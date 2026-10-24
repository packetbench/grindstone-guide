'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const base=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(base,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script defer src="([^"?]+)(?:\?[^"]*)?"/g)].map(m=>m[1]);
const context={window:{localStorage:{getItem:()=>null,setItem(){}},confirm:()=>true},location:{href:'http://127.0.0.1:50784/'},URL,URLSearchParams,console,Blob,setTimeout};
vm.createContext(context);
for(const file of scripts.filter(file=>file!=='app.js'))vm.runInContext(fs.readFileSync(path.join(base,file),'utf8'),context,{filename:file});
const w=context.window,plain=value=>JSON.parse(JSON.stringify(value));
const modules=[w.GRINDSTONE_SERIES_NEUTRAL_NEXT,w.GRINDSTONE_SERIES_TOP_NEXT,w.GRINDSTONE_SERIES_DEFENSE_NEXT];
const catalog=w.GRINDSTONE_BUILDER.testing.normalizeCatalog(),byId=new Map(catalog.map(item=>[item.id,item]));
let count=0;function check(name,fn){fn();count++;console.log('PASS '+name);}
check('all new modules load before integration and teaching groups before shared tags',()=>{
 for(const file of ['series-neutral-next.js','series-top-next.js','series-defense-next.js'])assert(scripts.indexOf(file)<scripts.indexOf('series-library.js'));
 assert(scripts.indexOf('series-expansion.js')<scripts.indexOf('series-teaching-groups.js'));
 assert(scripts.indexOf('series-teaching-groups.js')<scripts.indexOf('catalog-tags.js'));
 assert(scripts.indexOf('in-progress-data.js')<scripts.indexOf('series-research-status.js'));
 assert(modules.every(Boolean));
});
for(const module of modules){
 for(const series of module.series)check(series.id+' expands every individual branch with its own foundation and receiving scope',()=>{
  assert(series.branches.length>=2);assert(byId.has('series:'+series.id));
  for(const branch of series.branches){
   assert(branch.when&&branch.action&&branch.readiness&&branch.move_ids.length);
   const block=w.GRINDSTONE_BUILDER.testing.blockFrom(byId.get('series:'+series.id),'series');
   const selected=w.GRINDSTONE_COMPONENTS.selectSeries(block,[w.GRINDSTONE_COMPONENTS.testing.branchKey(branch)],catalog);
   const guides=w.GRINDSTONE_COMPONENTS.expandedGuides(selected,catalog);
   for(const id of branch.move_ids)assert(guides.some(guide=>guide.id===(/^K/.test(id)?'kyle:'+id:id)),series.id+' lost '+id);
   for(const guide of guides){assert(guide.steps.length);assert(guide.instructions.includes(series.foundation));assert(guide.readiness.includes(series.readiness));assert(guide.boundary.includes(series.boundaries));}
  }
  const tag=w.GRINDSTONE_CATALOG_TAGS.resolve('series:'+series.id);assert(tag.positions.includes(series.position));
 });
 for(const move of module.moves)check(move.id+' has a complete standalone guide and correct declared goal tags',()=>{
  assert(byId.has(move.id));assert(move.steps.length>=4&&move.cues.length&&move.drill&&move.boundary&&move.error&&move.fix&&move.prerequisite);
  assert(/^https:\/\//.test(move.video.url));assert(move.verification&&move.video.note);
  const tags=w.GRINDSTONE_CATALOG_TAGS.resolve(move.id);
  if(move.positions)assert.deepEqual(plain(tags.positions),plain(move.positions));
  if(move.purposes)assert.deepEqual(plain(tags.purposes),plain(move.purposes));
  assert(!tags.age_groups.includes('4-6'));
 });
}
check('common connected skills are visible to the same ready group as their series',()=>{
 for(const id of ['A01','A02','A03','A04','A05','A15','A16','A19','A24','N01','N02','N03','N04','N05','N11']){
  const tags=w.GRINDSTONE_CATALOG_TAGS.resolve(id);assert.equal(tags.tier,'Intermediate');assert.deepEqual(plain(tags.age_groups),['7-10','11-14']);assert(tags.ageNote.includes('prerequisite'));
 }
 const half=w.GRINDSTONE_PATHWAY.series.find(s=>s.id==='S21'),pass=w.GRINDSTONE_PATHWAY.series.find(s=>s.id==='S28');
 assert(half.age_groups.includes('7-10'));assert(half.steps[0].includes('without requiring'));
 assert(pass.age_groups.includes('7-10'));assert(pass.steps[0].includes('N41 only'));
 assert.deepEqual(plain(pass.branches.find(b=>b.move_ids.includes('N42')).age_groups),['11-14']);
 assert.deepEqual(plain(w.GRINDSTONE_CATALOG_TAGS.resolve('N42').age_groups),['11-14']);
 assert(pass.steps.some(s=>s.includes('do not improvise a knee block')));
});
check('Pups directory links to actual wrestling lessons and preserves their narrow tasks',()=>{
 const source=fs.readFileSync(path.join(base,'skill-pathway.js'),'utf8');
 assert(!source.includes('Pups continue with individual movement foundations'));
 for(const id of ['C20','C21','C22']){assert(source.includes('activity='+id));assert(byId.has('activity:'+id));}
 assert(source.includes('branch.age_groups'));
});
check('backlog retains each held question without making it a usable move or series',()=>{
 const items=w.GRINDSTONE_RESEARCH_QUEUE.items;assert(items.length>=5);assert.equal(new Set(items.map(q=>q.id)).size,items.length);
 for(const item of items){assert(item.known&&item.missing&&item.coach_question&&item.attempted_alternatives);assert(item.sources.length);}
 assert(!byId.has('N34')&&!byId.has('series:S26'));
 const doc=w.GRINDSTONE_IN_PROGRESS.documents.find(d=>d.id==='technique-coach-input');assert.equal(doc.kind,'research');
 assert(doc.next_step.includes('No reply is needed'));
 const render=w.GRINDSTONE_DRAFTS.render(doc.id),text=w.GRINDSTONE_DRAFTS.draftText(doc);
 assert(render.includes('unfinished instructions stay out'));
 for(const item of items){assert(render.includes(item.id));assert(text.includes(item.coach_question));for(const source of item.sources){const url=typeof source==='string'?source:source.url;assert(text.includes(url));assert(!text.includes('http://127.0.0.1:50784/'+url));}}
});
check('blank operations sheets remain linked to their original proposals',()=>{
 const file=path.join(base,'downloads','operations-worksheets.html'),text=fs.readFileSync(file,'utf8');
 for(const [id,anchor]of [['gear-loans','gear'],['volunteer-roles','roles'],['event-logistics','event'],['document-archive','documents']]){
  assert(text.includes('id="'+anchor+'"'));
  assert(w.GRINDSTONE_IN_PROGRESS.documents.find(d=>d.id===id).existing.some(x=>x.href==='downloads/operations-worksheets.html#'+anchor));
 }
 assert.equal((text.match(/class="sheet"/g)||[]).length,4);
 assert(text.includes('Draft worksheet'));assert(!text.includes('<form'));
 assert(text.includes('href="operations-worksheets.pdf"'));assert(fs.existsSync(path.join(base,'downloads','operations-worksheets.pdf')));
});
check('coach question references remain stable when research records are reordered',()=>{
 const baseline=Object.fromEntries(w.GRINDSTONE_RESEARCH_QUEUE.items.map(item=>[item.source_key,item.id]));
 const other={window:{GRINDSTONE_IN_PROGRESS:{documents:[]}},URL};
 for(const key of ['GRINDSTONE_SERIES_NEUTRAL_NEXT','GRINDSTONE_SERIES_TOP_NEXT','GRINDSTONE_SERIES_DEFENSE_NEXT']){
  other.window[key]=plain(w[key]);other.window[key].research_status.held.reverse();
 }
 vm.createContext(other);vm.runInContext(fs.readFileSync(path.join(base,'series-research-status.js'),'utf8'),other);
 for(const item of other.window.GRINDSTONE_RESEARCH_QUEUE.items)assert.equal(item.id,baseline[item.source_key]);
 assert.equal(w.GRINDSTONE_RESEARCH_QUEUE.items.find(item=>item.move_id==='A11').id,'Q05');
 assert(w.GRINDSTONE_DRAFTS.render('technique-coach-input').includes('data-scroll="research-q16"'));
});
check('cross-wrist choices preserve the canonical tilt prerequisite and escape checkpoint',()=>{
 const top=w.GRINDSTONE_PATHWAY.series.find(item=>item.id==='S37');assert.deepEqual(plain(top.age_groups),['11-14']);
 const tilt=top.branches.find(item=>item.move_ids.includes('A22'));assert.equal(tilt.tier,byId.get('A22').tier);assert.deepEqual(plain(tilt.age_groups),['11-14']);
 const bottom=w.GRINDSTONE_PATHWAY.series.find(item=>item.id==='S40');assert(bottom.branches[0].action.includes('pause before B17’s final turn'));
});
check('new defensive connections describe the early control and preserve actor changes',()=>{
 for(const target of ['N55','N56'])assert(w.GRINDSTONE_REACTIONS.resolve('A19').responses.some(r=>r.id===target));
 assert(w.GRINDSTONE_REACTIONS.resolve('A22').responses.some(r=>r.id==='A28'));
 assert(w.GRINDSTONE_REACTIONS.resolve('A28').answers.some(r=>r.id==='A22'));
 assert(w.GRINDSTONE_REACTIONS.resolve('A19').responses.every(r=>/before|Before/.test(r.condition)));
});
console.log(count+' next-batch checks passed. No files written.');
