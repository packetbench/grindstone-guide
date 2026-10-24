/* Run with node tools/series-additions-check.js. Read-only integration checks. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const base=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(base,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script defer src="([^"?]+)(?:\?[^"]*)?"/g)].map(m=>m[1]);
const ctx={window:{localStorage:{getItem:()=>null,setItem(){}},confirm:()=>true},URL,URLSearchParams,console,Blob,setTimeout};
vm.createContext(ctx);
for(const file of scripts.filter(f=>f!=='app.js'))vm.runInContext(fs.readFileSync(path.join(base,file),'utf8'),ctx,{filename:file});
const w=ctx.window,t=w.GRINDSTONE_BUILDER.testing,catalog=t.normalizeCatalog(),map=new Map(catalog.map(x=>[x.id,x]));
const plain=x=>JSON.parse(JSON.stringify(x)),ids=['S26','S27','S28','S30','S31'];let checks=0;
function check(name,fn){fn();checks++;console.log('PASS '+name);}
check('new modules load before library integration and reaction data before its renderer',()=>{
 for(const file of ['series-top-additions.js','series-neutral-additions.js','series-ready-additions.js'])assert(scripts.indexOf(file)<scripts.indexOf('series-library.js'));
 assert(scripts.indexOf('move-reactions.js')<scripts.indexOf('app.js'));
});
const expected={S26:['A23','N34','B28'],S27:['N36','A25'],S28:['N41','N42'],S30:['A09','A11'],S31:['B22','B23']};
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
 for(const id of ['N34','N36','N41','N42']){const guide=map.get(id),move=w.GRINDSTONE.moves.find(x=>x.id===id);assert(guide&&move);assert(guide.steps.length>=4&&guide.cues.length);assert(move.error&&move.fix&&move.drill&&move.prerequisite&&move.boundary);assert(!move.age_groups.includes('4-6'));assert(/^https:\/\//.test(move.video.url));assert(/footage/i.test(move.verification)&&/no|not/i.test(move.verification));}
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
console.log(checks+' series/reaction integration checks passed. No files written.');
