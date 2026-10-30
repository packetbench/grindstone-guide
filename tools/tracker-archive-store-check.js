'use strict';
// Browser transport only: every fetch is mocked; no network or filesystem writes.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const json = value => JSON.parse(JSON.stringify(value));
const response = (body, status = 200) => new Response(JSON.stringify(body), {status, headers: {'Content-Type':'application/json'}});
const fileUrl = id => 'https://drive.google.com/file/d/' + id + '/view';
const record = overrides => ({id:'session-blue-1',revision:1,season:'2026-2027',group:'blue',date:'2026-10-20',startTime:'18:00',location:'Westminster',author:'Thomas',lead:'Kyle',name:'Foundation night',status:'completed',plan:null,skills:[{id:'B01',title:'Stance',path:'#move/B01',category:'Neutral'}],notes:'',noSkillReason:'',actor:'Thomas',savedAt:'2026-10-30T12:00:00.000Z',...overrides});
const job = overrides => ({jobId:'job-1234567890',sessionId:'session-blue-1',revision:1,status:'archived',pdfUrl:fileUrl('pdf-1234567890'),jsonUrl:fileUrl('json-1234567890'),updatedAt:'2026-10-30T12:00:00.000Z',retryable:false,...overrides});
function browser(options = {}) {
  const calls = [], local = new Map(), session = new Map();
  const storage = map => ({getItem:key=>map.get(key) ?? null,setItem:(key,value)=>map.set(key,value)});
  const context = {console,URL,Date,Intl,Map,Set,JSON,TextEncoder,AbortController,setTimeout,clearTimeout,crypto:globalThis.crypto,
    localStorage:storage(local),sessionStorage:storage(session),GRINDSTONE_TRACKER_CONFIG:{endpoint:options.endpoint ?? 'https://tracker.example'},
    fetch:async (url, init) => {calls.push({url,...init,headers:{...init.headers}});if (!options.fetch) throw Error('Mock offline');return options.fetch(url,init);}};
  context.window=context;vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root,'tracker-model.js'),'utf8'),context,{filename:'tracker-model.js'});
  vm.runInContext(fs.readFileSync(path.join(root,'tracker-store.js'),'utf8'),context,{filename:'tracker-store.js'});
  return {store:context.GRINDSTONE_TRACKER_STORE,calls,local,session};
}
let checks=0;
async function check(name, fn) {await fn();checks++;console.log('PASS '+name);}
const rejects = (fn, code) => assert.rejects(fn,error=>error.code===code);
(async()=>{
  await check('Local preview reports no Drive connection and performs no requests',async()=>{
    const h=browser({endpoint:''});assert.deepEqual(json(await h.store.archiveStatus('2026-2027')),{enabled:false,jobs:[],local:true});
    await rejects(()=>h.store.retryArchive('session-blue-1',1,'Coach'),'archive_disabled');assert.equal(h.calls.length,0);
  });
  await check('Status uses the configured endpoint and safely encodes the selected season',async()=>{
    const h=browser({endpoint:'https://tracker.example/api',fetch:()=>response({enabled:false,jobs:[]})});
    await h.store.archiveStatus('2026-2027 & review');assert.equal(h.calls[0].url,'https://tracker.example/api/archive/status?season=2026-2027%20%26%20review');
    assert.equal(h.calls[0].method,'GET');assert.equal(h.calls[0].credentials,'omit');assert.equal(h.calls[0].cache,'no-store');
    assert(!Object.hasOwn(h.calls[0].headers,'Authorization'));
  });
  await check('Status retains only public fields and sanitizes raw failure information',async()=>{
    const supplied=job({status:'failed',retryable:true,error:'PRIVATE token=value',record:{private:'data'},secret:'hidden',attempts:3});
    const h=browser({fetch:()=>response({enabled:true,jobs:[supplied],DRIVE_ARCHIVE_KEY:'PRIVATE'})});const result=json(await h.store.archiveStatus('2026-2027'));
    assert.equal(result.enabled,true);assert.equal(result.jobs[0].retryable,true);assert.equal(result.jobs[0].pdfUrl,supplied.pdfUrl);
    assert.deepEqual(Object.keys(result.jobs[0]).sort(),['jobId','sessionId','revision','status','pdfUrl','jsonUrl','updatedAt','retryable','error'].sort());
    assert(!JSON.stringify(result).includes('PRIVATE'));assert(!JSON.stringify(result).includes('hidden'));assert(result.jobs[0].error.includes('shared practice remains saved'));
  });
  await check('Only exact HTTPS Google file-view links survive status sanitization',async()=>{
    for(const unsafe of ['http://drive.google.com/file/d/pdf-1234567890/view','https://drive.google.com.evil.example/file/d/pdf-1234567890/view','https://evil@drive.google.com/file/d/pdf-1234567890/view',fileUrl('short'),fileUrl('pdf-1234567890')+'?redirect=evil',fileUrl('pdf-1234567890')+'#extra','javascript:alert(1)','https://drive.google.com/file/d/%2e%2e/view']){
      const h=browser({fetch:()=>response({enabled:true,jobs:[job({pdfUrl:unsafe,jsonUrl:unsafe})]})});const result=await h.store.archiveStatus('2026-2027');assert.equal(result.jobs[0].pdfUrl,'');assert.equal(result.jobs[0].jsonUrl,'');
    }
  });
  await check('Malformed status envelopes and record fields are rejected',async()=>{
    const invalid=[null,{enabled:'true',jobs:[]},{enabled:true,jobs:{}},{enabled:true,jobs:Array(10001).fill(job())},...[
      null,job({sessionId:42}),job({revision:0}),job({revision:1.5}),job({status:'deleted'})
    ].map(value=>({enabled:true,jobs:[value]}))];
    for(const supplied of invalid){const h=browser({fetch:()=>response(supplied)});await rejects(()=>h.store.archiveStatus('2026-2027'),'invalid_response');}
  });
  await check('An older server missing this endpoint is explicitly not connected',async()=>{
    const h=browser({fetch:()=>response({code:'not_found',error:'Endpoint unavailable'},404)});
    assert.deepEqual(json(await h.store.archiveStatus('2026-2027')),{enabled:false,jobs:[],notConnected:true});assert.equal(h.local.size,0);
  });
  await check('Other errors and unreadable responses are never disguised as disabled archiving',async()=>{
    for(const [status,code] of [[404,'archive_not_found'],[401,'archive_unauthorized'],[503,'storage_error']]){
      const h=browser({fetch:()=>response({error:'Service unavailable',code},status)});await rejects(()=>h.store.archiveStatus('2026-2027'),code);
    }
    const malformed=browser({fetch:()=>new Response('<html>not JSON</html>',{status:200})});await rejects(()=>malformed.store.archiveStatus('2026-2027'),'invalid_response');
  });
  await check('Network failure remains an error and does not write a local fallback',async()=>{
    const h=browser();await rejects(()=>h.store.archiveStatus('2026-2027'),'network_error');assert.equal(h.local.size,0);
  });
  await check('Invalid seasons are rejected before requesting archive status',async()=>{
    const h=browser({fetch:()=>response({enabled:false,jobs:[]})});for(const season of ['',null,'x'.repeat(81),'2026\n2027']) await rejects(()=>h.store.archiveStatus(season),'invalid_season');assert.equal(h.calls.length,0);
  });
  await check('Retry validates identity, revision and actor before network access',async()=>{
    const h=browser({fetch:()=>response(job({status:'pending'}))});
    for(const args of [['../escape',1,'Coach'],['',1,'Coach'],['x'.repeat(101),1,'Coach'],['session-blue-1',0,'Coach'],['session-blue-1',1.5,'Coach'],['session-blue-1',1,''],['session-blue-1',1,'   '],['session-blue-1',1,'A'.repeat(121)],['session-blue-1',1,'Coach\nOther'],['session-blue-1',1,{folderId:'arbitrary'}]]) await rejects(()=>h.store.retryArchive(...args),'invalid_record');
    assert.equal(h.calls.length,0);
  });
  await check('Retry sends only saved record identity and trimmed actor by POST',async()=>{
    const h=browser({fetch:()=>response(job({status:'pending'}))});await h.store.retryArchive('session-blue-1',1,'  Coach  ',{folderId:'arbitrary',record:{plan:'override'}});
    assert.equal(h.calls[0].url,'https://tracker.example/api/archive/retry');assert.equal(h.calls[0].method,'POST');
    assert.deepEqual(JSON.parse(h.calls[0].body),{sessionId:'session-blue-1',revision:1,actor:'Coach'});
    assert.equal(h.calls[0].headers['Content-Type'],'application/json');assert(/^[A-Za-z0-9_-]{16,100}$/.test(h.calls[0].headers['X-Tracker-Operation']));
    assert(!Object.hasOwn(h.calls[0].headers,'Authorization'));assert.equal(h.local.size,0);
  });
  await check('Retry retains its operation for ambiguous retries and keeps coach code out of storage',async()=>{
    let calls=0;const h=browser({fetch:()=>{if(++calls===1)throw Error('Lost response');return response(job({status:'pending'}));}});
    h.store.setCode('test-coach-code');await rejects(()=>h.store.retryArchive('session-blue-1',1,'Coach'),'network_error');await h.store.retryArchive('session-blue-1',1,'Coach');
    assert.equal(h.calls[0].headers['X-Tracker-Operation'],h.calls[1].headers['X-Tracker-Operation']);assert.equal(h.calls[1].headers['X-Coach-Code'],'test-coach-code');
    assert(!JSON.stringify([...h.local,...h.session]).includes('test-coach-code'));assert.equal(h.local.size,0);
  });
  await check('Server rejection of an archive retry is preserved without local mutation',async()=>{
    const h=browser({fetch:()=>response({code:'archive_revision_unavailable',error:'Only the latest revision may be retried.'},409)});
    await rejects(()=>h.store.retryArchive('session-blue-1',1,'Coach'),'archive_revision_unavailable');assert.equal(h.local.size,0);
  });
  await check('A committed save preserves a sanitized archive warning without claiming save failure',async()=>{
    const h=browser({fetch:()=>response(record({archive:{status:'failed',warning:'PRIVATE upstream error with token=value',pdfUrl:'https://evil.example',secret:'hidden'}}))});
    const saved=await h.store.saveSession(record({revision:0}));assert.equal(saved.revision,1);assert.equal(saved.status,'completed');assert.equal(saved.archive.status,'failed');
    assert(saved.archive.warning.includes('practice is saved'));assert(!JSON.stringify(saved.archive).includes('PRIVATE'));assert.deepEqual(Object.keys(saved.archive).sort(),['status','warning']);
  });
  await check('A queued save stays pending and ignores unsupported archive metadata',async()=>{
    const h=browser({fetch:()=>response(record({archive:{status:'pending',token:'hidden',pdfUrl:fileUrl('untrusted-id-123')}}))});const saved=await h.store.saveSession(record({revision:0}));assert.deepEqual(json(saved.archive),{status:'pending'});
    const unsupported=browser({fetch:()=>response(record({archive:{status:'made-up-success',warning:'not trusted'}}))});assert(!Object.hasOwn(await unsupported.store.saveSession(record({revision:0})),'archive'));
  });
  await check('A shared save failure stays a failure rather than a successful archive warning',async()=>{
    const h=browser({fetch:()=>response({code:'storage_error',error:'Shared storage did not save.'},503)});await rejects(()=>h.store.saveSession(record({revision:0})),'storage_error');assert.equal(h.local.size,0);
  });
  console.log(checks+' archive transport checks passed. No network calls or file writes.');
})().catch(error=>{console.error(error);process.exitCode=1;});
