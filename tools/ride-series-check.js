/* Read-only runtime checks: node tools/ride-series-check.js.
   URL checks establish direct source shape/provenance, not playback or footage review. */
'use strict';
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const base = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(base, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script defer src="([^"?]+)(?:\?[^\"]*)?"/g)].map(match => match[1]);
const values = new Map();
const context = {window: {addEventListener() {}, localStorage: {getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value)}, confirm: () => true}, document: {addEventListener() {}}, URL, URLSearchParams, console, Blob, setTimeout};
vm.createContext(context);
for (const file of scripts.filter(file => file !== 'app.js')) vm.runInContext(fs.readFileSync(path.join(base, file), 'utf8'), context, {filename: file});
const w = context.window, builder = w.GRINDSTONE_BUILDER, b = builder.testing, components = w.GRINDSTONE_COMPONENTS;
const plain = value => JSON.parse(JSON.stringify(value));
const catalog = b.normalizeCatalog(), byId = new Map(catalog.map(item => [item.id, item]));
function checkRide(moduleName, seriesId, scriptFile, label, expectedPosition = 'top') {
const moduleData = w['GRINDSTONE_SERIES_' + moduleName];
assert(moduleData, label + ' module must be loaded by the actual page');
const series = w.GRINDSTONE_PATHWAY.series.find(item => item.id === seriesId);
assert(series, label + ' series must reach the shared pathway');
const item = byId.get('series:' + series.id);
const canonical = id => byId.has(id) ? id : byId.has('kyle:' + id) ? 'kyle:' + id : byId.has('facebook:' + id) ? 'facebook:' + id : id;
const seriesMoveIds = new Set([...series.move_ids, ...series.members.map(member => member.move_id)].map(canonical));
const seriesMoves = moduleData.moves.filter(move => seriesMoveIds.has(canonical(move.id)));
const foundationIds = series.members.filter(member => /^foundation$/i.test(member.role)).map(member => canonical(member.move_id));
const branchKey = components.testing.branchKey;
const expectedIds = branches => [...new Set([...foundationIds, ...branches.flatMap(branch => branch.move_ids.map(canonical))])];
let checks = 0;
function check(name, test) { test(); checks++; console.log('PASS ' + name); }
function text(value, label) { assert.equal(typeof value, 'string', label); assert(value.trim(), label); }
function sourceUrl(value) {
  const url = new URL(value);
  assert.equal(url.protocol, 'https:', 'Source must use HTTPS');
  assert(!url.username && !url.password, 'Source cannot contain credentials');
  assert(!/(?:^|\/)(?:results|search)(?:\/|$)/i.test(url.pathname), 'Use a concrete source, not search results');
  if (/(^|\.)youtube\.com$/.test(url.hostname)) {
    const id = url.pathname === '/watch' ? url.searchParams.get('v') : url.pathname.match(/^\/(?:shorts|embed)\/([^/]+)/)?.[1];
    assert(/^[\w-]{11}$/.test(id || ''), 'YouTube source must identify a specific video');
  }
  if (url.hostname === 'youtu.be') assert(/^\/[\w-]{11}$/.test(url.pathname), 'Short link must identify a specific video');
}

check(label + ' loads before move and series integration, without duplicate IDs', () => {
  assert(scripts.indexOf(scriptFile) >= 0);
  for (const file of ['series-library.js', 'series-expansion.js']) assert(scripts.indexOf(scriptFile) < scripts.indexOf(file));
  assert.equal(byId.size, catalog.length);
  const ids = [...w.GRINDSTONE_PATHWAY.series, ...w.GRINDSTONE_PATHWAY.sequences].map(value => value.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(w.GRINDSTONE.moves.filter(move => moduleData.moves.some(source => source.id === move.id)).length, moduleData.moves.length);
});

check(label + ' has a reusable foundation and distinct choices', () => {
  assert(item && foundationIds.length);
  assert(series.branches.length >= 2, 'A single turn is not a reaction series');
  assert.equal(new Set(series.branches.map(branchKey)).size, series.branches.length);
  assert(new Set(series.branches.map(branch => [...branch.move_ids].sort().join(','))).size >= 2, 'Options must resolve to distinct teaching guides');
  for (const field of ['foundation', 'setup', 'readiness', 'boundaries', 'verification']) text(series[field], field);
  if (moduleName === 'WESTERN') assert(moduleData.moves.some(move => /(?:3\s*\/\s*4|three.quarter|¾)/i.test(move.name) && /stack/i.test(move.name)), 'The requested 3/4 nelson stack needs its own guide');
  for (const branch of series.branches) {
    for (const field of ['title', 'when', 'action', 'readiness']) text(branch[field], 'Branch ' + field);
    assert(branch.move_ids.length);
    for (const id of branch.move_ids) assert(byId.has(canonical(id)), 'Missing branch guide ' + id);
  }
});

for (const move of seriesMoves) check(move.id + ' is a complete standalone guide with source provenance and searchable series tags', () => {
  const guide = byId.get(move.id), tags = w.GRINDSTONE_CATALOG_TAGS.resolve(move.id);
  assert(guide && tags);
  assert.equal(guide.setup, move.setup, move.id + ' must retain its exact starting configuration in the builder');
  assert(move.steps.length >= 4 && move.cues.length);
  for (const field of ['purpose', 'prerequisite', 'setup', 'drill', 'boundary', 'error', 'fix', 'verification']) text(move[field], move.id + ' ' + field);
  assert(move.sources.length);
  if (move.video?.url) {
    sourceUrl(move.video.url);
    text(move.video.note, 'Video scope');
    assert.equal(guide.video, move.video.url);
  } else {
    assert.equal(move.video, null, 'A written-only lesson must explicitly omit a video');
    assert.equal(guide.video, '', 'No unrelated demonstration may fill a written-only lesson');
    assert(!w.GRINDSTONE.videos[move.id]?.video, 'The library must not invent a video');
    const links = components.testing.trustedLinks(components.testing.snapshot(guide), catalog);
    assert(!links.includes('Watch source video'));
    assert(links.includes('#move/' + move.id), 'Written-only lessons still link to their full guide');
  }
  for (const source of move.sources) { sourceUrl(source.url); text(source.title, 'Source title'); }
  assert.equal(guide.path, '#move/' + move.id);
  assert(tags.memberships.some(membership => membership.id === series.id));
  for (const key of ['positions', 'purposes', 'uses', 'age_groups']) assert.deepEqual(plain(tags[key]), plain(move[key]), move.id + ' ' + key);
  assert(tags.positions.includes(expectedPosition));
  assert(!tags.age_groups.includes('4-6'), 'This ride/turn collection is not a default Pup lesson');
  assert(tags.searchText.includes(series.title.toLowerCase()));
  assert(tags.age_groups.length && guide.readiness, 'Age does not replace explicit readiness');
});

for (const branch of series.branches) check('selecting ' + branch.title + ' includes only its moves and the foundation with teaching context', () => {
  const selected = components.selectSeries(b.blockFrom(item, 'series'), [branchKey(branch)], catalog);
  const snapshot = JSON.stringify(selected);
  const guides = components.expandedGuides(selected, catalog);
  assert.deepEqual(plain(guides.map(guide => guide.id)), expectedIds([branch]));
  assert.equal(JSON.stringify(selected), snapshot, 'Expansion must not mutate a saved selection');
  for (const guide of guides) {
    assert(guide.steps.length && guide.instructions.includes(series.foundation));
    assert(guide.readiness.includes(series.readiness));
    assert(guide.boundary.includes(series.boundaries));
    assert(guide.sourceNote.includes(series.verification));
    if (branch.move_ids.map(canonical).includes(guide.id)) assert(guide.readiness.includes(branch.readiness));
  }
});

let branchFields = [], root;
function mount() {
  builder.render(new URLSearchParams());
  const nodes = new Map(), listeners = {};
  root = {dataset: {}, listeners,
    querySelector(selector) {
      if (selector === 'input:invalid, select:invalid, textarea:invalid' || selector === '[data-week-content]') return null;
      if (!nodes.has(selector)) nodes.set(selector, {innerHTML: '', textContent: '', value: '', checked: false, disabled: false, hidden: false, focus() {}});
      return nodes.get(selector);
    },
    querySelectorAll(selector) { return selector === '[data-component-branch="picker"]' ? branchFields : []; },
    addEventListener(name, handler) { listeners[name] = handler; }
  };
  builder.bind(root);
}
function picker(key, value) { root.listeners.change({target: {dataset: {picker: key}, type: 'select-one', value}}); }
function state() { return plain(b.getState()); }
function total(plan) { return plan.blocks.reduce((sum, block) => sum + block.minutes, 0); }
b.reset(); values.clear(); mount();
const slot = b.blockFrom(null, 'custom');
slot.name = ''; slot.minutes = 12.5; slot.section = 'teach';
const beforeWater = b.blockFrom(null, 'water'), afterWater = b.blockFrom(null, 'water');
const draft = b.newPlan();
Object.assign(draft, {age: series.age_groups[0], target: 60, blocks: [beforeWater, slot, afterWater]});
b.replaceDraft(draft);
picker('destination', state().plan.blocks[1].id);
picker('type', 'series'); picker('selected', item.id);
branchFields = series.branches.map(branch => ({value: branchKey(branch), checked: true}));
const before = state().plan;
check(label + ' options prepare separate blocks without mutating the plan or increasing its slot time', () => {
  b.action('add', -1);
  const current = state(), pending = current.pendingReplacement;
  assert(pending?.blocks, current.placementNotice || 'Expected a split review');
  assert.deepEqual(current.plan, before);
  assert.equal(pending.kept, false);
  assert.deepEqual(pending.blocks.map(block => block.sourceId), expectedIds(series.branches));
  assert.equal(pending.blocks.reduce((sum, block) => sum + block.minutes, 0), slot.minutes);
  assert(pending.blocks.every(block => block.minutes >= 0.5 && Number.isInteger(block.minutes * 2)));
  assert.equal(new Set(pending.blocks.map(block => block.sourceId)).size, pending.blocks.length);
});
check(label + ' blocks preserve neighboring work, instructions, readiness and exact practice timing', () => {
  b.action('confirm-replace', -1);
  const plan = state().plan, split = plan.blocks.slice(1, -1);
  assert.deepEqual(plan.blocks[0], before.blocks[0]);
  assert.deepEqual(plan.blocks.at(-1), before.blocks.at(-1));
  assert.equal(total(plan), total(before));
  assert.equal(plan.target, before.target);
  assert.deepEqual(split.map(block => block.sourceId), expectedIds(series.branches));
  assert.equal(new Set(plan.blocks.map(block => block.id)).size, plan.blocks.length);
  for (const block of split) {
    assert.equal(block.type, 'move'); assert(!block.components?.series);
    assert(block.instructions.includes(series.foundation)); assert(block.readiness.includes(series.readiness));
    assert(block.boundary.includes(series.boundaries)); assert(block.sourceNote.includes(series.verification));
    assert.equal(block.section, slot.section); assert.equal(block.timingConfirmed, false);
  }
  const imported = b.parseImport(JSON.stringify({format: 'grindstone-practice', version: plan.version, plan}));
  assert.deepEqual(plain(imported.blocks), plan.blocks, 'Separate guides and timing survive JSON export/import');
  const print = b.printHtml(true);
  for (const block of split) assert(print.includes(b.esc(block.name)), 'Print includes each move');
});
check('coaches can insert water between the new moves, reorder and undo without losing instruction', () => {
  const prior = state().plan;
  b.action('water-after', 1);
  const waterPlan = state().plan;
  assert.equal(waterPlan.blocks[2].type, 'water');
  assert.equal(total(waterPlan), total(prior) + 2);
  assert.deepEqual(waterPlan.blocks[1], prior.blocks[1]);
  assert.deepEqual(waterPlan.blocks[3], prior.blocks[2]);
  b.action('down', 1);
  assert.deepEqual(state().plan.blocks[2], prior.blocks[1]);
  b.action('undo', -1); assert.deepEqual(state().plan, waterPlan);
});
check('new reaction links retain valid actor-aware navigation in both directions', () => {
  const ids = new Set(seriesMoves.map(move => move.id));
  const links = w.GRINDSTONE_REACTIONS.links.filter(link => ids.has(link.from) || ids.has(link.to));
  assert(links.length, label + ' choices need reaction/continuation navigation');
  for (const link of links) {
    assert(byId.has(canonical(link.from)) && byId.has(canonical(link.to)));
    assert(['continuation', 'response'].includes(link.kind));
    text(link.condition, 'Forward condition'); text(link.reverse, 'Reverse condition');
    const forward = w.GRINDSTONE_REACTIONS.resolve(link.from), reverse = w.GRINDSTONE_REACTIONS.resolve(link.to);
    assert(forward[link.kind === 'response' ? 'responses' : 'nextOptions'].some(item => item.id === canonical(link.to)));
    assert(reverse[link.kind === 'response' ? 'answers' : 'buildsFrom'].some(item => item.id === canonical(link.from)));
  }
});
if (moduleName === 'LEG_ESCAPES') check(label + ' is an opponent response rather than the rider continuing their own attack', () => {
  const attackIds = new Set([...w.GRINDSTONE_SERIES_LEG_ONE.moves, ...w.GRINDSTONE_SERIES_LEG_TWO.moves].map(move => move.id));
  const answerIds = new Set(seriesMoves.map(move => move.id));
  const responses = w.GRINDSTONE_REACTIONS.links.filter(link => attackIds.has(link.from) && answerIds.has(link.to));
  assert(responses.length, 'An established-ride escape needs navigation from its attacking position');
  for (const link of responses) {
    assert.equal(link.kind, 'response', link.from + ' to ' + link.to + ' changes the acting wrestler');
    assert(byId.get(link.from).positions.includes('top'));
    assert(byId.get(link.to).positions.includes('bottom'));
  }
});
check(label + ' rejects a slot too short for its guides without losing work, then accepts the minimum', () => {
  b.reset(); values.clear(); mount();
  const minimum = expectedIds(series.branches).length * 0.5;
  const shortSlot = b.blockFrom(null, 'custom');
  shortSlot.name = ''; shortSlot.minutes = minimum - 0.5; shortSlot.section = 'teach';
  const testPlan = b.newPlan();
  Object.assign(testPlan, {age: series.age_groups[0], target: 60, blocks: [b.blockFrom(null, 'water'), shortSlot, b.blockFrom(null, 'water')]});
  b.replaceDraft(testPlan);
  picker('destination', shortSlot.id); picker('type', 'series'); picker('selected', item.id);
  branchFields = series.branches.map(branch => ({value: branchKey(branch), checked: true}));
  const original = state().plan;
  b.action('add', -1);
  assert.equal(state().pendingReplacement, null);
  assert(state().placementError);
  assert.deepEqual(state().plan, original);
  const enough = plain(original); enough.blocks[1].minutes = minimum;
  b.replaceDraft(enough);
  b.action('add', -1);
  assert(state().pendingReplacement?.blocks);
  assert(state().pendingReplacement.blocks.every(block => block.minutes === 0.5));
  assert.deepEqual(state().plan, enough, 'Review alone must not replace the selected slot');
  b.action('confirm-replace', -1);
  const accepted = state().plan;
  assert.equal(total(accepted), total(enough)); assert.equal(accepted.target, enough.target);
  assert.deepEqual(accepted.blocks[0], enough.blocks[0]);
  assert.deepEqual(accepted.blocks.at(-1), enough.blocks.at(-1));
  assert.deepEqual(accepted.blocks.slice(1, -1).map(block => block.sourceId), expectedIds(series.branches));
  b.action('undo', -1); assert.deepEqual(state().plan, enough);
});
check(label + ' remains searchable in both pickers and keeps explicit teaching groups', () => {
  b.reset(); values.clear(); mount();
  const foundation = byId.get(foundationIds[0]);
  const searches = [[foundation, foundation.aliases[0] || foundation.title], [item, series.title]];
  for (const [guide, search] of searches) {
    const station = components.testing.stationPicker({}); station.search = search;
    picker('search', search);
    for (const age of series.age_groups) {
      const current = b.newPlan(); current.age = age; b.replaceDraft(current);
      assert(b.catalogMatches(guide), guide.id + ' main picker for ' + age);
      assert(components.testing.stationMatches(guide, station, age), guide.id + ' station picker for ' + age);
    }
    const pups = b.newPlan(); pups.age = '4-6'; b.replaceDraft(pups);
    assert(!b.catalogMatches(guide), guide.id + ' must not silently appear for Pups');
    assert(!components.testing.stationMatches(guide, station, '4-6'));
  }
});
if (moduleName === 'LEG_ONE') check('one-leg goals and linked-guide demonstrations retain the playable creator page', () => {
  assert(byId.get('N66').purposes.includes('breakdown'));
  for (const id of ['N67', 'N68']) assert(byId.get(id).purposes.includes('turn'));
  for (const id of ['N66', 'N67', 'N68']) assert(!byId.get(id).purposes.includes('pin'));
  const creatorPage = 'https://attackstylewrestling.com/leg-riding-series/';
  for (const id of ['N66', 'N67']) {
    const guide = byId.get(id); assert.equal(guide.video, creatorPage);
    const linkedGuide = components.testing.guideHtml(components.testing.snapshot(guide), catalog, true);
    assert(linkedGuide.includes('href="' + creatorPage + '"'), 'Linked guide and component print markup use the playable page');
    assert(!linkedGuide.includes('href="https://player.vimeo.com/video/473939084'));
    const testPlan = b.newPlan(); testPlan.blocks = [b.blockFrom(guide, 'move')]; b.replaceDraft(testPlan);
    for (const full of [false, true]) {
      const printed = b.printHtml(full);
      assert(!printed.includes('href="https://player.vimeo.com/video/473939084'), 'Do not print the privacy-blocked direct player');
    }
  }
});
console.log(checks + ' ' + label + ' runtime checks passed. Source URL checks do not claim video playback review.');
}
checkRide('WESTERN', 'S43', 'series-western.js', 'Western ride');
if (fs.existsSync(path.join(base, 'series-navy.js'))) checkRide('NAVY', 'S44', 'series-navy.js', 'Navy ride');
checkRide('LEG_ONE', 'S45', 'series-leg-one.js', 'One-leg ride');
checkRide('LEG_TWO', 'S46', 'series-leg-two.js', 'Two-leg ride');
checkRide('LEG_ESCAPES', 'S47', 'series-leg-escapes.js', 'One-leg ride escapes', 'bottom');
checkRide('LEG_ESCAPES', 'S48', 'series-leg-escapes.js', 'Two-leg ride escapes', 'bottom');
