/* Read-only regression checks: node tools/builder-check.js */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert');
const base = path.resolve(__dirname, '..');
let checks = 0;
function check(name, fn) { fn(); checks++; console.log('PASS ' + name); }
const values = new Map(), writes = [];
let failStorage = false, allowConfirm = true;
const storage = { getItem: k => { if (failStorage) throw Error('disabled'); return values.get(k) || null; }, setItem: (k, val) => { if (failStorage) throw Error('full'); values.set(k, val); writes.push(k); } };
const ctx = { window: { localStorage: storage, confirm: () => allowConfirm }, URL, URLSearchParams, console, Blob, setTimeout };
for (const file of ['data.js', 'game-video-fixes.js', 'kyle-data.js', 'kyle-instruction-data.js', 'video-additions.js', 'game-guides-a.js', 'game-guides-b.js', 'game-guides-c.js', 'game-guide-library.js', 'move-tags.js', 'series-moves.js', 'series-bottom.js', 'series-neutral.js', 'series-top.js', 'series-escapes.js', 'series-library.js', 'practice-frameworks.js', 'pathway-data.js', 'series-expansion.js', 'practice-weeks.js', 'practice-components.js', 'practice-builder.js']) {
  if (!fs.existsSync(path.join(base, file))) throw Error('Missing ' + file);
  vm.runInNewContext(fs.readFileSync(path.join(base, file), 'utf8'), ctx, { filename: file });
}
const api = ctx.window.GRINDSTONE_BUILDER, t = api.testing;
function fakeRoot() {
  const nodes = new Map(), listeners = {};
  return { dataset: {}, listeners, querySelector(selector) { if (selector === ':invalid' || selector === '[data-week-content]') return null; if (!nodes.has(selector)) nodes.set(selector, { innerHTML: '', textContent: '', value: '', checked: false, disabled: false, hidden: false, focus() {} }); return nodes.get(selector); }, querySelectorAll() { return []; }, addEventListener(name, fn) { listeners[name] = fn; } };
}
let root;
function mount(params = '') { api.render(new URLSearchParams(params)); root = fakeRoot(); api.bind(root); return root; }
function state() { return t.getState(); }
function picker(key, value) { root.listeners.change({ target: { dataset: { picker: key }, type: 'select-one', value } }); }
function field(key, value) { root.listeners.input({ target: { dataset: { planField: key }, value, validity: { valid: true } } }); }
function blockField(index, key, value) { root.listeners.input({ target: { dataset: { blockField: key }, value, validity: { valid: true }, closest() { return { dataset: { blockIndex: String(index) }, querySelector() { return { textContent: '' }; } }; } } }); }
function addSource(type, id) { picker('type', type); if (!visibleIds().includes(id)) root.listeners.change({ target: { dataset: { picker: 'matchAge' }, type: 'checkbox', checked: false } }); picker('selected', id); t.action('add', -1); }
function resetCase(params = '') { values.clear(); writes.length = 0; failStorage = false; allowConfirm = true; t.reset(); mount(params); }
function visibleIds() { return Array.from(root.querySelector('[data-picker="selected"]').innerHTML.matchAll(/<option value="([^"]+)"/g), match => match[1]); }
mount();
const catalog = t.normalizeCatalog(), counts = ctx.window.GRINDSTONE, pathway = ctx.window.GRINDSTONE_PATHWAY;
const expansionModules = [ctx.window.GRINDSTONE_SERIES_NEUTRAL, ctx.window.GRINDSTONE_SERIES_TOP, ctx.window.GRINDSTONE_SERIES_ESCAPES];
const expandedSeries = expansionModules.flatMap(module => module.series || []);
const addedMoves = [...ctx.window.GRINDSTONE_SERIES_MOVES.entries, ...ctx.window.GRINDSTONE_SERIES_BOTTOM.entries, ...expansionModules.flatMap(module => module.moves || [])];
const series = pathway.series[0], sequence = pathway.sequences[0], activity = pathway.activities[0];
function assertSeriesInstructions(instructions, item = series) {
  assert(instructions.includes(item.foundation), item.id + ' must retain its shared foundation');
  for (const branch of item.branches) for (const field of ['title', 'when', 'action', ...(branch.readiness ? ['readiness'] : [])]) assert(instructions.includes(branch[field]), item.id + ' must retain branch ' + field);
}
check('all original, Kyle, Facebook, new move, sequence, series and activity entries adapt once', () => { assert.equal(catalog.length, counts.moves.length + counts.games.length + ctx.window.GRINDSTONE_KYLE.entries.length + ctx.window.GRINDSTONE_VIDEO_ADDITIONS.entries.length + pathway.sequences.length + pathway.series.length + pathway.activities.length); assert.equal(new Set(catalog.map(x => x.id)).size, catalog.length); });
check('linked drills retain old source IDs and remain separate from foundation series', () => {
  assert.deepEqual(Array.from(pathway.sequences, item => item.id), Array.from({ length: 12 }, (_, i) => 'S' + String(i + 1).padStart(2, '0')));
  for (const item of pathway.sequences) assert.deepEqual(Array.from(catalog.find(x => x.id === 'series:' + item.id).types), ['drill']);
  assert(pathway.series.length, 'Expected foundation series');
  for (const item of pathway.series) {
    assert(!pathway.sequences.some(s => s.id === item.id));
    assert(item.foundation.trim()); assert(item.branches.length >= 2, item.id + ' needs choices from the foundation');
    for (const branch of item.branches) for (const field of ['title', 'when', 'action']) assert(typeof branch[field] === 'string' && branch[field].trim(), item.id + ' branch needs ' + field);
    const entry = catalog.find(x => x.id === 'series:' + item.id);
    assert.deepEqual(Array.from(entry.types), ['series']); assertSeriesInstructions(entry.instructions, item);
  }
});
check('starts blank without any ready-made practices', () => { assert.equal(state().plan.blocks.length, 0); assert.equal(state().plan.age, ''); assert.equal(state().plan.target, 0); assert(!api.render(new URLSearchParams()).includes('Customize this plan')); });
check('Kyle guide carries actual steps and boundaries with corrected round timing', () => { const item = catalog.find(x => x.id === 'kyle:K01'); assert(item.steps.length >= 5); assert(item.boundary.includes('head')); assert(/30[- ]seconds?/.test(item.instructions)); assert(!/20[- ]seconds?/.test(item.instructions)); });
check('Facebook written guides and references remain distinct', () => { assert(catalog.find(x => x.id === 'facebook:V01').steps.length); assert.equal(catalog.find(x => x.id === 'facebook:V06').steps.length, 0); assert(catalog.find(x => x.id === 'facebook:V06').status.includes('no complete written')); });
check('source URLs reject active URL schemes', () => { assert.equal(t.safeUrl('javascript:alert(1)'), ''); assert.equal(t.safeUrl('data:text/html,test'), ''); assert.equal(t.safeUrl('https://www.youtube.com/watch?v=abc'), 'https://www.youtube.com/watch?v=abc'); });
check('HTML escaping handles imported text and attributes', () => { assert.equal(t.esc('<img src=x onerror="bad">&\''), '&lt;img src=x onerror=&quot;bad&quot;&gt;&amp;&#39;'); });
check('series links preselect series without adding on repeat render', () => { api.render(new URLSearchParams('series=' + series.id + '&age=7-10')); api.render(new URLSearchParams('series=' + series.id + '&age=7-10')); assert.equal(state().picker.selected, 'series:' + series.id); assert.equal(state().picker.type, 'series'); assert.equal(state().plan.blocks.length, 0); assert.equal(state().plan.age, '7-10'); });
check('new sequence and legacy series links select the same drill without adding', () => {
  for (const key of ['sequence', 'series']) { mount(key + '=' + sequence.id + '&age=4-6'); assert.equal(state().picker.selected, 'series:' + sequence.id); assert.equal(state().picker.type, 'drill'); assert.equal(state().plan.blocks.length, 0); assert.equal(state().plan.age, '7-10'); }
});
check('activity links preselect correct type without changing an existing group', () => { api.render(new URLSearchParams('activity=' + activity.id + '&age=4-6')); assert.equal(state().picker.selected, 'activity:' + activity.id); assert.equal(state().picker.type, activity.type); assert.equal(state().plan.age, '7-10'); assert.equal(state().plan.blocks.length, 0); });
check('series link to their own guide while linked drills retain their phase route', () => {
  for (const item of catalog.filter(x => x.id.startsWith('series:'))) {
    const id = item.id.slice(7);
    if (item.types.includes('series')) { assert.equal(item.path, '#season?view=series&series=' + encodeURIComponent(id)); continue; }
    const group = pathway.groups.find(g => g.phases.some(p => (p.sequence_ids || []).includes(id)));
    if (!group) { assert.equal(item.path, '#season'); continue; }
    const phase = group.phases.find(p => (p.sequence_ids || []).includes(id));
    assert.equal(item.path, '#season?age=' + encodeURIComponent(group.age_group) + '&phase=' + encodeURIComponent(phase.id));
  }
});
check('pathway tab keeps the current group and an exact age-control name', () => { const html = api.render(new URLSearchParams()); assert(html.includes('data-pathway-link href="#season?age=7-10">Season pathway</a>')); assert(html.includes('id="builder-age" aria-label="Age group (optional)"')); assert(!html.includes('Season skill pathway')); });
mount();
check('changing the practice group updates the pathway tab link', () => { field('age', '11-14'); assert.equal(root.querySelector('[data-pathway-link]').href, '#season?age=11-14'); field('age', '7-10'); });
addSource('move', 'P01'); addSource('game', 'G01'); addSource('move', 'kyle:K02'); addSource('move', 'facebook:V06'); addSource('series', 'series:' + series.id);
check('mixed catalog builds a custom ordered plan with instruction', () => { assert.deepEqual(Array.from(state().plan.blocks.map(x => x.sourceId)), ['P01', 'G01', 'kyle:K02', 'facebook:V06', 'series:' + series.id]); assert(state().plan.blocks[0].steps.length); assert(state().plan.blocks[3].instructions.includes('Preview')); });
check('adding a foundation series retains every option in the editable task', () => { const block = state().plan.blocks[4]; assert.equal(block.type, 'series'); assertSeriesInstructions(block.instructions); const clean = t.cleanPlan(JSON.parse(JSON.stringify(state().plan))); assertSeriesInstructions(clean.blocks[4].instructions); });
check('legacy saved series blocks become drills and preserve their source and coach edits', () => { const raw = JSON.parse(JSON.stringify(state().plan)); raw.blocks = [t.blockFrom(catalog.find(x => x.id === 'series:' + sequence.id), 'series')]; raw.blocks[0].instructions = 'Coach-edited sequence from an existing practice.'; const clean = t.cleanPlan(raw); assert.equal(clean.blocks[0].type, 'drill'); assert.equal(clean.blocks[0].sourceId, 'series:' + sequence.id); assert.equal(clean.blocks[0].instructions, raw.blocks[0].instructions); });
check('cumulative timing includes fractional-minute blocks', () => { const times = t.timing([{ minutes: 2 }, { minutes: 0.5 }, { minutes: 8 }]); assert.equal(JSON.stringify(times), JSON.stringify([{ start: 0, end: 2 }, { start: 2, end: 2.5 }, { start: 2.5, end: 10.5 }])); });
check('up/down and remove/undo retain block text and order', () => { const before = state().plan.blocks.map(x => x.sourceId).join(); t.action('up', 2); assert.equal(state().plan.blocks[1].sourceId, 'kyle:K02'); t.action('down', 1); assert.equal(state().plan.blocks.map(x => x.sourceId).join(), before); t.action('remove', 0); assert.equal(state().plan.blocks.length, 4); t.action('undo', -1); assert.equal(state().plan.blocks.map(x => x.sourceId).join(), before); });
field('name', 'Tuesday technique'); field('target', '60'); field('notes', 'Rotate partners.'); t.action('save', -1);
check('named save and autosave use separate non-favorites keys', () => { assert.equal(state().saved.length, 1); assert.equal(JSON.parse(values.get(t.keys.plans))[0].name, 'Tuesday technique'); assert.equal(JSON.parse(values.get(t.keys.draft)).target, 60); assert(writes.every(k => [t.keys.plans, t.keys.draft].includes(k))); });
check('foundation and response options survive saved storage and page reload', () => { assertSeriesInstructions(JSON.parse(values.get(t.keys.plans))[0].blocks[4].instructions); t.reset(); mount(); assertSeriesInstructions(state().plan.blocks[4].instructions); assertSeriesInstructions(state().saved[0].blocks[4].instructions); });
const originalId = state().plan.id;
check('save a copy gets a new ID; editing saved plan updates it', () => { t.action('duplicate', -1); assert.equal(state().saved.length, 2); assert.notEqual(state().plan.id, originalId); field('name', 'Thursday technique'); t.action('save', -1); assert.equal(state().saved.length, 2); assert.equal(state().saved[1].name, 'Thursday technique'); });
check('load restores a named practice, delete requires confirmation', () => { root.querySelector('[data-saved-plan]').value = originalId; t.action('load', -1); assert.equal(state().plan.name, 'Tuesday technique'); allowConfirm = false; t.action('delete', -1); assert.equal(state().saved.length, 2); allowConfirm = true; t.action('delete', -1); assert.equal(state().saved.length, 1); assert.equal(state().plan.id, ''); assert(state().plan.blocks.length); });
check('cancelled blank action retains draft', () => { allowConfirm = false; t.action('new', -1); assert(state().plan.blocks.length); allowConfirm = true; });
check('print includes boundaries, excludes active markup, and expands instruction optionally', () => { field('name', '<script>alert(1)</script>'); const compact = t.printHtml(false), expanded = t.printHtml(true); assert(compact.includes('&lt;script&gt;')); assert(!compact.includes('<script>')); assert(compact.includes('Boundaries:')); assert(expanded.length > compact.length); assert(compact.includes('coach must preview')); });
check('compact run sheet includes the foundation, all response options and readiness limits', () => { const html = t.printHtml(false); for (const value of [series.foundation, ...series.branches.flatMap(branch => [branch.title, branch.when, branch.action, branch.readiness].filter(Boolean))]) assert(html.includes(t.esc(value)), 'Missing series option in compact print'); });
const exported = { format: 'grindstone-practice', version: 1, plan: state().plan };
check('exported plan imports as independent draft with matching content and series options', () => { const imported = t.parseImport(JSON.stringify(exported)); assert.equal(imported.id, ''); assert.equal(imported.blocks.length, state().plan.blocks.length); assert.equal(imported.blocks[0].sourceId, 'P01'); assert.equal(imported.blocks[4].sourceId, 'series:' + series.id); assertSeriesInstructions(imported.blocks[4].instructions); });
check('import drops unknown source and never accepts supplied links or HTML fields', () => { const raw = JSON.parse(JSON.stringify(exported)); raw.plan.blocks[0].sourceId = 'unknown'; raw.plan.blocks[0].video = 'javascript:alert(1)'; raw.plan.blocks[0].html = '<iframe>'; raw.plan.__proto__ = { malicious: true }; const imported = t.parseImport(JSON.stringify(raw)); assert.equal(imported.blocks[0].sourceId, ''); assert(!Object.hasOwn(imported.blocks[0], 'video')); assert(!Object.hasOwn(imported.blocks[0], 'html')); assert(!Object.hasOwn(imported, 'malicious')); });
check('malformed version, negative timing and excessive text fail clearly', () => { assert.throws(() => t.parseImport('{}'), /Grindstone/); assert.throws(() => t.parseImport('{'), /valid JSON/); const p = JSON.parse(JSON.stringify(exported)); p.plan.blocks[0].minutes = -5; assert.throws(() => t.parseImport(JSON.stringify(p)), /0.5/); p.plan.blocks[0].minutes = 5; p.plan.notes = 'x'.repeat(12001); assert.throws(() => t.parseImport(JSON.stringify(p)), /12000/); p.plan.notes = ''; p.plan.blocks = Array(101).fill(p.plan.blocks[0]); assert.throws(() => t.parseImport(JSON.stringify(p)), /100 blocks/); });
check('missing group and optional target stay optional after reload', () => { field('age', ''); field('target', ''); t.reset(); mount(); assert.equal(state().plan.age, ''); assert.equal(state().plan.target, 0); assert(state().plan.blocks.length); });
check('page-load backup restores original draft after structural change', () => { const length = state().plan.blocks.length; t.action('new', -1); assert.equal(state().plan.blocks.length, 0); t.action('backup', -1); assert.equal(state().plan.blocks.length, length); });
check('disabled browser storage is reported and draft remains usable in memory', () => { failStorage = true; t.reset(); mount(); addSource('move', 'P01'); assert.equal(state().plan.blocks.length, 1); assert(state().storageError.includes('export')); t.action('save', -1); assert.equal(state().saved.length, 0); failStorage = false; });
check('corrupt saved-plan data is not overwritten by named save', () => { values.set(t.keys.plans, '{broken'); t.reset(); mount(); addSource('move', 'P01'); t.action('save', -1); assert.equal(values.get(t.keys.plans), '{broken'); });

const frameworkData = ctx.window.GRINDSTONE_FRAMEWORKS;
check('time frameworks total 60, 90 and 120 minutes with valid teaching sections', () => {
  const durations = { hour: 60, ninety: 90, 'two-hour': 120 };
  const sections = new Set(['prepare', 'staples', 'teach', 'choices', 'physical', 'game', 'recap', 'reset']);
  assert.equal(frameworkData.frameworks.length, 3);
  for (const framework of frameworkData.frameworks) {
    assert.equal(framework.minutes, durations[framework.id]);
    assert.equal(framework.blocks.reduce((sum, block) => sum + block.minutes, 0), framework.minutes);
    assert(framework.blocks.some(block => block.section === 'reset'));
    assert(framework.blocks.some(block => block.section === 'choices'));
    for (const block of framework.blocks) { assert(sections.has(block.section)); assert(block.instructions.trim()); assert(block.minutes > 0); }
  }
});
check('program schedules match the supplied handout without assigning age tiers', () => {
  const expected = { black: [['Monday', 'Wednesday', 'Friday'], '18:00', 120, 'Westminster High School', 'two-hour'], blue: [['Tuesday', 'Thursday'], '18:00', 120, 'Westminster High School', 'two-hour'], pups: [['Tuesday'], '18:00', 60, 'Winters Mill High School', 'hour'], valkyries: [['Monday', 'Wednesday', 'Friday'], '18:30', 90, 'Winters Mill High School', 'ninety'] };
  for (const program of frameworkData.programs) {
    assert.deepEqual(JSON.parse(JSON.stringify([program.days, program.start, program.minutes, program.location, program.defaultFramework])), expected[program.id]);
    assert(!Object.hasOwn(program, 'age')); assert(!Object.hasOwn(program, 'age_group'));
  }
});
check('legacy exports receive safe planning defaults without losing tasks', () => {
  resetCase(); addSource('move', 'P01');
  const raw = state().plan;
  for (const key of ['program', 'framework', 'session', 'stage', 'startTime']) delete raw[key];
  for (const block of raw.blocks) for (const key of ['section', 'delivery', 'rotation']) delete block[key];
  const clean = t.cleanPlan(raw);
  for (const key of ['program', 'framework', 'session', 'stage', 'startTime']) assert.equal(clean[key], '');
  assert.equal(clean.blocks[0].section, ''); assert.equal(clean.blocks[0].delivery, 'whole'); assert.equal(clean.blocks[0].rotation, '');
  assert.equal(clean.blocks[0].sourceId, 'P01'); assert.equal(clean.blocks[0].instructions, raw.blocks[0].instructions);
});
check('selecting a program updates duration and clock without replacing age or blocks', () => {
  resetCase(); field('age', '7-10'); addSource('move', 'P01');
  const before = JSON.stringify(state().plan.blocks);
  field('program', 'valkyries');
  assert.equal(state().plan.program, 'valkyries'); assert.equal(state().plan.framework, 'ninety'); assert.equal(state().plan.target, 90); assert.equal(state().plan.startTime, '18:30');
  assert.equal(state().plan.age, '7-10'); assert.equal(JSON.stringify(state().plan.blocks), before);
  field('program', 'black');
  assert.equal(state().plan.target, 120); assert.equal(state().plan.startTime, '18:00'); assert.equal(state().plan.framework, 'two-hour'); assert.equal(state().plan.age, '7-10'); assert.equal(JSON.stringify(state().plan.blocks), before);
});
check('program links initialize a blank draft but never overwrite an existing plan', () => {
  resetCase('program=pups'); assert.equal(state().plan.program, 'pups'); assert.equal(state().plan.target, 60); assert.equal(state().plan.blocks.length, 0); assert.equal(state().plan.age, '');
  addSource('move', 'P01'); const before = JSON.stringify(state().plan);
  mount('program=black'); assert.equal(JSON.stringify(state().plan), before);
});
check('a time framework adds generic editable slots, with confirmation and undo', () => {
  resetCase(); addSource('move', 'P01'); field('framework', 'two-hour');
  const before = JSON.stringify(state().plan.blocks);
  allowConfirm = false; t.action('framework', -1); assert.equal(JSON.stringify(state().plan.blocks), before);
  allowConfirm = true; t.action('framework', -1);
  const framework = frameworkData.frameworks.find(item => item.id === 'two-hour');
  assert.equal(state().plan.blocks.length, framework.blocks.length); assert.equal(state().plan.blocks.reduce((sum, block) => sum + block.minutes, 0), 120);
  for (let i = 0; i < framework.blocks.length; i++) { assert.equal(state().plan.blocks[i].sourceId, ''); assert.equal(state().plan.blocks[i].section, framework.blocks[i].section); assert.equal(state().plan.blocks[i].minutes, framework.blocks[i].minutes); }
  t.action('undo', -1); assert.equal(JSON.stringify(state().plan.blocks), before);
});
check('replacing a selected slot preserves timing and station arrangements', () => {
  resetCase(); field('framework', 'ninety'); t.action('framework', -1);
  blockField(0, 'section', 'staples'); blockField(0, 'delivery', 'stations'); blockField(0, 'rotation', 'Three groups; rotate clockwise after each turn.');
  const before = state().plan.blocks, slot = before[0];
  picker('type', 'move'); picker('selected', 'P01'); picker('destination', slot.id);
  allowConfirm = false; t.action('add', -1); assert.equal(JSON.stringify(state().plan.blocks), JSON.stringify(before));
  allowConfirm = true; t.action('add', -1);
  const replaced = state().plan.blocks;
  assert.equal(replaced.length, before.length); assert.equal(replaced[0].sourceId, 'P01');
  for (const key of ['minutes', 'section', 'delivery', 'rotation']) assert.equal(replaced[0][key], slot[key]);
  assert.equal(JSON.stringify(replaced.slice(1)), JSON.stringify(before.slice(1)));
  picker('destination', ''); addSource('game', 'G01'); assert.equal(state().plan.blocks.length, before.length + 1); assert.equal(state().plan.blocks.at(-1).sourceId, 'G01');
});
check('series filter includes member moves and the complete series without unrelated guides', () => {
  resetCase();
  const family = pathway.series.find(item => item.members?.some(member => catalog.some(entry => entry.id === member.move_id && entry.types.includes('move'))));
  assert(family, 'Expected a series with member moves'); picker('family', family.id); picker('type', 'move');
  const expected = catalog.filter(item => item.types.includes('move') && item.memberships.some(m => m.id === family.id)).map(item => item.id).sort();
  assert(expected.length); assert.deepEqual(visibleIds().sort(), Array.from(expected));
  picker('type', 'series'); assert.deepEqual(visibleIds(), ['series:' + family.id]);
  picker('family', ''); assert(visibleIds().length > 1);
});
check('new written move guides use plain IDs and retain their source details', () => {
  for (const entry of addedMoves) {
    const normalized = catalog.find(item => item.id === entry.id);
    assert(normalized, 'Missing new move ' + entry.id); assert(normalized.steps.length); assert(normalized.readiness); assert(normalized.boundary); assert(normalized.video.startsWith('https://'));
    assert.equal(counts.moves.filter(move => move.id === entry.id).length, 1, entry.id + ' must integrate once');
    assert.equal(counts.research[entry.id].research.source_limits, entry.verification, entry.id + ' must preserve research provenance');
    assert.equal(counts.videos[entry.id].video.verified_by, entry.verification, entry.id + ' must preserve video verification scope');
  }
});
check('move links select new guides with broader references enabled without changing an existing draft', () => {
  resetCase(); field('age', '7-10'); addSource('move', 'P01');
  const before = JSON.stringify(state().plan), move = ctx.window.GRINDSTONE_SERIES_MOVES.entries[0]; assert(move);
  root.listeners.change({ target: { dataset: { picker: 'matchAge' }, type: 'checkbox', checked: false } });
  mount('move=' + move.id + '&age=11-14');
  assert.equal(state().picker.selected, move.id); assert.equal(state().picker.type, 'move'); assert.equal(JSON.stringify(state().plan), before);
  mount('move=' + move.id); assert.equal(JSON.stringify(state().plan), before);
});
check('session context requires an explicit action and preserves existing practice blocks', () => {
  resetCase(); field('age', '4-6'); field('session', 'revisit'); field('focus', 'Keep my current focus.'); addSource('move', 'P01');
  const group = pathway.groups.find(item => item.phases.some(phase => phase.practice_cycle?.core_a)), phase = group?.phases.find(item => item.practice_cycle?.core_a);
  assert(phase, 'Expected a phase teaching cycle'); const before = JSON.stringify(state().plan.blocks);
  mount('age=' + group.age_group + '&phase=' + phase.id + '&session=core-a');
  assert.equal(state().plan.age, '4-6'); assert.equal(state().plan.session, 'revisit'); assert.equal(state().plan.focus, 'Keep my current focus.');
  t.action('context', -1); assert.equal(state().plan.age, group.age_group); assert.equal(state().plan.session, 'core-a'); assert.equal(state().plan.focus, phase.practice_cycle.core_a.focus); assert.equal(JSON.stringify(state().plan.blocks), before);
});
check('session, clock and station details survive save, reload and JSON import', () => {
  resetCase(); field('program', 'valkyries'); field('session', 'core-b'); field('stage', 'choice'); addSource('move', 'P01');
  blockField(0, 'section', 'choices'); blockField(0, 'delivery', 'stations'); blockField(0, 'rotation', 'Coach A: read the response; swap on the signal.');
  t.action('save', -1); t.reset(); mount();
  const savedPlan = state().plan, imported = t.parseImport(JSON.stringify({ format: 'grindstone-practice', version: 1, plan: savedPlan }));
  for (const plan of [savedPlan, imported]) {
    assert.equal(plan.program, 'valkyries'); assert.equal(plan.framework, 'ninety'); assert.equal(plan.session, 'core-b'); assert.equal(plan.stage, 'choice'); assert.equal(plan.startTime, '18:30');
    assert.equal(plan.blocks[0].section, 'choices'); assert.equal(plan.blocks[0].delivery, 'stations'); assert.equal(plan.blocks[0].rotation, 'Coach A: read the response; swap on the signal.');
  }
  const printed = t.printHtml(false);
  for (const text of ['6:30 pm', '6:35 pm', 'Core B', 'Read and choose', 'Station rotations', savedPlan.blocks[0].rotation]) assert(printed.includes(t.esc(text)), 'Missing printed detail: ' + text);
});
check('unknown planning values are sanitized and invalid clock times fail import', () => {
  const raw = state().plan; raw.program = 'untrusted'; raw.framework = 'untrusted'; raw.session = 'untrusted'; raw.stage = 'untrusted'; raw.blocks[0].section = 'untrusted'; raw.blocks[0].delivery = 'untrusted';
  const clean = t.cleanPlan(raw);
  for (const key of ['program', 'framework', 'session', 'stage']) assert.equal(clean[key], ''); assert.equal(clean.blocks[0].section, ''); assert.equal(clean.blocks[0].delivery, 'whole');
  for (const time of ['24:00', '18:60', '6:30', 'bad']) { raw.startTime = time; assert.throws(() => t.cleanPlan(raw), /HH:MM/); }
});
check('V08 head-and-neck warning survives preview, saved blocks, import and both print modes', () => {
  resetCase();
  const source = ctx.window.GRINDSTONE_VIDEO_ADDITIONS.entries.find(entry => entry.id === 'V08');
  const warning = source.focus.find(text => /head and neck/.test(text)); assert(warning, 'Expected the reviewed V08 loading warning');
  const entry = catalog.find(item => item.id === 'facebook:V08');
  assert.equal(entry.steps.length, 0); assert(entry.status.includes('Video reference')); assert(entry.status.includes('no complete written instruction')); assert(entry.boundary.includes(warning));
  picker('type', 'move'); picker('selected', entry.id);
  const preview = root.querySelector('.builder-resource-preview').innerHTML;
  assert(preview.includes(t.esc(warning))); assert(preview.includes(t.esc(entry.status)));
  t.action('add', -1); assert(state().plan.blocks[0].boundary.includes(warning)); assert.equal(state().plan.blocks[0].steps.length, 0);
  t.action('save', -1); t.reset(); mount();
  const savedPlan = state().saved[0], draft = state().plan, imported = t.parseImport(JSON.stringify({ format: 'grindstone-practice', version: 1, plan: savedPlan }));
  for (const plan of [savedPlan, draft, imported]) { assert.equal(plan.blocks[0].sourceId, 'facebook:V08'); assert(plan.blocks[0].boundary.includes(warning)); assert.equal(plan.blocks[0].steps.length, 0); }
  for (const details of [false, true]) { const printed = t.printHtml(details); assert(printed.includes(t.esc(warning))); assert(printed.includes('Video reference:')); assert(printed.includes('coach must preview')); }
});
check('new series provide two distinct taught outcomes and no Pup placements', () => {
  for (const id of ['S19', 'S20', 'S21', 'S23']) assert(expandedSeries.some(item => item.id === id), 'Missing researched series ' + id);
  for (const item of expandedSeries) {
    const outcomes = item.branches.filter(branch => !/reset|rebuild|stop|keep balance/i.test(branch.title));
    assert(outcomes.length >= 2, item.id + ' needs two outcomes beyond resetting');
    assert(new Set(outcomes.map(branch => branch.move_ids[0])).size >= 2, item.id + ' must teach different move options');
    for (const branch of outcomes) assert(branch.move_ids.some(id => catalog.some(entry => (entry.id === id || entry.id === 'kyle:' + id) && entry.steps.length)), item.id + ' outcome must link a written teaching guide');
    assert(!item.age_groups.includes('4-6')); assert(item.verification, item.id + ' needs explicit source scope');
  }
  const newIds = new Set(expandedSeries.map(item => item.id));
  for (const phase of pathway.groups.find(group => group.age_group === '4-6').phases) assert(!phase.series_ids.some(id => newIds.has(id)), 'Pup phase must not receive advanced series');
});
for (const item of expandedSeries) check(item.id + ' full choices and limitations survive save, reload, import and print', () => {
  resetCase('series=' + item.id);
  assert.equal(state().picker.selected, 'series:' + item.id); assert.equal(state().plan.blocks.length, 0);
  const normalized = catalog.find(entry => entry.id === 'series:' + item.id);
  assertSeriesInstructions(normalized.instructions, item); assert(normalized.instructions.includes(item.verification));
  t.action('add', -1); t.action('save', -1); t.reset(); mount();
  const savedPlan = state().saved[0], imported = t.parseImport(JSON.stringify({ format: 'grindstone-practice', version: 1, plan: savedPlan }));
  for (const plan of [savedPlan, state().plan, imported]) {
    const block = plan.blocks[0]; assert.equal(block.sourceId, 'series:' + item.id); assertSeriesInstructions(block.instructions, item);
    assert(block.instructions.includes(item.verification)); assert.equal(block.readiness, item.readiness); assert.equal(block.boundary, item.boundaries);
    assert.deepEqual(Array.from(block.steps), Array.from(item.steps));
  }
  for (const details of [false, true]) {
    const html = t.printHtml(details);
    for (const text of [item.foundation, item.readiness, item.boundaries, item.verification, ...item.branches.flatMap(branch => [branch.when, branch.action, branch.readiness].filter(Boolean))]) assert(html.includes(t.esc(text)), item.id + ' print omitted a teaching limit or option');
  }
});
check('Circle the Castle has no substitute video while matching Spin Drill remains on P11', () => {
  const original = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(base, 'data.js'), 'utf8'), original);
  assert.equal(counts.videos.G16.video, null); assert.deepEqual(JSON.parse(JSON.stringify(counts.videos.P11)), JSON.parse(JSON.stringify(original.window.GRINDSTONE.videos.P11)));
  assert.equal(catalog.find(item => item.id === 'G16').video, '');
  resetCase(); addSource('game', 'G16');
  const priorVideo = original.window.GRINDSTONE.videos.G16.video.url;
  for (const html of [root.querySelector('.builder-resource-preview').innerHTML, t.printHtml(false), t.printHtml(true)]) assert(!html.includes(priorVideo), 'G16 must not present the unrelated Spin Drill video');
});
check('all 37 original games have runnable instructions without losing their library identity', () => {
  const original = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(base, 'data.js'), 'utf8'), original);
  assert.equal(counts.games.length, 37); assert.equal(new Set(counts.games.map(game => game.id)).size, 37);
  for (const game of counts.games) {
    const previous = original.window.GRINDSTONE.games.find(item => item.id === game.id); assert(previous, 'New or missing game ID ' + game.id);
    for (const key of ['name', 'ages', 'format', 'minutes', 'equipment']) assert.equal(game[key], previous[key], game.id + ' changed original ' + key);
    for (const key of ['setup', 'play', 'scoring', 'reset', 'timing', 'variation', 'boundary', 'review_note']) assert(typeof game[key] === 'string' && game[key].trim(), game.id + ' needs ' + key);
    assert(Array.isArray(game.steps) && game.steps.length >= 3 && game.steps.length <= 6, game.id + ' needs 3–6 runnable steps');
    assert(game.steps.every(step => typeof step === 'string' && step.trim()), game.id + ' contains an empty step');
    assert(Array.isArray(game.cues) && game.cues.length && game.cues.every(cue => typeof cue === 'string' && cue.trim()), game.id + ' needs coaching cues');
  }
});
for (const game of counts.games) check(game.id + ' rules, equipment and coaching cues survive building, save, import and both print modes', () => {
  resetCase(); const normalized = catalog.find(item => item.id === game.id); assert(normalized);
  assert(normalized.setup.includes(game.equipment), game.id + ' builder omitted equipment');
  assert(normalized.setup.includes(game.setup), game.id + ' builder omitted starting setup');
  for (const key of ['play', 'scoring', 'reset', 'timing']) assert(normalized.instructions.includes(game[key]), game.id + ' builder omitted ' + key);
  assert.deepEqual(Array.from(normalized.steps.slice(0, game.steps.length)), Array.from(game.steps)); assert(normalized.steps.some(step => step.includes(game.variation)), game.id + ' builder omitted its variation'); assert.deepEqual(Array.from(normalized.cues), Array.from(game.cues));
  addSource('game', game.id); t.action('save', -1); t.reset(); mount();
  const savedPlan = state().saved[0], imported = t.parseImport(JSON.stringify({ format: 'grindstone-practice', version: 1, plan: savedPlan }));
  for (const plan of [savedPlan, state().plan, imported]) {
    const block = plan.blocks[0]; assert.equal(block.sourceId, game.id); assert.equal(block.minutes, Number(game.minutes));
    assert.equal(block.setup, normalized.setup); assert.equal(block.instructions, normalized.instructions); assert.equal(block.cues, game.cues.join('\n')); assert.equal(block.boundary, game.boundary);
    assert.deepEqual(Array.from(block.steps), Array.from(normalized.steps));
  }
  for (const details of [false, true]) {
    const printed = t.printHtml(details);
    for (const text of [game.equipment, game.setup, game.play, game.scoring, game.reset, game.timing, game.boundary, game.variation, ...game.steps, ...game.cues]) assert(printed.includes(t.esc(text)), game.id + ' print omitted a rule or teaching cue, full moves=' + details);
  }
});
for (const id of ['kyle:K01', 'facebook:V03']) check(id + ' clarified rules survive save, import and both print modes', () => {
  resetCase(); const normalized = catalog.find(item => item.id === id); assert(normalized && normalized.types.includes('game'));
  if (id === 'kyle:K01') {
    assert(/30[- ]seconds?/.test(normalized.instructions)); assert(/15[- ]seconds?/.test(normalized.instructions));
    assert(normalized.steps.some(step => /even if/.test(step) && /knee touch/.test(step)), 'K01 must resolve simultaneous touch and block scoring');
  } else {
    const rules = normalized.steps.join('\n'); assert(rules.includes('standing')); assert(rules.includes('both feet outside')); assert(rules.includes('both feet inside')); assert(rules.includes('20-second')); assert(rules.includes('20 seconds play and 10 seconds reset/swap'));
  }
  addSource('game', id); t.action('save', -1); t.reset(); mount();
  const savedPlan = state().saved[0], imported = t.parseImport(JSON.stringify({ format: 'grindstone-practice', version: 1, plan: savedPlan }));
  for (const plan of [savedPlan, state().plan, imported]) {
    const block = plan.blocks[0]; assert.equal(block.sourceId, id); assert.equal(block.minutes, 5); assert.equal(block.instructions, normalized.instructions); assert.equal(block.cues, normalized.cues.join('\n')); assert.equal(block.boundary, normalized.boundary); assert.deepEqual(Array.from(block.steps), Array.from(normalized.steps));
  }
  for (const details of [false, true]) {
    const printed = t.printHtml(details);
    for (const text of [normalized.setup, normalized.instructions, normalized.boundary, ...normalized.steps, ...normalized.cues].filter(Boolean)) assert(printed.includes(t.esc(text)), id + ' print omitted a rule, full moves=' + details);
  }
});

check('group matching defaults to conservative choices and preserves explicit game ages', () => {
  resetCase('age=4-6');
  assert.equal(state().picker.matchAge, true);
  for (const id of ['A14', 'kyle:K18', 'facebook:V08']) assert(!visibleIds().includes(id), id + ' must not be a default Pup choice');
  assert(visibleIds().includes('P01'));
  picker('type', 'game'); assert(visibleIds().includes('G31')); assert(!visibleIds().includes('G11')); assert(!visibleIds().includes('G21'));
  for (const g of counts.games.filter(g => Array.isArray(g.age_groups))) assert.deepEqual(Array.from(catalog.find(item => item.id === g.id).age_groups), Array.from(g.age_groups));
  root.listeners.change({ target: { dataset: { picker: 'matchAge' }, type: 'checkbox', checked: false } });
  assert(visibleIds().includes('G21'));
  picker('type', 'move'); assert(visibleIds().includes('kyle:K18')); assert(visibleIds().includes('facebook:V08'));
  resetCase('program=pups'); assert.equal(state().plan.age, ''); assert(visibleIds().includes('P01')); assert(!visibleIds().includes('A14'));
  resetCase(); assert(visibleIds().includes('A14')); field('program', 'pups'); assert(!visibleIds().includes('A14')); assert.equal(state().plan.age, '');
});
check('outside-group deep links do not silently disable the group filter', () => {
  resetCase('age=4-6&move=kyle:K18');
  assert.equal(state().picker.matchAge, true); assert(!visibleIds().includes('kyle:K18')); assert.equal(state().plan.blocks.length, 0);
  assert(api.render(new URLSearchParams('move=kyle:K18')).includes('outside the current teaching-group suggestions'));
});
check('age restrictions and source scope survive preview, save, reload, import and both print modes', () => {
  resetCase('age=4-6'); addSource('move', 'kyle:K18');
  const original = catalog.find(item => item.id === 'kyle:K18');
  for (const text of [original.ageNote, original.adaptation, original.sourceNote]) assert(root.querySelector('.builder-resource-preview').innerHTML.includes(t.esc(text)));
  blockField(0, 'instructions', 'My carefully adapted task.');
  t.action('save', -1); t.reset(); mount();
  const imported = t.parseImport(JSON.stringify({ format: 'grindstone-practice', version: 1, plan: state().plan }));
  for (const p of [state().plan, state().saved[0], imported]) {
    assert.equal(p.blocks[0].instructions, 'My carefully adapted task.');
    for (const key of ['ageNote','adaptation','sourceNote']) assert.equal(p.blocks[0][key], original[key]);
  }
  for (const full of [false,true]) for (const text of [original.ageNote, original.adaptation, original.sourceNote]) assert(t.printHtml(full).includes(t.esc(text)));
});
check('legacy imported plans gain current restrictions without replacing coach-written content', () => {
  resetCase(); addSource('move', 'kyle:K18');
  const old = state().plan; delete old.blocks[0].sourceNote; delete old.blocks[0].ageNote; old.blocks[0].adaptation = '';
  old.blocks[0].instructions = 'A coach-authored progression.'; old.blocks[0].cues = 'Personal cue.'; old.blocks[0].steps = ['Keep this step.'];
  const clean = t.cleanPlan(old), source = catalog.find(item => item.id === 'kyle:K18');
  assert.equal(clean.blocks[0].instructions, old.blocks[0].instructions); assert.equal(clean.blocks[0].cues, old.blocks[0].cues); assert.deepEqual(Array.from(clean.blocks[0].steps), old.blocks[0].steps);
  assert.equal(clean.blocks[0].adaptation, source.adaptation); assert.equal(clean.blocks[0].sourceNote, source.sourceNote); assert.equal(clean.blocks[0].ageNote, source.ageNote);
  const again = t.cleanPlan(clean); assert.equal(again.blocks[0].adaptation, clean.blocks[0].adaptation); assert.equal(again.blocks[0].sourceNote, clean.blocks[0].sourceNote);
});
check('game duration conflicts stay visible until the coach chooses timing explicitly', () => {
  resetCase('program=pups'); t.action('framework', -1);
  const index = state().plan.blocks.findIndex(b => b.section === 'game'), slot = state().plan.blocks[index];
  picker('destination', slot.id); addSource('game', 'G31');
  assert.equal(state().plan.blocks[index].minutes, 10); assert.equal(state().plan.blocks[index].guideMinutes, 4);
  assert(root.querySelector('.builder-block-list').innerHTML.includes('Timing needs review')); assert(root.querySelector('.builder-summary').innerHTML.includes('timing needs review'));
  for (const full of [false,true]) assert(t.printHtml(full).includes('Timing needs review'));
  const original = state().plan.blocks[index].instructions;
  t.action('guide-duration', index); assert.equal(state().plan.blocks[index].minutes, 4); assert.equal(state().plan.blocks[index].instructions, original); assert(!t.printHtml(false).includes('Timing needs review'));
  t.action('undo', -1); assert.equal(state().plan.blocks[index].minutes, 10); assert(t.printHtml(false).includes('Timing needs review'));
  blockField(index, 'instructions', 'One-minute demonstration; eighteen 20-second turns with 10-second rest: ten minutes total.');
  t.action('confirm-timing', index); assert(!t.printHtml(false).includes('Timing needs review'));
  t.action('save', -1); t.reset(); mount(); assert(state().plan.blocks[index].timingConfirmed); assert(!t.printHtml(false).includes('Timing needs review'));
  blockField(index, 'minutes', '12'); assert(!state().plan.blocks[index].timingConfirmed); assert(t.printHtml(false).includes('Timing needs review'));
});
check('builder search finds a guide by an exact coaching cue', () => {
  resetCase(); picker('search', 'Legs back, hips low.'); assert(visibleIds().includes('P07'));
});

check('detaching a selected series retains its full teaching snapshots in manual copies', () => { resetCase(); const c = ctx.window.GRINDSTONE_COMPONENTS; const source = t.normalizeCatalog().find(x => x.id === 'series:' + series.id); const block = c.selectSeries(t.blockFrom(source, 'series'), [c.testing.branchKey(series.branches[0])], t.normalizeCatalog()); const p = state().plan; p.blocks = [block]; t.replaceDraft(p); t.action('detach-guide', 0); const kept = state().plan.blocks[0]; assert.equal(kept.sourceId, ''); assert.equal(kept.type, 'custom'); assert.deepEqual(kept.components.series.guides, block.components.series.guides); const imported = t.parseImport(JSON.stringify({format:'grindstone-practice',version:1,plan:state().plan})); assert(imported.blocks[0].components.series.guides.length); for (const guide of block.components.series.guides) assert(t.printHtml(false).includes(t.esc(guide.title))); });
console.log('\n' + checks + ' builder checks passed. No files written.');
