/* Run with node tools/series-additions-check.js. Read-only integration checks. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const base=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(base,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script defer src="([^"?]+)(?:\?[^"]*)?"/g)].map(m=>m[1]);
const ctx={document:{addEventListener(){}},window:{addEventListener(){},localStorage:{getItem:()=>null,setItem(){}},confirm:()=>true},URL,URLSearchParams,console,Blob,setTimeout};
vm.createContext(ctx);
for(const file of scripts.filter(f=>f!=='app.js'))vm.runInContext(fs.readFileSync(path.join(base,file),'utf8'),ctx,{filename:file});
const w=ctx.window,t=w.GRINDSTONE_BUILDER.testing,catalog=t.normalizeCatalog(),map=new Map(catalog.map(x=>[x.id,x]));
const plain=x=>JSON.parse(JSON.stringify(x)),ids=['S27','S28','S30','S31'];let checks=0;
function check(name,fn){fn();checks++;console.log('PASS '+name);}
check('new modules load before library integration and reaction data before its renderer',()=>{
 for(const file of ['series-top-additions.js','series-neutral-additions.js','series-ready-additions.js'])assert(scripts.indexOf(file)<scripts.indexOf('series-library.js'));
 assert(scripts.indexOf('move-reactions.js')<scripts.indexOf('app.js'));
});
const expected={S27:['N36','A25'],S28:['N41','N42'],S30:['A09','A11'],S31:['B22','B23']};
for(const id of ids)check(id+' offers real choices and expands to actual selected guides',()=>{
 const s=w.GRINDSTONE_PATHWAY.series.find(s=>s.id===id),item=map.get('series:'+id);assert(s&&item);
 assert(s.branches.length>=2);assert(!s.age_groups.includes('4-6'));
 const keys=s.branches.map(w.GRINDSTONE_COMPONENTS.testing.branchKey);
 const selected=w.GRINDSTONE_COMPONENTS.selectSeries(t.blockFrom(item,'series'),keys,catalog);
 const guides=w.GRINDSTONE_COMPONENTS.expandedGuides(selected,catalog);
 assert.deepEqual(plain(guides.map(g=>g.id)),expected[id]);
 for(const guide of guides){assert(guide.steps.length);assert(guide.instructions.includes(s.foundation));assert(guide.readiness.includes(s.readiness));assert(guide.boundary.includes(s.boundaries));}
 for(const branch of s.branches){assert(branch.when&&branch.action&&branch.readiness);assert(branch.move_ids.length);assert(branch.move_ids.every(id=>map.has(id)||map.has('kyle:'+id)));}
});
check('new written moves remain discoverable without unsupported age assignments or pin labels',()=>{
 for(const id of ['N36','N41','N42']){const guide=map.get(id),move=w.GRINDSTONE.moves.find(x=>x.id===id);assert(guide&&move);assert(guide.steps.length>=4&&guide.cues.length);assert(move.error&&move.fix&&move.drill&&move.prerequisite&&move.boundary);assert(!move.age_groups.includes('4-6'));assert(/^https:\/\//.test(move.video.url));assert(move.verification.length>80&&/Grindstone.*adaptation/i.test(move.verification),'Retain review scope and distinguish coaching adaptations');}
 assert.deepEqual(plain(w.GRINDSTONE_CATALOG_TAGS.resolve('N41').purposes),['entry']);
 assert.deepEqual(plain(w.GRINDSTONE_CATALOG_TAGS.resolve('N36').purposes),['turn']);
 assert.deepEqual(plain(w.GRINDSTONE_CATALOG_TAGS.resolve('series:S30').purposes),['defend']);
});
check('younger breakdown pathway is available without adding advanced choices to Pups',()=>{
 const groups=w.GRINDSTONE_PATHWAY.groups;
 const youth=groups.find(g=>g.age_group==='7-10');assert(youth.phases.some(p=>p.series_ids.includes('S31')));
 const pups=groups.find(g=>g.age_group==='4-6');assert(pups.phases.every(p=>p.series_ids.every(id=>!ids.includes(id))));
 for(const s of w.GRINDSTONE_PATHWAY.series.filter(s=>ids.includes(s.id)))assert.equal(new Set(s.move_ids).size,s.move_ids.length);
});
check('breakdown finishes preserve their grips and references do not become unrequested blocks',()=>{
 const s=w.GRINDSTONE_PATHWAY.series.find(s=>s.id==='S31');assert(!s.branches.some(b=>b.move_ids.includes('B25')));assert(s.members.find(m=>m.move_id==='B25').note.includes('different wrist hand'));
 const pass=w.GRINDSTONE.moves.find(m=>m.id==='N41');assert(pass.steps.some(s=>s.includes('hand on top')&&s.includes('elbow')));
});
const reactions=w.GRINDSTONE_REACTIONS;
for(const link of reactions.links)check(link.from+' → '+link.to+' has accurate reverse-role navigation',()=>{
 assert(map.has(link.from)&&map.has(link.to));assert(link.condition&&link.reverse);
 const forward=reactions.resolve(link.from),reverse=reactions.resolve(link.to),out=link.kind==='response'?'responses':'nextOptions',back=link.kind==='response'?'answers':'buildsFrom';
 assert(forward[out].some(r=>r.id===link.to&&r.route==='#move/'+link.to));assert(reverse[back].some(r=>r.id===link.from&&r.route==='#move/'+link.from));
 assert(!reverse[back==='answers'?'buildsFrom':'answers'].some(r=>r.id===link.from));
});
check('specific stages and safe routing survive reaction lookup',()=>{
 assert(reactions.resolve('N24').responses.find(x=>x.id==='B12').condition.includes('Before you capture'));
 assert(reactions.resolve('B30').answers[0].condition.includes('hands are still apart'));
 assert.equal(reactions.resolve('A07').answers.length,0);assert.equal(reactions.resolve('A07').buildsFrom[0].id,'B09');
 assert.equal(reactions.route('javascript:alert(1)'), '');assert.equal(reactions.route('kyle:K08'),'#moves/kyle/K08');
 const value=reactions.resolve('B08');value.responses.length=0;assert.equal(reactions.resolve('B08').responses.length,2);
});
check('series entrance tiers reach the builder without changing explicit age suggestions',()=>{
 const expectedTiers={S24:'Beginner',S13:'Beginner',S14:'Beginner',S17:'Beginner',S21:'Beginner',S28:'Beginner',S31:'Beginner',S16:'Intermediate',S18:'Intermediate',S19:'Intermediate',S20:'Intermediate',S23:'Intermediate',S27:'Intermediate',S30:'Intermediate'};
 for(const [id,tier]of Object.entries(expectedTiers))assert.equal(map.get('series:'+id).tier,tier,id);
 for(const id of ['S10','S11','S12'])assert.equal(map.get('series:'+id).tier,'Intermediate');
 assert.deepEqual(plain(map.get('series:S21').age_groups),['7-10','11-14']);assert.deepEqual(plain(map.get('series:S28').age_groups),['7-10','11-14']);
 assert(map.get('series:S21').instructions.includes('Intermediate option:'));
 assert(map.get('series:S28').instructions.includes('Intermediate option:'));
 const metadata=w.GRINDSTONE_CATALOG_TAGS;
 try{
  w.GRINDSTONE_CATALOG_TAGS=null;w.GRINDSTONE.moves.push({id:'N90',name:'Intermediate fallback fixture',tier:'Intermediate',steps:[],cues:[]});
  assert.deepEqual(plain(t.normalizeCatalog().find(m=>m.id==='N90').age_groups),['7-10','11-14']);
 }finally{w.GRINDSTONE.moves.pop();w.GRINDSTONE_CATALOG_TAGS=metadata;}
});
check('Intermediate filter renders and returns matching written moves',()=>{
 const nav=fs.readFileSync(path.join(base,'tools/navigation-check.js'),'utf8');
 const prefix=nav.slice(0,nav.indexOf('let checks=0;'));
 assert(prefix.includes('function harness('));
 const test=prefix+`\nconst ui=harness('#moves?tier=Intermediate');
  const result=ui.api.libraryResults('moves',new URLSearchParams('tier=Intermediate'));
  assert(result.length>0,'Intermediate needs actual discoverable guides');
  assert(result.some(m=>m.id==='N42'));assert(!result.some(m=>m.id==='B26'));
  assert(result.every(m=>ui.window.GRINDSTONE_CATALOG_TAGS.resolve(m.id).tier==='Intermediate'));
  assert(ui.api.filters('moves',new URLSearchParams('tier=Intermediate')).includes('<option value="Intermediate" selected>Intermediate</option>'));
  assert(ui.api.home().includes('Pup, Beginner, Intermediate, and Advanced'));
 `;
 vm.runInNewContext(test,{require,__dirname:path.join(base,'tools'),process,console,URL,URLSearchParams},{filename:'intermediate-navigation-check.js'});
});
check('reviewed video scope does not advertise a different grip or landing',()=>{
 assert(!map.get('A11').video,'The linked-hand/head-control video is not an elbow-lift demonstration');
 for(const id of ['N41','N42']){
  const move=w.GRINDSTONE.moves.find(m=>m.id===id);
  assert.equal(move.video.url,'https://www.attackstylewrestling.com/pass-by-series/');
  assert(move.verification.includes('visual checkpoints'));assert(move.verification.includes('not transcribed'));
 }
 const finish=w.GRINDSTONE.moves.find(m=>m.id==='N42');
 assert(finish.steps.some(step=>step.includes('coverage from the landing position')));
 assert(finish.steps.some(step=>step.includes('do not force an extra roll')));
 assert(!w.GRINDSTONE.moves.some(m=>m.id==='N34'));assert(!w.GRINDSTONE_PATHWAY.series.some(s=>s.id==='S26'));
});
check('ready Pup activity adaptations preserve limits and references throughout the builder',()=>{
 w.GRINDSTONE_BUILDER.render(new URLSearchParams('age=4-6'));
 const facets={C18:['neutral',['entry','takedown']],C19:['neutral',['defend']],C20:['bottom',['escape']],C21:['top',['breakdown']],C22:['top',['turn','pin']]};
 for(const [id,[position,purposes]]of Object.entries(facets)){
  const source=w.GRINDSTONE_PATHWAY.activities.find(a=>a.id===id),item=map.get('activity:'+id);
  assert(source&&item,id+' needs an adapted guide');assert(source.readiness&&source.move_ids.length);
  assert(t.catalogMatches(item),id+' must be selectable for 4-6');
  assert.deepEqual(plain(item.age_groups),['4-6']);assert.deepEqual(plain(item.move_ids),plain(source.move_ids));
  assert.equal(item.readiness,source.readiness);assert.deepEqual(plain(item.positions),[position]);assert.deepEqual(plain(item.purposes),purposes);
  for(const use of ['teach','review','reps'])assert(item.uses.includes(use));
  const block=t.blockFrom(item,'drill'),draft={...t.newPlan(),age:'4-6',blocks:[block]};
  assert.equal(t.cleanPlan(draft).blocks[0].readiness,source.readiness);
  assert.equal(item.path,'#season?age=4-6&activity='+id);
  const page=w.GRINDSTONE_SKILL_PATHWAY.render(new URLSearchParams('age=4-6&activity='+id));
  assert(page.includes(t.esc(source.readiness)));assert(page.includes('id="activity-'+id+'"'));
  for(const move of source.move_ids)assert(page.includes('#move/'+move),id+' reference '+move);
 }
 for(const id of ['B07','B17','B26','A17','kyle:K18','series:S24','series:S23'])assert(!map.get(id).age_groups.includes('4-6'),id+' must retain its existing guidance');
 const pups=w.GRINDSTONE_PATHWAY.groups.find(g=>g.age_group==='4-6');
 for(const id of Object.keys(facets)){
  const phase=pups.phases.find(p=>(p.activity_ids||[]).includes(id));assert(phase,id+' needs a pathway placement');
  const page=w.GRINDSTONE_SKILL_PATHWAY.render(new URLSearchParams({age:'4-6',phase:phase.id}));
  const section=page.match(/<section class="pathway-series"><h2>Wrestling skills to teach<\/h2>[\s\S]*?<\/section>/)?.[0];
  assert(section&&section.includes('id="activity-'+id+'"'),id+' must appear in its phase, not only the general catalogue');
 }
});
console.log(checks+' series/reaction integration checks passed. No files written.');
