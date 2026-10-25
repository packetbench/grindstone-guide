'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const model = require('../tracker-model.js');
let checks = 0;
function check(label, fn) { fn(); checks++; process.stdout.write('PASS ' + label + '\n'); }
const guide = (id,title = id,types = ['move']) => ({id,title,types,path:'#move/' + id,category:'Neutral'});
const a = {id:'B01',title:'Stance',path:'#move/B01',category:'Neutral'};
const b = {id:'B07',title:'Double leg',path:'#move/B07',category:'Neutral'};
const manual = {id:'manual:stance-review',title:'Our stance review',path:'',category:'Movement'};
const catalog = [guide('B01','Stance'),guide('B07','Double leg'),guide('B17','Stand-up'),guide('P01'),guide('G01','Game',['game']),guide('activity:C01','Strength',['strength']),guide('series:S24','Foundation',['series']),guide('series:S13','Sit-out',['series']),...['C18','C19','C20','C21','C22'].map(id => ({...guide('activity:' + id),path:'#season?activity=' + id}))];
const base = overrides => ({id:'session-1',season:'2026-27',group:'blue',date:'2026-10-20',startTime:'18:00',location:'Westminster High School',author:'Thomas',lead:'Kyle',name:'Foundation night',status:'completed',plan:null,skills:[a],notes:'',actor:'Thomas',revision:0,...overrides});
const curriculum = overrides => ({id:'blue-2026-27',season:'2026-27',group:'blue',skills:[a,b],actor:'Thomas',revision:0,...overrides});

check('CommonJS and browser APIs expose the same model', () => {
  const context = {window:{}}; vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../tracker-model.js'),'utf8'),context);
  assert.deepEqual(Object.keys(context.window.GRINDSTONE_TRACKER_MODEL),Object.keys(model));
  const worker = {}; vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../tracker-model.js'),'utf8'),worker);
  assert.deepEqual(Object.keys(worker.GRINDSTONE_TRACKER_MODEL),Object.keys(model));
  assert.equal(model.groups.length,4); assert.equal(model.groups.find(group => group.id === 'valkyries').age,'');
});
check('Candidates include explicit blocks and deduplicate by guide ID', () => {
  assert.deepEqual(model.candidates({blocks:[{sourceId:'B01'},{sourceId:'B07'},{sourceId:'B01'}]},catalog).map(item => item.id),['B01','B07']);
});
check('Selected series count only saved selected guides, not all membership', () => {
  const selected = {blocks:[{type:'series',sourceId:'series:S13',components:{series:{guides:[{sourceId:'B17',title:'Stand-up'}]}}}]};
  const expanded = catalog.map(item => item.id === 'series:S13' ? {...item,move_ids:['B01','B07','B17'],members:[{move_id:'B07'}]} : item);
  assert.deepEqual(model.candidates(selected,expanded).map(item => item.id),['B17']);
  assert.equal(model.candidates({blocks:[{type:'series',sourceId:'series:S13'}]},expanded).length,0);
});
check('Nested activities and station selected guides are included', () => {
  const plan = {blocks:[{components:{activities:[{guide:{sourceId:'B01'},series:{guides:[{sourceId:'B07'}]}}],rotation:{stations:[{guide:{sourceId:'B17'}},{guide:{sourceId:'series:S13'},series:{guides:[{sourceId:'B07'}]}}]}}}]};
  assert.deepEqual(model.candidates(plan,catalog).map(item => item.id),['B01','B07','B17']);
});
check('Games and water do not count; explicit conditioning can count', () => {
  assert.deepEqual(model.candidates({blocks:[{sourceId:'G01',type:'game'},{sourceId:'B01',type:'water'},{sourceId:'activity:C01',type:'strength'}]},catalog).map(item => item.id),['activity:C01']);
});
check('A skill deliberately added inside a game slot retains its own identity', () => {
  assert.deepEqual(model.candidates({blocks:[{sourceId:'G01',type:'game',components:{activities:[{guide:{sourceId:'B01'},guideType:'move'}]}}]},catalog).map(item => item.id),['B01']);
});
check('Retired guides survive completed history without imported URLs', () => {
  const plan = {status:'completed',blocks:[{sourceId:'old:guide',name:'Old technique',path:'javascript:alert(1)'},{sourceId:'series:retired'},{sourceId:'G99',name:'Retired game'}]};
  assert.deepEqual(model.candidates(plan,catalog),[{id:'old:guide',title:'Old technique',path:'',category:'Previously taught guide'}]);
  assert.equal(model.candidates({...plan,status:'planned'},catalog).length,0);
});
check('Unsafe catalog links are dropped', () => {
  assert.equal(model.candidates({blocks:[{sourceId:'B01'}]},[{...catalog[0],path:'https://outside.invalid/'}])[0].path,'');
});
check('Season starters keep Pups staged and Valkyries independent', () => {
  const pathway = {series:[{id:'S24',kind:'foundation',move_ids:['B07','B17']}],groups:[{age_group:'4-6',phases:[{move_ids:['P01'],activity_ids:['C18']}]},{age_group:'7-10',phases:[{move_ids:['B01']}]},{age_group:'11-14',phases:[{move_ids:['B01'],activity_ids:['C01']}]}]};
  assert.deepEqual(model.seed('pups',catalog,pathway).map(item => item.id),['P01','activity:C18','activity:C19','activity:C20','activity:C21','activity:C22']);
  assert.deepEqual(model.seed('blue',catalog,pathway).map(item => item.id),['B07','B17','B01']);
  assert.deepEqual(model.seed('black',catalog,pathway).map(item => item.id),['B07','B17','B01','activity:C01']);
  assert.deepEqual(model.seed('valkyries',catalog,pathway).map(item => item.id),['B07','B17']);
});
check('Only completed confirmed skills update coverage', () => {
  const rows = model.coverage(curriculum(),[base({plan:{blocks:[{sourceId:'B07'}]}}),base({id:'planned',status:'planned',skills:[b]}),base({id:'cancelled',status:'cancelled',skills:[b]})]);
  assert.equal(rows[0].count,1); assert.equal(rows[1].count,0); assert.equal(rows[1].firstCovered,'');
});
check('Backfill computes actual earliest and latest practice dates', () => {
  const rows = model.coverage(curriculum(),[base({id:'later',date:'2026-10-24'}),base({id:'backfill',date:'2026-10-02'}),base({id:'middle',date:'2026-10-16'})]);
  assert.equal(rows[0].firstCovered,'2026-10-02'); assert.equal(rows[0].lastReviewed,'2026-10-24'); assert.equal(rows[0].count,3);
  assert.deepEqual(rows[0].sessionIds,['backfill','middle','later']);
});
check('Correcting a session replaces coverage instead of adding a second event', () => {
  const rows = model.coverage(curriculum(),[base({revision:0}),base({revision:1,skills:[b]})]);
  assert.equal(rows[0].count,0); assert.equal(rows[1].count,1);
  const cancelled = model.coverage(curriculum(),[base(),base({revision:1,status:'cancelled'})]);
  assert.equal(cancelled[0].count,0);
});
check('Other group and season records never fill this curriculum', () => {
  const rows = model.coverage(curriculum(),[base({id:'black',group:'black'}),base({id:'older',season:'2025-26'}),base()]);
  assert.equal(rows[0].count,1); assert.deepEqual(rows[0].sessionIds,['session-1']);
});
check('Manual skills are valid and do not require library membership', () => {
  const rows = model.coverage(curriculum({skills:[manual]}),[base({skills:[manual]})]); assert.equal(rows[0].count,1);
});
check('Games-only completion requires an explicit explanation, not ordinary notes', () => {
  assert.throws(() => model.cleanSession(base({skills:[],notes:'Fun day'})),/explain/);
  assert.equal(model.cleanSession(base({skills:[],noSkillReason:'Games and conditioning only'})).skills.length,0);
});
check('Required completion fields and future dates are checked', () => {
  assert.throws(() => model.cleanSession(base({date:''})),/date/);
  assert.throws(() => model.cleanSession(base({lead:''})),/lead coach/);
  assert.throws(() => model.cleanSession(base({date:'2026-10-26'}),{today:'2026-10-25'}),/future/);
  assert.equal(model.cleanSession(base({date:'2026-10-26',status:'planned'}),{today:'2026-10-25'}).date,'2026-10-26');
  assert.equal(model.cleanSession(base({date:'2026-10-25'}),{today:'2026-10-25'}).date,'2026-10-25');
});
check('Calendar dates and clock formats are actually valid', () => {
  for (const value of ['2026-02-29','2026-04-31','2026-13-01','26-10-25']) assert.throws(() => model.cleanSession(base({date:value})),/date/);
  assert.equal(model.cleanSession(base({date:'2024-02-29'})).date,'2024-02-29');
  for (const startTime of ['24:00','9:00','18:61']) assert.throws(() => model.cleanSession(base({startTime})),/HH:MM/);
});
check('Imported arbitrary URLs and encoded unsafe links are rejected', () => {
  for (const unsafe of ['javascript:alert(1)','https://example.com','#season?x=%3Cscript%3E','#season?x=%00','#season?x=%ZZ']) assert.throws(() => model.cleanCurriculum(curriculum({skills:[{...a,path:unsafe}]})),/internal/);
});
check('Prototype fields and unsafe snapshots are rejected without mutation', () => {
  assert.throws(() => model.cleanSession(JSON.parse('{"__proto__":{"polluted":true}}')),/unsupported/);
  assert.throws(() => model.cleanSession(base({plan:JSON.parse('{"blocks":[{"constructor":{}}]}')})),/unsupported/);
  assert.throws(() => model.cleanSession(base({plan:{value:() => 1}})),/object/);
  assert.equal({}.polluted,undefined);
});
check('Malformed plan shapes cannot poison a saved snapshot view', () => {
  for (const plan of [{blocks:'wrong'},{blocks:[null]},{blocks:[{minutes:'five'}]},{name:{}},{blocks:[{activities:'wrong'}]},{blocks:[{components:{rotation:{stations:[null]}}}]},{blocks:[{components:{activities:[{task:{}}]}}]},{blocks:[{components:{series:{guides:'wrong'}}}]}]) {
    assert.throws(() => model.cleanSession(base({plan})),/array|object|text|minutes/);
  }
  const valid = {name:'Stations',blocks:[{name:'Review',minutes:10,components:{activities:[{name:'Stance',task:'Step and stop',guide:{sourceId:'B01',title:'Stance',cues:['Head up'],steps:['Stand']}}],rotation:{stations:[{name:'Station one',coach:'Kyle',task:'Repeat'}]}}}]};
  assert.deepEqual(model.cleanSession(base({plan:valid})).plan,valid);
});
check('Limits, duplicates, revision and group validation prevent malformed records', () => {
  assert.throws(() => model.cleanSession(base({group:'unknown'})),/Choose/);
  assert.throws(() => model.cleanSession(base({revision:-1})),/Revision/);
  assert.throws(() => model.cleanSession(base({skills:[a,a]})),/once/);
  assert.throws(() => model.cleanSession(base({notes:'x'.repeat(12001)})),/12000/);
  assert.throws(() => model.cleanCurriculum(curriculum({skills:Array.from({length:501},(_,i) => ({...a,id:'manual:' + i}))})),/500/);
});
check('Clean snapshots and coverage do not mutate caller records', () => {
  const raw = base({plan:{blocks:[{sourceId:'B01'}]},extra:'ignored'}), copy = JSON.stringify(raw);
  const clean = model.cleanSession(raw); clean.plan.blocks[0].sourceId = 'B07';
  model.coverage(curriculum(),[raw]); assert.equal(JSON.stringify(raw),copy); assert.equal(clean.extra,undefined);
});
check('Existing live catalog and pathway seed all four groups with real guide links', () => {
  const root = path.resolve(__dirname,'..'), html = fs.readFileSync(path.join(root,'index.html'),'utf8');
  const files = [...html.matchAll(/<script defer src="([^"]+)"/g)].map(match => match[1].split('?')[0]);
  const stop = files.indexOf('practice-builder.js'); assert(stop >= 0);
  const ctx = {window:{},URL,URLSearchParams,console,Blob,setTimeout};
  for (const file of files.slice(0,stop + 1)) vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});
  const realCatalog = ctx.window.GRINDSTONE_BUILDER.testing.normalizeCatalog(), realPathway = ctx.window.GRINDSTONE_PATHWAY;
  for (const group of model.groups) {
    const seeded = model.seed(group.id,realCatalog,realPathway); assert(seeded.length >= 6,group.id);
    assert(seeded.every(item => item.path.startsWith('#')),group.id);
    model.cleanCurriculum(curriculum({group:group.id,skills:seeded}));
    if (group.id === 'pups') for (const id of ['C18','C19','C20','C21','C22']) assert(seeded.some(item => item.id === 'activity:' + id));
  }
  assert.deepEqual(model.candidates({blocks:[{sourceId:'B01'},{sourceId:'G01',type:'game'},{sourceId:'activity:C18'}]},realCatalog).map(item => item.id),['B01','activity:C18']);
});
process.stdout.write(checks + ' tracker model checks passed.\n');
