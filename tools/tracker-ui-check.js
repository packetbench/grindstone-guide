'use strict';
// Exercise the real tracker event handlers without a browser, network, or filesystem writes.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const model = require('../tracker-model.js');
const source = fs.readFileSync(path.join(__dirname,'../tracker-ui.js'),'utf8');
const marker = /window\.GRINDSTONE_TRACKER = \{([^}]+)\};/;
assert(marker.test(source),'Tracker harness must match its public export.');
const instrumented = source.replace(marker,(_,exports)=>'window.GRINDSTONE_TRACKER = {'+exports+',testing:{state:()=>state,openSession,openCurriculum}};');
const catalog = [{id:'B01',title:'Stance',path:'#move/B01',category:'Movement',types:['move']},{id:'B07',title:'Double leg',path:'#move/B07',category:'Neutral',types:['move']}];
const decode = value => String(value).replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
const attributes = text => Object.fromEntries([...text.matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1],decode(m[2])]));
const settle = () => new Promise(resolve => setImmediate(resolve));
let checks = 0;
async function check(label,fn) { await fn(); checks++; console.log('PASS ' + label); }
async function harness(program = 'blue',params = 'from=builder',options = {}) {
  let html = '', focused = '', saves = 0, prints = 0, fields = {}, checkboxes = [], acceptSaves = false;
  const handlers = {}, windowHandlers = {}, nodes = new Map(), records = {sessions:structuredClone(options.sessions || []),curricula:[]}, archiveRequests = [], retryRequests = [], importedPlans = [], confirmations = [], routes = [], printedSheets = [];
  const plan = {name:'Saved ' + program + ' practice',program,startTime:'',owner:'Author',blocks:[{name:'Review stance',sourceId:'B01',type:'move',minutes:5,instructions:'Move and stop'}]};
  function node(key) {
    if (!nodes.has(key)) {const attrs={};nodes.set(key,{textContent:'',innerHTML:'',value:'',dataset:{},setAttribute(name,value){attrs[name]=String(value);},removeAttribute(name){delete attrs[name];},getAttribute:name=>attrs[name],hasAttribute:name=>Object.hasOwn(attrs,name),focus(){focused=key;},scrollIntoView(){}});}
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
      const planFilter = /^\[data-plan-filter="([^"]+)"\]$/.exec(selector);
      if (planFilter) return fields[planFilter[1]] || null;
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
  const context={window:{GRINDSTONE_TRACKER_MODEL:model,GRINDSTONE_TRACKER_CONFIG:options.config || {},GRINDSTONE_BUILDER:{tracker:{current:()=>structuredClone(options.currentPlan || plan),catalog:()=>catalog,saved:()=>[plan],importPlan:copy=>importedPlans.push(copy)}},GRINDSTONE_TRACKER_STORE:{load:async season=>options.load ? options.load(season) : ({...structuredClone(records),mode:'local'}),archiveStatus:async season=>{archiveRequests.push(season);return options.archiveStatus ? options.archiveStatus(season) : {enabled:false,jobs:[]};},retryArchive:async(...args)=>{retryRequests.push(args);return options.retryArchive ? options.retryArchive(...args) : {};},saveSession:raw=>saveRecord('sessions',raw),saveCurriculum:raw=>saveRecord('curricula',raw)},GRINDSTONE_NAVIGATION:{replaceRoute(hash){routes.push(hash);context.window.location.hash=hash;}},crypto:{randomUUID:()=>String(Math.random()).slice(2)},confirm:message=>{confirmations.push(message);return options.confirm !== false;},print:()=>{prints++;const sheet=node('.tracker-print-sheet');printedSheets.push({html:sheet.innerHTML,ready:sheet.getAttribute('data-ready')});},prompt:()=>options.prompt == null ? 'Coach retrying' : options.prompt,addEventListener(name,fn){(windowHandlers[name]||=[]).push(fn);},location:{hash:options.mode==='plans'?'#plans':'#tracker'}},document:{addEventListener(){},querySelector:()=>host},Intl,Date,URLSearchParams,console,FormData:class {constructor(){this.values=Object.fromEntries(Object.entries(fields).map(([key,value])=>[key,value.value]));}has(key){return Object.hasOwn(this.values,key);}get(key){return this.values[key]??null;}}};
  context.window.GRINDSTONE_TRACKER_STORE.history=async(kind,id)=>options.history ? options.history(kind,id) : [];
  vm.createContext(context);vm.runInContext(instrumented,context,{filename:'tracker-ui.js'});
  const api=context.window.GRINDSTONE_TRACKER,renderMode=options.mode==='plans'?'renderPlans':'render';assert.equal(typeof api[renderMode],'function',renderMode+' must be exported');api[renderMode](new URLSearchParams(params));api.bind(host);await settle();
  function target(selector,value='') {return {value,dataset:{},matches:query=>query===selector,closest:query=>query==='[data-tracker-editor]' ? host : null,focus(){focused=selector;}};}
  function key(selector,overrides={}) { const event={key:'Enter',isComposing:false,target:target(selector),defaultPrevented:false,preventDefault(){this.defaultPrevented=true;},...overrides};handlers.keydown(event);return event; }
  function group(value) { const field=target('[data-tracker-session-group]',value);field.name='group';handlers.change({target:field});return field; }
  function click(action,id) {const button={dataset:{trackerAction:action,id}};handlers.click({target:{closest:()=>button},preventDefault(){}});}
  function dispatchWindow(type) {for(const listener of windowHandlers[type]||[])listener({type});}
  return {api,handlers,host,plan,archiveRequests,retryRequests,importedPlans,confirmations,routes,printedSheets,state:api.testing.state,key,group,click,season(value){handlers.change({target:{name:'season',value,closest:selector=>selector==='[data-tracker-season]' ? host : null}});},field:name=>fields[name]?.value,set(name,value){fields[name]={value};},edit(name,value){fields[name]={value};handlers.input({target:target('[name="'+name+'"]',value)});},input(selector,value){handlers.input({target:target(selector,value)});},change(selector,value){handlers.change({target:target(selector,value)});},planFilter(name,value){fields[name]={value};handlers.change({target:{name,value,dataset:{planFilter:name},matches:selector=>selector==='[data-plan-filter]'||selector==='[data-plan-filter="'+name+'"]',closest:selector=>selector==='[data-plans-filters]'?form:null}});},submitPlans(){handlers.submit({target:{...form,matches:selector=>selector==='[data-plans-filters]'},preventDefault(){}});},toggle(id,checked){const input=target('[data-tracker-skill]');input.dataset.trackerSkill=id;input.checked=checked;handlers.change({target:input});},manual(value){node('[data-tracker-manual]').value=value;},search(value){node('[data-tracker-skill-search]').value=value;},manualValue:()=>node('[data-tracker-manual]').value,focused:()=>focused,saves:()=>saves,prints:()=>prints,printSheet:()=>node('.tracker-print-sheet'),hash:()=>context.window.location.hash,allowSave(){acceptSaves=true;},submit(kind='session'){handlers.submit({target:{...form,matches:selector=>selector==='[data-tracker-'+kind+'-form]'},preventDefault(){}});},dispatchWindow,leave(type='popstate'){dispatchWindow(type);host.isConnected=false;},async returnTo(params='group='+program){api[renderMode](new URLSearchParams(params));host.isConnected=true;api.bind(host);await settle();}};
}
const completed = (id='archived-session',revision=2) => ({id,revision,group:'blue',season:'2026-2027',status:'completed',name:'Completed practice',date:'2026-10-29',startTime:'18:00',location:'Gym',author:'Coach',lead:'Coach',skills:[catalog[0]],notes:'',noSkillReason:''});
const archiveJob = (status='archived',overrides={}) => ({sessionId:'archived-session',revision:2,status,pdfUrl:'https://drive.google.com/file/d/pdf_123/view',jsonUrl:'https://drive.google.com/file/d/json-123/view',...overrides});
function deferred() {let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});return {promise,resolve,reject};}
const richPlan = name => ({name,program:'blue',owner:'Saved author',notes:'Plan-wide saved notes',blocks:[{name:'Entry decision',minutes:10,instructions:'Choose the available entry',steps:['Top-level saved step'],sourceNote:'Top-level source scope',cues:['Keep your stance'],components:{activities:[{name:'Additional activity',task:'Additional saved task',guide:{title:'Additional saved guide',steps:['Nested activity step'],sourceNote:'Nested activity scope'}}],series:{selections:[{title:'Selected series branch'}],guides:[{title:'Saved series guide',steps:['Nested series step'],sourceNote:'Nested series scope'}]},rotation:{rounds:2,workMinutes:2,changeMinutes:1,briefingMinutes:1,finishMinutes:1,stations:[{name:'Saved station',task:'Station saved task',guide:{title:'Station guide',steps:['Nested station step']}}]}}}]});
const planRecord = (id,name,group,status,extra={}) => ({...completed(id,3),name,group,status,plan:richPlan(name),...extra});
const plansFixture = () => [planRecord('pup-plan','Pup balance session','pups','planned'),planRecord('blue-plan','Blue entry session','blue','completed'),planRecord('black-plan','Black tie session','black','planned'),planRecord('valkyrie-plan','Valkyries escape session','valkyries','completed'),planRecord('cancel-plan','Cancelled snow session','blue','cancelled'),planRecord('other-season','Prior season session','blue','completed',{season:'2025-2026'}),planRecord('no-snapshot','Notes without a plan','blue','completed',{plan:null})];
const plansHarness = (params='season=2026-2027',options={}) => harness('blue',params,{mode:'plans',sessions:plansFixture(),...options});
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
  await check('Practice Plans defaults to all groups and active saved snapshots only',async()=>{
    const h=await plansHarness();const html=h.host.innerHTML;
    for(const title of ['Pup balance session','Blue entry session','Black tie session','Valkyries escape session'])assert(html.includes(title),title+' should be listed');
    for(const title of ['Cancelled snow session','Prior season session','Notes without a plan'])assert(!html.includes(title),title+' should be omitted');
    assert(!/data-tracker-action="(?:new|edit|complete|curriculum|retry-archive)"/.test(html));assert(!html.includes('data-tracker-session-form'));assert(!html.includes('data-tracker-curriculum-form'));assert.equal(h.saves(),0);assert.equal(h.importedPlans.length,0);
  });
  await check('Practice Plans group and status query filters select only the requested snapshots',async()=>{
    const fixtures=plansFixture().filter(item=>item.season==='2026-2027'&&item.plan);
    for(const group of model.groups){const h=await plansHarness('season=2026-2027&group='+group.id);for(const item of fixtures)assert.equal(h.host.innerHTML.includes(item.name),item.group===group.id&&item.status!=='cancelled',group.id+': '+item.name);}
    for(const status of ['active','planned','completed','cancelled','all']){const h=await plansHarness('season=2026-2027&status='+status);for(const item of fixtures)assert.equal(h.host.innerHTML.includes(item.name),status==='all'||status==='active'&&item.status!=='cancelled'||item.status===status,status+': '+item.name);}
  });
  await check('Practice Plans search applies to saved records without changing the saved content',async()=>{
    const fixtures=plansFixture(),before=JSON.stringify(fixtures);const h=await plansHarness('season=2026-2027&q=escape',{sessions:fixtures});
    assert(h.host.innerHTML.includes('Valkyries escape session'));for(const name of ['Pup balance session','Blue entry session','Black tie session'])assert(!h.host.innerHTML.includes(name));assert.equal(JSON.stringify(fixtures),before);assert.equal(h.saves(),0);
  });
  await check('Practice Plans searches nested activities, series options and station guides',async()=>{
    for(const q of ['Additional activity','Additional saved guide','Selected series branch','Saved series guide','Saved station','Station guide']){const h=await plansHarness('season=2026-2027&q='+encodeURIComponent(q));assert(h.host.innerHTML.includes('Blue entry session'),'Missing nested search result '+q);assert.equal(h.saves(),0);}
  });
  await check('Scheduled session notes appear separately from source plan notes in view and print',async()=>{
    const sessions=plansFixture(),record=sessions.find(item=>item.id==='blue-plan');record.status='planned';record.notes='Bring the extra cones for this session';const h=await plansHarness('season=2026-2027&plan=blue-plan',{sessions});assert(h.host.innerHTML.includes('Session notes'));assert(h.host.innerHTML.includes(record.notes));assert(h.host.innerHTML.includes('Plan-wide saved notes'));const firstPrint=h.host.innerHTML.indexOf('data-tracker-action="print-plan"'),firstBlock=h.host.innerHTML.indexOf('tracker-plan-blocks');assert(firstPrint>0&&firstPrint<firstBlock,'Quick print should precede long instructions');h.click('print-plan');await settle();assert(h.printedSheets[0].html.includes(record.notes));assert.equal(h.saves(),0);
  });
  await check('Practice Plans empty results and missing deep links are explicit instead of opening an editor',async()=>{
    const empty=await plansHarness('season=2026-2027&q=no-match-here');assert(/no saved plan snapshots match/i.test(empty.host.innerHTML));assert(!empty.host.innerHTML.includes('data-tracker-session-form'));
    const missing=await plansHarness('season=2026-2027&plan=missing-session');assert(/not found/i.test(missing.host.innerHTML));assert(!missing.host.innerHTML.includes('data-tracker-session-form'));assert.equal(missing.saves(),0);
  });
  await check('A Practice Plans deep link renders the complete immutable saved snapshot',async()=>{
    const fixtures=plansFixture(),before=JSON.stringify(fixtures);const h=await plansHarness('season=2026-2027&group=blue&status=completed&q=entry&plan=blue-plan',{sessions:fixtures});
    for(const text of ['Top-level saved step','Top-level source scope','Additional saved task','Nested activity step','Nested activity scope','Selected series branch','Nested series step','Nested series scope','Station saved task','Nested station step','Plan-wide saved notes'])assert(h.host.innerHTML.includes(text),'Missing snapshot field: '+text);
    assert(/revision\s*3/i.test(h.host.innerHTML));assert(h.host.innerHTML.includes('data-tracker-action="print-plan"'));assert(!/data-tracker-action="(?:new|edit|complete|curriculum|retry-archive)"/.test(h.host.innerHTML));assert(!h.host.innerHTML.includes('data-tracker-session-form'));assert.equal(JSON.stringify(fixtures),before);assert.equal(h.saves(),0);
    const planLinks=[...h.host.innerHTML.matchAll(/href="(#plans[^\"]*)"/g)].map(match=>decode(match[1]));assert(planLinks.some(link=>{const p=new URLSearchParams(link.split('?')[1]);return !p.has('plan')&&p.get('group')==='blue'&&p.get('status')==='completed'&&p.get('q')==='entry';}),'Close link should retain list filters');
  });
  await check('Practice Plans printing prepares full readable instructions only during the print callback',async()=>{
    const h=await plansHarness('season=2026-2027&plan=blue-plan');h.click('print-plan');await settle();assert.equal(h.prints(),1);assert.equal(h.printedSheets[0].ready,'true');
    for(const text of ['Top-level saved step','Top-level source scope','Nested activity step','Nested series step','Nested station step','Plan-wide saved notes'])assert(h.printedSheets[0].html.includes(text),'Printed snapshot lacks '+text);
    const details=[...h.printedSheets[0].html.matchAll(/<details\b([^>]*)>/g)];assert(details.length>0);assert(details.every(match=>/\bopen\b/.test(match[1])),'Nested guides must be expanded for printing');assert.equal(h.printSheet().innerHTML,'');assert.equal(h.printSheet().hasAttribute('data-ready'),false);assert.equal(h.saves(),0);
  });
  await check('Practice Plans inline reuse can cancel without a browser dialog or draft change',async()=>{
    const h=await plansHarness('season=2026-2027&plan=blue-plan');h.click('confirm-builder-copy');await settle();assert.equal(h.importedPlans.length,0);h.click('builder-copy');await settle();assert.equal(h.confirmations.length,0);assert.equal(h.importedPlans.length,0);assert(h.host.innerHTML.includes('data-plan-copy-confirm'));assert(h.host.innerHTML.includes('aria-labelledby="tracker-copy-confirm-title"'));assert(h.host.innerHTML.includes('Undo last structural change'));assert.equal(h.focused(),'[data-plan-copy-confirm]');h.click('cancel-builder-copy');await settle();assert(!h.host.innerHTML.includes('data-plan-copy-confirm'));assert.equal(h.state().copyPending,false);assert.equal(h.importedPlans.length,0);assert.notEqual(h.hash(),'#practices');assert.equal(h.saves(),0);
  });
  await check('Practice Plans inline reuse accepts a separate copy and preserves the shared snapshot',async()=>{
    const h=await plansHarness('season=2026-2027&plan=blue-plan');const saved=h.state().data.sessions.find(item=>item.id==='blue-plan').plan,before=JSON.stringify(saved);h.click('builder-copy');await settle();h.click('print-plan');await settle();assert(!h.printedSheets[0].html.includes('data-plan-copy-confirm'));h.click('confirm-builder-copy');await settle();assert.equal(h.confirmations.length,0);assert.equal(h.importedPlans.length,1);assert.notEqual(h.importedPlans[0],saved);assert.equal(JSON.stringify(h.importedPlans[0]),before);h.importedPlans[0].blocks[0].instructions='Changed only in copied draft';assert.equal(JSON.stringify(saved),before);assert.equal(h.hash(),'#practices');assert.equal(h.saves(),0);
  });
  await check('Practice Plans reuse imports directly into an empty draft and Escape dismisses an inline prompt',async()=>{
    const empty=await plansHarness('season=2026-2027&plan=blue-plan',{currentPlan:{blocks:[]}});empty.click('builder-copy');await settle();assert.equal(empty.importedPlans.length,1);assert.equal(empty.confirmations.length,0);assert.equal(empty.hash(),'#practices');
    const h=await plansHarness('season=2026-2027&plan=blue-plan');h.click('builder-copy');await settle();assert.equal(h.key('[data-plan-copy-confirm]',{key:'Escape'}).defaultPrevented,true);await settle();assert.equal(h.state().copyPending,false);assert.equal(h.importedPlans.length,0);assert.equal(h.confirmations.length,0);
  });
  await check('The original tracker reuse confirmation remains unchanged',async()=>{
    const h=await harness('blue','season=2026-2027&group=blue',{sessions:plansFixture(),confirm:false});h.click('view-plan','blue-plan');await settle();h.click('builder-copy');await settle();assert.equal(h.confirmations.length,1);assert.equal(h.importedPlans.length,0);assert(!h.host.innerHTML.includes('data-plan-copy-confirm'));assert.equal(h.saves(),0);
  });
  await check('Practice Plans archive links match the selected saved revision and never expose retry mutations',async()=>{
    const params='season=2026-2027&group=blue&plan=blue-plan';const old=await plansHarness(params,{archiveStatus:async()=>({enabled:true,jobs:[archiveJob('archived',{sessionId:'blue-plan',revision:2})]})});assert(!old.host.innerHTML.includes('>Open PDF</a>'));assert(!old.host.innerHTML.includes('>Open JSON</a>'));
    const current=await plansHarness(params,{archiveStatus:async()=>({enabled:true,jobs:[archiveJob('archived',{sessionId:'blue-plan',revision:3})]})});assert(current.host.innerHTML.includes('https://drive.google.com/file/d/pdf_123/view'));assert(current.host.innerHTML.includes('https://drive.google.com/file/d/json-123/view'));assert(!current.host.innerHTML.includes('data-tracker-action="retry-archive"'));
    const failed=await plansHarness(params,{archiveStatus:async()=>({enabled:true,jobs:[archiveJob('failed',{sessionId:'blue-plan',revision:3})]})});assert(!failed.host.innerHTML.includes('data-tracker-action="retry-archive"'));assert.equal(failed.retryRequests.length,0);
  });
  await check('Practice Plans remain visible when archive status is slow or fails',async()=>{
    const request=deferred();const h=await plansHarness('season=2026-2027',{archiveStatus:()=>request.promise});assert(h.host.innerHTML.includes('Pup balance session'));assert(h.host.innerHTML.includes('Blue entry session'));assert.equal(h.state().loaded,true);request.reject(Error('archive-private-token'));await settle();assert(h.host.innerHTML.includes('Pup balance session'));assert(!h.host.innerHTML.includes('archive-private-token'));assert.equal(h.state().loaded,true);assert.equal(h.state().error,false);assert.equal(h.saves(),0);
  });
  await check('Practice Plans refresh ignores stale archive replies without hiding loaded snapshots',async()=>{
    const old=deferred();let calls=0;const h=await plansHarness('season=2026-2027&group=blue',{archiveStatus:()=>++calls===1?old.promise:Promise.resolve({enabled:true,jobs:[archiveJob('archived',{sessionId:'blue-plan',revision:3})]})});h.click('refresh');await settle();assert(h.host.innerHTML.includes('Blue entry session'));assert(h.host.innerHTML.includes('https://drive.google.com/file/d/pdf_123/view'));old.resolve({enabled:false,jobs:[]});await settle();assert(h.host.innerHTML.includes('https://drive.google.com/file/d/pdf_123/view'));assert.equal(h.state().archive.enabled,true);assert.equal(h.saves(),0);
  });
  await check('Practice Plans record-load failure is not mislabeled as an empty collection',async()=>{
    const h=await plansHarness('season=2026-2027',{load:async()=>{throw Error('Records offline; refresh to retry.');}});assert.equal(h.state().loaded,false);assert(h.host.innerHTML.includes('Records offline'));assert(!/no saved plan snapshots match/i.test(h.host.innerHTML));assert.equal(h.saves(),0);
  });
  await check('Practice Plans successful refresh clears an earlier load error',async()=>{
    let loads=0;const h=await plansHarness('season=2026-2027',{load:async()=>{if(++loads===1)throw Error('Temporary load failure');return {sessions:plansFixture(),curricula:[],mode:'shared'};}});assert(h.state().error);h.click('refresh');await settle();assert.equal(h.state().error,false);assert.equal(h.state().message,'');assert(!h.host.innerHTML.includes('Temporary load failure'));assert(h.host.innerHTML.includes('Pup balance session'));assert.equal(h.saves(),0);
  });
  await check('Practice Plans retains the visible saved list when a later refresh fails',async()=>{
    let loads=0;const h=await plansHarness('season=2026-2027',{load:async()=>{if(++loads===1)return {sessions:plansFixture(),curricula:[],mode:'shared'};throw Error('Refresh unavailable; try again.');}});assert(h.host.innerHTML.includes('Blue entry session'));h.click('refresh');await settle();assert(h.host.innerHTML.includes('Refresh unavailable'));assert(h.host.innerHTML.includes('Blue entry session'));assert(h.host.innerHTML.includes('Pup balance session'));assert.equal(h.state().loaded,true);assert.equal(h.saves(),0);
  });
  await check('Practice Plans ignores an old list request that finishes after a newer refresh',async()=>{
    const old=deferred();let loads=0;const newest=planRecord('new-plan','Newest saved snapshot','blue','planned');const h=await plansHarness('season=2026-2027',{load:()=>++loads===1?old.promise:Promise.resolve({sessions:[newest],curricula:[],mode:'shared'})});h.click('refresh');await settle();assert(h.host.innerHTML.includes('Newest saved snapshot'));old.resolve({sessions:plansFixture(),curricula:[],mode:'shared'});await settle();assert(h.host.innerHTML.includes('Newest saved snapshot'));assert(!h.host.innerHTML.includes('Blue entry session'));assert.equal(h.saves(),0);
  });
  await check('Practice Plans filter controls preserve read-only routing and apply search on submit',async()=>{
    const h=await plansHarness();h.planFilter('group','pups');await settle();assert(h.hash().startsWith('#plans?'));assert.equal(new URLSearchParams(h.hash().split('?')[1]).get('group'),'pups');h.set('q','balance');h.submitPlans();await settle();const query=new URLSearchParams(h.hash().split('?')[1]);assert.equal(query.get('q'),'balance');assert.equal(query.get('group'),'pups');assert.equal(h.saves(),0);assert.equal(h.importedPlans.length,0);
  });
  await check('Saved practice edit links carry the exact session and season from Plans cards, snapshot and tracker',async()=>{
    const hasEditLink=(html,id)=>[...html.matchAll(/href="(#practices\?[^\"]+)"/g)].some(match=>{const query=new URLSearchParams(decode(match[1]).split('?')[1]);return query.get('edit')===id&&query.get('season')==='2026-2027';});
    const list=await plansHarness('season=2026-2027');assert(hasEditLink(list.host.innerHTML,'pup-plan'));assert(hasEditLink(list.host.innerHTML,'blue-plan'));
    const detail=await plansHarness('season=2026-2027&plan=blue-plan');assert(hasEditLink(detail.host.innerHTML,'blue-plan'));
    const tracker=await harness('blue','group=blue&season=2026-2027',{sessions:plansFixture()});assert(hasEditLink(tracker.host.innerHTML,'blue-plan'));assert(!hasEditLink(tracker.host.innerHTML,'no-snapshot'));
    for(const h of [list,detail,tracker]){assert.equal(h.saves(),0);assert.equal(h.importedPlans.length,0);}
    assert(!/data-tracker-action="(?:edit|complete)"/.test(list.host.innerHTML),'Plans links must not introduce direct tracker mutation buttons');
  });
  await check('Tracker session links open the original existing record rather than a builder-created session',async()=>{
    for(const id of ['pup-plan','blue-plan']){const sessions=plansFixture(),original=sessions.find(item=>item.id===id),before=JSON.stringify(sessions);const h=await harness('blue','season=2026-2027&group='+original.group+'&session='+id+'&from=builder',{sessions});assert.equal(h.state().editor.kind,'session');assert.equal(h.state().editor.record.id,id);assert.equal(h.state().editor.record.revision,original.revision);for(const key of ['group','season','date','startTime','location','lead','status','notes','noSkillReason'])assert.equal(h.state().editor.record[key],original[key]);assert.equal(JSON.stringify(h.state().editor.record.skills),JSON.stringify(original.skills));assert.equal(h.state().editor.requireReason,original.status==='completed');assert.equal(h.state().data.sessions.length,sessions.length);assert.equal(JSON.stringify(sessions),before);assert.equal(h.saves(),0);assert.equal(h.importedPlans.length,0);}
  });
  await check('Missing or mismatched tracker session links never create a new session',async()=>{
    for(const query of ['group=blue&session=missing','group=blue&session=pup-plan','group=blue&session=other-season']){const sessions=plansFixture(),h=await harness('blue','season=2026-2027&from=builder&'+query,{sessions});assert.equal(h.state().editor,null);assert(/saved session was not found/i.test(h.host.innerHTML));assert.equal(h.state().data.sessions.length,sessions.length);assert.equal(h.saves(),0);assert(!h.host.innerHTML.includes('data-tracker-session-form'));}
  });
  await check('Saving through a session deep link updates the original ID and revision',async()=>{
    const sessions=plansFixture();sessions.find(item=>item.id==='pup-plan').plan.blocks[0].cues='Keep your stance';const h=await harness('pups','season=2026-2027&group=pups&session=pup-plan',{sessions});h.set('name','Updated existing Pup practice');h.set('actor','Coach editing');h.allowSave();h.submit();await settle();const saved=h.state().data.sessions.find(item=>item.id==='pup-plan');assert.equal(h.saves(),1,h.host.querySelector('[data-tracker-form-error]').textContent);assert.equal(saved.name,'Updated existing Pup practice');assert.equal(saved.revision,4);assert.equal(saved.group,'pups');assert.equal(h.state().data.sessions.length,sessions.length);assert.equal(h.state().data.sessions.filter(item=>item.id==='pup-plan').length,1);
  });
  await check('A different session link does not consume another unsaved draft in the same group',async()=>{
    const sessions=plansFixture(),h=await harness('blue','season=2026-2027&group=blue&session=blue-plan',{sessions});h.edit('notes','Unsaved notes for the first session');h.leave();await h.returnTo('season=2026-2027&group=blue&session=cancel-plan');assert.equal(h.state().editor.record.id,'cancel-plan');assert.notEqual(h.state().editor.record.notes,'Unsaved notes for the first session');h.leave();await h.returnTo('season=2026-2027&group=blue&session=blue-plan');assert.equal(h.state().editor.record.id,'blue-plan');assert.equal(h.state().editor.record.notes,'Unsaved notes for the first session');assert.equal(h.state().editor.dirty,true);assert.equal(h.saves(),0);
  });
  await check('Plan correction metadata is escaped in saved detail and print without changing prior notes',async()=>{
    const sessions=plansFixture(),record=sessions.find(item=>item.id==='blue-plan');record.notes='Original confirmed reflection';record.plan.notes='Original plan notes';record.plan.sharedCorrection={reason:'Clarified <img src=x onerror="bad()"> & finish',actor:'Coach <script>bad()</script>',baseRevision:2};const before=JSON.stringify(sessions),h=await plansHarness('season=2026-2027&plan=blue-plan',{sessions});
    const verify=html=>{assert(html.includes('Plan correction'));assert(html.includes('Clarified &lt;img src=x onerror=&quot;bad()&quot;&gt; &amp; finish'));assert(html.includes('Coach &lt;script&gt;bad()&lt;/script&gt;'));assert(html.includes('Based on revision 2'));assert(!html.includes('<img src=x'));assert(!html.includes('<script>bad()'));assert(html.includes('Original confirmed reflection'));assert(html.includes('Original plan notes'));};verify(h.host.innerHTML);h.click('print-plan');await settle();verify(h.printedSheets[0].html);assert.equal(JSON.stringify(sessions),before);assert.equal(h.saves(),0);
  });
  await check('Session history shows each revision’s escaped plan correction audit details',async()=>{
    const sessions=plansFixture(),current=sessions.find(item=>item.id==='blue-plan'),earlier=structuredClone(current);earlier.revision=2;earlier.plan.sharedCorrection={reason:'Earlier <b>correction</b>',actor:'Earlier & coach',baseRevision:1};current.plan.sharedCorrection={reason:'Latest <svg onload="bad()"> correction',actor:'Latest coach',baseRevision:2};const before=JSON.stringify(sessions),requests=[];const h=await harness('blue','season=2026-2027&group=blue',{sessions,history:async(kind,id)=>{requests.push([kind,id]);return [{revision:3,actor:'Latest coach',savedAt:'2026-10-30T12:00:00Z',record:current},{revision:2,actor:'Earlier coach',savedAt:'2026-10-29T12:00:00Z',record:earlier}];}});h.click('history','blue-plan');await settle();assert.deepEqual(requests,[['session','blue-plan']]);assert(h.host.innerHTML.includes('Earlier &lt;b&gt;correction&lt;/b&gt;'));assert(h.host.innerHTML.includes('Latest &lt;svg onload=&quot;bad()&quot;&gt; correction'));assert(h.host.innerHTML.includes('Earlier &amp; coach'));assert(h.host.innerHTML.includes('Based on revision 1'));assert(h.host.innerHTML.includes('Based on revision 2'));assert(!h.host.innerHTML.includes('<svg onload='));assert.equal(JSON.stringify(sessions),before);assert.equal(h.saves(),0);
  });
  await check('Correction rendering bounds text and omits invalid audit fields',async()=>{
    const sessions=plansFixture(),record=sessions.find(item=>item.id==='blue-plan');record.plan.sharedCorrection={reason:'r'.repeat(1000)+'HIDDEN_REASON_TAIL',actor:'a'.repeat(120)+'HIDDEN_ACTOR_TAIL',baseRevision:'2<script>'};const h=await plansHarness('season=2026-2027&plan=blue-plan',{sessions});assert(h.host.innerHTML.includes('r'.repeat(1000)));assert(!h.host.innerHTML.includes('HIDDEN_REASON_TAIL'));assert(!h.host.innerHTML.includes('HIDDEN_ACTOR_TAIL'));assert(!h.host.innerHTML.includes('Based on revision'));record.plan.sharedCorrection={reason:{html:'<script>bad</script>'},actor:'Coach',baseRevision:2};const invalid=await plansHarness('season=2026-2027&plan=blue-plan',{sessions});assert(!invalid.host.innerHTML.includes('Plan correction'));assert.equal(invalid.saves(),0);
  });
  console.log(checks+' tracker UI event checks passed. No files written.');
})().catch(error=>{console.error(error);process.exitCode=1;});
