'use strict';
// Exercise shared-practice editing with real browser modules and memory-only stores.
// No network requests, shared saves, browser storage changes, or filesystem writes.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const base = path.resolve(__dirname,'..'), model = require('../tracker-model.js');
const copy = value => JSON.parse(JSON.stringify(value));
const settle = () => new Promise(resolve => setImmediate(resolve));
function deferred() {let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});return {promise,resolve,reject};}
const guide = (sourceId='retired:nested') => ({sourceId,title:'Frozen nested guide',task:'Frozen nested task',setup:'Frozen setup',readiness:'Frozen readiness',boundary:'Frozen boundary',adaptation:'Frozen nested adaptation',ageNote:'Frozen nested age note',sourceNote:'Frozen nested source note',steps:['Frozen nested step'],cues:['Frozen nested cue']});
function snapshot(name='Original saved practice') {
  const nested=guide();
  const block=(id,sourceId)=>({id,type:'drill',minutes:10,sourceId,name:'Frozen '+id,instructions:'Frozen task '+id,cues:'Frozen cue',setup:'Frozen setup',readiness:'Frozen readiness',boundary:'Frozen boundary',adaptation:'Frozen top adaptation',steps:['Frozen top step'],ageNote:'Frozen top age note',sourceNote:'Frozen top source note',guideMinutes:0,timingConfirmed:false,section:'teach',delivery:'pairs',rotation:''});
  const first=block('block-one','facebook:V99');
  first.components={version:1,activities:[{name:'Frozen additional activity',task:'Frozen added task',cues:'Frozen added cue',guide:copy(nested)}],series:{id:'series:retired',selections:[{key:'branch-old',title:'Frozen branch'}],guides:[copy(nested)]},rotation:{rounds:2,workMinutes:2,changeMinutes:1,briefingMinutes:1,finishMinutes:1,showAll:false,stations:[{name:'Frozen station',task:'Frozen station task',coach:'Coach A',equipment:'None',space:'Mat',group:'Partners',rounds:'Two turns',simpler:'Slow turn',success:'Controlled finish',stop:'Release',guide:copy(nested),series:{id:'series:old-station',selections:[{key:'station-branch',title:'Frozen station option'}],guides:[copy(nested)]}}]}};
  return {version:1,id:'local-source-id',name,age:'4-6',target:20,program:'pups',framework:'',session:'',stage:'',startTime:'18:00',focus:'Original focus',notes:'Original plan notes',date:'2026-10-29',owner:'Original author',revision:'Original label',status:'planned',completedAt:'',parentId:'',weekContext:{id:'',label:'',focus:'',cue:'',outcome:''},handoff:{taught:'Original handoff',changed:'',worked:'',reliable:'',revisit:''},frozenProvenance:{edition:'fixture-original',note:'Retain untouched source metadata'},blocks:[first,block('block-two','retired:unknown-guide')]};
}
function session(overrides={}) {return {id:'shared-practice',revision:3,season:'2026-2027',group:'pups',date:'2026-10-29',startTime:'18:00',location:'Original venue',author:'Original author',lead:'Original lead',name:'Original saved practice',status:'planned',skills:[],notes:'Original session notes',noSkillReason:'',actor:'Original editor',plan:snapshot(),...overrides};}
let checks=0;
async function check(label,fn){await fn();checks++;console.log('PASS '+label);}
async function harness(options={}) {
  const values=options.values || new Map(), writes=[], loadCalls=[], saveCalls=[], records=copy(options.records || [session()]), nodes=new Map(), eventTargets=[], confirms=[], alerts=[];
  let allowConfirm=options.confirm!==false, failStorage=false, html='';
  const listeners={};
  function node(selector) {
    if(!nodes.has(selector)){
      const attrs={},events={};
      const element={dataset:{},value:'',innerHTML:'',textContent:'',checked:false,disabled:false,hidden:false,isConnected:true,open:false,addEventListener(type,fn){(events[type]||=[]).push(fn);},querySelector:select,querySelectorAll:()=>[],setAttribute(name,value){attrs[name]=String(value);},removeAttribute(name){delete attrs[name];},getAttribute:name=>attrs[name],hasAttribute:name=>Object.hasOwn(attrs,name),focus(){},scrollIntoView(){},contains:()=>true,closest:()=>null,events};
      nodes.set(selector,element);eventTargets.push(element);
    }
    return nodes.get(selector);
  }
  function select(selector){if(selector==='input:invalid, select:invalid, textarea:invalid'||selector==='[data-week-content]'&&!options.weekUi)return null;return node(selector);}
  const root={dataset:{},isConnected:true,querySelector:select,querySelectorAll:()=>[],addEventListener(type,fn){(listeners[type]||=[]).push(fn);},contains:()=>true,get innerHTML(){return html;},set innerHTML(value){html=value;}};
  function dispatch(type,event){for(const fn of listeners[type]||[])fn(event);for(const element of eventTargets)for(const fn of element.events[type]||[])fn(event);}
  const store={
    async load(season){loadCalls.push(season);return options.load?options.load(season):{sessions:copy(records.filter(record=>record.season===season)),curricula:[],mode:'shared'};},
    async saveSession(raw){saveCalls.push(copy(raw));if(options.save)return options.save(raw);const index=records.findIndex(record=>record.id===raw.id);if(index<0)throw Error('Unknown fixture session');if(records[index].revision!==raw.revision){const error=Error('Another coach saved a newer revision.');error.status=409;throw error;}const saved={...copy(raw),revision:raw.revision+1};records[index]=saved;return copy(saved);}
  };
  const storage={getItem:key=>{if(failStorage)throw Error('Storage disabled');return values.get(key)||null;},setItem(key,value){if(failStorage)throw Error('Storage full');values.set(key,String(value));writes.push(key);},removeItem:key=>values.delete(key)};
  const context={window:{GRINDSTONE_TRACKER_MODEL:model,GRINDSTONE_TRACKER_STORE:store,GRINDSTONE_TRACKER_CONFIG:{endpoint:options.endpoint||'https://tracker.example.test'},GRINDSTONE:{moves:[],games:[]},GRINDSTONE_VIDEO_ADDITIONS:{entries:[{id:'V99',title:'Current catalog guide',kind:'move',category:'movement',age_groups:['7-10'],steps:['Current catalog step'],age_adaptations:{'7-10':'New catalog adaptation'},verification:'New catalog source note'}]},localStorage:storage,confirm:message=>{confirms.push(message);return allowConfirm;},alert:message=>alerts.push(message),addEventListener(){},setTimeout,clearTimeout,location:{hash:'#practices'},history:{state:null,replaceState(_state,_title,hash){context.window.location.hash=hash;}}},document:{addEventListener(){},querySelector:select},URL,URLSearchParams,console,Blob,Date,Intl,setTimeout,clearTimeout};
  vm.createContext(context);
  for(const file of ['practice-frameworks.js','practice-weeks.js','practice-components.js','practice-builder.js','practice-saved.js'])vm.runInContext(fs.readFileSync(path.join(base,file),'utf8'),context,{filename:file});
  const builder=context.window.GRINDSTONE_BUILDER,saved=context.window.GRINDSTONE_PRACTICE_SAVED;
  assert(saved?.testing,'Shared-practice test interface must be available');
  function mount(params=''){root.innerHTML=builder.render(new URLSearchParams(params));builder.bind(root);}
  mount(options.params||'');await settle();
  async function open(id='shared-practice',mode='edit',confirm=true){await saved.testing.loadList();await saved.testing.open(id,mode);await settle();if(confirm){await saved.testing.confirmLoad();await settle();}}
  const field=(key,value)=>dispatch('input',{target:{dataset:{planField:key},value,validity:{valid:true},matches:()=>false,closest:()=>null}});
  const blockField=(index,key,value)=>dispatch('input',{target:{dataset:{blockField:key},value,validity:{valid:true},matches:()=>false,closest:()=>({dataset:{blockIndex:String(index)},querySelector:()=>node('[data-block-title]')})}});
  return {builder,saved,root,values,writes,records,loadCalls,saveCalls,confirms,alerts,context,mount,open,field,blockField,node,dispatch,state:()=>builder.testing.getState(),attachment:()=>saved.captureAttachment(),setConfirm:value=>{allowConfirm=value;},setStorageFailure:value=>{failStorage=value;},action:async(name,index=-1)=>{await builder.testing.action(name,index);await settle();},save:async(actor='Coach editing',reason='')=>{await saved.testing.save({actor,reason});await settle();},sharedHtml:()=>saved.render(),async importJson(plan){const json=JSON.stringify({format:'grindstone-practice',version:1,plan});dispatch('change',{target:{dataset:{},value:'fixture.json',files:[{size:json.length,text:async()=>json}],matches:selector=>selector==='[data-import]'}});await settle();}};
}
function attachedRecord(h){return h.attachment()?.record;}
function assertSessionFields(actual,original){for(const key of ['id','season','group','date','startTime','location','author','lead','status','skills','notes','noSkillReason'])assert.deepEqual(copy(actual[key]),copy(original[key]),'Preserve session '+key);}
(async()=>{
  await check('The saved-practice picker is visible near the top and opening a saved session attaches its ID and revision',async()=>{
    const h=await harness();assert(/data-shared-select/.test(h.root.innerHTML+h.sharedHtml()));await h.open();assert.equal(attachedRecord(h).id,'shared-practice');assert.equal(attachedRecord(h).revision,3);assert.equal(h.state().plan.name,'Original saved practice');assert.equal(h.saveCalls.length,0);
  });
  await check('Opening and saving without edits preserves frozen guidance, unknown IDs and nested components exactly',async()=>{
    const original=session(),h=await harness({records:[original]});await h.open();
    for(const [index,block] of original.plan.blocks.entries()){const opened=h.state().plan.blocks[index];for(const key of ['sourceId','sourceNote','ageNote','adaptation','steps','instructions'])assert.deepEqual(copy(opened[key]),copy(block[key]),'Opening preserves '+key);if(block.components)assert.deepEqual(copy(opened.components),block.components);}
    await h.save();assert.equal(h.saveCalls.length,1);const saved=h.saveCalls[0];assert.deepEqual(saved.plan,original.plan,'A no-op save must preserve the entire original source plan');assert(!JSON.stringify(saved.plan).includes('New catalog source note'));assert(!JSON.stringify(saved.plan).includes('New catalog adaptation'));assertSessionFields(saved,original);
  });
  await check('Saving an edited scheduled practice updates the same session using its optimistic revision',async()=>{
    const original=session(),h=await harness({records:[original]});await h.open();h.field('focus','Revised focus');h.blockField(0,'instructions','Coach revised task');await h.save('Coach Jane');assert.equal(h.saveCalls.length,1);const written=h.saveCalls[0];assert.equal(written.id,original.id);assert.equal(written.revision,3);assert.equal(written.actor,'Coach Jane');assert.equal(written.plan.focus,'Revised focus');assert.equal(written.plan.blocks[0].instructions,'Coach revised task');assertSessionFields(written,original);assert.equal(attachedRecord(h).revision,4);
  });
  await check('Repeated saves use the latest acknowledged revision',async()=>{
    const h=await harness();await h.open();h.field('focus','First edit');await h.save();h.field('focus','Second edit');await h.save();assert.deepEqual(h.saveCalls.map(record=>record.revision),[3,4]);assert.equal(attachedRecord(h).revision,5);assert.equal(h.records[0].plan.focus,'Second edit');
  });
  await check('Completed practice edits require a correction reason and retain confirmed skills and status',async()=>{
    const original=session({status:'completed',skills:[{id:'B01',title:'Confirmed stance',path:'#move/B01',category:'Movement'}]});original.plan.status='completed';original.plan.completedAt='2026-10-29T23:00:00Z';const h=await harness({records:[original]});await h.open();h.field('focus','Clarified completed plan');await h.save('Correcting coach');assert.equal(h.saveCalls.length,0,'Reason must be required');await h.save('Correcting coach','Corrected the printed instructions');assert.equal(h.saveCalls.length,1);const result=h.saveCalls[0];assert.equal(result.status,'completed');assert.deepEqual(result.skills,original.skills);assert.equal(result.noSkillReason,original.noSkillReason);assert.equal(result.lead,original.lead);assert.equal(result.location,original.location);assert.equal(result.notes,original.notes);assert.deepEqual(result.plan.sharedCorrection,{reason:'Corrected the printed instructions',actor:'Correcting coach',baseRevision:3});assert.equal(result.plan.focus,'Clarified completed plan');for(const key of ['status','completedAt','date','handoff','frozenProvenance'])assert.deepEqual(result.plan[key],original.plan[key],'Preserve completed plan '+key);
  });
  await check('A completed no-skills explanation is preserved and plan contents never become confirmed skills',async()=>{
    const original=session({status:'completed',skills:[],noSkillReason:'Practice ended before instruction'}),h=await harness({records:[original]});await h.open();h.field('focus','Plan retained for reference');await h.save('Coach','Clarified the planned focus');assert.equal(h.saveCalls.length,1);assert.deepEqual(h.saveCalls[0].skills,[]);assert.equal(h.saveCalls[0].noSkillReason,original.noSkillReason);assert.equal(h.saveCalls[0].status,'completed');
  });
  await check('Revision conflicts preserve the edited draft and original source revision',async()=>{
    const h=await harness();await h.open();h.field('focus','Keep my unsaved edit');h.records[0].revision=4;await h.save();assert.equal(h.saveCalls.length,1);assert.equal(h.state().plan.focus,'Keep my unsaved edit');assert.equal(attachedRecord(h).revision,3);assert.equal(h.records[0].revision,4);assert(!h.records[0].plan.focus.includes('Keep my'));
  });
  await check('Network failures preserve the current draft and do not advance its saved revision',async()=>{
    const h=await harness({save:async()=>{throw Error('Network unavailable');}});await h.open();h.field('notes','Keep these draft notes');await h.save();assert.equal(h.state().plan.notes,'Keep these draft notes');assert.equal(attachedRecord(h).revision,3);assert.equal(h.records[0].revision,3);assert.equal(h.saveCalls.length,1);
  });
  await check('Shared edit context and unsaved changes survive a browser reload together',async()=>{
    const h=await harness();await h.open();h.field('focus','Reload this unsaved edit');const stored=JSON.parse(h.values.get(h.builder.testing.keys.draft));assert.equal(stored.sharedSession.record.id,'shared-practice');assert.equal(stored.sharedSession.record.revision,3);assert(stored.sharedSession.baseline);const reloaded=await harness({values:h.values,records:h.records});assert.equal(reloaded.state().plan.focus,'Reload this unsaved edit');assert.equal(attachedRecord(reloaded).id,'shared-practice');assert.equal(attachedRecord(reloaded).revision,3);assert.deepEqual(copy(reloaded.state().plan.blocks),copy(h.state().plan.blocks),'Reload must not append current catalog notes or strip retired IDs');assert.equal(reloaded.saveCalls.length,0);
  });
  await check('Cancelling replacement retains the current edited draft and shared attachment',async()=>{
    const other=session({id:'other-practice',name:'Other practice',plan:snapshot('Other practice')}),h=await harness({records:[session(),other]});await h.open();h.field('focus','Current unsaved focus');const before=copy(h.state().plan);await h.saved.testing.open(other.id,'edit');await h.saved.testing.cancelLoad();await settle();assert.deepEqual(copy(h.state().plan),before);assert.equal(attachedRecord(h).id,'shared-practice');assert.equal(h.saveCalls.length,0);
  });
  await check('Opening a saved practice as a copy detaches the shared session',async()=>{
    const h=await harness();await h.open('shared-practice','copy');assert(!h.attachment());assert.equal(h.state().plan.name,'Original saved practice');h.field('focus','Independent copy');await h.action('save');assert.equal(h.saveCalls.length,0);assert(h.state().saved.length>0);assert(!JSON.stringify(h.state().saved).includes('sharedSession'));
  });
  await check('Start blank detaches the source and Undo restores both content and edit context',async()=>{
    const h=await harness();await h.open();h.field('focus','Restore this with Undo');const before=copy(h.state().plan);await h.action('new');assert.equal(h.state().plan.blocks.length,0);assert(!h.attachment());await h.action('undo');assert.deepEqual(copy(h.state().plan),before);assert.equal(attachedRecord(h).id,'shared-practice');assert.equal(attachedRecord(h).revision,3);
  });
  await check('Save a copy and local named-plan loading never retain a shared edit target',async()=>{
    const h=await harness();await h.open();await h.action('duplicate');assert(!h.attachment());assert.equal(h.saveCalls.length,0);assert.equal(h.state().saved.length,1);const localId=h.state().saved[0].id;await h.open();h.node('[data-saved-plan]').value=localId;await h.action('load');assert(!h.attachment());assert.equal(h.saveCalls.length,0);assert(!JSON.parse(h.values.get(h.builder.testing.keys.draft)).sharedSession);
  });
  await check('Tracker imports and JSON imports detach the source rather than editing that session',async()=>{
    const h=await harness();await h.open();h.builder.tracker.importPlan(snapshot('Imported tracker copy'));assert(!h.attachment());assert.equal(h.state().plan.name,'Imported tracker copy');await h.open();await h.importJson(snapshot('Imported JSON copy'));assert(!h.attachment());assert.equal(h.state().plan.name,'Imported JSON copy');assert.equal(h.saveCalls.length,0);
  });
  await check('Undo after a successful save cannot revert the source to a stale acknowledged revision',async()=>{
    const h=await harness();await h.open();await h.action('remove',1);await h.save();assert.equal(attachedRecord(h).revision,4);await h.action('undo');assert.equal(h.state().plan.blocks.length,2);assert.equal(attachedRecord(h).revision,4);await h.save();assert.deepEqual(h.saveCalls.map(record=>record.revision),[3,4]);
  });
  await check('An edit route opens the exact saved session without creating a new shared record',async()=>{
    const h=await harness({params:'edit=shared-practice&season=2026-2027'});await settle();await h.saved.testing.confirmLoad();await settle();assert.equal(attachedRecord(h).id,'shared-practice');assert.equal(attachedRecord(h).season,'2026-2027');assert.equal(h.saveCalls.length,0);assert.equal(h.records.length,1);
  });
  await check('A different tracker endpoint cannot silently reuse a persisted shared edit target',async()=>{
    const original=await harness();await original.open();original.field('focus','Draft from original tracker');const h=await harness({values:original.values,endpoint:'https://different-tracker.example.test'});assert.equal(h.state().plan.focus,'Draft from original tracker');assert(!h.attachment(),'Saved target from another endpoint must detach');assert.equal(h.saveCalls.length,0);
  });
  await check('Copying a completed source clears completion metadata and keeps the source untouched',async()=>{
    const original=session({status:'completed'});original.plan.status='completed';original.plan.completedAt='2026-10-29T23:00:00Z';const h=await harness({records:[original]});await h.open(original.id,'copy');const plan=h.state().plan;assert(!h.attachment());assert.equal(plan.status,'planned');assert.equal(plan.completedAt,'');assert.equal(plan.date,'');assert(Object.values(plan.handoff).every(value=>!value));assert.deepEqual(h.records[0],original);assert.equal(h.saveCalls.length,0);
  });
  await check('Local week and shared attachments are mutually exclusive and Undo restores the matching target',async()=>{
    const h=await harness({weekUi:true}),weeks=h.context.window.GRINDSTONE_WEEKS;await h.open();weeks.testing.act('new');weeks.testing.act('add');assert(!h.attachment());assert(weeks.captureAttachment());const weekTarget=copy(weeks.captureAttachment());await h.open();assert.equal(attachedRecord(h).id,'shared-practice');assert.equal(weeks.captureAttachment(),null);await h.action('undo');assert(!h.attachment());assert.deepEqual(copy(weeks.captureAttachment()),weekTarget);assert.equal(h.saveCalls.length,0);
  });
  await check('Double Save while a request is pending sends one revision only',async()=>{
    const request=deferred(),h=await harness({save:()=>request.promise});await h.open();h.field('focus','One submitted edit');const first=h.saved.testing.save({actor:'Coach'});await settle();await h.saved.testing.save({actor:'Coach'});assert.equal(h.saveCalls.length,1);request.resolve({...h.saveCalls[0],revision:4});await first;await settle();assert.equal(attachedRecord(h).revision,4);
  });
  await check('Edits made during a delayed save remain local and the next save uses the acknowledged revision',async()=>{
    const request=deferred();let saves=0;const h=await harness({save:raw=>++saves===1?request.promise:Promise.resolve({...copy(raw),revision:raw.revision+1})});await h.open();h.field('focus','Submitted focus');const first=h.saved.testing.save({actor:'Coach'});await settle();h.field('focus','Newer unsaved focus');request.resolve({...h.saveCalls[0],revision:4});await first;await settle();assert.equal(h.state().plan.focus,'Newer unsaved focus');assert.equal(attachedRecord(h).revision,4);assert.equal(attachedRecord(h).plan.focus,'Submitted focus');await h.save();assert.equal(h.saveCalls[1].revision,4);assert.equal(h.saveCalls[1].plan.focus,'Newer unsaved focus');
  });
  await check('A late save acknowledgment cannot overwrite or reattach a newly imported independent draft',async()=>{
    const request=deferred(),h=await harness({save:()=>request.promise});await h.open();h.field('focus','Submitted old-source edit');const saving=h.saved.testing.save({actor:'Coach'});await settle();h.builder.tracker.importPlan(snapshot('Independent draft while saving'));const independent=copy(h.state().plan);assert(!h.attachment());request.resolve({...h.saveCalls[0],revision:4});await saving;await settle();assert.deepEqual(copy(h.state().plan),independent);assert(!h.attachment());assert(!JSON.parse(h.values.get(h.builder.testing.keys.draft)).sharedSession);
  });
  await check('A stale saved-list response cannot replace a newer result',async()=>{
    const old=deferred(),newer=session({id:'newer-session',name:'Newer list result',plan:snapshot('Newer list result')});let calls=0;const h=await harness({load:()=>++calls===1?old.promise:Promise.resolve({mode:'shared',sessions:[newer],curricula:[]})});await h.saved.testing.loadList();old.resolve({mode:'shared',sessions:[session()],curricula:[]});await settle();assert(h.sharedHtml().includes('Newer list result'));assert(!h.sharedHtml().includes('Original saved practice'));assert.equal(h.saveCalls.length,0);
  });
  await check('A late edit-route response cannot reopen an earlier requested practice',async()=>{
    const old=deferred(),second=session({id:'second-practice',name:'Second requested practice',plan:snapshot('Second requested practice')}),all=[session(),second];let calls=0;const h=await harness({params:'edit=shared-practice&season=2026-2027',load:()=>++calls===1?old.promise:Promise.resolve({mode:'shared',sessions:all,curricula:[]})});h.mount('edit=second-practice&season=2026-2027');await settle();assert.equal(attachedRecord(h).id,'second-practice');old.resolve({mode:'shared',sessions:all,curricula:[]});await settle();assert.equal(attachedRecord(h).id,'second-practice');assert(!h.saved.testing.state().pending,'Stale route must not leave a confirmation for the older source');assert.equal(h.saveCalls.length,0);
  });
  await check('Replacement confirmation notices edits made after the confirmation opened',async()=>{
    const second=session({id:'second-practice',name:'Second requested practice',plan:snapshot('Second requested practice')}),h=await harness({records:[session(),second]});await h.open();await h.saved.testing.open(second.id,'edit');h.field('focus','Changed after prompt');await h.saved.testing.confirmLoad();assert.equal(attachedRecord(h).id,'shared-practice');assert.equal(h.state().plan.focus,'Changed after prompt');await h.saved.testing.cancelLoad();assert.equal(h.saveCalls.length,0);
  });
  await check('The top picker and normal builder Save action edit the selected shared session',async()=>{
    const second=session({id:'second-practice',name:'Picker-selected practice',plan:snapshot('Picker-selected practice')}),h=await harness({records:[session(),second]});await h.saved.testing.loadList();h.dispatch('change',{target:{dataset:{},value:second.id,matches:()=>false,hasAttribute:name=>name==='data-shared-select'}});const button={dataset:{sharedAction:'load-edit'}};h.dispatch('click',{target:{closest:selector=>selector==='[data-shared-action]'?button:null}});await settle();assert.equal(attachedRecord(h).id,second.id);h.dispatch('input',{target:{dataset:{sharedField:'actor'},value:'Coach using top picker',matches:()=>false}});h.field('focus','Edited through the normal builder');await h.action('save');assert.equal(h.saveCalls.length,1);assert.equal(h.saveCalls[0].id,second.id);assert.equal(h.saveCalls[0].actor,'Coach using top picker');assert.equal(h.state().saved.length,0,'Normal Save must not silently create a local named copy');
  });
  await check('Explicit metadata edits update the same scheduled session while editor name remains separate',async()=>{
    const original=session(),h=await harness();await h.open();await h.save('Another editor');assert.equal(h.saveCalls[0].author,original.author);h.field('name','Updated session name');h.field('date','2026-10-28');h.field('startTime','18:30');h.field('owner','Revised plan author');await h.save('Editor name');const written=h.saveCalls[1];assert.equal(written.id,original.id);assert.equal(written.name,'Updated session name');assert.equal(written.date,'2026-10-28');assert.equal(written.startTime,'18:30');assert.equal(written.author,'Revised plan author');assert.equal(written.actor,'Editor name');for(const key of ['group','season','location','lead','status','notes','skills'])assert.deepEqual(written[key],original[key]);
  });
  await check('Leaving the builder before an edit-route response cannot replace the draft',async()=>{
    const request=deferred(),h=await harness({params:'edit=shared-practice&season=2026-2027',load:()=>request.promise});const before=copy(h.state().plan);h.root.isConnected=false;request.resolve({mode:'shared',sessions:[session()],curricula:[]});await settle();assert.deepEqual(copy(h.state().plan),before);assert(!h.attachment());assert(!h.saved.testing.state().pending);assert.equal(h.saveCalls.length,0);
  });
  await check('An open shared picker stays open during a list refresh',async()=>{
    const h=await harness();await h.open();h.node('.builder-shared-picker').open=true;await h.saved.testing.loadList();assert.equal(h.node('.builder-shared-picker').open,true);assert.equal(h.saveCalls.length,0);
  });
  await check('Picker edits, cancelled route requests, and separate copies keep the URL matched to the current context',async()=>{
    const second=session({id:'second-practice',name:'Second practice',plan:snapshot('Second practice')}),h=await harness({records:[session(),second]});await h.open();assert(h.context.window.location.hash.includes('edit=shared-practice'));await h.open(second.id);assert(h.context.window.location.hash.includes('edit=second-practice'));h.context.window.location.hash='#practices?edit=shared-practice&season=2026-2027';await h.saved.testing.open('shared-practice');await h.saved.testing.cancelLoad();assert(h.context.window.location.hash.includes('edit=second-practice'));await h.saved.testing.detachAsCopy();assert(!h.context.window.location.hash.includes('edit='));assert(!h.attachment());assert.equal(h.saveCalls.length,0);
  });
  await check('Opening a requested saved practice selects it and reveals it through incompatible picker filters',async()=>{
    const second=session({id:'z-latest',date:'2026-10-30',name:'Default first result',plan:snapshot('Default first result')}),h=await harness({records:[session(),second],params:'edit=shared-practice&season=2026-2027'});await settle();assert.equal(attachedRecord(h).id,'shared-practice');assert.equal(h.saved.testing.state().selected,'shared-practice');h.dispatch('change',{target:{dataset:{sharedFilter:'group'},value:'blue',matches:()=>false,hasAttribute:()=>false}});h.dispatch('input',{target:{dataset:{sharedFilter:'q'},value:'Does not match',matches:()=>false}});await h.saved.testing.open('shared-practice');const state=h.saved.testing.state();assert.equal(state.selected,'shared-practice');assert.equal(state.group,'pups');assert.equal(state.q,'');assert(h.sharedHtml().includes('value="shared-practice" selected'));assert.equal(h.saveCalls.length,0);
  });
  console.log(checks+' saved-practice builder checks passed. No files written.');
})().catch(error=>{console.error(error);process.exitCode=1;});
