'use strict';
// Exercise the real tracker event handlers without a browser, network, or filesystem writes.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const model = require('../tracker-model.js');
const source = fs.readFileSync(path.join(__dirname,'../tracker-ui.js'),'utf8');
const marker = 'window.GRINDSTONE_TRACKER = {render,bind};';
assert(source.includes(marker),'Tracker harness must match its public export.');
const instrumented = source.replace(marker,'window.GRINDSTONE_TRACKER = {render,bind,testing:{state:()=>state,openSession,openCurriculum}};');
const catalog = [{id:'B01',title:'Stance',path:'#move/B01',category:'Movement',types:['move']},{id:'B07',title:'Double leg',path:'#move/B07',category:'Neutral',types:['move']}];
const decode = value => String(value).replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
const attributes = text => Object.fromEntries([...text.matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1],decode(m[2])]));
const settle = () => new Promise(resolve => setImmediate(resolve));
let checks = 0;
async function check(label,fn) { await fn(); checks++; console.log('PASS ' + label); }
async function harness(program = 'blue',params = 'from=builder',options = {}) {
  let html = '', focused = '', saves = 0, fields = {}, checkboxes = [], acceptSaves = false;
  const handlers = {}, windowHandlers = {}, nodes = new Map(), records = {sessions:structuredClone(options.sessions || []),curricula:[]}, archiveRequests = [], retryRequests = [];
  const plan = {name:'Saved ' + program + ' practice',program,startTime:'',owner:'Author',blocks:[{name:'Review stance',sourceId:'B01',type:'move',minutes:5,instructions:'Move and stop'}]};
  function node(key) {
    if (!nodes.has(key)) nodes.set(key,{textContent:'',value:'',dataset:{},setAttribute(){},focus(){focused=key;},scrollIntoView(){}});
    return nodes.get(key);
  }
  function setCheckboxes(markup) { checkboxes = [...markup.matchAll(/<input\b([^>]*data-tracker-skill="[^"]+"[^>]*)>/g)].map(match => {const a=attributes(match[1]);return {dataset:{trackerSkill:a['data-tracker-skill']},checked:/\bchecked\b/.test(match[1]),focus(){focused='skill:' + this.dataset.trackerSkill;}};}); }
  const chosen = {set innerHTML(value){setCheckboxes(value);}};
  function archiveNode(attribute,id) {
    const key = attribute + (id == null ? '' : ':' + id);
    if (!nodes.has(key)) {
      const marker = attribute + (id == null ? '' : '="' + id + '"');
      nodes.set(key,{dataset:{trackerArchiveSession:id},set innerHTML(value){const pattern=new RegExp('(<div[^>]*\\b'+marker+'[^>]*>)[\\s\\S]*?(</div>)');html=html.replace(pattern,(_,open,close)=>open+value+close);}});
    }
    return nodes.get(key);
  }
  const form = {querySelector:selector => node(selector),querySelectorAll:()=>[]};
  const host = {
    isConnected:true,matches:selector=>selector==='#practice-tracker',contains:()=>true,
    addEventListener:(name,fn)=>{handlers[name]=fn;},
    querySelector(selector) {
      if (selector==='[data-tracker-session-form]') return html.includes('data-tracker-session-form') ? form : null;
      if (selector==='[data-tracker-curriculum-form]') return html.includes('data-tracker-curriculum-form') ? form : null;
      if (selector==='[data-tracker-curriculum-form] [name="actor"]') return fields.actor || null;
      if (selector==='[data-tracker-chosen]') return chosen;
      if (selector==='[data-tracker-archive-summary]') return archiveNode('data-tracker-archive-summary');
      return node(selector);
    },
    querySelectorAll:selector=>selector==='[data-tracker-skill]' ? checkboxes : selector==='[data-tracker-archive-session]' ? [...html.matchAll(/data-tracker-archive-session="([^"]+)"/g)].map(match=>archiveNode('data-tracker-archive-session',decode(match[1]))) : [],
    get innerHTML(){return html;},
    set innerHTML(value) {
      html=value; fields={};
      for (const match of value.matchAll(/<input\b([^>]*)>/g)) { const a=attributes(match[1]); if(a.name) fields[a.name]={value:a.value||''}; for(const selector of ['data-tracker-skill-search','data-tracker-manual'])if(new RegExp('\\b'+selector+'\\b').test(match[1]))node('['+selector+']').value=a.value||''; }
      for (const match of value.matchAll(/<textarea\b([^>]*)>([\s\S]*?)<\/textarea>/g)) { const a=attributes(match[1]); if(a.name) fields[a.name]={value:decode(match[2])}; }
      for (const match of value.matchAll(/<select\b([^>]*)>([\s\S]*?)<\/select>/g)) { const a=attributes(match[1]); if(!a.name)continue; const options=[...match[2].matchAll(/<option\b([^>]*)>/g)], selected=options.find(m=>/\bselected\b/.test(m[1]))||options[0]; fields[a.name]={value:attributes(selected?.[1]||'').value||''}; }
      setCheckboxes(value);
      node('.tracker-picker').open=/<details class="tracker-picker" open/.test(value);
    }
  };
  async function saveRecord(kind,raw) { saves++; if(!acceptSaves)throw Error('Unexpected save'); const result={...structuredClone(raw),revision:raw.revision+1,...(options.saveArchive ? {archive:structuredClone(options.saveArchive)} : {})};records[kind].push({...result,archive:undefined});return result; }
  const context={window:{GRINDSTONE_TRACKER_MODEL:model,GRINDSTONE_TRACKER_CONFIG:options.config || {},GRINDSTONE_BUILDER:{tracker:{current:()=>structuredClone(plan),catalog:()=>catalog,saved:()=>[plan]}},GRINDSTONE_TRACKER_STORE:{load:async season=>options.load ? options.load(season) : ({...structuredClone(records),mode:'local'}),archiveStatus:async season=>{archiveRequests.push(season);return options.archiveStatus ? options.archiveStatus(season) : {enabled:false,jobs:[]};},retryArchive:async(...args)=>{retryRequests.push(args);return options.retryArchive ? options.retryArchive(...args) : {};},saveSession:raw=>saveRecord('sessions',raw),saveCurriculum:raw=>saveRecord('curricula',raw)},GRINDSTONE_NAVIGATION:{replaceRoute(){}},crypto:{randomUUID:()=>String(Math.random()).slice(2)},confirm:()=>true,prompt:()=>options.prompt == null ? 'Coach retrying' : options.prompt,addEventListener(name,fn){(windowHandlers[name]||=[]).push(fn);},location:{hash:'#tracker'}},document:{addEventListener(){},querySelector:()=>host},Intl,Date,URLSearchParams,console,FormData:class {constructor(){this.values=Object.fromEntries(Object.entries(fields).map(([key,value])=>[key,value.value]));}has(key){return Object.hasOwn(this.values,key);}get(key){return this.values[key]??null;}}};
  vm.createContext(context);vm.runInContext(instrumented,context,{filename:'tracker-ui.js'});
  const api=context.window.GRINDSTONE_TRACKER;api.render(new URLSearchParams(params));api.bind(host);await settle();
  function target(selector,value='') {return {value,dataset:{},matches:query=>query===selector,closest:query=>query==='[data-tracker-editor]' ? host : null,focus(){focused=selector;}};}
  function key(selector,overrides={}) { const event={key:'Enter',isComposing:false,target:target(selector),defaultPrevented:false,preventDefault(){this.defaultPrevented=true;},...overrides};handlers.keydown(event);return event; }
  function group(value) { const field=target('[data-tracker-session-group]',value);field.name='group';handlers.change({target:field});return field; }
  function click(action,id) {const button={dataset:{trackerAction:action,id}};handlers.click({target:{closest:()=>button},preventDefault(){}});}
  function dispatchWindow(type) {for(const listener of windowHandlers[type]||[])listener({type});}
  return {api,handlers,host,plan,archiveRequests,retryRequests,state:api.testing.state,key,group,click,season(value){handlers.change({target:{name:'season',value,closest:selector=>selector==='[data-tracker-season]' ? host : null}});},field:name=>fields[name]?.value,set(name,value){fields[name]={value};},edit(name,value){fields[name]={value};handlers.input({target:target('[name="'+name+'"]',value)});},toggle(id,checked){const input=target('[data-tracker-skill]');input.dataset.trackerSkill=id;input.checked=checked;handlers.change({target:input});},manual(value){node('[data-tracker-manual]').value=value;},search(value){node('[data-tracker-skill-search]').value=value;},manualValue:()=>node('[data-tracker-manual]').value,focused:()=>focused,saves:()=>saves,allowSave(){acceptSaves=true;},submit(kind='session'){handlers.submit({target:{...form,matches:selector=>selector==='[data-tracker-'+kind+'-form]'},preventDefault(){}});},dispatchWindow,leave(type='popstate'){dispatchWindow(type);host.isConnected=false;},async returnTo(params='group='+program){api.render(new URLSearchParams(params));host.isConnected=true;api.bind(host);await settle();}};
}
const completed = (id='archived-session',revision=2) => ({id,revision,group:'blue',season:'2026-2027',status:'completed',name:'Completed practice',date:'2026-10-29',startTime:'18:00',location:'Gym',author:'Coach',lead:'Coach',skills:[catalog[0]],notes:'',noSkillReason:''});
const archiveJob = (status='archived',overrides={}) => ({sessionId:'archived-session',revision:2,status,pdfUrl:'https://drive.google.com/file/d/pdf_123/view',jsonUrl:'https://drive.google.com/file/d/json-123/view',...overrides});
function deferred() {let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});return {promise,resolve,reject};}
(async()=>{
  await check('Every builder program opens its own group and building without an explicit query group',async()=>{
    for(const g of model.groups){const h=await harness(g.id);assert.equal(h.state().group,g.id);assert.equal(h.state().editor.record.group,g.id);assert.equal(h.state().editor.record.location,g.location);assert.equal(h.state().editor.record.startTime,g.start);assert.notEqual(h.state().editor.record.plan,h.plan);assert(h.host.innerHTML.includes('data-tracker-session-group'));}
  });
  await check('An explicit tracker group takes precedence when reusing a plan',async()=>{const h=await harness('pups','from=builder&group=black');assert.equal(h.state().group,'black');assert.equal(h.state().editor.record.location,'Westminster High School');});
  await check('An unsaved session can change group and retain its plan and coach fields',async()=>{const h=await harness('blue');h.set('author','Changed author');h.set('lead','Lead coach');h.set('notes','Keep this handoff');h.group('valkyries');const s=h.state();assert.equal(s.group,'valkyries');assert.equal(s.editor.record.group,'valkyries');assert.equal(s.editor.record.location,'Winters Mill High School');assert.equal(s.editor.record.startTime,'18:30');assert.equal(s.editor.record.author,'Changed author');assert.equal(s.editor.record.lead,'Lead coach');assert.equal(s.editor.record.notes,'Keep this handoff');assert.equal(s.editor.record.plan.blocks[0].sourceId,'B01');assert.equal(s.editor.dirty,true);});
  await check('Changing group preserves a coach-customized building and start time',async()=>{const h=await harness('blue');h.set('location','Community practice room');h.set('startTime','17:45');h.group('pups');assert.equal(h.state().editor.record.location,'Community practice room');assert.equal(h.state().editor.record.startTime,'17:45');});
  await check('Saved records cannot migrate to another group through the editor',async()=>{const h=await harness('pups');const record={...structuredClone(h.state().editor.record),revision:1};h.api.testing.openSession(record,false,false);assert(h.host.innerHTML.includes('data-tracker-session-group disabled'));assert(h.host.innerHTML.includes('cancel it here and schedule its saved plan'));const field=h.group('blue');assert.equal(field.value,'pups');assert.equal(h.state().editor.record.group,'pups');assert.equal(h.state().group,'pups');});
  await check('Enter in completion skill search cannot submit the completed practice',async()=>{const h=await harness();h.api.testing.openSession({...structuredClone(h.state().editor.record),revision:1},true,false);h.set('actor','Coach');h.set('lead','Coach');assert.equal(h.key('[data-tracker-skill-search]').defaultPrevented,true);await settle();assert.equal(h.saves(),0);assert.equal(h.state().editor.record.status,'completed');});
  await check('Enter in curriculum skill search cannot save the expected list',async()=>{const h=await harness();h.api.testing.openCurriculum();h.set('actor','Coach');assert.equal(h.key('[data-tracker-skill-search]').defaultPrevented,true);await settle();assert.equal(h.saves(),0);});
  await check('Enter adds a custom skill and keeps focus in its field without saving the practice',async()=>{const h=await harness();h.manual('Our hip-heist review');assert.equal(h.key('[data-tracker-manual]').defaultPrevented,true);await settle();assert(h.state().editor.options.some(s=>s.title==='Our hip-heist review'&&h.state().editor.selected.has(s.id)));assert.equal(h.manualValue(),'');assert.equal(h.focused(),'[data-tracker-manual]');assert.equal(h.saves(),0);});
  await check('Empty custom skill Enter is harmless and still prevents form submission',async()=>{const h=await harness();const before=h.state().editor.options.length;h.manual('');assert.equal(h.key('[data-tracker-manual]').defaultPrevented,true);await settle();assert.equal(h.state().editor.options.length,before);assert.equal(h.saves(),0);});
  await check('Library Add leaves keyboard focus on the newly checked skill',async()=>{const h=await harness();h.click('add-skill','B07');await settle();assert.equal(h.focused(),'skill:B07');assert(h.state().editor.selected.has('B07'));assert.equal(h.saves(),0);});
  await check('Other keys and active input-method composition are not intercepted',async()=>{const h=await harness();assert.equal(h.key('[data-tracker-skill-search]',{key:'ArrowDown'}).defaultPrevented,false);assert.equal(h.key('[data-tracker-skill-search]',{isComposing:true}).defaultPrevented,false);});
  await check('Back and Forward restore unsaved completion fields, skipped skills and extras without saving',async()=>{
    const h=await harness();h.api.testing.openSession({...structuredClone(h.state().editor.record),revision:1},true,false);
    h.edit('lead','Coach after practice');h.edit('actor','Coach making changes');h.edit('notes','Unsaved handoff notes');h.toggle('B01',false);h.click('add-skill','B07');await settle();h.search('double');h.manual('A skill I am still typing');
    const id=h.state().editor.record.id;h.leave('popstate');await h.returnTo('group=blue');
    assert.equal(h.state().editor.record.id,id);assert.equal(h.state().editor.record.status,'completed');assert.equal(h.state().editor.record.notes,'Unsaved handoff notes');assert.equal(h.state().editor.record.lead,'Coach after practice');assert.equal(h.state().editor.record.actor,'Coach making changes');assert(!h.state().editor.selected.has('B01'));assert(h.state().editor.selected.has('B07'));assert.equal(h.state().editor.skillSearch,'double');assert.equal(h.manualValue(),'A skill I am still typing');assert(h.host.innerHTML.includes('Restored your unsaved practice changes'));assert.equal(h.saves(),0);
    h.leave('hashchange');await h.returnTo('group=blue');assert.equal(h.state().editor.record.id,id);assert.equal(h.saves(),0);
  });
  await check('History navigation also restores unsaved curriculum selections and editor name',async()=>{
    const h=await harness('valkyries');h.api.testing.openCurriculum();h.edit('actor','Valkyries coach');h.click('add-skill','B07');await settle();h.leave();await h.returnTo('group=valkyries');
    assert.equal(h.state().editor.kind,'curriculum');assert.equal(h.state().editor.record.actor,'Valkyries coach');assert(h.state().editor.selected.has('B07'));assert(h.host.innerHTML.includes('Restored your unsaved season expectations'));assert.equal(h.saves(),0);
  });
  await check('Draft recovery is scoped to its group and season',async()=>{
    const h=await harness('pups','from=builder&season=2026-2027');h.edit('notes','Only this Pup season');h.leave();await h.returnTo('group=valkyries&season=2026-2027');assert.equal(h.state().editor,null);
    h.leave();await h.returnTo('group=pups&season=2027-2028');assert.equal(h.state().editor,null);h.leave();await h.returnTo('group=pups&season=2026-2027');assert.equal(h.state().editor.record.notes,'Only this Pup season');
  });
  await check('Explicitly discarding a recovered draft does not resurrect it on later navigation',async()=>{
    const h=await harness();h.edit('notes','Discard me');h.leave();await h.returnTo();h.click('close-editor');await settle();assert.equal(h.state().editor,null);h.leave();await h.returnTo();assert.equal(h.state().editor,null);assert.equal(h.saves(),0);
  });
  await check('A successful save clears any history backup of the same editor',async()=>{
    const h=await harness();h.edit('actor','Coach');h.edit('notes','Save this once');h.dispatchWindow('popstate');h.allowSave();h.submit();await settle();assert.equal(h.saves(),1);assert.equal(h.state().editor,null);h.leave();await h.returnTo();assert.equal(h.state().editor,null);assert.equal(h.saves(),1);
  });
  await check('Disabled Drive connection stays pending with the configured restricted folder link',async()=>{
    const folder='https://drive.google.com/drive/folders/review_folder-123';
    const h=await harness('blue','group=blue&season=2026-2027',{sessions:[completed()],config:{archiveFolderUrl:folder}});
    assert.equal(h.state().loaded,true);assert.equal(h.state().archiveLoaded,true);assert(h.host.innerHTML.includes('Connection pending'));assert(h.host.innerHTML.includes(folder));assert(h.host.innerHTML.includes('permission to view this restricted folder'));assert(!h.host.innerHTML.includes('No Drive copy for this revision'));assert(!h.host.innerHTML.includes('Drive copy ready'));assert.equal(h.archiveRequests.length,1);
  });
  await check('Pending Drive requests never block tracker records or saving an editor',async()=>{
    const request=deferred();const h=await harness('blue','from=builder',{archiveStatus:()=>request.promise});
    assert.equal(h.state().loaded,true);assert.equal(h.state().loading,false);assert.equal(h.state().archiveLoading,true);assert(h.state().editor);h.set('actor','Coach');h.allowSave();h.submit();await settle();assert.equal(h.saves(),1);assert.equal(h.state().editor,null);assert(h.host.innerHTML.includes('Practice scheduled'));request.resolve({enabled:false,jobs:[]});await settle();
  });
  await check('Archive errors do not fail tracker loading or expose technical messages',async()=>{
    const h=await harness('blue','group=blue&season=2026-2027',{sessions:[completed()],archiveStatus:async()=>{throw Error('secret-token-123');}});
    assert.equal(h.state().loaded,true);assert.equal(h.state().error,false);assert.equal(h.state().archiveError,true);assert(h.host.innerHTML.includes('Completed practice'));assert(h.host.innerHTML.includes('Drive archive status is unavailable'));assert(!h.host.innerHTML.includes('secret-token-123'));assert(h.host.innerHTML.includes('Refresh records'));
  });
  await check('Completed cards show acknowledged current-revision PDF and JSON links in wrapping actions',async()=>{
    const h=await harness('blue','group=blue&season=2026-2027',{sessions:[completed()],archiveStatus:async()=>({enabled:true,jobs:[archiveJob()]})});
    assert(h.host.innerHTML.includes('Drive copy ready · revision 2'));assert(h.host.innerHTML.includes('href="https://drive.google.com/file/d/pdf_123/view" target="_blank" rel="noopener noreferrer"'));assert(h.host.innerHTML.includes('>Open PDF</a>'));assert(h.host.innerHTML.includes('>Open JSON</a>'));assert(h.host.innerHTML.includes('<p class="tracker-actions"><a href="https://drive.google.com/file/d/pdf_123/view"'));assert(!h.host.innerHTML.includes('<table'));assert(!h.host.innerHTML.includes('style="width:'));assert(h.host.innerHTML.includes('Corrections create a separate revision'));
  });
  await check('An older archived revision is never presented as the current revision or backfill button',async()=>{
    const h=await harness('blue','group=blue&season=2026-2027',{sessions:[completed()],archiveStatus:async()=>({enabled:true,jobs:[archiveJob('archived',{revision:1})]})});
    assert(h.host.innerHTML.includes('No Drive copy for this revision'));assert(!h.host.innerHTML.includes('Drive copy ready'));assert(!h.host.innerHTML.includes('pdf_123'));assert(!h.host.innerHTML.includes('Archive this revision'));assert(!h.host.innerHTML.includes('Retry Drive copy'));
  });
  await check('Archive file links reject arbitrary origins, extra queries, paths and credentials',async()=>{
    for(const url of ['javascript:alert(1)','https://drive.google.com.evil.test/file/d/id/view','https://drive.google.com@evil.test/file/d/id/view','https://drive.google.com/file/d/id/view?token=secret','https://drive.google.com/file/d/../view','https://evil.test/file/d/id/view','https://drive.google.com/uc?export=download&id=id']) {
      const h=await harness('blue','group=blue&season=2026-2027',{sessions:[completed()],config:{archiveFolderUrl:'https://evil.test/folder'},archiveStatus:async()=>({enabled:true,jobs:[archiveJob('archived',{pdfUrl:url})]})});
      assert(h.host.innerHTML.includes('file links are unavailable'));assert(!h.host.innerHTML.includes('>Open PDF</a>'));assert(!h.host.innerHTML.includes('>Open JSON</a>'));assert(!h.host.innerHTML.includes('evil.test'));assert(h.host.innerHTML.includes('drive/folders/1nH6QOx1E0mTWGiRg9MroZ6iJX9PQuXK_'));
    }
  });
  await check('Queued and failed copies remain distinct from completed archive files',async()=>{
    const h=await harness('blue','group=blue&season=2026-2027',{sessions:[completed(),completed('failed-session')],archiveStatus:async()=>({enabled:true,jobs:[archiveJob('pending'),archiveJob('failed',{sessionId:'failed-session',retryable:true,error:'private-provider-secret'})]})});
    assert(h.host.innerHTML.includes('Drive copy queued for revision 2'));assert(h.host.innerHTML.includes('PDF and JSON are not ready yet'));assert(h.host.innerHTML.includes('Drive copy could not be completed'));assert(h.host.innerHTML.includes('Retry Drive copy'));assert(!h.host.innerHTML.includes('private-provider-secret'));assert(!h.host.innerHTML.includes('Drive copy ready'));
  });
  await check('Late archive responses update only archive fragments and preserve typed form fields',async()=>{
    const request=deferred();const h=await harness('blue','from=builder',{archiveStatus:()=>request.promise});
    h.edit('notes','Text still being typed');h.manual('Unfinished custom skill');h.search('double');const editor=h.state().editor;request.resolve({enabled:true,jobs:[]});await settle();
    assert.equal(h.state().editor,editor);assert.equal(h.field('notes'),'Text still being typed');assert.equal(h.manualValue(),'Unfinished custom skill');assert.equal(h.state().editor.dirty,true);assert(h.host.innerHTML.includes('Newly completed practices automatically queue'));assert.equal(h.saves(),0);
  });
  await check('Refresh ignores an older archive response that finishes after the new one',async()=>{
    const old=deferred();let calls=0;const h=await harness('blue','group=blue&season=2026-2027',{sessions:[completed()],archiveStatus:()=>++calls===1 ? old.promise : Promise.resolve({enabled:true,jobs:[archiveJob()]})});
    h.click('refresh');await settle();assert(h.host.innerHTML.includes('Drive copy ready'));old.resolve({enabled:false,jobs:[]});await settle();assert.equal(h.state().archive.enabled,true);assert(h.host.innerHTML.includes('Drive copy ready'));assert.equal(h.archiveRequests.length,2);
  });
  await check('Group and season navigation refresh archive state and reject stale responses',async()=>{
    const old=deferred();let calls=0;const h=await harness('blue','group=blue&season=2026-2027',{sessions:[completed()],archiveStatus:()=>++calls===1 ? old.promise : Promise.resolve({enabled:false,jobs:[]})});
    h.click('group','black');await settle();old.resolve({enabled:true,jobs:[archiveJob()]});await settle();assert.equal(h.state().group,'black');assert.equal(h.state().archive.enabled,false);assert(!h.host.innerHTML.includes('Drive copy ready'));
    h.season('2027-2028');await settle();assert.equal(h.archiveRequests.at(-1),'2027-2028');assert.equal(h.state().season,'2027-2028');assert.equal(h.state().archiveLoaded,true);
  });
  await check('A completed save refreshes archive status without blocking or claiming an archive success',async()=>{
    const afterSave=deferred();let calls=0;const h=await harness('blue','from=builder&season=2026-2027',{archiveStatus:()=>++calls===1 ? Promise.resolve({enabled:true,jobs:[]}) : afterSave.promise});
    const id=h.state().editor.record.id;h.set('status','completed');h.set('actor','Coach');h.set('lead','Coach');h.allowSave();h.submit();await settle();assert.equal(h.saves(),1);assert.equal(h.state().editor,null);assert.equal(h.state().archiveLoading,true);assert(h.host.innerHTML.includes('Practice confirmed'));assert(!h.host.innerHTML.includes('Drive copy ready'));assert.equal(h.archiveRequests.length,2);
    afterSave.resolve({enabled:true,jobs:[archiveJob('pending',{sessionId:id,revision:1})]});await settle();assert(h.host.innerHTML.includes('Drive copy queued for revision 1'));
  });
  await check('A failed post-save queue acknowledgment is recoverable without offering historical backfill',async()=>{
    const h=await harness('blue','from=builder&season=2026-2027',{saveArchive:{status:'failed',warning:'provider-private-detail'},archiveStatus:async()=>({enabled:true,jobs:[]})});
    const id=h.state().editor.record.id;h.set('status','completed');h.set('actor','Coach saved');h.set('lead','Coach');h.allowSave();h.submit();await settle();assert.equal(h.saves(),1);assert(h.host.innerHTML.includes('Practice confirmed'));assert(h.host.innerHTML.includes('its Drive copy needs attention'));assert(h.host.innerHTML.includes('Drive copy was not queued'));assert(h.host.innerHTML.includes('Retry Drive copy'));assert(!h.host.innerHTML.includes('provider-private-detail'));
    h.click('retry-archive',id);await settle();assert.deepEqual(h.retryRequests[0],[id,1,'Coach saved']);h.click('refresh');await settle();assert(!h.host.innerHTML.includes('Retry Drive copy'));assert(h.host.innerHTML.includes('No Drive copy for this revision'));
  });
  await check('An old-season archive request cannot replace the newly selected season status',async()=>{
    const old=deferred();const h=await harness('blue','group=blue&season=2026-2027',{archiveStatus:season=>season==='2026-2027' ? old.promise : Promise.resolve({enabled:false,jobs:[]})});
    h.season('2027-2028');await settle();old.resolve({enabled:true,jobs:[archiveJob()]});await settle();assert.equal(h.state().season,'2027-2028');assert.equal(h.state().archive.enabled,false);assert.equal(h.state().archiveLoaded,true);assert.equal(h.state().archiveLoading,false);assert(h.host.innerHTML.includes('Connection pending'));
  });
  await check('Retry uses a coach name and waits for service acknowledgment plus refreshed status',async()=>{
    const retry=deferred();let retried=false;const h=await harness('blue','group=blue&season=2026-2027',{sessions:[completed()],archiveStatus:async()=>({enabled:true,jobs:[archiveJob(retried?'pending':'failed')]}),retryArchive:()=>retry.promise});
    h.click('retry-archive','archived-session');await settle();assert.deepEqual(h.retryRequests[0],['archived-session',2,'Coach retrying']);assert(h.host.innerHTML.includes('Requesting retry…'));assert(!h.host.innerHTML.includes('Drive copy queued'));h.click('retry-archive','archived-session');await settle();assert.equal(h.retryRequests.length,1);
    retried=true;retry.resolve({status:'pending'});await settle();assert(h.host.innerHTML.includes('Drive copy queued'));assert(!h.host.innerHTML.includes('Drive copy ready'));
  });
  await check('Retry cancellation and retry failures preserve records and never expose provider details',async()=>{
    const opts={sessions:[completed()],archiveStatus:async()=>({enabled:true,jobs:[archiveJob('failed')]})};
    const cancelled=await harness('blue','group=blue&season=2026-2027',{...opts,prompt:''});cancelled.click('retry-archive','archived-session');await settle();assert.equal(cancelled.retryRequests.length,0);
    const failed=await harness('blue','group=blue&season=2026-2027',{...opts,retryArchive:async()=>{throw Error('private-retry-token');}});failed.click('retry-archive','archived-session');await settle();assert(failed.host.innerHTML.includes('The retry could not be requested'));assert(!failed.host.innerHTML.includes('private-retry-token'));assert.equal(failed.state().loaded,true);assert.equal(failed.state().error,false);assert.equal(failed.saves(),0);
  });
  console.log(checks+' tracker UI event checks passed. No files written.');
})().catch(error=>{console.error(error);process.exitCode=1;});
