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
async function harness(program = 'blue',params = 'from=builder') {
  let html = '', focused = '', saves = 0, fields = {}, checkboxes = [], acceptSaves = false;
  const handlers = {}, windowHandlers = {}, nodes = new Map(), records = {sessions:[],curricula:[]};
  const plan = {name:'Saved ' + program + ' practice',program,startTime:'',owner:'Author',blocks:[{name:'Review stance',sourceId:'B01',type:'move',minutes:5,instructions:'Move and stop'}]};
  function node(key) {
    if (!nodes.has(key)) nodes.set(key,{textContent:'',value:'',dataset:{},setAttribute(){},focus(){focused=key;},scrollIntoView(){}});
    return nodes.get(key);
  }
  function setCheckboxes(markup) { checkboxes = [...markup.matchAll(/<input\b([^>]*data-tracker-skill="[^"]+"[^>]*)>/g)].map(match => {const a=attributes(match[1]);return {dataset:{trackerSkill:a['data-tracker-skill']},checked:/\bchecked\b/.test(match[1]),focus(){focused='skill:' + this.dataset.trackerSkill;}};}); }
  const chosen = {set innerHTML(value){setCheckboxes(value);}};
  const form = {querySelector:selector => node(selector),querySelectorAll:()=>[]};
  const host = {
    isConnected:true,matches:selector=>selector==='#practice-tracker',contains:()=>true,
    addEventListener:(name,fn)=>{handlers[name]=fn;},
    querySelector(selector) {
      if (selector==='[data-tracker-session-form]') return html.includes('data-tracker-session-form') ? form : null;
      if (selector==='[data-tracker-curriculum-form]') return html.includes('data-tracker-curriculum-form') ? form : null;
      if (selector==='[data-tracker-curriculum-form] [name="actor"]') return fields.actor || null;
      if (selector==='[data-tracker-chosen]') return chosen;
      return node(selector);
    },
    querySelectorAll:selector=>selector==='[data-tracker-skill]' ? checkboxes : [],
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
  async function saveRecord(kind,raw) { saves++; if(!acceptSaves)throw Error('Unexpected save'); const result={...structuredClone(raw),revision:raw.revision+1};records[kind].push(result);return result; }
  const context={window:{GRINDSTONE_TRACKER_MODEL:model,GRINDSTONE_BUILDER:{tracker:{current:()=>structuredClone(plan),catalog:()=>catalog,saved:()=>[plan]}},GRINDSTONE_TRACKER_STORE:{load:async()=>({...structuredClone(records),mode:'local'}),saveSession:raw=>saveRecord('sessions',raw),saveCurriculum:raw=>saveRecord('curricula',raw)},GRINDSTONE_NAVIGATION:{replaceRoute(){}},crypto:{randomUUID:()=>String(Math.random()).slice(2)},confirm:()=>true,addEventListener(name,fn){(windowHandlers[name]||=[]).push(fn);},location:{hash:'#tracker'}},document:{addEventListener(){},querySelector:()=>host},Intl,Date,URLSearchParams,console,FormData:class {constructor(){this.values=Object.fromEntries(Object.entries(fields).map(([key,value])=>[key,value.value]));}has(key){return Object.hasOwn(this.values,key);}get(key){return this.values[key]??null;}}};
  vm.createContext(context);vm.runInContext(instrumented,context,{filename:'tracker-ui.js'});
  const api=context.window.GRINDSTONE_TRACKER;api.render(new URLSearchParams(params));api.bind(host);await settle();
  function target(selector,value='') {return {value,dataset:{},matches:query=>query===selector,closest:query=>query==='[data-tracker-editor]' ? host : null,focus(){focused=selector;}};}
  function key(selector,overrides={}) { const event={key:'Enter',isComposing:false,target:target(selector),defaultPrevented:false,preventDefault(){this.defaultPrevented=true;},...overrides};handlers.keydown(event);return event; }
  function group(value) { const field=target('[data-tracker-session-group]',value);field.name='group';handlers.change({target:field});return field; }
  function click(action,id) {const button={dataset:{trackerAction:action,id}};handlers.click({target:{closest:()=>button},preventDefault(){}});}
  function dispatchWindow(type) {for(const listener of windowHandlers[type]||[])listener({type});}
  return {api,handlers,host,plan,state:api.testing.state,key,group,click,set(name,value){fields[name]={value};},edit(name,value){fields[name]={value};handlers.input({target:target('[name="'+name+'"]',value)});},toggle(id,checked){const input=target('[data-tracker-skill]');input.dataset.trackerSkill=id;input.checked=checked;handlers.change({target:input});},manual(value){node('[data-tracker-manual]').value=value;},search(value){node('[data-tracker-skill-search]').value=value;},manualValue:()=>node('[data-tracker-manual]').value,focused:()=>focused,saves:()=>saves,allowSave(){acceptSaves=true;},submit(kind='session'){handlers.submit({target:{...form,matches:selector=>selector==='[data-tracker-'+kind+'-form]'},preventDefault(){}});},dispatchWindow,leave(type='popstate'){dispatchWindow(type);host.isConnected=false;},async returnTo(params='group='+program){api.render(new URLSearchParams(params));host.isConnected=true;api.bind(host);await settle();}};
}
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
  console.log(checks+' tracker UI event checks passed. No files written.');
})().catch(error=>{console.error(error);process.exitCode=1;});
