/* Read-only release checks: node tools/foundation-check.js */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const base=path.resolve(__dirname,'..'),clone=value=>JSON.parse(JSON.stringify(value));
const page=fs.readFileSync(path.join(base,'index.html'),'utf8');
const scriptUrls=[...page.matchAll(/<script defer src="([^"]+)"/g)].map(match=>match[1]),scripts=scriptUrls.map(url=>url.split('?')[0]);
const saved=new Map(),ctx={window:{localStorage:{getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,value)},confirm:()=>true},URL,URLSearchParams,console,Blob,setTimeout};
for(const file of scripts.filter(file=>file!=='app.js'))vm.runInNewContext(fs.readFileSync(path.join(base,file),'utf8'),ctx,{filename:file});
const w=ctx.window,builder=w.GRINDSTONE_BUILDER,t=builder.testing,components=w.GRINDSTONE_COMPONENTS,key=components.testing.branchKey;
const catalog=t.normalizeCatalog(),byId=new Map(catalog.map(item=>[item.id,item])),series=w.GRINDSTONE_PATHWAY.series.find(item=>item.id==='S24'),source=byId.get('series:S24');
let checks=0;
function check(name,fn){fn();checks++;console.log('PASS '+name);}
function fakeRoot(){
 const nodes=new Map(),events={};
 return {dataset:{},selectedKeys:null,events,
 querySelector(selector){if(selector===':invalid')return null;if(!nodes.has(selector))nodes.set(selector,{innerHTML:'',textContent:'',value:'',checked:false,disabled:false,hidden:false,focus(){}});return nodes.get(selector);},
 querySelectorAll(selector){if(selector==='[data-component-branch="picker"]')return series.branches.map((branch,i)=>({value:key(branch),checked:this.selectedKeys?this.selectedKeys.includes(key(branch)):i===0}));return [];},
 addEventListener(name,fn){(events[name]||=[]).push(fn);},emit(name,event){for(const fn of events[name]||[])fn(event);}
 };
}
let root;
function mount(params=''){builder.render(new URLSearchParams(params));root=fakeRoot();builder.bind(root);return root;}
function reset(params=''){saved.clear();t.reset();mount(params);}
function picker(name,value){root.emit('change',{target:{dataset:{picker:name},value,type:typeof value==='boolean'?'checkbox':'select-one',checked:value}});}
function ids(){return [...root.querySelector('[data-picker="selected"]').innerHTML.matchAll(/<option value="([^"]+)"/g)].map(match=>match[1]);}
function state(){return t.getState();}
function putPlan(plan){saved.set(t.keys.draft,JSON.stringify(plan));t.reset();mount();}
check('release loads Foundation data before its integrations with current asset hashes',()=>{
 for(const [first,second] of [['series-foundation.js','series-library.js'],['series-foundation.js','series-expansion.js'],['practice-components.js','practice-builder.js']])assert(scripts.indexOf(first)<scripts.indexOf(second));
 for(const file of ['series-foundation.js','series-library.js','series-expansion.js','skill-pathway.js','practice-builder.js','practice-components.js','practice-components.css']){
  const match=page.match(new RegExp('(?:src|href)="'+file.replace(/\./g,'\\.')+'\\?v=([^"]+)"'));assert(match,file);
  assert.equal(match[1],crypto.createHash('sha256').update(fs.readFileSync(path.join(base,file),'utf8').replace(/\r\n/g,'\n'),'utf8').digest('hex').slice(0,16));
 }
 assert(!scripts.includes('practice-weeks.js'));assert(!page.includes('family-quickstart.css'));
});
check('S24 and both move guides join the existing library exactly once',()=>{
 assert.equal(w.GRINDSTONE_PATHWAY.series[0].id,'S24');assert.equal(catalog[0].id,'series:S24');
 for(const id of ['N24','N25']){assert.equal(w.GRINDSTONE.moves.filter(move=>move.id===id).length,1);assert(byId.has(id));assert(w.GRINDSTONE.videos[id].video.url);assert(w.GRINDSTONE_TAGS.entries[id]);assert(byId.get(id).memberships.some(item=>item.id==='S24'));assert(byId.get(id).sourceNote);}
 assert.equal(series.branches.length,6);assert.deepEqual(Array.from(source.age_groups),['7-10','11-14']);
});
check('Foundation listing and detail retain independent-skill labels and appear first',()=>{
 const directory=w.GRINDSTONE_SKILL_PATHWAY.render(new URLSearchParams('view=series')),detail=w.GRINDSTONE_SKILL_PATHWAY.render(new URLSearchParams('series=S24'));
 assert(directory.indexOf('<h2>Foundations</h2>')<directory.indexOf('<h2>Neutral</h2>'));
 assert(detail.includes('Match essentials'));assert(detail.includes('Core skills'));assert(!detail.includes('Common foundation'));assert(!detail.includes('Before adding this option'));
 for(const group of w.GRINDSTONE_PATHWAY.groups.filter(group=>group.age_group==='4-6'))for(const phase of group.phases)assert(!phase.series_ids.includes('S24'));
});
check('Pups excludes Foundation and new partnered moves by default; broader reference browsing is explicit',()=>{
 reset('age=4-6&series=S24');assert(!ids().includes('series:S24'));picker('type','move');assert(!ids().includes('N24'));assert(!ids().includes('N25'));
 picker('matchAge',false);assert(ids().includes('N24'));assert(ids().includes('N25'));picker('type','series');assert(ids().includes('series:S24'));
 reset('program=pups&series=S24');assert(!ids().includes('series:S24'));
});
check('picker adds one selected skill by default without unrelated station or week controls',()=>{
 reset('age=7-10&series=S24');assert.equal(state().picker.selected,'series:S24');t.action('add',-1);
 const block=state().plan.blocks[0];assert.equal(block.components.series.selections.length,1);assert.equal(block.components.series.selections[0].title,series.branches[0].title);
 const html=builder.render(new URLSearchParams());assert(!html.includes('data-week-'));assert(!html.includes('data-handoff-'));assert(!components.renderBlock(block,0,catalog).includes('station rotation'));
 assert.equal(components.renderPicker(byId.get('series:S13')),'');
});
check('all 63 nonempty skill combinations retain exactly their selected guide snapshots on clean and reload',()=>{
 for(let mask=1;mask<64;mask++){
  const branches=series.branches.filter((_,i)=>mask&(1<<i)),selected=components.selectSeries(t.blockFrom(source,'series'),branches.map(key),catalog);
  const expected=[...new Set(branches.flatMap(branch=>branch.move_ids))];assert.deepEqual(Array.from(selected.components.series.guides,guide=>guide.sourceId),expected);
  const raw={...state().plan,blocks:[selected]},clean=t.cleanPlan(raw);
  assert.equal(clean.blocks[0].components.series.kind,'foundation');assert.deepEqual(clone(clean.blocks[0].components),clone(selected.components));
  assert.deepEqual(clone(components.reloadBlock(selected,t.blockFrom(source,'series'),catalog).components),clone(selected.components));
  assert(selected.instructions.includes('receiving control'));assert(!selected.instructions.includes('common foundation'));
 }
});
check('selected skills survive save, copy, load and JSON import with coach edits',()=>{
 reset('age=7-10&series=S24');root.selectedKeys=[key(series.branches[2]),key(series.branches[5])];t.action('add',-1);
 let plan=state().plan;plan.blocks[0].instructions+=' Coach note: use the south mat.';plan.blocks[0].rotation='Coach A watches receiving.';putPlan(plan);t.action('save',-1);
 const firstId=state().plan.id,stored=clone(state().plan);t.action('duplicate',-1);assert.notEqual(state().plan.id,firstId);
 root.querySelector('[data-saved-plan]').value=firstId;t.action('load',-1);assert.deepEqual(state().plan.blocks,stored.blocks);
 const imported=t.parseImport(JSON.stringify({format:'grindstone-practice',version:1,plan:state().plan}));assert.equal(imported.id,'');assert.deepEqual(clone(imported.blocks),clone(state().plan.blocks));
 assert(imported.blocks[0].instructions.includes('Coach note:'));assert.equal(imported.blocks[0].rotation,'Coach A watches receiving.');
});
check('both print modes retain selected receiving limits, source scope, cues and exact linked instruction',()=>{
 const block=state().plan.blocks[0];
 for(const full of [false,true]){
  const html=t.printHtml(full);assert(html.includes('Selected core skills'));assert(!html.includes('Selected series options'));
  for(const guide of block.components.series.guides)for(const text of [guide.title,guide.task,guide.readiness,guide.boundary,guide.sourceNote,...guide.steps,...guide.cues].filter(Boolean))assert(html.includes(t.esc(text)),guide.sourceId+' print omitted '+text.slice(0,55));
 }
});
check('reloading keeps selected skills and timing; detaching retains snapshots and print content',()=>{
 const old=state().plan.blocks[0],choices=clone(old.components.series.selections);t.action('reload-guide',0);
 assert.deepEqual(state().plan.blocks[0].components.series.selections,choices);assert.equal(state().plan.blocks[0].minutes,old.minutes);assert.equal(state().plan.blocks[0].rotation,old.rotation);
 t.action('detach-guide',0);assert.equal(state().plan.blocks[0].sourceId,'');assert.deepEqual(state().plan.blocks[0].components.series.selections,choices);assert(t.printHtml(false).includes('Hip Dump Mat Return'));
 const imported=t.parseImport(JSON.stringify({format:'grindstone-practice',version:1,plan:state().plan}));assert.deepEqual(clone(imported.blocks[0].components),clone(state().plan.blocks[0].components));
});
check('apply-selected-skills event updates only the chosen block and retains coach timing',()=>{
 reset('age=7-10&series=S24');t.action('add',-1);
 const host={dataset:{componentBlock:'0'},querySelectorAll:()=>series.branches.map((branch,i)=>({value:key(branch),checked:i===1||i===4}))};
 const button={disabled:false,closest:selector=>selector==='[data-component-block]'?host:null};
 root.emit('click',{target:{closest:selector=>selector==='[data-component-action="apply-series"]'?button:null}});
 assert.deepEqual(state().plan.blocks[0].components.series.selections.map(item=>item.title),[series.branches[1].title,series.branches[4].title]);
 const before=clone(state().plan);host.querySelectorAll=()=>[];root.emit('click',{target:{closest:selector=>selector==='[data-component-action="apply-series"]'?button:null}});assert.deepEqual(state().plan,before);
});
check('missing branches preserve saved instruction and print labels',()=>{
 const selected=state().plan.blocks[0],removed=series.branches.splice(1,1)[0];assert(components.selectionStatus(selected));assert.deepEqual(clone(components.reloadBlock(selected,t.blockFrom(source,'series'),catalog)),clone(selected));assert(components.printBlock(selected,catalog).includes('Selected core skills'));series.branches.splice(1,0,removed);
});
check('untrusted imported links cannot replace canonical guide links',()=>{
 const selected=clone(state().plan.blocks[0]);selected.components.series.guides[0].url='javascript:alert(1)';selected.components.series.guides[0].video='https://evil.example/';
 const cleaned=components.cleanBlock(selected),html=components.printBlock({...selected,...cleaned},catalog);assert(!html.includes('evil.example'));assert(!html.includes('javascript:'));assert(html.includes('Open '));
});
check('unsupported preview station imports fail instead of silently losing their records',()=>{
 const raw=clone(state().plan);raw.blocks[0].components.rotation={rounds:3,stations:[{task:'Do not silently drop this'}]};assert.throws(()=>t.parseImport(JSON.stringify({format:'grindstone-practice',version:1,plan:raw})),/preview-only structured stations/);
});
console.log(checks+' Foundation release checks passed. No files written.');
