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
for (const file of ['data.js', 'game-video-fixes.js', 'kyle-data.js', 'kyle-instruction-data.js', 'video-additions.js', 'game-guides-a.js', 'game-guides-b.js', 'game-guides-c.js', 'game-guide-library.js', 'move-tags.js', 'series-moves.js', 'series-bottom.js', 'series-neutral.js', 'series-top.js', 'series-escapes.js', 'series-foundation.js', 'series-library.js', 'practice-frameworks.js', 'pathway-data.js', 'series-expansion.js', 'catalog-tags.js', 'practice-weeks.js', 'practice-components.js', 'practice-builder.js']) {
  if (!fs.existsSync(path.join(base, file))) throw Error('Missing ' + file);
  vm.runInNewContext(fs.readFileSync(path.join(base, file), 'utf8'), ctx, { filename: file });
}
const api = ctx.window.GRINDSTONE_BUILDER, t = api.testing;
function fakeRoot() {
  const nodes = new Map(), listeners = {};
  return { dataset: {}, listeners, querySelector(selector) { if (selector === 'input:invalid, select:invalid, textarea:invalid' || selector === '[data-week-content]') return null; if (!nodes.has(selector)) nodes.set(selector, { innerHTML: '', textContent: '', value: '', checked: false, disabled: false, hidden: false, focus() {} }); return nodes.get(selector); }, querySelectorAll() { return []; }, addEventListener(name, fn) { listeners[name] = fn; } };
}
let root;
function mount(params = '') { api.render(new URLSearchParams(params)); root = fakeRoot(); api.bind(root); return root; }
function state() { return t.getState(); }
function picker(key, value) { root.listeners.change({ target: { dataset: { picker: key }, type: 'select-one', value } }); }
function field(key, value) { root.listeners.input({ target: { dataset: { planField: key }, value, validity: { valid: true } } }); }
function blockField(index, key, value) { root.listeners.input({ target: { dataset: { blockField: key }, value, validity: { valid: true }, closest() { return { dataset: { blockIndex: String(index) }, querySelector() { return { textContent: '' }; } }; } } }); }
function addSource(type, id) { picker('type', type); if (!visibleIds().includes(id)) root.listeners.change({ target: { dataset: { picker: 'matchAge' }, type: 'checkbox', checked: false } }); picker('selected', id); t.action('add', -1); if (state().pendingReplacement) t.action('confirm-replace', -1); }
function resetCase(params = '') { values.clear(); writes.length = 0; failStorage = false; allowConfirm = true; t.reset(); mount(params); }
function visibleIds() { return Array.from(root.querySelector('[data-picker="selected"]').innerHTML.matchAll(/<option value="([^"]+)"/g), match => match[1]); }
mount();
const catalog = t.normalizeCatalog(), counts = ctx.window.GRINDSTONE, pathway = ctx.window.GRINDSTONE_PATHWAY;
const expansionModules = [ctx.window.GRINDSTONE_SERIES_NEUTRAL, ctx.window.GRINDSTONE_SERIES_TOP, ctx.window.GRINDSTONE_SERIES_ESCAPES, ctx.window.GRINDSTONE_SERIES_FOUNDATION];
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
  t.action('add', -1); assert.equal(JSON.stringify(state().plan.blocks), JSON.stringify(before)); assert(state().pendingReplacement);
  t.action('cancel-replace', -1); assert.equal(JSON.stringify(state().plan.blocks), JSON.stringify(before));
  t.action('add', -1); t.action('confirm-replace', -1);
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

check('builder catalog uses the shared category, position, purpose, use and age metadata', () => {
  const tags = ctx.window.GRINDSTONE_CATALOG_TAGS;
  assert(tags);
  for (const item of catalog) {
    const shared = tags.resolve(item.id); assert(shared, 'Missing shared metadata: ' + item.id);
    for (const key of ['positions','purposes','uses','age_groups','aliases','coreSkills','memberships']) assert.deepEqual(JSON.parse(JSON.stringify(item[key])), JSON.parse(JSON.stringify(shared[key])), item.id + ' differs for ' + key);
    assert.equal(item.category, shared.category);
    assert.equal(item.categoryLabel, shared.categoryLabel);
    assert(item.ageNote.includes(shared.ageNote), item.id + ' must retain the source of its age suggestion');
  }
});
check('default all-guide picker combines orthogonal filters and keeps source IDs', () => {
  resetCase('age=7-10'); assert.equal(state().picker.type, '');
  picker('position','bottom'); picker('purpose','escape'); picker('use','teach');
  const expected = catalog.filter(item => item.age_groups.includes('7-10') && item.positions.includes('bottom') && item.purposes.includes('escape') && item.uses.includes('teach')).map(item => item.id);
  assert.deepEqual(visibleIds(),expected); assert(visibleIds().includes('B17')); assert(!visibleIds().includes('B07'));
  picker('selected','B17'); t.action('add',-1);
  assert.equal(state().plan.blocks[0].sourceId,'B17'); assert.equal(state().plan.blocks[0].type,'move');
  assert.equal(t.cleanPlan(state().plan).blocks[0].sourceId,'B17');
  assert(root.querySelector('.builder-filter-chips').innerHTML.includes('Position: Bottom'));
  assert(root.querySelector('#builder-match-count').textContent.includes('suggested for ages 7-10'));
});
check('shared warm-up use finds both stance guides without requiring the legacy warm-up block type', () => {
  resetCase('age=7-10'); picker('use','warmup');
  assert(visibleIds().includes('P01')); assert(visibleIds().includes('B01')); assert(!visibleIds().includes('B26'));
  picker('category','movement'); assert(visibleIds().includes('B01'));
  picker('type','move'); assert(visibleIds().includes('B01'));
  t.clearPickerFilters('type'); assert.equal(state().picker.type,'');
});
check('aliases, cue words and shared category labels are searchable', () => {
  resetCase('age=7-10'); picker('search','run the pipe'); assert(visibleIds().includes('B08'));
  picker('search','knees bent eyes ahead'); assert(visibleIds().includes('P01'));
  picker('search',''); picker('category','counters'); assert(visibleIds().includes('P07'));
  assert.equal(catalog.find(item=>item.id==='P07').categoryLabel,ctx.window.GRINDSTONE_CATALOG_TAGS.resolve('P07').categoryLabel);
});
check('unassigned references require explicit group-filter override and are labeled', () => {
  resetCase('age=4-6'); picker('search','Peterson');
  assert(!visibleIds().includes('kyle:K18'));
  root.listeners.change({target:{dataset:{picker:'matchAge'},type:'checkbox',checked:false}});
  assert(visibleIds().includes('kyle:K18'));
  assert(root.querySelector('.builder-group-guidance').textContent.includes('not a recommendation'));
  assert(root.querySelector('[data-picker="selected"]').innerHTML.includes('group unassigned'));
  t.clearPickerFilters('matchAge'); assert.equal(state().picker.matchAge,true); assert(!visibleIds().includes('kyle:K18'));
});
check('slot-use suggestions preserve explicit search and selection until the coach applies them', () => {
  resetCase('age=7-10'); field('framework','two-hour'); t.action('framework',-1);
  picker('search','Wrestling Stance'); picker('selected','B01'); picker('position','neutral');
  const slot=state().plan.blocks.find(item=>item.section==='prepare');
  picker('destination',slot.id);
  assert.equal(state().picker.search,'Wrestling Stance'); assert.equal(state().picker.selected,'B01'); assert.equal(state().picker.use,'');
  assert.deepEqual(Array.from(t.suggestedUses()),['warmup']);
  const button={dataset:{suggestUse:'warmup'},disabled:false};
  root.listeners.click({target:{closest(selector){return selector.includes('data-suggest-use')?button:null;}}});
  assert.equal(state().picker.use,'warmup'); assert.equal(state().picker.search,'Wrestling Stance'); assert.equal(state().picker.position,'neutral'); assert.equal(state().picker.selected,'B01');
  assert(root.querySelector('.builder-slot-suggestion').innerHTML.includes('Optional'));
});
check('clear filters restores group suggestions while preserving destination and practice', () => {
  resetCase('age=4-6'); field('framework','hour'); t.action('framework',-1);
  const before=JSON.stringify(state().plan), destination=state().plan.blocks[0].id;
  picker('destination',destination); picker('search','not a real guide'); picker('type','move'); picker('purpose','pin');
  root.listeners.change({target:{dataset:{picker:'matchAge'},type:'checkbox',checked:false}});
  assert.equal(visibleIds().length,0); t.action('clear-filters',-1);
  assert.equal(state().picker.matchAge,true); assert.equal(state().picker.destination,destination);
  for(const key of ['type','search','family','category','position','purpose','use'])assert.equal(state().picker[key],'');
  assert(visibleIds().includes('P01')); assert(!visibleIds().includes('A14')); assert.equal(JSON.stringify(state().plan),before);
});
check('manual block types remain reachable and filters never become invalid saved block types', () => {
  resetCase(); picker('type','water'); t.action('add',-1); assert.equal(state().plan.blocks[0].type,'water'); assert.equal(state().plan.blocks[0].sourceId,'');
  picker('type','custom'); t.action('add',-1); assert.equal(state().plan.blocks[1].type,'custom');
  t.clearPickerFilters(); picker('selected','G31'); t.action('add',-1); assert.equal(state().plan.blocks[2].type,'game');
  assert.equal(t.cleanPlan(state().plan).blocks.length,3);
});
check('new shared filters cannot hide an explicit deep link with stale filter values', () => {
  resetCase('age=7-10'); picker('position','top'); picker('purpose','pin'); picker('use','game'); picker('category','games');
  mount('series=S24');
  for(const key of ['position','purpose','use','category'])assert.equal(state().picker[key],'');
  assert.equal(state().picker.selected,'series:S24'); assert.equal(state().picker.type,'series');
  assert(root.querySelector('.builder-resource-preview').innerHTML.includes('Match essentials'));
  assert(root.querySelector('.builder-resource-preview').innerHTML.includes('data-component-branch'));
});
check('completed practice records reject tag, group-mode and slot-suggestion changes', () => {
  resetCase('age=7-10'); field('framework','hour'); t.action('framework',-1);
  picker('destination',state().plan.blocks[0].id); t.completePlan();
  const before=JSON.stringify(state().picker), planBefore=JSON.stringify(state().plan);
  picker('position','top'); root.listeners.change({target:{dataset:{picker:'matchAge'},type:'checkbox',checked:false}});
  const button={dataset:{suggestUse:'warmup'},disabled:false}; root.listeners.click({target:{closest(selector){return selector.includes('data-suggest-use')?button:null;}}});
  t.action('clear-filters',-1);
  assert.equal(JSON.stringify(state().picker),before); assert.equal(JSON.stringify(state().plan),planBefore);
});


check('named save and copy preserve the selected slot ID and replace it instead of appending', () => {
  for(const saveAction of ['save','duplicate']) {
    resetCase('age=7-10'); field('framework','hour'); t.action('framework',-1);
    const before=state().plan.blocks,slot=before[2];
    picker('selected','B17'); picker('destination',slot.id); t.action(saveAction,-1);
    assert.equal(state().plan.blocks[2].id,slot.id); assert.equal(state().picker.destination,slot.id);
    t.action('add',-1); assert(state().pendingReplacement); assert.equal(state().plan.blocks[2].sourceId,'');
    t.action('confirm-replace',-1);
    assert.equal(state().plan.blocks.length,before.length); assert.equal(state().plan.blocks[2].sourceId,'B17');
    assert.equal(state().plan.blocks[2].minutes,slot.minutes);
    assert(root.querySelector('.builder-placement-feedback').innerHTML.includes('Filled slot 3'));
  }
});
check('saved block IDs stay stable and imported duplicate or unsafe IDs become unique', () => {
  resetCase();addSource('move','P01');addSource('move','P02');
  const raw=state().plan,ids=raw.blocks.map(block=>block.id);
  assert.deepEqual(Array.from(t.cleanPlan(raw).blocks,block=>block.id),ids);
  raw.blocks[1].id=raw.blocks[0].id;
  let cleaned=t.cleanPlan(raw);assert.equal(new Set(cleaned.blocks.map(block=>block.id)).size,2);
  raw.blocks[0].id='bad"><id';cleaned=t.cleanPlan(raw);
  assert(/^[a-zA-Z0-9_-]+$/.test(cleaned.blocks[0].id));
});
check('saving and copying a draft retain station object identity and its staged guide filters', () => {
  const components=ctx.window.GRINDSTONE_COMPONENTS, original=components.bind;let bridge;
  components.bind=function(element,options){bridge=options;return original(element,options);};
  try {
    resetCase('age=7-10');addSource('move','P01');
    const raw=state().plan;raw.blocks[0].components={version:1,rotation:components.testing.newRotation()};t.replaceDraft(raw);
    const station=bridge.getPlan().blocks[0].components.rotation.stations[0];
    const transient=components.testing.stationPicker(station);transient.search='foundation';transient.selected='series:S24';
    for(const saveAction of ['save','duplicate']) {
      t.action(saveAction,-1);assert.strictEqual(bridge.getPlan().blocks[0].components.rotation.stations[0],station);
      assert.strictEqual(components.testing.stationPicker(station),transient);assert.equal(transient.selected,'series:S24');
    }
  } finally {components.bind=original;}
});
function stageMainSkills(indices) {
  const foundation=pathway.series.find(item=>item.id==='S24'),key=ctx.window.GRINDSTONE_COMPONENTS.testing.branchKey;
  const fields=foundation.branches.map((branch,index)=>({value:key(branch),checked:indices.includes(index)}));
  const other=root.querySelectorAll;
  root.querySelectorAll=selector=>selector==='[data-component-branch="picker"]'?fields:other.call(root,selector);
  root.listeners.change({target:{dataset:{componentBranch:'picker'}}});
  return {foundation,fields,key};
}
check('main selected core skills survive destination and filter rerenders before insertion', () => {
  resetCase('age=7-10');field('framework','hour');t.action('framework',-1);
  picker('type','series');picker('selected','series:S24');
  const {foundation,key}=stageMainSkills([2]);picker('destination',state().plan.blocks[1].id);picker('search','Foundation');
  const preview=root.querySelector('.builder-resource-preview').innerHTML;
  assert(preview.includes('value="'+key(foundation.branches[2])+'" checked'));
  assert(!preview.includes('value="'+key(foundation.branches[0])+'" checked'));
  assert(preview.includes('<details class="builder-series-reference">'));
  t.action('add',-1);t.action('confirm-replace',-1);
  const block=state().plan.blocks[1];
  assert.deepEqual(block.components.series.selections.map(item=>item.title),['Single leg']);
  assert(block.instructions.includes(foundation.branches[2].action));assert(!block.instructions.includes(foundation.branches[0].action));
});
check('empty main series choices fail before replacing the previous Undo snapshot', () => {
  resetCase('age=7-10');addSource('move','P01');addSource('move','P02');
  picker('type','series');picker('selected','series:S24');stageMainSkills([]);
  t.action('add',-1);assert.equal(state().plan.blocks.length,2);
  assert(root.querySelector('.builder-placement-feedback').innerHTML.includes('Choose at least one'));
  t.action('undo',-1);assert.deepEqual(state().plan.blocks.map(block=>block.sourceId),['P01']);
});
check('stale selected slots report an error without silently appending', () => {
  resetCase();addSource('move','P01');picker('destination',state().plan.blocks[0].id);
  t.action('remove',0);const before=JSON.stringify(state().plan);
  t.action('add',-1);assert.equal(JSON.stringify(state().plan),before);assert.equal(state().plan.blocks.length,0);
  assert(state().placementError);assert(root.querySelector('.builder-placement-feedback').innerHTML.includes('no longer exists'));
});
check('inline replacement is canceled safely and rejects edits made after its review', () => {
  resetCase();addSource('move','P01');const id=state().plan.blocks[0].id;
  picker('selected','P02');picker('destination',id);t.action('add',-1);
  assert(state().pendingReplacement);t.action('cancel-replace',-1);assert.equal(state().plan.blocks[0].sourceId,'P01');
  t.action('add',-1);blockField(0,'instructions','New coach task after review');t.action('confirm-replace',-1);
  assert.equal(state().plan.blocks[0].instructions,'New coach task after review');assert.equal(state().plan.blocks[0].sourceId,'P01');
  assert(state().placementError);assert(!state().pendingReplacement);
});
check('invalid numeric edits block placement without hiding the field or changing saved numbers', () => {
  resetCase();addSource('move','P01');picker('selected','P02');picker('destination',state().plan.blocks[0].id);
  let focused=0,reported=0;
  const invalid={focus(){focused++;},reportValidity(){reported++;}}, query=root.querySelector.bind(root);
  root.querySelector=selector=>selector==='input:invalid, select:invalid, textarea:invalid'?invalid:query(selector);
  const before=JSON.stringify(state().plan);t.action('add',-1);
  assert.equal(JSON.stringify(state().plan),before);assert(!state().pendingReplacement);assert(focused&&reported);
  root.querySelector=query;t.action('add',-1);assert(state().pendingReplacement);
  root.querySelector=selector=>selector==='input:invalid, select:invalid, textarea:invalid'?invalid:query(selector);
  t.action('confirm-replace',-1);assert.equal(JSON.stringify(state().plan),before);assert(state().pendingReplacement);
  assert(root.querySelector('.builder-placement-feedback').innerHTML.includes('invalid value has not been applied'));
});
check('unfinished station drafts save and export with warnings, print warnings, but cannot complete', () => {
  resetCase();addSource('move','P01');const components=ctx.window.GRINDSTONE_COMPONENTS;
  const raw=state().plan;raw.blocks[0].components={version:1,rotation:components.testing.newRotation()};raw.handoff={taught:'Started setup'};
  t.replaceDraft(raw);t.action('save',-1);assert.equal(state().saved.length,1);
  assert(root.querySelector('.builder-status').textContent.includes('unfinished station'));
  let exports=0;const previousDocument=ctx.document,previousTimer=ctx.window.setTimeout;
  ctx.document={createElement:()=>({click(){exports++;}})};ctx.window.setTimeout=fn=>fn();
  try {t.action('export',-1);assert.equal(exports,1);} finally {ctx.document=previousDocument;ctx.window.setTimeout=previousTimer;}
  for(const details of [false,true])assert(t.printHtml(details).includes('needs a name and a task'));
  t.completePlan();assert.notEqual(state().plan.status,'completed');assert.equal(state().saved.length,1);
  assert(root.querySelector('.builder-status').textContent.includes('Finish the station tasks'));
  assert(!root.querySelector('.builder-status').textContent.includes('Save is unavailable'));
});
check('completed snapshots retain historical restrictions, unknown source IDs, types and timing metadata', () => {
  resetCase();addSource('game','G01');
  const raw=state().plan;raw.status='completed';raw.completedAt='2026-10-20T12:00:00.000Z';
  Object.assign(raw.blocks[0],{adaptation:'Historical adaptation.',ageNote:'Historical age note.',sourceNote:'Historical source note.',guideMinutes:0});
  const clean=t.cleanPlan(raw);
  for(const key of ['adaptation','ageNote','sourceNote','guideMinutes'])assert.equal(clean.blocks[0][key],raw.blocks[0][key]);
  raw.blocks.push({...raw.blocks[0],id:'old-series',sourceId:'series:'+sequence.id,type:'series'});
  raw.blocks.push({...raw.blocks[0],id:'removed-source',sourceId:'retired-guide'});
  const complete=t.cleanPlan(raw);
  assert.equal(complete.blocks[1].type,'series');assert.equal(complete.blocks[2].sourceId,'retired-guide');
  values.set(t.keys.draft,JSON.stringify(raw));t.reset();mount();
  assert.equal(state().plan.blocks[0].ageNote,'Historical age note.');assert.equal(state().plan.blocks[0].guideMinutes,0);
});
check('short usage flow and a per-slot picker shortcut preserve the chosen guide', () => {
  resetCase();addSource('move','P01');picker('selected','P02');
  const html=api.render(new URLSearchParams());
  assert(html.includes('builder-quick-start'));assert(html.includes('data-action="jump-practice"'));assert(html.includes('data-action="save">Save</button>'));
  assert(root.querySelector('.builder-block-list').innerHTML.includes('Choose guide for this slot'));
  t.action('choose-slot',0);assert.equal(state().picker.destination,state().plan.blocks[0].id);assert.equal(state().picker.selected,'P02');
});


check('structural actions keep invalid visible numbers in place until they are corrected',()=>{
  resetCase();addSource('move','P01');addSource('move','P02');field('framework','hour');
  const before=JSON.stringify(state().plan),query=root.querySelector.bind(root);let focused=0;
  root.querySelector=selector=>selector==='input:invalid, select:invalid, textarea:invalid'?{focus(){focused++;},reportValidity(){}}:query(selector);
  for(const action of ['framework','up','down','remove','undo','reload-guide','detach-guide','new','backup']) {
    t.action(action,0);assert.equal(JSON.stringify(state().plan),before,action+' must not discard an invalid visible edit');
  }
  assert(focused>=9);
});
check('all shortcut and lower Save controls become disabled for a completed record',()=>{
  resetCase();addSource('move','P01');
  root.listeners.input({target:{dataset:{handoffField:'taught'},value:'Practiced balanced stance.'}});
  const buttons=[{disabled:false},{disabled:false}],queryAll=root.querySelectorAll;
  root.querySelectorAll=selector=>selector==='[data-action="save"]'?buttons:queryAll.call(root,selector);
  t.completePlan();assert.equal(state().plan.status,'completed');assert(buttons.every(button=>button.disabled));
  assert(root.querySelector('[data-action="save"]').disabled);
});


check('time frameworks identify unfilled tasks without flagging warmups, reset, recap or blank practices',()=>{
  resetCase();assert.equal(t.unfilledSlots().length,0);
  assert.equal(root.querySelector('.builder-unfilled-overview').innerHTML,'');
  for(const [framework,count] of [['hour',5],['ninety',5],['two-hour',7]]) {
    resetCase();field('framework',framework);t.action('framework',-1);
    assert.equal(t.unfilledSlots().length,count);
    for(const block of state().plan.blocks) {
      const exempt=['prepare','reset','recap'].includes(block.section)||['warmup','water'].includes(block.type);
      assert.equal(Object.hasOwn(block,'frameworkPrompt'),!exempt);
      if(!exempt)assert.equal(block.frameworkPrompt,block.instructions);
    }
    assert(root.querySelector('.builder-summary').innerHTML.includes('Time on target'));
    assert(root.querySelector('.builder-summary').innerHTML.includes(count+' slots need a task'));
  }
});
check('unfilled overview prioritizes teaching and jumps to the actual task after reordering',()=>{
  resetCase();field('framework','hour');t.action('framework',-1);
  let blocks=state().plan.blocks,teach=blocks.find(block=>block.section==='teach');
  let html=root.querySelector('.builder-unfilled-overview').innerHTML;
  assert(html.indexOf('data-slot-id="'+teach.id+'"')<html.indexOf('data-slot-id="'+blocks.find(block=>block.section==='staples').id+'"'));
  assert(root.querySelector('.builder-block-list').innerHTML.includes('Choose a skill for this slot'));
  t.action('down',blocks.findIndex(block=>block.id===teach.id));
  const now=state().plan.blocks.findIndex(block=>block.id===teach.id),query=root.querySelector.bind(root);let focused='';
  root.querySelector=selector=>selector.includes('[data-block-field="instructions"]')?{scrollIntoView(){},focus(){focused=selector;}}:query(selector);
  const button={disabled:false,dataset:{action:'review-slot',slotId:teach.id},closest(){return null;}};
  root.listeners.click({target:{closest(selector){return selector==='[data-action]'?button:null;}}});
  assert.equal(focused,'[data-block-index="'+now+'"] [data-block-field="instructions"]');
});
check('names, timing, cues, section edits and preview selections do not fill a framework task',()=>{
  resetCase('age=7-10');field('framework','hour');t.action('framework',-1);
  const index=state().plan.blocks.findIndex(block=>block.section==='teach'),original=state().plan.blocks[index].frameworkPrompt;
  blockField(index,'name','My single leg lesson');blockField(index,'minutes','12');blockField(index,'cues','Head up.');
  blockField(index,'section','recap');picker('selected','B17');
  assert(t.needsFrameworkTask(state().plan.blocks[index]));
  blockField(index,'instructions','  '+original.replace(/ /g,' \n ')+'  ');
  assert(t.needsFrameworkTask(state().plan.blocks[index]));
  assert.equal(t.unfilledSlots().length,5);
});
check('a nonblank coach task resolves its prompt and clearing or reverting restores the reminder',()=>{
  resetCase();field('framework','hour');t.action('framework',-1);
  const index=2,original=state().plan.blocks[index].frameworkPrompt;
  blockField(index,'instructions','Partners start seated. Clear the hand and turn to face, then swap.');
  assert(!t.needsFrameworkTask(state().plan.blocks[index]));assert.equal(t.unfilledSlots().length,4);
  assert.equal(state().plan.blocks[index].frameworkPrompt,original);
  blockField(index,'instructions','  ');assert(t.needsFrameworkTask(state().plan.blocks[index]));
  blockField(index,'instructions',original);assert(t.needsFrameworkTask(state().plan.blocks[index]));
  const manual={...state().plan.blocks[index],instructions:'Coach-written game.'};delete manual.frameworkPrompt;
  assert(!t.needsFrameworkTask(manual));manual.instructions='';assert(!t.needsFrameworkTask(manual),'Custom blanks are outside framework inference');
});
check('guide filling resolves the chosen slot while its prompt survives save, reload, import and guide refresh',()=>{
  resetCase('age=7-10');field('framework','hour');t.action('framework',-1);
  const index=2,slot=state().plan.blocks[index];picker('destination',slot.id);addSource('move','B17');
  assert.equal(t.unfilledSlots().length,4);assert.equal(state().plan.blocks[index].frameworkPrompt,slot.frameworkPrompt);
  t.action('save',-1);t.reset();mount();
  assert.equal(t.unfilledSlots().length,4);assert.equal(state().plan.blocks[index].frameworkPrompt,slot.frameworkPrompt);
  const imported=t.parseImport(JSON.stringify({format:'grindstone-practice',version:1,plan:state().plan}));
  assert.equal(t.unfilledSlots(imported).length,4);assert.equal(imported.blocks[index].frameworkPrompt,slot.frameworkPrompt);
  t.action('reload-guide',index);assert.equal(state().plan.blocks[index].frameworkPrompt,slot.frameworkPrompt);
  blockField(index,'instructions','');assert(t.needsFrameworkTask(state().plan.blocks[index]),'A stale guide ID cannot hide a cleared task');
});
check('legacy prompts are inferred by full normalized task across frameworks after rename or reorder',()=>{
  resetCase();field('framework','hour');t.action('framework',-1);
  const raw=state().plan;raw.framework='two-hour';raw.blocks.reverse();
  raw.blocks.forEach((block,index)=>{delete block.frameworkPrompt;block.name='Renamed '+index;block.minutes=3;block.cues='Custom cues.';block.instructions='\n '+block.instructions.replace(/ /g,'  ')+' \n';});
  const teach=raw.blocks.find(block=>block.section==='teach');teach.sourceId='B17';
  const clean=t.cleanPlan(raw);
  assert.equal(t.unfilledSlots(clean).length,5);
  assert.equal(clean.blocks.filter(block=>Object.hasOwn(block,'frameworkPrompt')).length,5);
  assert(clean.blocks.find(block=>block.sourceId==='B17').frameworkPrompt);
  const custom={...raw.blocks[0],instructions:'An unrelated coach-written task.'};assert.equal(t.inferredFrameworkPrompt(custom),'');
});
check('only a nonempty rotation of named tasks can satisfy a generic parent slot',()=>{
  resetCase();field('framework','hour');t.action('framework',-1);
  const block=state().plan.blocks[2],rotation=ctx.window.GRINDSTONE_COMPONENTS.testing.newRotation();
  block.components={version:1,rotation};assert(t.needsFrameworkTask(block));
  rotation.stations[0].task='Stance steps';assert(t.needsFrameworkTask(block));
  rotation.stations.forEach((station,index)=>{station.task='Coach task '+(index+1);});
  assert(!t.needsFrameworkTask(block));
  rotation.stations[1].name=' ';assert(t.needsFrameworkTask(block));
  rotation.stations=[];assert(t.needsFrameworkTask(block));
});
check('print includes unfilled notices in its header and beside each unresolved slot without blocking save',()=>{
  resetCase();field('framework','hour');t.action('framework',-1);t.action('save',-1);
  assert.equal(state().saved.length,1);
  for(const details of [false,true]) {
    const html=t.printHtml(details);
    assert(html.indexOf('5 framework slots still need a task')<html.indexOf('</header>'));
    assert.equal((html.match(/class="builder-unfilled-warning"/g)||[]).length,6);
    assert(html.includes('Choose a skill'));assert(!html.includes('data-action="review-slot"'));
  }
});
check('new prompt metadata survives Undo and rejects oversized or non-string imported provenance',()=>{
  resetCase('age=7-10');field('framework','hour');t.action('framework',-1);
  const before=state().plan.blocks;picker('destination',before[2].id);addSource('move','B17');
  t.action('undo',-1);assert.equal(t.unfilledSlots().length,5);assert.deepEqual(state().plan.blocks,before);
  const raw=state().plan;raw.blocks[0].frameworkPrompt='x'.repeat(16001);
  assert.throws(()=>t.cleanPlan(raw),/16000/);raw.blocks[0].frameworkPrompt={};assert.throws(()=>t.cleanPlan(raw),/text/);
});
check('legacy completed records are unchanged while planned copies regain missing-task reminders',()=>{
  resetCase();field('framework','hour');t.action('framework',-1);
  const raw=state().plan;raw.blocks.forEach(block=>delete block.frameworkPrompt);
  raw.status='completed';raw.completedAt='2026-10-20T12:00:00.000Z';raw.handoff={taught:'Prior practice record.'};
  const original=JSON.stringify(raw),completed=t.cleanPlan(raw);
  assert.equal(JSON.stringify(raw),original);assert.equal(t.unfilledSlots(completed).length,0);
  assert(completed.blocks.every(block=>!Object.hasOwn(block,'frameworkPrompt')));
  values.set(t.keys.draft,JSON.stringify(raw));t.reset();mount();
  assert(!t.printHtml(false).includes('builder-unfilled-warning'));
  const planned=t.cleanPlan(ctx.window.GRINDSTONE_WEEKS.draftCopy(completed));
  assert.equal(t.unfilledSlots(planned).length,5);
});
check('new explicit framework prompts still print as unfilled after completion without a new blocker',()=>{
  resetCase();field('framework','hour');t.action('framework',-1);
  root.listeners.input({target:{dataset:{handoffField:'taught'},value:'Recorded the actual work after this planned framework.'}});
  t.completePlan();assert.equal(state().plan.status,'completed');assert.equal(state().saved.length,1);
  assert.equal(t.unfilledSlots().length,5);assert(t.printHtml(false).includes('5 framework slots still need a task'));
  assert(!root.querySelector('.builder-unfilled-overview').innerHTML.includes('data-action="review-slot"'));
});


check('legacy warmups with explicit prompt metadata stay exempt through save, reload and import without rewriting text',()=>{
  const oldPrompt='Greet the group, show the activity area and rehearse the stop signal. Choose a familiar movement game that prepares children for today’s task. Alternate brief turns with resets and check that everyone has space.';
  for(const [section,type] of [['prepare','custom'],['staples','warmup']]) {
    resetCase();field('framework','hour');t.action('framework',-1);
    const raw=state().plan,warmup=raw.blocks[0];
    Object.assign(warmup,{section,type,name:'Our usual opener',minutes:7,cues:'Keep our old cue.',instructions:oldPrompt,frameworkPrompt:oldPrompt});
    t.replaceDraft(raw);assert(!t.needsFrameworkTask(state().plan.blocks[0]));assert.equal(t.unfilledSlots().length,5);
    assert(t.needsFrameworkTask(state().plan.blocks.find(block=>block.section==='teach')));
    t.action('save',-1);t.reset();mount();
    const saved=state().plan,imported=t.parseImport(JSON.stringify({format:'grindstone-practice',version:1,plan:saved}));
    for(const record of [saved,imported]) {
      const kept=record.blocks[0];
      assert.equal(kept.instructions,oldPrompt);assert.equal(kept.frameworkPrompt,oldPrompt);
      assert.equal(kept.cues,'Keep our old cue.');assert.equal(kept.name,'Our usual opener');assert.equal(kept.minutes,7);
      assert(!t.needsFrameworkTask(kept,record));assert.equal(t.unfilledSlots(record).length,5);
    }
  }
});


function appendSource(type,id) {
  picker('type',type);
  if(!visibleIds().includes(id))root.listeners.change({target:{dataset:{picker:'matchAge'},type:'checkbox',checked:false}});
  picker('selected',id);t.action('append',-1);
}
check('Add to this slot appends teaching without changing the slot or neighboring practice blocks',()=>{
  resetCase('age=7-10');field('framework','hour');t.action('framework',-1);
  const index=2,slot=state().plan.blocks[index];blockField(index,'name','Our technique time');blockField(index,'cues','Keep my opening cue.');
  picker('destination',slot.id);const before=state().plan;
  appendSource('move','B17');appendSource('move','B07');
  const after=state().plan,added=after.blocks[index];
  assert.equal(after.blocks.length,before.blocks.length);assert.equal(t.timing(after.blocks).at(-1).end,60);
  for(const key of ['id','name','type','sourceId','minutes','section','delivery','rotation','instructions','cues','frameworkPrompt'])
    assert.equal(added[key],before.blocks[index][key],key+' must stay with the original slot');
  assert.deepEqual(added.components.activities.map(item=>item.guide.sourceId),['B17','B07']);
  assert.equal(added.components.activities[0].task,catalog.find(item=>item.id==='B17').instructions);
  assert.deepEqual(after.blocks.filter((_,i)=>i!==index),before.blocks.filter((_,i)=>i!==index));
  assert(!state().pendingReplacement);assert.equal(t.unfilledSlots().length,4);
});
check('appended guides survive actual export, import, named load, page reload and both print modes',()=>{
  resetCase('age=7-10');field('framework','hour');t.action('framework',-1);
  const index=2;picker('destination',state().plan.blocks[index].id);appendSource('move','B17');appendSource('game','G31');
  const activities=state().plan.blocks[index].components.activities;
  t.action('save',-1);const savedId=state().plan.id;
  blockField(index,'instructions','Temporary local change');root.querySelector('[data-saved-plan]').value=savedId;t.action('load',-1);
  assert.deepEqual(state().plan.blocks[index].components.activities,activities);
  t.reset();mount();assert.deepEqual(state().plan.blocks[index].components.activities,activities);
  const priorBlob=ctx.Blob,priorDocument=ctx.document,priorTimer=ctx.window.setTimeout;let exportedText='';
  ctx.Blob=class extends Blob {constructor(parts,options){super(parts,options);exportedText=parts.join('');}};
  ctx.document={createElement:()=>({click(){}})};ctx.window.setTimeout=fn=>fn();
  try {t.action('export',-1);} finally {ctx.Blob=priorBlob;ctx.document=priorDocument;ctx.window.setTimeout=priorTimer;}
  const imported=t.parseImport(exportedText);
  assert.deepEqual(imported.blocks[index].components.activities,activities);
  assert.equal(imported.blocks[index].minutes,state().plan.blocks[index].minutes);
  for(const details of [false,true]) {
    const html=t.printHtml(details);
    for(const activity of activities) {
      assert(html.includes(t.esc(activity.name)));assert(html.includes(t.esc(activity.task)));
      for(const key of ['readiness','boundary','ageNote','sourceNote'])if(activity.guide[key])assert(html.includes(t.esc(activity.guide[key])),key+' must print with added guide');
    }
    assert(html.indexOf(t.esc(activities[0].task))<html.indexOf(t.esc(activities[1].task)));
    assert(/share|shared/i.test(html)&&/slot|block/i.test(html),'Printed activities must explain their shared time');
  }
});
check('duplicate additions do not change the practice or consume the preceding Undo',()=>{
  resetCase();addSource('move','P01');picker('destination',state().plan.blocks[0].id);
  appendSource('move','P02');const before=JSON.stringify(state().plan);
  appendSource('move','P02');assert.equal(JSON.stringify(state().plan),before);
  assert(state().placementError);assert(/already|duplicate/i.test(state().placementNotice));
  t.action('undo',-1);assert.equal(state().plan.blocks.length,1);assert.equal(state().plan.blocks[0].sourceId,'P01');
  assert(!state().plan.blocks[0].components?.activities?.length);
  appendSource('move','P01');assert(!state().plan.blocks[0].components?.activities?.length);
  assert(state().placementError);
});
check('one slot can hold distinct selected Foundation skills without losing independent setups or source notes',()=>{
  resetCase('age=7-10');field('framework','hour');t.action('framework',-1);
  const index=2;picker('destination',state().plan.blocks[index].id);picker('type','series');picker('selected','series:S24');
  const {foundation}=stageMainSkills([0,2]);t.action('append',-1);
  stageMainSkills([1]);t.action('append',-1);
  const added=state().plan.blocks[index].components.activities;
  assert.equal(added.length,2);assert.deepEqual(added[0].series.selections.map(item=>item.title),['Stand-up escape','Single leg']);
  assert.deepEqual(added[1].series.selections.map(item=>item.title),['Double leg']);
  assert(added[0].task.includes(foundation.branches[0].action)&&added[0].task.includes(foundation.branches[2].action));
  assert(!added[0].task.includes(foundation.branches[1].action));assert(!added[1].task.includes(foundation.branches[0].action));
  for(const activity of added) {
    assert.equal(activity.series.kind,'foundation');assert(activity.task.includes('Teach each skill separately'));assert(activity.task.includes('receiving control'));
    assert(activity.series.guides.length);assert(activity.guide.boundary);assert(activity.guide.sourceNote);
  }
  const before=JSON.stringify(state().plan);const staged=stageMainSkills([0,2]);
  root.querySelectorAll=selector=>selector==='[data-component-branch="picker"]'?[...staged.fields].reverse():[];
  root.listeners.change({target:{dataset:{componentBranch:'picker'}}});t.action('append',-1);
  assert.equal(JSON.stringify(state().plan),before,'Reordered identical selections are still a duplicate');
  const roundtrip=t.parseImport(JSON.stringify({format:'grindstone-practice',version:1,plan:state().plan}));
  assert.deepEqual(roundtrip.blocks[index].components.activities,added);
  for(const details of [false,true]) {
    const html=t.printHtml(details);for(const activity of added)for(const guide of activity.series.guides) {
      assert(html.includes(t.esc(guide.title)));if(guide.boundary)assert(html.includes(t.esc(guide.boundary)));
    }
  }
});
check('appending to a selected-series block retains its original teaching subset and structured rotation',()=>{
  resetCase('age=7-10');const components=ctx.window.GRINDSTONE_COMPONENTS,foundation=catalog.find(item=>item.id==='series:S24');
  let original=components.selectSeries(t.blockFrom(foundation,'series'),[components.testing.branchKey(pathway.series.find(item=>item.id==='S24').branches[0])],catalog);
  original.components.rotation=components.testing.newRotation();original.rotation='Keep coach groups and stations.';original.minutes=20;
  original.components.rotation.stations.forEach((station,index)=>{station.task='Existing task '+index;});
  const raw=state().plan;raw.blocks=[original];t.replaceDraft(raw);
  const before=state().plan.blocks[0];picker('destination',before.id);appendSource('move','B07');
  const after=state().plan.blocks[0];
  assert.deepEqual(after.components.series,before.components.series);assert.deepEqual(after.components.rotation,before.components.rotation);
  assert.equal(after.instructions,before.instructions);assert.equal(after.minutes,20);assert.equal(after.rotation,before.rotation);
  t.action('reload-guide',0);assert.deepEqual(state().plan.blocks[0].components.activities,after.components.activities);
  assert.deepEqual(state().plan.blocks[0].components.rotation,before.components.rotation);
});
check('Undo removes only the latest appended work and can restore the untouched framework reminder',()=>{
  resetCase('age=7-10');field('framework','hour');t.action('framework',-1);
  const index=2,before=state().plan;picker('destination',before.blocks[index].id);appendSource('move','B17');
  assert.equal(t.unfilledSlots().length,4);t.action('undo',-1);assert.deepEqual(state().plan.blocks,before.blocks);assert.equal(t.unfilledSlots().length,5);
  appendSource('move','B17');const one=state().plan.blocks[index];appendSource('move','B07');t.action('undo',-1);
  assert.deepEqual(state().plan.blocks[index],one);assert.equal(state().plan.blocks[index].components.activities.length,1);
});
check('append requires a current destination and valid inputs and cannot write completed records',()=>{
  resetCase();addSource('move','P01');const before=JSON.stringify(state().plan);
  picker('selected','P02');t.action('append',-1);assert.equal(JSON.stringify(state().plan),before);
  picker('destination','removed-slot');t.action('append',-1);assert.equal(JSON.stringify(state().plan),before);assert(state().placementError);
  picker('destination',state().plan.blocks[0].id);
  const query=root.querySelector.bind(root);root.querySelector=selector=>selector==='input:invalid, select:invalid, textarea:invalid'?{focus(){},reportValidity(){}}:query(selector);
  t.action('append',-1);assert.equal(JSON.stringify(state().plan),before);root.querySelector=query;
  root.listeners.input({target:{dataset:{handoffField:'taught'},value:'Completed the stance task.'}});t.completePlan();
  const completed=JSON.stringify(state().plan);t.action('append',-1);assert.equal(JSON.stringify(state().plan),completed);
});
check('additional-work limits reject overflow without truncating or losing prior guide snapshots',()=>{
  resetCase('age=7-10');picker('type','custom');t.action('add',-1);picker('destination',state().plan.blocks[0].id);
  for(let i=1;i<=12;i++)appendSource('move','P'+String(i).padStart(2,'0'));
  assert.equal(state().plan.blocks[0].components.activities.length,12);
  const before=JSON.stringify(state().plan);appendSource('move','B17');assert.equal(JSON.stringify(state().plan),before);assert(state().placementError);
  const raw=state().plan;raw.blocks[0].components.activities.push(raw.blocks[0].components.activities[0]);
  assert.throws(()=>t.cleanPlan(raw),/12|many|maximum|most/i);
});


check('Fill this slot changes only its main guide and retains all appended work and timing',()=>{
  resetCase('age=7-10');field('framework','hour');t.action('framework',-1);
  const index=2;picker('destination',state().plan.blocks[index].id);appendSource('move','B17');appendSource('move','B07');
  const before=state().plan.blocks[index];
  addSource('move','B08');const after=state().plan.blocks[index];
  assert.equal(after.sourceId,'B08');assert.equal(after.instructions,catalog.find(item=>item.id==='B08').instructions);
  assert.deepEqual(after.components.activities,before.components.activities);
  for(const key of ['id','minutes','section','delivery','rotation','frameworkPrompt'])assert.equal(after[key],before[key]);
  t.action('undo',-1);assert.deepEqual(state().plan.blocks[index],before);
});
function componentActivityHarness(blockIndex) {
  const components=ctx.window.GRINDSTONE_COMPONENTS,original=components.bind;let bridge;
  components.bind=function(element,options){bridge=options;return original(element,options);};
  try {api.bind(root);} finally {components.bind=original;}
  const listeners={},container={dataset:{},querySelectorAll(){return[];},querySelector(){return null;},addEventListener(name,listener){listeners[name]=listener;}};
  original(container,bridge);
  const host={dataset:{componentBlock:String(blockIndex)},querySelectorAll(){return[];},querySelector(){return{innerHTML:''};}};
  function element(activityIndex,dataset,value='') {
    const nodes=new Map(),card={dataset:{activityIndex:String(activityIndex)},querySelector(selector){if(!nodes.has(selector))nodes.set(selector,{hidden:false,textContent:''});return nodes.get(selector);}};
    return {dataset,value,validity:{valid:true},closest(selector){return selector==='[data-component-block]'?host:selector==='[data-activity-index]'?card:null;}};
  }
  return {
    input(index,key,value){listeners.input({target:element(index,{activityField:key},value)});},
    click(index,action){const button=element(index,{componentAction:action});listeners.click({target:{closest(){return button;}}});}
  };
}
check('activity edits, reordering and removal preserve the parent and restore reminders when no work remains',()=>{
  resetCase('age=7-10');field('framework','hour');t.action('framework',-1);
  const index=2;picker('destination',state().plan.blocks[index].id);appendSource('move','B17');appendSource('move','B07');
  const before=state().plan.blocks[index],h=componentActivityHarness(index);
  h.input(0,'name','Stand-up partner turns');h.input(0,'task','Two turns each, then switch partners.');h.input(0,'cues','Hands first.\nFace your partner.');
  const edited=state().plan.blocks[index];
  assert.equal(edited.components.activities[0].name,'Stand-up partner turns');
  assert.equal(edited.components.activities[0].task,'Two turns each, then switch partners.');
  assert.equal(edited.components.activities[0].cues,'Hands first.\nFace your partner.');
  assert.deepEqual(edited.components.activities[0].guide,before.components.activities[0].guide);
  h.click(1,'activity-up');assert.deepEqual(state().plan.blocks[index].components.activities.map(item=>item.guide.sourceId),['B07','B17']);
  h.click(0,'activity-down');assert.deepEqual(state().plan.blocks[index].components.activities.map(item=>item.guide.sourceId),['B17','B07']);
  for(const key of ['minutes','id','instructions','cues','frameworkPrompt'])assert.equal(state().plan.blocks[index][key],before[key]);
  t.action('save',-1);
  const imported=t.parseImport(JSON.stringify({format:'grindstone-practice',version:1,plan:state().plan}));
  assert.equal(imported.blocks[index].components.activities[0].task,'Two turns each, then switch partners.');
  for(const full of [false,true]) {
    const printed=t.printHtml(full);assert(printed.includes('Two turns each, then switch partners.'));
    assert(printed.includes('Hands first.'));assert(printed.includes('component-shared-time'));
  }
  h.click(1,'activity-remove');assert.equal(state().plan.blocks[index].components.activities.length,1);assert.equal(t.unfilledSlots().length,4);
  h.input(0,'task',' ');assert.equal(t.unfilledSlots().length,5,'An empty activity cannot fulfill a generic slot');
  h.input(0,'task','One cooperative turn each.');assert.equal(t.unfilledSlots().length,4);
  h.click(0,'activity-remove');assert.equal(state().plan.blocks[index].components.activities.length,0);assert.equal(t.unfilledSlots().length,5);
  t.action('undo',-1);assert.equal(state().plan.blocks[index].components.activities[0].task,'One cooperative turn each.');assert.equal(t.unfilledSlots().length,4);
});
check('legacy whole-series guides overlap subsets while distinct explicit selections remain separate',()=>{
  resetCase('age=7-10');const components=ctx.window.GRINDSTONE_COMPONENTS,item=catalog.find(guide=>guide.id==='series:S24'),full=t.blockFrom(item,'series');
  let raw=state().plan;raw.blocks=[full];t.replaceDraft(raw);picker('destination',state().plan.blocks[0].id);
  picker('type','series');picker('selected','series:S24');stageMainSkills([0]);const before=JSON.stringify(state().plan);t.action('append',-1);
  assert.equal(JSON.stringify(state().plan),before);assert(state().placementError);
  const manual=t.blockFrom(null,'custom'),withWhole=components.appendActivity(manual,full);
  raw=state().plan;raw.blocks=[withWhole];t.replaceDraft(raw);picker('destination',state().plan.blocks[0].id);
  picker('selected','series:S24');stageMainSkills([1]);const addedBefore=JSON.stringify(state().plan);t.action('append',-1);
  assert.equal(JSON.stringify(state().plan),addedBefore);assert(state().placementError);
  const foundation=pathway.series.find(guide=>guide.id==='S24'),subset=components.selectSeries(full,[components.testing.branchKey(foundation.branches[0])],catalog);
  const withSubset=components.appendActivity(manual,subset);
  assert.throws(()=>components.appendActivity(withSubset,full),/already|overlap|duplicate/i);
});
check('activity edits and controls cannot change completed records or discard invalid visible numbers',()=>{
  resetCase();addSource('move','P01');picker('destination',state().plan.blocks[0].id);appendSource('move','P02');
  const h=componentActivityHarness(0),before=JSON.stringify(state().plan),query=root.querySelector.bind(root);
  root.querySelector=selector=>selector==='input:invalid, select:invalid, textarea:invalid'?{focus(){},reportValidity(){}}:query(selector);
  h.click(0,'activity-remove');assert.equal(JSON.stringify(state().plan),before);root.querySelector=query;
  root.listeners.input({target:{dataset:{handoffField:'taught'},value:'Practiced the selected work.'}});t.completePlan();
  const complete=JSON.stringify(state().plan);h.input(0,'task','Bad edit');h.click(0,'activity-remove');assert.equal(JSON.stringify(state().plan),complete);
});

console.log('\n' + checks + ' builder checks passed. No files written.');
