/* Read-only checks: node tools/components-check.js */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert');
const base = path.resolve(__dirname,'..');
let checks = 0;
const check = (name,fn) => { fn(); checks++; console.log('PASS ' + name); };
const clone = value => JSON.parse(JSON.stringify(value));
const ctx = {window:{confirm:()=>true,localStorage:{getItem:()=>null,setItem(){}}},URL,URLSearchParams,console,setTimeout};
for (const file of ['data.js','game-video-fixes.js','kyle-data.js','kyle-instruction-data.js','video-additions.js','game-guides-a.js','game-guides-b.js','game-guides-c.js','game-guide-library.js','move-tags.js','series-moves.js','series-bottom.js','series-neutral.js','series-top.js','series-escapes.js','series-foundation.js','series-library.js','practice-frameworks.js','pathway-data.js','series-expansion.js','catalog-tags.js','practice-components.js','practice-builder.js']) vm.runInNewContext(fs.readFileSync(path.join(base,file),'utf8'),ctx,{filename:file});
const api = ctx.window.GRINDSTONE_COMPONENTS, t = api.testing;
const catalog = ctx.window.GRINDSTONE_BUILDER.testing.normalizeCatalog(), pathway = ctx.window.GRINDSTONE_PATHWAY;
const byId = new Map(catalog.map(item=>[item.id,item]));
const source = byId.get('series:S13'), series = pathway.series.find(item=>item.id==='S13');
function blockFor(item=source) { return {id:'block-1',sourceId:item.id,name:item.title,type:item.types[0],minutes:item.minutes,instructions:item.instructions,setup:item.setup,cues:item.cues.join('\n'),steps:clone(item.steps),readiness:item.readiness,boundary:item.boundary,adaptation:item.adaptation||'',ageNote:item.ageNote||'',sourceNote:item.sourceNote||'',rotation:'Coach B supervises the north mat.',delivery:'pairs'}; }
const key = t.branchKey, first = key(series.branches[0]), second = key(series.branches[1]);
const selected = api.selectSeries(blockFor(),[first,second],catalog);
const rotationBlock = () => ({...blockFor(),minutes:20,components:{version:1,rotation:t.newRotation()}});
function hostFor(plan) {
  const timing = {innerHTML:''}, listeners = {}, changes = [], snapshots = [], inputs = [];
  const panels = new Map();
  const panelFor = index => {
    if (!panels.has(index)) { const nodes = new Map(); panels.set(index,{querySelector(selector) { if (!nodes.has(selector)) nodes.set(selector,{innerHTML:'',textContent:'',value:'',checked:false,disabled:false}); return nodes.get(selector); }}); }
    return panels.get(index);
  };
  const host = {dataset:{componentBlock:'0'},querySelector(selector) { const match = selector.match(/^\[data-station-picker="(\d+)"\]$/); return match ? panelFor(Number(match[1])) : timing; },querySelectorAll:()=>inputs};
  const container = {dataset:{},addEventListener:(name,fn)=>{listeners[name]=fn;},querySelectorAll:()=>[host]};
  api.bind(container,{getPlan:()=>plan,getAge:()=>plan.age,getCatalog:()=>catalog,beforeChange:()=>snapshots.push(clone(plan)),onChange:change=>changes.push(change)});
  function element(dataset={},value='') { return {dataset,value,checked:false,validity:{valid:true},setCustomValidity(message){this.error=message;this.validity.valid=!message;},closest:()=>host,hasAttribute(name){return name==='data-component-broad'&&'componentBroad' in this.dataset;}}; }
  return {container,host,timing,listeners,changes,snapshots,inputs,element,panelFor,
    input(dataset,value){const el=element(dataset,value);listeners.input({target:el});return el;},
    change(dataset,value,checked=false){const el=element(dataset,value);el.checked=checked;listeners.change({target:el});return el;},
    click(action,index){const button=element({componentAction:action,stationIndex:String(index)});listeners.click({target:{closest:()=>button}});}
  };
}
check('legacy blocks have no components forced into them and retain old rotation text',()=>{
  const old=blockFor(), copy=clone(old); assert.deepEqual(clone(api.cleanBlock(old)),{}); assert.deepEqual(old,copy);
  const fresh={...old,instructions:'Fresh guide'}; assert.strictEqual(api.reloadBlock(old,fresh,catalog),fresh);
});
check('a new series picker initially selects one option and non-series pickers stay empty',()=>{
  assert.equal((api.renderPicker(source).match(/ checked>/g)||[]).length,1);
  assert.equal(api.renderPicker(byId.get('P01')),'');
});
check('selected options keep the common foundation, receiving, readiness and reset',()=>{
  assert(selected.instructions.includes(series.foundation));
  assert(selected.instructions.includes(series.branches[0].action));
  assert(selected.instructions.includes(series.branches[1].action));
  for(const branch of series.branches.slice(2)) assert(!selected.instructions.includes(branch.action));
  assert(selected.instructions.includes('receiving control')); assert(selected.instructions.includes('Reset:'));
  assert.equal(selected.readiness,source.readiness); assert.equal(selected.boundary,source.boundary);
  assert.equal(selected.rotation,blockFor().rotation); assert.equal(selected.minutes,source.minutes);
  assert(selected.steps.every(step=>!step.includes('undefined')));
});
check('every canonical series can select each branch with its source guidance intact',()=>{
  for(const item of pathway.series) for(const branch of item.branches) {
    const result=api.selectSeries(blockFor(byId.get('series:'+item.id)),[key(branch)],catalog);
    assert(result.instructions.includes(item.foundation),item.id+' foundation');
    assert(result.instructions.includes(branch.action),item.id+' action');
    if(branch.readiness)assert(result.instructions.includes(branch.readiness),item.id+' branch prerequisites');
    assert(result.instructions.includes('receiving control'));assert(result.steps.some(step=>step.includes('receiving')));
    for(const guide of result.components.series.guides) {
      const original=byId.get(guide.sourceId);assert.equal(guide.readiness,original.readiness||'');assert.equal(guide.boundary,original.boundary||'');assert.equal(guide.ageNote,original.ageNote||'');assert.equal(guide.sourceNote,original.sourceNote||'');assert.equal(guide.adaptation,original.adaptation||'');
    }
    api.cleanBlock(result);
  }
});
check('guide snapshots are copied independently rather than changing the catalog',()=>{
  const result=api.selectSeries(blockFor(),[first],catalog), guide=result.components.series.guides[0], old=byId.get(guide.sourceId).steps[0];
  guide.steps[0]='Coach edit';assert.equal(byId.get(guide.sourceId).steps[0],old);
});
check('empty, duplicate and unknown branch selections are rejected',()=>{
  assert.throws(()=>api.selectSeries(blockFor(),[],catalog));
  assert.throws(()=>api.selectSeries(blockFor(),[first,first],catalog));
  assert.throws(()=>api.selectSeries(blockFor(),['branch-deleted'],catalog));
});
check('picker selection applies exactly checked choices and old non-DOM callers are unchanged',()=>{
  const item=blockFor();assert.strictEqual(api.applyPicker(item,source,{},catalog),item);
  const picker={querySelectorAll:()=>[{value:first,checked:false},{value:second,checked:true}]};
  assert.deepEqual(clone(api.applyPicker(item,source,picker,catalog).components.series.selections.map(x=>x.key)),[second]);
});
check('JSON roundtrip preserves selected guides, coach instructions and rotation notes',()=>{
  const before={...selected,instructions:selected.instructions+'\nCoach reminder: slow down.'};
  const roundtrip={...JSON.parse(JSON.stringify(before)),...api.cleanBlock(JSON.parse(JSON.stringify(before)))};
  assert.deepEqual(roundtrip,clone(before));
  assert(!JSON.stringify(roundtrip).includes('"video":'));
});
check('reloading refreshes only selected branches and keeps rotation cards',()=>{
  const before=clone(selected);before.components.rotation=t.newRotation();before.components.rotation.stations[0].task='Coach task';
  const refreshed=api.reloadBlock(before,blockFor(),catalog);
  assert.deepEqual(clone(refreshed.components.series.selections),clone(before.components.series.selections));
  assert.equal(refreshed.components.rotation.stations[0].task,'Coach task');
  for(const branch of series.branches.slice(2))assert(!refreshed.instructions.includes(branch.action));
});
check('branch keys tolerate order changes and a removed option preserves all saved prose',()=>{
  const saved=clone(selected), original=series.branches;series.branches=original.slice().reverse();
  assert.equal(api.selectionStatus(saved),'');assert.deepEqual(clone(api.reloadBlock(saved,blockFor(),catalog).components.series.selections.map(x=>x.key)).sort(),saved.components.series.selections.map(x=>x.key).sort());
  series.branches=original.filter(branch=>key(branch)!==first);
  saved.instructions+=' Unique coach notes';const retained=api.reloadBlock(saved,blockFor(),catalog);
  assert.deepEqual(clone(retained),saved);assert(api.selectionStatus(saved).includes('preserved'));
  assert(api.renderBlock(saved,0,catalog,'11-14').includes('saved instruction is preserved'));
  series.branches=original;
});
check('removed source references remain readable and cannot introduce imported links',()=>{
  const before=clone(selected);before.components.series.guides[0].sourceId='missing';before.components.series.guides[0].video='https://malicious.invalid';before.components.series.guides[0].path='javascript:alert(1)';
  const sanitized={...before,...api.cleanBlock(before)}, html=api.printBlock(sanitized,catalog);
  assert(html.includes('saved instruction is retained'));assert(!html.includes('malicious.invalid'));assert(!html.includes('javascript:'));
  assert(html.includes(before.components.series.guides[0].title));
});
check('station elapsed time is shared, not multiplied by the number of stations',()=>{
  const block=rotationBlock();assert.equal(api.rotationMinutes(block.components.rotation),20);
  block.components.rotation.stations.push(t.cleanStation({name:'Fourth',task:'Separate group'}));assert.equal(api.rotationMinutes(block.components.rotation),20);assert.equal(block.minutes,20);
  const r={...block.components.rotation,rounds:1,workMinutes:4,briefingMinutes:2,finishMinutes:1,changeMinutes:5};assert.equal(api.rotationMinutes(r),7);
});
check('station draft incompleteness and slot mismatch are explicit',()=>{
  const block=rotationBlock();block.minutes=10;const warnings=api.problems(block);
  assert(warnings.some(x=>x.includes('Station 1 needs')));assert(warnings.some(x=>x.includes('20 minutes; the practice slot is 10')));
  const html=api.printBlock(block,catalog);assert(html.includes('Task needed before use'));assert(html.includes('Use the rotation total or adjust'));
});
check('station timing validation rejects invalid values and oversized structures',()=>{
  for(const [field,value] of [['rounds',1.5],['rounds',0],['rounds',NaN],['workMinutes',0],['workMinutes',Infinity],['changeMinutes',-1],['workMinutes',.3],['workMinutes',120]]) {
    const b=rotationBlock();b.components.rotation[field]=value;assert.throws(()=>api.cleanBlock(b),field+' '+value);
  }
  const b=rotationBlock();b.components.rotation.stations=Array.from({length:13},()=>({}));assert.throws(()=>api.cleanBlock(b));
  const s=clone(selected);s.components.series.selections.push(s.components.series.selections[0]);assert.throws(()=>api.cleanBlock(s));
});
check('structured station JSON roundtrip retains all optional notes and linked guide',()=>{
  const b=rotationBlock();b.components.rotation.stations[0]=t.cleanStation({name:'Cooperative sit-out',task:'Switch receiver each minute',coach:'Coach A',equipment:'Marker',space:'North',group:'Pairs',rounds:'Two turns each',simpler:'One announced response',success:'Balanced finish',stop:'Reset if hand support slips',guide:t.snapshot(byId.get('B18'))});
  assert.deepEqual(clone(api.cleanBlock(b)),{components:clone(b.components)});
  const html=api.printBlock(b,catalog);
  for(const text of ['Coach A','Marker','North','Pairs','Two turns each','One announced response','Balanced finish','Reset if hand support slips','Ready when','Boundaries','Source scope'])assert(html.includes(text),text);
});
check('station guide choices respect explicit ages and require an opt-in for broader references',()=>{
  const b=rotationBlock(), strict=api.renderBlock(b,0,catalog,'4-6');
  assert(strict.includes('<option value="P01">'));assert(!strict.includes('<option value="A01">'));assert(!strict.includes('<option value="kyle:K18">'));assert(!strict.includes('<option value="series:S13">'));
  b.components.rotation.showAll=true;const broad=api.renderBlock(b,0,catalog,'4-6');assert(broad.includes('<option value="A01">'));
});
check('HTML escaping and safe links cover imported station and guide text',()=>{
  const b=rotationBlock();b.components.rotation.stations[0]=t.cleanStation({name:'<script>bad</script>',task:'<img onerror=bad>',guide:t.snapshot(byId.get('P01'))});
  const html=api.printBlock(b,catalog);assert(html.includes('&lt;script&gt;'));assert(!html.includes('<script>'));assert(html.includes('href="#move/P01"'));assert(t.trustedLinks(t.snapshot(byId.get('G01')),catalog).includes('href="#game/G01"'));
  const malicious=t.cleanGuide({sourceId:'unknown',title:'Unknown',path:'https://evil.invalid',video:'javascript:bad'});assert(!t.guideHtml(malicious,catalog,true).includes('evil.invalid'));
});
check('completed records ignore all component mutation events',()=>{
  const plan={status:'completed',age:'11-14',blocks:[rotationBlock()]}, before=clone(plan), h=hostFor(plan);
  h.input({stationField:'task',stationIndex:'0'},'Bad edit');h.input({rotationField:'rounds'},'4');h.change({componentBroad:''},'',true);h.change({stationSource:'0'},'P01');h.click('remove-rotation');h.click('use-total');h.click('add-station');
  assert.deepEqual(plan,before);assert.equal(h.changes.length,0);assert.equal(h.snapshots.length,0);
});
check('station edits preserve the outer block timing until explicitly applying the total',()=>{
  const plan={age:'11-14',blocks:[rotationBlock()]}, h=hostFor(plan);
  h.input({stationField:'task',stationIndex:'0'},'Five cooperative turns');h.input({rotationField:'rounds'},'4');
  assert.equal(plan.blocks[0].components.rotation.stations[0].task,'Five cooperative turns');assert.equal(api.rotationMinutes(plan.blocks[0].components.rotation),26);assert.equal(plan.blocks[0].minutes,20);
  assert(h.timing.innerHTML.includes('practice slot is 20'));h.click('use-total');assert.equal(plan.blocks[0].minutes,26);assert.equal(h.snapshots.length,1);
});
check('invalid shared timing reports an actionable validation error and can recover',()=>{
  const plan={age:'11-14',blocks:[rotationBlock()]}, h=hostFor(plan), el=h.input({rotationField:'workMinutes'},'120');
  assert(el.error.includes('120 minutes'));assert.equal(plan.blocks[0].components.rotation.workMinutes,5);
  el.value='6';h.listeners.input({target:el});assert.equal(el.error,'');assert.equal(plan.blocks[0].components.rotation.workMinutes,6);
});
check('copying a guide retains station arrangements and age/source guidance',()=>{
  const plan={age:'11-14',blocks:[rotationBlock()]}, h=hostFor(plan), station=plan.blocks[0].components.rotation.stations[0];station.coach='Coach West';
  h.change({stationSource:'0'},'B18');assert(!station.guide);h.click('use-station-guide',0);assert.equal(station.coach,'Coach West');assert.equal(station.guide.readiness,byId.get('B18').readiness);assert.equal(station.guide.ageNote,byId.get('B18').ageNote);
});
check('guide event cannot quietly select an out-of-group item without broader opt-in',()=>{
  const plan={age:'4-6',blocks:[rotationBlock()]}, h=hostFor(plan);h.change({stationSource:'0'},'A01');assert.equal(plan.blocks[0].components.rotation.stations[0].task,'');
  h.change({stationFilter:'matchAge',stationIndex:'0'},'',false);h.change({stationSource:'0'},'A01');h.click('use-station-guide',0);assert.equal(plan.blocks[0].components.rotation.stations[0].guide.sourceId,'A01');
});
check('refresh updates a changed outer slot and rotation removal preserves original text',()=>{
  const plan={age:'11-14',blocks:[rotationBlock()]}, h=hostFor(plan), note=plan.blocks[0].rotation;plan.blocks[0].minutes=30;
  api.refresh(h.container,plan);assert(h.timing.innerHTML.includes('practice slot is 30'));
  h.click('remove-rotation');assert.equal(plan.blocks[0].rotation,note);assert(!plan.blocks[0].components.rotation);
});

check('Foundation Series has six independent essentials and retains only selected skill guides',()=>{
  const s=pathway.series.find(x=>x.id==='S24'),item=byId.get('series:S24');
  assert.equal(s.title,'Foundation Series');assert.equal(item.kind,'foundation');assert.equal(s.branches.length,6);
  assert.equal(pathway.series[0].id,'S24');
  assert.deepEqual(Array.from(s.branches,b=>b.title),['Stand-up escape','Double leg','Single leg','Breakdown — Tight Waist Chop','Half nelson and pin finish','Mat return']);
  const stand=s.branches[0],single=s.branches[2];
  const block=api.selectSeries(blockFor(item),[key(stand),key(single)],catalog);
  assert(block.instructions.includes(stand.action));assert(block.instructions.includes(single.action));
  for(const omitted of s.branches.filter(b=>b!==stand&&b!==single))assert(!block.instructions.includes(omitted.action));
  assert(block.instructions.includes('Match essentials:'));assert(!block.instructions.includes('Start every attempt from the common foundation'));
  const ids=Array.from(block.components.series.guides,g=>g.sourceId);
  assert(ids.includes('B17')&&ids.includes('B21')&&ids.includes('N24')&&ids.includes('B08'));
  assert(!ids.includes('N25')&&!ids.includes('B26')&&!ids.includes('B22'));
  assert.equal(block.components.series.kind,'foundation');assert.equal(api.cleanBlock(block).components.series.kind,'foundation');
  const saved=JSON.parse(JSON.stringify(block));assert.equal(api.cleanBlock(saved).components.series.kind,'foundation');
  const printed=api.printBlock(saved,catalog);assert(/core skills/i.test(printed));assert(!printed.includes('Selected series options'));
  assert(printed.includes(t.snapshot(byId.get('N24')).boundary));
});
check('Foundation Series keeps age and return prerequisites visible without adding it to Pups',()=>{
  const s=pathway.series.find(x=>x.id==='S24');assert(!s.age_groups.includes('4-6'));
  for(const phase of pathway.groups.find(g=>g.age_group==='4-6').phases)assert(!phase.series_ids.includes(s.id));
  const mat=s.branches.find(b=>b.title==='Mat return'),guide=byId.get('N25');
  const block=api.selectSeries(blockFor(byId.get('series:S24')),[key(mat)],catalog);
  assert(block.components.series.guides.some(g=>g.sourceId==='N25'));
  assert(block.instructions.includes(mat.readiness));
  for(const phrase of [guide.boundary,guide.readiness])assert(api.printBlock(block,catalog).includes(escForTest(phrase)));
  function escForTest(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  assert(block.boundary.includes('No surprise returns'));
});


check('station filters use shared facets, aliases and cues without changing any practice data',()=>{
  const plan={age:'7-10',blocks:[rotationBlock()]},h=hostFor(plan),before=clone(plan);
  h.input({stationFilter:'search',stationIndex:'0'},'run the pipe');
  let state=t.stationPicker(plan.blocks[0].components.rotation.stations[0]);
  assert(catalog.filter(item=>t.stationMatches(item,state,plan.age)).some(item=>item.id==='B08'));
  h.input({stationFilter:'search',stationIndex:'0'},'');
  for(const [key,value] of [['position','bottom'],['purpose','escape'],['use','teach'],['category','bottom']])h.change({stationFilter:key,stationIndex:'0'},value);
  const matches=catalog.filter(item=>t.stationMatches(item,state,plan.age));
  assert(matches.some(item=>item.id==='B17'));assert(!matches.some(item=>item.id==='B07'));
  h.input({stationFilter:'search',stationIndex:'1'},'knees bent eyes ahead');
  const other=t.stationPicker(plan.blocks[0].components.rotation.stations[1]);assert.equal(other.position,'');assert.equal(state.search,'');
  assert(catalog.filter(item=>t.stationMatches(item,other,plan.age)).some(item=>item.id==='P01'));
  assert.deepEqual(plan,before);assert.equal(h.changes.length,0);assert.equal(h.snapshots.length,0);
  assert(h.panelFor(0).querySelector('[data-station-chips]').innerHTML.includes('Position: Bottom'));
});
check('search updates only station results and keeps its search field node and value',()=>{
  const plan={age:'7-10',blocks:[rotationBlock()]},h=hostFor(plan),field=h.panelFor(0).querySelector('[data-station-filter="search"]');
  field.value='stand';
  const el=h.element({stationFilter:'search',stationIndex:'0'},'stand');
  h.listeners.input({target:el});
  assert.strictEqual(h.panelFor(0).querySelector('[data-station-filter="search"]'),field);
  assert.equal(field.value,'stand');
  assert(h.panelFor(0).querySelector('[data-station-source]').innerHTML.includes('B17'));
  assert(!h.panelFor(0).querySelector('[data-station-source]').innerHTML.includes('value="B07"'));
});
check('Foundation Series selection stages a candidate and inserts only the checked skill',()=>{
  const plan={age:'7-10',blocks:[rotationBlock()]},h=hostFor(plan),rotation=plan.blocks[0].components.rotation,station=rotation.stations[0];
  station.coach='Coach Ryan';station.equipment='Cone';station.task='Keep my task until insertion';
  const before=clone(plan),s=pathway.series.find(item=>item.id==='S24');
  h.change({stationFilter:'family',stationIndex:'0'},'S24');
  assert.equal(t.stationPicker(station).selected,'series:S24');assert.deepEqual(plan,before);
  assert(h.panelFor(0).querySelector('[data-station-preview]').innerHTML.includes('Core skills to teach today'));
  h.change({componentBranch:'station-0'},key(s.branches[0]),false);
  assert.equal(h.panelFor(0).querySelector('[data-component-action="use-station-guide"]').disabled,true);
  h.change({componentBranch:'station-0'},key(s.branches[2]),true);
  h.click('use-station-guide',0);
  assert.equal(station.series.kind,'foundation');assert.deepEqual(clone(station.series.selections.map(item=>item.title)),['Single leg']);
  assert.equal(station.guide.sourceId,'series:S24');assert.equal(station.guide.title,'Foundation Series');assert.equal(station.name,'Foundation Series — Single leg');
  assert(station.task.includes(s.branches[2].action));assert(!station.task.includes(s.branches[0].action));assert(!station.task.includes(s.branches[5].action));
  assert(station.task.includes('Teach each skill separately'));assert(station.task.includes('receiving control'));
  assert(station.series.guides.some(item=>item.sourceId==='N24'));assert(!station.series.guides.some(item=>item.sourceId==='N25'));
  assert.equal(station.coach,'Coach Ryan');assert.equal(station.equipment,'Cone');
  assert.deepEqual(clone(rotation.stations.slice(1)),before.blocks[0].components.rotation.stations.slice(1));
  assert.equal(plan.blocks[0].minutes,before.blocks[0].minutes);assert.equal(api.rotationMinutes(rotation),20);
  assert.equal(h.snapshots.length,1);
});
check('regular technique series keeps its foundation, selected response, receiving rules and snapshots in a station',()=>{
  const plan={age:'11-14',blocks:[rotationBlock()]},h=hostFor(plan),station=plan.blocks[0].components.rotation.stations[1];
  h.change({stationFilter:'type',stationIndex:'1'},'series');
  h.change({stationSource:'1'},'series:S13');
  h.change({componentBranch:'station-1'},first,false);
  h.change({componentBranch:'station-1'},second,true);
  h.click('use-station-guide',1);
  assert.equal(station.guide.sourceId,'series:S13');
  assert(station.task.includes(series.foundation));assert(station.task.includes(series.branches[1].action));assert(!station.task.includes(series.branches[0].action));
  assert(station.task.includes('common foundation'));assert(station.task.includes('receiving control'));assert(station.task.includes('Reset:'));
  assert.deepEqual(clone(station.series.selections.map(item=>item.key)),[second]);
  assert(station.series.guides.length);
});
check('canceling explicit station insertion preserves task, guidance, timing and other stations',()=>{
  const plan={age:'11-14',blocks:[rotationBlock()]},h=hostFor(plan);
  plan.blocks[0].components.rotation.stations[0].task='Coach-authored setup and turns';
  const before=clone(plan);
  h.change({stationFilter:'family',stationIndex:'0'},'S24');assert.deepEqual(plan,before);
  ctx.window.confirm=()=>false;
  try {h.click('use-station-guide',0);} finally {ctx.window.confirm=()=>true;}
  assert.deepEqual(plan,before);assert.equal(h.snapshots.length,0);assert.equal(h.changes.length,0);
});
check('station selected series survive full builder clean, export/import and both print modes',()=>{
  const item=byId.get('series:S24'),s=pathway.series.find(item=>item.id==='S24'),b=rotationBlock();
  b.components.rotation.stations[0]=t.stationWithGuide(b.components.rotation.stations[0],item,[key(s.branches[5])],catalog);
  const station=b.components.rotation.stations[0];station.task+=' Coach reminder: use the agreed receiving partner.';
  const builder=ctx.window.GRINDSTONE_BUILDER;builder.render(new URLSearchParams());
  const plan={...builder.testing.newPlan(),name:'Station skills',age:'11-14',blocks:[b]};
  const clean=builder.testing.cleanPlan(clone(plan)),imported=builder.testing.parseImport(JSON.stringify({format:'grindstone-practice',version:1,plan:clean}));
  assert.deepEqual(clone(imported.blocks[0].components.rotation.stations[0]),clone(station));
  assert(!JSON.stringify(imported).includes('renderedAge'));assert(!JSON.stringify(imported).includes('groupTouched'));
  const nodes=new Map(),root={dataset:{},querySelector(selector){if(selector===':invalid'||selector==='[data-week-content]')return null;if(!nodes.has(selector))nodes.set(selector,{innerHTML:'',textContent:'',value:'',checked:false,disabled:false,hidden:false,focus(){}});return nodes.get(selector);},querySelectorAll(){return[];},addEventListener(){}};
  builder.bind(root);builder.testing.replaceDraft(clean);
  for(const full of [false,true]) {
    const printed=builder.testing.printHtml(full);
    for(const value of [station.task,station.guide.readiness,station.guide.boundary,station.guide.sourceNote,...station.series.guides.flatMap(guide=>[guide.title,guide.readiness,guide.boundary,guide.ageNote,guide.sourceNote])].filter(Boolean))assert(printed.includes(escapeText(value)),'Missing station print guidance');
    assert(printed.includes('Selected core skills'));assert(printed.includes('Mat return'));
  }
  function escapeText(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
});
check('group changes refresh station eligibility while preserving filters and written tasks',()=>{
  const plan={age:'11-14',blocks:[rotationBlock()]},h=hostFor(plan),station=plan.blocks[0].components.rotation.stations[0];station.task='Keep this task';
  h.change({stationFilter:'family',stationIndex:'0'},'S24');
  assert.equal(t.stationPicker(station).selected,'series:S24');
  plan.age='4-6';api.refresh(h.container,plan);
  assert.equal(t.stationPicker(station).family,'S24');assert.equal(t.stationPicker(station).selected,'');assert.equal(station.task,'Keep this task');
  assert(!h.panelFor(0).querySelector('[data-station-source]').innerHTML.includes('value="series:S24"'));
  assert(h.panelFor(0).querySelector('[data-station-group-note]').textContent.includes('4-6'));
  h.change({stationFilter:'matchAge',stationIndex:'0'},'',false);h.change({stationFilter:'family',stationIndex:'0'},'S24');
  assert.equal(t.stationPicker(station).selected,'series:S24');
  assert.equal(t.stationPicker(plan.blocks[0].components.rotation.stations[1]).matchAge,true);
});
check('station filter state follows station identity after removal and is absent from copies',()=>{
  const plan={age:'11-14',blocks:[rotationBlock()]},h=hostFor(plan),rotation=plan.blocks[0].components.rotation;
  const secondStation=rotation.stations[1];
  h.input({stationFilter:'search',stationIndex:'0'},'half');
  h.input({stationFilter:'search',stationIndex:'1'},'single');
  h.click('remove-station',0);
  assert.strictEqual(rotation.stations[0],secondStation);assert.equal(t.stationPicker(rotation.stations[0]).search,'single');
  assert.equal(t.stationPicker(clone(rotation.stations[0])).search,'');
  const saved=api.cleanBlock(plan.blocks[0]);assert(!JSON.stringify(saved).includes('"search"'));
});
check('completed records cannot browse, select, insert or clear station guides',()=>{
  const plan={age:'7-10',blocks:[rotationBlock()]},h=hostFor(plan),station=plan.blocks[0].components.rotation.stations[0];
  h.change({stationFilter:'family',stationIndex:'0'},'S24');
  plan.status='completed';
  const before=clone(plan),stateBefore=clone(t.stationPicker(station));
  h.input({stationFilter:'search',stationIndex:'0'},'new');h.change({stationSource:'0'},'B18');h.change({stationFilter:'matchAge',stationIndex:'0'},'',false);h.change({componentBranch:'station-0'},key(pathway.series[0].branches[1]),true);
  h.click('use-station-guide',0);h.click('clear-station-filters',0);
  assert.deepEqual(plan,before);assert.deepEqual(clone(t.stationPicker(station)),stateBefore);
});
check('removed station series branches and unknown guide links retain saved instruction safely',()=>{
  const b=rotationBlock(),station=t.stationWithGuide(b.components.rotation.stations[0],source,[first],catalog);
  b.components.rotation.stations[0]=station;
  station.series.selections[0].key='branch-removed';station.series.guides[0].sourceId='unknown';
  station.series.guides[0].video='https://bad.invalid';station.guide.path='javascript:bad';station.task+=' Original coach prose.';
  const cleaned={...b,...api.cleanBlock(clone(b))},html=api.printBlock(cleaned,catalog);
  assert.equal(cleaned.components.rotation.stations[0].task,station.task);
  assert(html.includes('saved instruction is preserved'));assert(html.includes('Original coach prose'));assert(!html.includes('bad.invalid'));assert(!html.includes('javascript:bad'));
  assert.throws(()=>api.cleanBlock({...b,components:{version:1,rotation:{...b.components.rotation,stations:[{...station,series:{...station.series,selections:[]}}]}}}));
});
check('replacing a series with one move removes only obsolete station-series instruction',()=>{
  const b=rotationBlock(),initial=t.stationWithGuide(b.components.rotation.stations[0],source,[first],catalog);
  initial.coach='Coach Eric';initial.rounds='Swap every minute';initial.name='North mat: Coach Eric';
  const next=t.stationWithGuide(initial,byId.get('B18'),[],catalog);
  assert(!next.series);assert.equal(next.guide.sourceId,'B18');assert.equal(next.coach,initial.coach);assert.equal(next.rounds,initial.rounds);assert.equal(next.name,'North mat: Coach Eric');
  assert(initial.series);assert.equal(initial.guide.sourceId,'series:S13');
});
check('station controls never use main-picker action attributes or block branch context',()=>{
  const b=rotationBlock();t.stationPicker(b.components.rotation.stations[0]).selected='series:S24';
  const html=t.stationPickerHtml(b.components.rotation.stations[0],0,catalog,'7-10',false);
  for(const attr of ['data-picker=','data-action=','data-clear-filter=','data-suggest-use=','data-component-branch="block"'])assert(!html.includes(attr));
  assert(html.includes('data-component-branch="station-0"'));assert(html.indexOf('data-station-filter="family"')<html.indexOf('More filters'));
});


check('a removed saved station choice can be replaced explicitly without discarding its old task first',()=>{
  const b=rotationBlock(),station=t.stationWithGuide(b.components.rotation.stations[0],source,[first],catalog);
  station.series.selections[0].key='removed-key';station.task='Historical instruction that must stay until replacement';
  b.components.rotation.stations[0]=station;
  const plan={age:'11-14',blocks:[b]},h=hostFor(plan),before=clone(station);
  h.change({stationFilter:'family',stationIndex:'0'},'S13');
  assert.deepEqual(clone(t.stationPicker(station).selections['series:S13']),[]);
  assert.equal(h.panelFor(0).querySelector('[data-component-action="use-station-guide"]').disabled,true);
  assert.deepEqual(station,before);
  h.change({componentBranch:'station-0'},second,true);h.click('use-station-guide',0);
  assert.deepEqual(clone(station.series.selections.map(item=>item.key)),[second]);assert(station.task.includes(series.branches[1].action));
});

console.log(checks+' component checks passed.');
