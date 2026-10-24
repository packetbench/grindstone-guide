/* Read-only shared metadata checks: node tools/tag-data-check.js */
'use strict';
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const base = path.resolve(__dirname,'..');
const context = {window:{},URL,URLSearchParams};
vm.createContext(context);
const files = ['data.js','game-video-fixes.js','kyle-data.js','kyle-instruction-data.js','video-additions.js','game-guides-a.js','game-guides-b.js','game-guides-c.js','game-guide-library.js','move-tags.js','series-moves.js','series-bottom.js','series-neutral.js','series-top.js','series-escapes.js','series-foundation.js','series-library.js','practice-frameworks.js','pathway-data.js','series-expansion.js'];
for (const file of files) vm.runInContext(fs.readFileSync(path.join(base,file),'utf8'),context,{filename:file});
const before = JSON.stringify(context.window);
vm.runInContext(fs.readFileSync(path.join(base,'catalog-tags.js'),'utf8'),context,{filename:'catalog-tags.js'});
const w = context.window, api = w.GRINDSTONE_CATALOG_TAGS, plain = value => JSON.parse(JSON.stringify(value));
let count = 0;
function check(name,fn) { fn(); count++; console.log('PASS ' + name); }
check('all source records resolve exactly once with namespaced collection IDs',() => {
  const expected = [...w.GRINDSTONE.moves.map(item => item.id),...w.GRINDSTONE.games.map(item => item.id),...w.GRINDSTONE_KYLE.entries.map(item => 'kyle:' + item.id),...w.GRINDSTONE_VIDEO_ADDITIONS.entries.map(item => 'facebook:' + item.id),...w.GRINDSTONE_PATHWAY.series.map(item => 'series:' + item.id),...w.GRINDSTONE_PATHWAY.sequences.map(item => 'series:' + item.id),...w.GRINDSTONE_PATHWAY.activities.map(item => 'activity:' + item.id)];
  assert.equal(new Set(expected).size,expected.length); assert.deepEqual(plain(api.allIds()).sort(),plain(expected).sort());
  expected.forEach(id => assert(api.resolve(id),id)); console.log('Catalog coverage: ' + expected.length);
});
check('shared metadata never changes source records',() => { const after = {...w}; delete after.GRINDSTONE_CATALOG_TAGS; assert.equal(JSON.stringify(after),before); });
check('all facets use declared IDs and assigned ages have a documented basis',() => {
  const ids = Object.fromEntries(Object.entries(api.definitions).map(([key,values]) => [key,new Set(values.map(item => item.id))]));
  for (const id of api.allIds()) { const item = api.resolve(id); for (const key of ['positions','purposes','uses']) { assert.equal(new Set(item[key]).size,item[key].length,id); item[key].forEach(value => assert(ids[key].has(value),id + ':' + value)); } assert.equal(item.ageStatus,item.age_groups.length ? 'assigned' : 'unassigned'); assert(item.ageNote); assert(['explicit','teaching-tier','source-description','unassigned'].includes(item.ageBasis)); }
});
check('aliases resolve consistently without exposing internal mutable objects',() => {
  assert.deepEqual(plain(api.resolve('K01')),plain(api.resolve('kyle:K01'))); assert.deepEqual(plain(api.resolve('V04')),plain(api.resolve('facebook:V04')));
  const item = api.resolve('B08'); item.positions.length = 0; item.memberships[0].role = 'mastered'; assert(api.resolve('B08').positions.length); assert.notEqual(api.resolve('B08').memberships[0].role,'mastered');
  assert.equal(api.resolve('unknown'),null); assert.equal(api.resolve(null),null);
});
check('source ages win and the written teaching-tier suggestions remain explicit',() => {
  assert.deepEqual(plain(api.resolve('N25').age_groups),['7-10','11-14']); assert.equal(api.resolve('N25').ageBasis,'explicit');
  assert.deepEqual(plain(api.resolve('P01').age_groups),['4-6','7-10','11-14']); assert.equal(api.resolve('P01').ageBasis,'teaching-tier');
  assert.deepEqual(plain(api.resolve('B26').age_groups),['7-10','11-14']); assert.deepEqual(plain(api.resolve('A25').age_groups),['11-14']);
  assert.equal(api.resolve('kyle:K01').ageStatus,'unassigned'); assert(api.resolve('kyle:K01').ageNote.includes('4–6'));
  assert.equal(api.resolve('facebook:V04').ageStatus,'unassigned'); assert(api.resolve('facebook:V04').ageNote.includes('4-6'));
});
check('game source age fields and original audience labels are retained',() => {
  assert.equal(api.resolve('G31').ageBasis,'explicit'); assert.deepEqual(plain(api.resolve('G31').age_groups),['4-6','7-10','11-14']);
  assert.equal(api.resolve('G01').ageBasis,'source-description'); assert(api.resolve('G01').ageNote.includes('Pup / all ages'));
  assert.deepEqual(plain(api.resolve('G11').age_groups),['7-10','11-14']); assert.deepEqual(plain(api.resolve('G21').age_groups),['11-14']);
});
check('Foundation essentials do not turn Preparation members into core skills or mastery',() => {
  assert.deepEqual(plain(api.resolve('B01').coreSkills),[]); assert(api.resolve('B01').memberships.some(item => item.id === 'S24' && item.role === 'Preparation'));
  assert.deepEqual(plain(api.resolve('N24').coreSkills),['single-leg']); assert.deepEqual(plain(api.resolve('N25').coreSkills),['mat-return']); assert.equal(api.resolve('series:S24').coreSkills.length,6);
  assert(!api.allIds().some(id => JSON.stringify(api.resolve(id).memberships).includes('mastered')));
});
check('series-specific relationship roles are preserved verbatim',() => {
  const item = api.resolve('B08'); assert.equal(item.memberships.find(member => member.id === 'S14').role,'Foundation'); assert.equal(item.memberships.find(member => member.id === 'S17').role,'Finish');
  const half = api.resolve('B26'); assert.equal(half.memberships.find(member => member.id === 'S16').role,'Preparation'); assert.equal(half.memberships.find(member => member.id === 'S21').role,'Foundation');
});
check('clear position and purpose distinctions stay faithful to existing lessons',() => {
  assert.deepEqual(plain(api.resolve('N24').purposes),['entry']); assert.deepEqual(plain(api.resolve('B08').purposes),['takedown']); assert.deepEqual(plain(api.resolve('N25').positions),['top']); assert.deepEqual(plain(api.resolve('N25').purposes),['mat-return']);
  assert.deepEqual(plain(api.resolve('G31').purposes),['movement']); assert(!api.resolve('G31').purposes.includes('takedown')); assert(!api.resolve('N21').purposes.includes('pin')); assert.deepEqual(plain(api.resolve('V15').positions),[]);
});
check('search includes source cues, aliases and readable facet labels',() => { assert(api.resolve('G31').searchText.includes('touch only')); assert(api.resolve('B08').searchText.includes('single leg')); assert(api.resolve('N25').searchText.includes('guide down')); assert(api.resolve('N24').searchText.includes('enter an attack')); });
check('Pup tier is not a blanket warm-up assignment and references remain distinct',() => { assert(!api.resolve('P12').uses.includes('warmup')); assert(api.resolve('K02').uses.includes('warmup')); assert.equal(api.resolve('V06').uses.length,0); assert.equal(api.resolve('V03').category,'games'); });
check('game choice tags describe the actual cards rather than every wrestling goal',() => { assert.deepEqual(plain(api.resolve('G25').positions),['neutral','bottom']); assert.deepEqual(plain(api.resolve('G25').purposes),['movement','escape']); assert(!api.resolve('G24').purposes.includes('takedown')); assert.deepEqual(plain(api.resolve('G27').purposes),['movement']); });
check('Kyle goals include the written finish without upgrading the video verification',() => {
  const snap = w.GRINDSTONE_KYLE_INSTRUCTION.entries.K09, roll = w.GRINDSTONE_KYLE_INSTRUCTION.entries.K19;
  assert(snap.steps.some(step => step.includes('behind the hips') && step.includes('cover')));
  assert.deepEqual(plain(api.resolve('K09').purposes),['entry','takedown']);
  assert(roll.purpose.includes('separation from a rider')); assert(roll.steps.some(step => step.includes('do not assume') && step.includes('escape')));
  assert.deepEqual(plain(api.resolve('K19').purposes),['movement','escape']);
  assert(snap.verification.includes('not been footage-verified')); assert(roll.verification.includes('Rolling alone does not establish an escape'));
});
check('S07 includes the controlled go-behind finish as well as defense',() => {
  const sequence = w.GRINDSTONE_PATHWAY.sequences.find(item => item.id === 'S07');
  assert(sequence.move_ids.includes('B11')); assert(sequence.steps.some(step => step.includes('behind the hips with taught control')));
  assert.deepEqual(plain(api.resolve('series:S07').purposes),['defend','takedown']);
  assert.deepEqual(plain(api.resolve('series:S03').purposes),['defend']);
});
console.log(count + ' shared tag checks passed.');
