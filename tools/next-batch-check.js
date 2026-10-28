/* Read-only: node tools/next-batch-check.js. Uses the actual page script order.
   These checks validate behavior and provenance fields, not video mechanics. */
'use strict';
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const site = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script defer src="([^"?]+)(?:\?[^\"]*)?"/g)].map(match => match[1]);
const values = new Map(), elements = new Map();
const node = id => {
  if (!elements.has(id)) elements.set(id, {id, innerHTML:'', textContent:'', dataset:{}, classList:{add(){},remove(){}}, addEventListener(){}, setAttribute(){}, getAttribute(){return null;}, querySelector(){return null;}, querySelectorAll(){return [];}, focus(){}});
  return elements.get(id);
};
const storage = {getItem:key => values.get(key) || null, setItem:(key,value) => values.set(key,value), removeItem:key => values.delete(key)};
const location = {hash:'#moves',href:'https://packetbench.github.io/grindstone-guide/#moves'};
const context = {window:{localStorage:storage,addEventListener(){},confirm:()=>true,scrollY:0}, localStorage:storage,
  document:{getElementById:node,querySelector:node,querySelectorAll:()=>[],addEventListener(){}},
  history:{state:null,replaceState(){},pushState(){}}, location, console, URL, URLSearchParams, Blob, Date, Math, setTimeout, clearTimeout, requestAnimationFrame(){}
};
vm.createContext(context);
for (const file of scripts.filter(file => file !== 'app.js')) vm.runInContext(fs.readFileSync(path.join(site,file),'utf8'),context,{filename:file});
const app = fs.readFileSync(path.join(site,'app.js'),'utf8');
const startup = 'window.addEventListener("popstate",historyNavigation);window.addEventListener("hashchange",historyNavigation);render({restore:true});';
assert(app.includes(startup), 'App startup changed; update the test harness deliberately');
vm.runInContext(app.replace(startup, 'window.nextBatchApi={safeRouteHash,moveDetail,linked};'),context,{filename:'app.js'});
const w = context.window, builder = w.GRINDSTONE_BUILDER, b = builder.testing, components = w.GRINDSTONE_COMPONENTS;
const catalog = b.normalizeCatalog(), byId = new Map(catalog.map(item => [item.id,item]));
const canonical = id => byId.has(id) ? id : byId.has('kyle:' + id) ? 'kyle:' + id : byId.has('facebook:' + id) ? 'facebook:' + id : id;
const plain = value => JSON.parse(JSON.stringify(value));
const text = (value,label) => {assert.equal(typeof value,'string',label);assert(value.trim(),label);};
let checks=0;
const failures=[];
function check(name, run) {
  try {run();checks++;console.log('PASS ' + name);}
  catch (error) {failures.push({name,error});console.error('FAIL ' + name + ': ' + error.message);}
}
const moduleSpecs = [
  ['NEXT_NEUTRAL','series-next-neutral.js'], ['NEXT_TOP','series-next-top.js'], ['NEXT_BOTTOM','series-next-bottom.js']
];
const modules = moduleSpecs.map(([name,file]) => {
  const module = w['GRINDSTONE_SERIES_' + name];
  assert(module, name + ' must be loaded by the actual page');
  return {name,file,module};
});
const fresh = modules.flatMap(({module}) => module.moves || []);
const allSeries = new Map(w.GRINDSTONE_PATHWAY.series.map(item => [item.id,item]));
const affectedIds = [...new Set(modules.flatMap(({module}) => [...(module.series || []).map(item=>item.id),...(module.research_status?.promoted || []).map(item=>item.series_id)].filter(Boolean)))];
const affected = affectedIds.map(id => {assert(allSeries.has(id),'Promoted series must actually exist: '+id);return allSeries.get(id);});
check('new modules load before integration and cannot create duplicate canonical guides', () => {
  assert.equal(byId.size,catalog.length);
  assert.equal(new Set(fresh.map(item=>item.id)).size,fresh.length);
  assert.equal(allSeries.size,w.GRINDSTONE_PATHWAY.series.length);
  for (const {name,file,module} of modules) {
    for (const integration of ['series-library.js','series-expansion.js']) assert(scripts.indexOf(file)>=0 && scripts.indexOf(file)<scripts.indexOf(integration),name+' load order');
    for (const move of module.moves || []) assert.equal(w.GRINDSTONE.moves.filter(item=>item.id===move.id).length,1,move.id+' canonical count');
  }
});
const categoryIds = new Set(w.GRINDSTONE_TAGS.categories.map(item=>item.id));
for (const move of fresh) check(move.id + ' retains its complete setup, teaching and source scope', () => {
  const guide = byId.get(move.id), tags=w.GRINDSTONE_CATALOG_TAGS.resolve(move.id);
  assert(guide && tags,move.id+' integrated');assert(categoryIds.has(move.category),move.id+' uses a real category');
  for (const key of ['purpose','prerequisite','setup','drill','boundary','error','fix','verification']) text(move[key],move.id+' '+key);
  assert(move.steps.length>=4 && move.cues.length,move.id+' teaching content');
  assert.equal(guide.setup,move.setup,move.id+' setup survives catalog adapter');
  assert(guide.readiness && guide.sourceNote,move.id+' prerequisite and evidence reach builder');
  for (const key of ['positions','purposes','uses','age_groups']) assert.deepEqual(plain(tags[key]),plain(move[key]),move.id+' '+key);
  assert(move.sources.length);
  for (const source of move.sources) {assert.equal(new URL(source.url).protocol,'https:');text(source.title,move.id+' source title');assert(/^\d{4}-\d{2}-\d{2}$/.test(source.accessed),move.id+' source date');}
  if (move.video?.url) {assert.equal(guide.video,move.video.url);assert.equal(new URL(guide.video).protocol,'https:');text(move.video.note,move.id+' video scope');}
  else {assert.equal(move.video,null);assert.equal(guide.video,'');assert(!w.GRINDSTONE.videos[move.id]?.video);}
});
check('unresolved research remains outside usable series and has persistent question references', () => {
  for (const {module} of modules) for (const held of module.research_status?.held || []) {
    const record=w.GRINDSTONE_RESEARCH_QUEUE.items.find(item=>item.source_key===(held.id || held.title));
    assert(record && /^Q\d+$/.test(record.id),'Research question missing: '+held.id);
    assert(!w.GRINDSTONE_PATHWAY.series.some(item=>item.title===held.title),'Research title was promoted as usable instruction');
    for (const id of held.move_ids || []) assert(!byId.has(canonical(id)),'Held-only guide leaked into the picker: '+id);
  }
});
let root, branchFields=[];
function mount() {
  builder.render(new URLSearchParams());
  const nodes=new Map(),listeners={};
  root={dataset:{},listeners,querySelector(selector){
    if (selector==='input:invalid, select:invalid, textarea:invalid' || selector==='[data-week-content]') return null;
    if (!nodes.has(selector)) nodes.set(selector,{innerHTML:'',textContent:'',value:'',checked:false,disabled:false,hidden:false,focus(){}});
    return nodes.get(selector);
  },querySelectorAll:selector=>selector==='[data-component-branch="picker"]'?branchFields:[],addEventListener:(name,handler)=>listeners[name]=handler};
  builder.bind(root);
}
function picker(key,value){root.listeners.change({target:{dataset:{picker:key},type:'select-one',value}});}
const state=()=>plain(b.getState()), total=plan=>plan.blocks.reduce((sum,block)=>sum+block.minutes,0);
const branchKey=components.testing.branchKey;
function selectedIds(series,branches){
  const foundation=series.members.filter(member=>/^foundation$/i.test(member.role)).map(member=>canonical(member.move_id));
  return [...new Set([...foundation,...branches.flatMap(branch=>branch.move_ids.map(canonical))])];
}
function setupChoice(series,branches,minutes=12.5) {
  b.reset();values.clear();mount();
  const plan=b.newPlan(),slot=b.blockFrom(null,'custom');slot.name='';slot.minutes=minutes;slot.section='teach';
  Object.assign(plan,{age:series.age_groups[0],target:60,blocks:[b.blockFrom(null,'water'),slot,b.blockFrom(null,'water')]});b.replaceDraft(plan);
  picker('destination',slot.id);picker('type','series');picker('selected','series:'+series.id);
  branchFields=series.branches.map(branch=>({value:branchKey(branch),checked:branches.includes(branch)}));
  return state().plan;
}
for (const series of affected) {
  const collection=byId.get('series:'+series.id);
  check(series.id+' has an actual reusable foundation and meaningful branch choices',()=>{
    assert(collection);assert(series.members.some(member=>/^foundation$/i.test(member.role)),'Builder needs an exact Foundation role');
    assert(series.branches.length>=2);assert.equal(new Set(series.branches.map(branchKey)).size,series.branches.length);
    for(const field of ['foundation','setup','readiness','boundaries','verification'])text(series[field],series.id+' '+field);
    for(const branch of series.branches){for(const field of ['title','when','action','readiness'])text(branch[field],field);for(const id of branch.move_ids)assert(byId.has(canonical(id)),id);}
  });
  for (const branch of series.branches) check(series.id+' / '+branch.title+' selects only its foundation and chosen guides',()=>{
    const selected=components.selectSeries(b.blockFrom(collection,'series'),[branchKey(branch)],catalog), before=JSON.stringify(selected);
    const guides=components.expandedGuides(selected,catalog), expected=selectedIds(series,[branch]);
    assert.deepEqual(plain(guides.map(guide=>guide.id)),expected);assert.equal(new Set(guides.map(guide=>guide.id)).size,guides.length);assert.equal(JSON.stringify(selected),before);
    for(const guide of guides){const canonicalGuide=byId.get(guide.id);assert(guide.setup.includes(canonicalGuide.setup || ''),guide.id+' setup');assert(guide.instructions.includes(series.foundation));assert(guide.readiness.includes(series.readiness));assert(guide.sourceNote.includes(series.verification));assert(guide.boundary.includes(series.boundaries));}
  });
  check(series.id+' splits a selected slot into distinct guides while preserving minutes and surrounding water',()=>{
    const before=setupChoice(series,series.branches),expected=selectedIds(series,series.branches);b.action('add',-1);
    const pending=state().pendingReplacement;assert(pending?.blocks,state().placementNotice);assert.deepEqual(state().plan,before);
    assert.deepEqual(pending.blocks.map(block=>block.sourceId),expected);assert.equal(pending.blocks.reduce((sum,block)=>sum+block.minutes,0),before.blocks[1].minutes);
    assert(pending.blocks.every(block=>block.minutes>=0.5 && Number.isInteger(block.minutes*2)));
    b.action('confirm-replace',-1);const accepted=state().plan,split=accepted.blocks.slice(1,-1);
    assert.equal(total(accepted),total(before));assert.equal(accepted.target,before.target);assert.deepEqual(accepted.blocks[0],before.blocks[0]);assert.deepEqual(accepted.blocks.at(-1),before.blocks.at(-1));
    assert.equal(new Set(accepted.blocks.map(block=>block.id)).size,accepted.blocks.length);
    for(const block of split){const guide=byId.get(block.sourceId);assert.equal(block.type,'move');assert(block.setup.includes(guide.setup || ''));assert(block.sourceNote.includes(guide.sourceNote));assert(block.instructions.includes(series.foundation));assert(block.readiness.includes(series.readiness));assert.equal(block.timingConfirmed,false);}
    const imported=b.parseImport(JSON.stringify({format:'grindstone-practice',version:accepted.version,plan:accepted}));assert.deepEqual(plain(imported.blocks),accepted.blocks);
    const print=b.printHtml(true);for(const block of split)assert(print.includes(b.esc(block.name)),block.sourceId+' in print');
    b.action('water-after',1);const water=state().plan;assert.equal(water.blocks[2].type,'water');assert.equal(total(water),total(accepted)+2);
    b.action('down',1);assert.deepEqual(state().plan.blocks[2],accepted.blocks[1]);b.action('undo',-1);assert.deepEqual(state().plan,water);
  });
  check(series.id+' rejects insufficient time without losing the selected slot',()=>{
    const minimum=selectedIds(series,series.branches).length*0.5;
    const before=setupChoice(series,series.branches,minimum-0.5);b.action('add',-1);assert.equal(state().pendingReplacement,null);assert(state().placementError);assert.deepEqual(state().plan,before);
    const enough=plain(before);enough.blocks[1].minutes=minimum;b.replaceDraft(enough);b.action('add',-1);assert(state().pendingReplacement.blocks.every(block=>block.minutes===0.5));
    b.action('confirm-replace',-1);assert.equal(total(state().plan),total(enough));b.action('undo',-1);assert.deepEqual(state().plan,enough);
  });
}
for (const guide of [...fresh.map(move=>byId.get(move.id)),...affected.map(series=>byId.get('series:'+series.id))]) check(guide.id+' obeys age filters in both selection menus',()=>{
  b.reset();values.clear();mount();picker('search',guide.id);
  const station=components.testing.stationPicker({});station.search=guide.id;
  for(const age of ['4-6','7-10','11-14']){const plan=b.newPlan();plan.age=age;b.replaceDraft(plan);const allowed=guide.age_groups.includes(age);assert.equal(b.catalogMatches(guide),allowed,guide.id+' main '+age);assert.equal(components.testing.stationMatches(guide,station,age),allowed,guide.id+' station '+age);}
});
for(const id of ['N111','N115','N116']) check(id+' survives three-digit routes, print, import and reaction navigation',()=>{
  const guide=byId.get(id);assert(guide,'Expected three-digit guide '+id);assert.equal(guide.path,'#move/'+id);
  assert.equal(w.nextBatchApi.safeRouteHash('#move/'+id),'#move/'+id);assert.equal(w.nextBatchApi.safeRouteHash('#move/'+id+'1'),'');
  const page=w.nextBatchApi.moveDetail(id);assert(page.includes(b.esc(guide.title)));assert(page.includes('guide-steps-'+id));assert(page.includes('#practices?move='+id));
  const linked=w.nextBatchApi.linked(id+' next');assert(linked.includes('href="#move/'+id+'"'),'Inline IDs cannot truncate to two digits');
  b.reset();values.clear();mount();const plan=b.newPlan();plan.age=guide.age_groups[0];plan.blocks=[b.blockFrom(guide,'move')];b.replaceDraft(plan);
  const printed=b.printHtml(true);assert(printed.includes(b.esc(guide.title)));assert(printed.includes(b.esc(guide.setup)),'Exact setup appears in full print');
  const imported=b.parseImport(JSON.stringify({format:'grindstone-practice',version:plan.version,plan}));assert.equal(imported.blocks[0].sourceId,id);
  assert.equal(w.GRINDSTONE_REACTIONS.canonicalId(id),id);assert.equal(w.GRINDSTONE_REACTIONS.route(id),'#move/'+id);
  const links=w.GRINDSTONE_REACTIONS.links.filter(link=>link.from===id || link.to===id);assert(links.length,id+' linked to related instruction');
  for(const link of links){text(link.condition,'Reaction condition');text(link.reverse,'Reverse condition');assert(['continuation','response'].includes(link.kind));const forward=w.GRINDSTONE_REACTIONS.resolve(link.from),reverse=w.GRINDSTONE_REACTIONS.resolve(link.to);assert(forward[link.kind==='response'?'responses':'nextOptions'].some(item=>item.id===canonical(link.to)));assert(reverse[link.kind==='response'?'answers':'buildsFrom'].some(item=>item.id===canonical(link.from)));}
});
console.log(checks+' next-batch runtime checks passed; '+failures.length+' failed. Video mechanics and mobile visuals require their separate review.');
if(failures.length) process.exitCode=1;
