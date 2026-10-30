'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const archive = require('../tracker-archive.js');
const model = require('../tracker-model.js');
const base = path.join(__dirname,'..');
let checks = 0;
function check(label, fn) { fn(); checks++; process.stdout.write('PASS ' + label + '\n'); }
const guide = overrides => ({sourceId:'B17',title:'Stand-up',task:'Clear hands, rise and face.',setup:'Bottom base; light waist control.',readiness:'Can keep a stable base.',boundary:'No lift or return in this drill.',adaptation:'Use less resistance for younger learners.',ageNote:'Only coach-ready partners.',sourceNote:'Instruction is broader than the sampled clip.',steps:['Clear the grip.','Rise and turn to face.'],cues:['Hands first.','Face your partner.'],...overrides});
const plan = () => ({version:1,id:'original-plan',name:'Foundation night',age:'7-10',target:20,startTime:'18:00',program:'',framework:'',session:'',stage:'',focus:'Stand up and face.',notes:'Original plan notes.',date:'2026-10-29',owner:'Thomas',revision:'draft 2',status:'planned',blocks:[{id:'block-1',type:'move',minutes:10,sourceId:'B17',name:'Stand-up choices',instructions:'Demonstrate for 2 minutes; partners take turns.',cues:'Hands first.',setup:'Matched partners.',readiness:'Stable base.',boundary:'No neck pressure.',adaptation:'Cooperative first.',ageNote:'Readiness overrides age.',sourceNote:'Written instruction and source demonstration differ.',steps:['Clear hands.','Rise.'],section:'teach',delivery:'stations',rotation:'Swap partners after the second turn.',components:{version:1,activities:[{name:'Hand-control review',task:'Two short rounds.',cues:'Elbows close.',guide:guide({sourceId:'B01',title:'Hand-control guide'})}],series:{id:'series:S24',kind:'foundation',selections:[{key:'choice-1',title:'Stand-up option'}],guides:[guide()]},rotation:{rounds:2,workMinutes:3,changeMinutes:1,briefingMinutes:2,finishMinutes:1,stations:[{name:'Station Alpha',task:'Trade roles every attempt.',coach:'Coach Erin',equipment:'No equipment.',space:'Circle A',group:'Pairs',rounds:'Three turns each.',simpler:'Start with loose hands.',success:'Face partner with hands free.',stop:'Reset on lost balance.',guide:guide(),series:{id:'series:S13',selections:[{key:'choice-2',title:'Rise choice'}],guides:[guide({title:'Nested station series guide'})]}}]}}}]});
const record = overrides => ({id:'session:blue:2026-10-29:0001',season:'2026-2027',group:'blue',date:'2026-10-29',startTime:'18:00',location:'Westminster High School',author:'Thomas',lead:'Kyle',name:'Foundation night',status:'completed',plan:plan(),skills:[{id:'B17',title:'Stand-up',path:'#move/B17',category:'Bottom'}],notes:'Skipped one planned activity; reviewed the stand-up.',noSkillReason:'',actor:'Thomas',revision:2,...overrides});
const frozen = value => { if (value && typeof value === 'object') { Object.values(value).forEach(frozen); Object.freeze(value); } return value; };
check('SHA-256 matches independent Node implementation including Unicode and multi-block input', () => {
  for (const value of ['', 'abc', 'Coach \u00c9rin \ud83e\udd3c', 'a'.repeat(1000), '\ud800']) assert.equal(archive.sha256(value),crypto.createHash('sha256').update(value).digest('hex'));
});
check('CommonJS and Apps Script-style globals need no Node or browser APIs', () => {
  const context = {};
  vm.runInNewContext(fs.readFileSync(path.join(base,'tracker-archive.js'),'utf8'),context);
  assert.deepEqual(Object.keys(context.GRINDSTONE_ARCHIVE),Object.keys(archive));
  assert.equal(context.GRINDSTONE_ARCHIVE.prepare(record()).json,archive.prepare(record()).json);
});
check('The source plan and confirmed tracker record are preserved without mutating the input', () => {
  const raw = frozen(record()), before = JSON.stringify(raw);
  model.cleanSession(raw);
  const result = archive.prepare(raw), json = JSON.parse(result.json);
  assert.equal(JSON.stringify(raw),before);
  assert.deepEqual(json.plan,raw.plan);
  assert.deepEqual(json.trackerRecord,raw);
  assert.equal(json.plan.status,'planned');
  assert.equal(json.confirmation.status,'completed');
  assert.deepEqual(json.confirmation.skills,raw.skills);
  assert.notStrictEqual(json.plan,raw.plan);
});
check('HTML includes full nested instructions, series choices, rotation and source scope', () => {
  const html = archive.prepare(record()).html;
  for (const phrase of ['Matched partners.','No neck pressure.','Readiness overrides age.','Written instruction and source demonstration differ.','Hand-control review','Two short rounds.','Stand-up option','Nested station series guide','Coach Erin','Three turns each.','Reset on lost balance.','Work minutes per round','Minutes between rounds','Briefing / demonstration minutes','Finish / reset minutes','Skills confirmed as actually taught','Planned work is not evidence']) assert(html.includes(phrase),phrase);
  assert(html.includes('https://packetbench.github.io/grindstone-guide/#move/B17'));
});
check('All user text is escaped and only validated internal routes become links', () => {
  const raw = record({name:'<img src=x onerror=alert(1)>',notes:'</style><script>alert(2)</script>',author:'" onclick="alert(3)',skills:[{id:'manual:x',title:'<svg onload=alert(4)>',path:'javascript:alert(5)',category:'<iframe src=x>'}]});
  raw.plan.blocks[0].instructions = '<a href="javascript:alert(6)">task</a>';
  raw.plan.blocks[0].path = '#move/B17%22onclick%3Dalert(7)';
  raw.plan.blocks[0].video = 'https://untrusted.example/tracking.png';
  const html = archive.prepare(raw).html;
  assert(!/<(?:script|img|iframe|svg|object|embed|link)\b/i.test(html));
  const tags = html.match(/<[^>]*>/g) || [];
  assert(tags.every(tag => !/\s(?:onclick|onerror|onload|src)\s*=/i.test(tag)));
  assert(html.includes('&lt;script&gt;'));
  assert(!/href="(?:javascript:|https:\/\/untrusted|#)/i.test(html));
  assert(!html.includes('href="https://packetbench.github.io/grindstone-guide/#move/B17%22'));
  assert(html.includes('default-src &#39;none&#39;') || html.includes("default-src 'none'"));
});
check('Filename identity is deterministic, case-sensitive and bounded without discarding long IDs', () => {
  const raw = record({id:'a'.repeat(99)+'z',revision:Number.MAX_SAFE_INTEGER,group:'valkyries'});
  const first = archive.prepare(raw), again = archive.prepare(raw), other = archive.prepare({...raw,id:'a'.repeat(99)+'y'});
  assert.equal(first.key,again.key); assert.equal(first.json,again.json); assert.equal(first.html,again.html);
  assert.equal(first.baseName.length,59); assert(first.jsonFilename.length <= 64); assert(first.htmlFilename.length <= 64);
  assert(/^[a-z0-9-]+\.json$/.test(first.jsonFilename));
  assert.notEqual(first.baseName,other.baseName);
  assert.notEqual(archive.prepare(record({id:'Case'})).baseName,archive.prepare(record({id:'case'})).baseName);
  assert.equal(first.identityDigest,crypto.createHash('sha256').update(raw.id).digest('hex'));
});
check('New revisions produce new keys/files and changed same-revision data has a conflict digest', () => {
  const first = archive.prepare(record()), corrected = archive.prepare(record({revision:3,notes:'Correction.'})), conflict = archive.prepare(record({notes:'Changed without advancing revision.'}));
  assert.notEqual(first.key,corrected.key); assert.notEqual(first.baseName,corrected.baseName);
  assert.equal(first.key,conflict.key); assert.equal(first.baseName,conflict.baseName); assert.notEqual(first.contentDigest,conflict.contentDigest);
  assert.equal(first.contentDigest,archive.prepare(Object.fromEntries(Object.entries(record()).reverse())).contentDigest);
});
check('Session-only archives do not fabricate a builder plan or claim planned work was taught', () => {
  const result = archive.prepare(record({plan:null,skills:[],noSkillReason:'Team meeting and equipment check.'})), json = JSON.parse(result.json);
  assert.equal(json.format,'grindstone-tracker-session'); assert(!Object.hasOwn(json,'plan'));
  assert.equal(json.trackerRecord.plan,null); assert.equal(json.confirmation.skills.length,0);
  assert(result.html.includes('No saved practice plan')); assert(result.html.includes('Team meeting and equipment check.'));
});
check('Import size accounts for UTF-8 bytes and never trims a large saved plan', () => {
  const small = archive.prepare(record({notes:'Coach \u00c9rin \ud83e\udd3c'}));
  assert.equal(small.jsonBytes,Buffer.byteLength(small.json,'utf8'));
  const raw = record();
  raw.plan.blocks = Array.from({length:35},(_,i) => ({id:'b'+i,type:'custom',minutes:1,name:'Long written station '+i,instructions:'\u00e9'.repeat(14500)}));
  model.cleanSession(raw);
  const before = JSON.stringify(raw);
  assert.throws(() => archive.prepare(raw),/2 MB JSON import limit/);
  assert.equal(JSON.stringify(raw),before);
});
check('The plan archive wrapper is accepted by the actual builder importer including nested details', () => {
  const context = {window:{},URL,URLSearchParams};
  for (const file of ['practice-weeks.js','practice-components.js','practice-builder.js']) vm.runInNewContext(fs.readFileSync(path.join(base,file),'utf8'),context,{filename:file});
  const importer = context.window.GRINDSTONE_BUILDER.testing.parseImport;
  const imported = importer(archive.prepare(record()).json);
  assert.equal(imported.id,''); assert.equal(imported.status,'planned');
  assert.equal(imported.blocks[0].instructions,record().plan.blocks[0].instructions);
  assert.equal(imported.blocks[0].components.rotation.stations[0].series.guides[0].title,'Nested station series guide');
  assert.throws(() => importer(archive.prepare(record({plan:null})).json),/practice export/);
});
check('Unconfirmed, malformed, unsupported and cyclic records are rejected', () => {
  for (const status of ['planned','cancelled','']) assert.throws(() => archive.prepare(record({status})),/completed/);
  assert.throws(() => archive.prepare(record({skills:[],noSkillReason:''})),/Confirm taught/);
  assert.throws(() => archive.prepare(record({revision:-1})),/Revision/);
  assert.throws(() => archive.prepare(record({date:'2026-02-30'})),/valid practice date/);
  assert.throws(() => archive.prepare(record({id:'../escape'})),/Session ID/);
  assert.throws(() => archive.prepare(record({group:'CON'})),/supported tracker group/);
  assert.throws(() => archive.prepare(record({plan:{version:2,blocks:[]}})),/version 1/);
  const cyclic = record(); cyclic.plan.loop = cyclic.plan;
  assert.throws(() => archive.prepare(cyclic),/acyclic/);
  assert.throws(() => archive.prepare(JSON.parse('{"status":"completed","__proto__":{}}')),/unsupported field/);
});
process.stdout.write('Passed ' + checks + ' archive checks.\n');
