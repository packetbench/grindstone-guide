/* Read-only VM regression checks: node tools/weeks-check.js */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert');
const base = path.resolve(__dirname, '..');
const plain = value => JSON.parse(JSON.stringify(value));
const files = ['data.js', 'game-video-fixes.js', 'kyle-data.js', 'kyle-instruction-data.js', 'video-additions.js', 'game-guides-a.js', 'game-guides-b.js', 'game-guides-c.js', 'game-guide-library.js', 'move-tags.js', 'series-moves.js', 'series-bottom.js', 'series-neutral.js', 'series-top.js', 'series-escapes.js', 'series-foundation.js', 'series-library.js', 'practice-frameworks.js', 'pathway-data.js', 'series-expansion.js', 'practice-weeks.js', 'practice-builder.js'];
const sources = files.map(file => [file, fs.readFileSync(path.join(base, file), 'utf8')]);
function node() {
  const nodes = new Map(), listeners = {};
  return { dataset: {}, listeners, innerHTML: '', textContent: '', value: '', checked: false, disabled: false, hidden: false, focus() {},
    querySelector(selector) { if (selector === ':invalid' || selector === 'input:invalid, select:invalid, textarea:invalid') return this.invalidControl || null; if (!nodes.has(selector)) nodes.set(selector, node()); return nodes.get(selector); },
    querySelectorAll(selector) { return selector === '[data-plan-edit]' ? [this.querySelector('fieldset-plan'), this.querySelector('fieldset-handoff')] : []; },
    addEventListener(name, fn) { listeners[name] = fn; }
  };
}
function setup() {
  const values = new Map(), writes = [], downloads = [];
  let failedWrites = false, allowConfirm = true;
  const storage = { getItem: key => values.get(key) || null, setItem: (key, value) => { if (failedWrites) throw Error('Quota exceeded'); values.set(key, value); writes.push(key); } };
  const mockURL = class extends URL {};
  mockURL.createObjectURL = blob => { downloads.push(blob); return 'blob:test'; };
  mockURL.revokeObjectURL = () => {};
  const ctx = { window: { localStorage: storage, confirm: () => allowConfirm, setTimeout: () => {}, print() {} }, URL: mockURL, URLSearchParams, console, Blob, setTimeout: () => {}, document: { createElement: () => ({ click() {} }) } };
  for (const [file, source] of sources) vm.runInNewContext(source, ctx, { filename: file });
  const builder = ctx.window.GRINDSTONE_BUILDER, b = builder.testing, week = ctx.window.GRINDSTONE_WEEKS.testing;
  let root, host;
  function mount() { builder.render(new URLSearchParams()); root = node(); builder.bind(root); host = root.querySelector('[data-week-content]'); }
  function reload() { b.reset(); week.reset(); mount(); }
  mount();
  const state = () => plain(b.getState());
  const weeks = () => plain(week.getState());
  const current = () => { const s = weeks(); return s.weeks.find(w => w.id === s.current); };
  const field = (key, value) => root.listeners.input({ target: { dataset: { planField: key }, value, validity: { valid: true } } });
  const handoff = (key, value) => root.listeners.input({ target: { dataset: { handoffField: key }, value, validity: { valid: true } } });
  const weekField = (key, value) => host.listeners.input({ target: { dataset: { weekField: key }, value, validity: { valid: true }, setCustomValidity() {}, reportValidity() {} } });
  const select = id => host.listeners.change({ target: { value: id, matches: selector => selector === '[data-week-select]' } });
  function makeWeek(lane = 'mat-rats') { week.act('new'); weekField('lane', lane); weekField('weekOf', '2026-10-26'); weekField('focus', 'Sit-out foundation'); weekField('cue', 'Hands first; clear the hips'); weekField('outcome', 'Recognize two responses'); weekField('owner', 'Coach Test'); return current(); }
  function populate(name = 'Practice A') { const p = state().plan; p.name = name; p.blocks = [b.blockFrom(null, 'custom')]; p.blocks[0].name = 'Partner response practice'; p.blocks[0].instructions = 'Start in the base. Partner gives one practiced response.'; b.replaceDraft(p); }
  async function importWeek(value, size) { const text = typeof value === 'string' ? value : JSON.stringify(value); await host.listeners.change({ target: { matches: selector => selector === '[data-week-import]', files: [{ size: size ?? text.length, text: async () => text }] } }); }
  return { values, writes, downloads, b, week, weekApi: ctx.window.GRINDSTONE_WEEKS, state, weeks, current, reload, field, handoff, weekField, select, makeWeek, populate, importWeek, render: params => builder.render(new URLSearchParams(params)), fail: value => { failedWrites = value; }, confirm: value => { allowConfirm = value; }, root: () => root, html: () => host.innerHTML };
}
let checks = 0, failures = 0;
async function check(name, fn) { try { await fn(setup()); checks++; console.log('PASS ' + name); } catch (error) { failures++; console.error('FAIL ' + name + '\n' + error.stack); } }
async function main() {
  await check('weekly organization is optional and does not mutate the current builder practice', h => {
    h.populate(); const before = h.state(); h.makeWeek();
    assert.deepStrictEqual(h.state(), before); assert.equal(h.current().sessions.length, 0);
    assert(h.html().includes('only in this browser')); assert(h.html().includes('never merges changes automatically'));
  });
  await check('Blue and Black share focus with five independent, empty, dated sessions', h => {
    h.makeWeek(); h.week.act('suggest'); const sessions = h.current().sessions;
    assert.deepStrictEqual(sessions.map(s => s.plan.program), ['black', 'blue', 'black', 'blue', 'black']);
    assert.deepStrictEqual(sessions.map(s => s.plan.date), ['2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30']);
    assert.deepStrictEqual(sessions.map(s => s.plan.session), ['core-a', 'core-a', 'core-b', 'core-b', 'extension']);
    assert.equal(new Set(sessions.map(s => s.id)).size, 5);
    for (const { plan } of sessions) { assert.equal(plan.target, 120); assert.equal(plan.startTime, '18:00'); assert.equal(plan.focus, 'Sit-out foundation'); assert.equal(plan.weekContext.cue, 'Hands first; clear the hips'); assert.equal(plan.blocks.length, 0); }
  });
  await check('Pups and Valkyries have separate program schedules and practice lengths', h => {
    h.makeWeek('pups'); h.week.act('suggest'); const pups = h.current().sessions;
    assert.equal(pups.length, 1); assert.equal(pups[0].plan.age, '4-6'); assert.equal(pups[0].plan.target, 60); assert.equal(pups[0].plan.date, '2026-10-27');
    h.makeWeek('valkyries'); h.week.act('suggest'); const valk = h.current().sessions;
    assert.deepStrictEqual(valk.map(s => s.plan.date), ['2026-10-26', '2026-10-28', '2026-10-30']);
    assert(valk.every(s => s.plan.program === 'valkyries' && s.plan.target === 90 && s.plan.startTime === '18:30' && s.plan.age === ''));
    assert.equal(h.weeks().weeks[0].sessions.length, 1);
  });
  await check('a full allowed weekly focus stays valid in suggested sessions and after reload', h => {
    h.makeWeek(); h.weekField('focus', 'x'.repeat(1000)); h.week.act('suggest');
    for (const s of h.current().sessions) { h.b.cleanPlan(s.plan); assert.equal(s.plan.focus.length, 500); assert.equal(s.plan.weekContext.focus.length, 1000); }
    h.week.cleanWeek(h.current(), h.b.cleanPlan); h.reload(); assert.equal(h.weeks().readable, true); assert.equal(h.weeks().weeks[0].sessions.length, 5);
  });
  await check('editing shared focus never silently changes saved sessions; explicit application changes one', h => {
    h.makeWeek(); h.week.act('suggest'); const first = h.current().sessions[0], second = h.current().sessions[1];
    h.week.act('open', first.id); h.weekField('focus', 'New coach focus');
    assert.equal(h.state().plan.focus, 'Sit-out foundation'); assert.equal(h.current().sessions[0].plan.focus, 'Sit-out foundation');
    h.week.act('focus'); assert.equal(h.state().plan.focus, 'New coach focus'); assert.equal(h.current().sessions[0].plan.focus, 'Sit-out foundation');
    h.week.act('update'); assert.equal(h.current().sessions[0].plan.focus, 'New coach focus'); assert.deepStrictEqual(h.current().sessions[1], second);
  });
  await check('session draft edits require explicit save and cannot alias another session', h => {
    h.makeWeek(); h.week.act('suggest'); const [first, second] = h.current().sessions;
    h.week.act('open', first.id); h.populate('Monday adjustments'); h.week.act('update');
    const saved = plain(h.current().sessions[0]); h.field('notes', 'Uncommitted coaching edit');
    assert.deepStrictEqual(h.current().sessions[0], saved); assert.deepStrictEqual(h.current().sessions[1], second);
    h.week.act('open', second.id); h.populate('Tuesday options'); h.week.act('update'); assert.deepStrictEqual(h.current().sessions[0], saved);
    h.reload(); assert.equal(h.weeks().weeks[0].sessions[1].plan.name, 'Tuesday options');
  });
  await check('adding a named practice creates an independent planned session and builder copy', h => {
    h.populate('Named base'); h.field('focus', 'Practice-specific focus'); h.b.action('save'); const original = h.state().saved[0];
    h.makeWeek(); h.week.act('add'); const copied = h.state().plan;
    assert.equal(copied.id, ''); assert.equal(copied.parentId, original.id); assert.equal(copied.focus, original.focus);
    assert.equal(copied.weekContext.focus, 'Sit-out foundation'); assert.deepStrictEqual(h.current().sessions[0].plan, copied);
    assert.deepStrictEqual(h.state().saved[0], original); assert(h.html().includes('keeps its own focus'));
    h.field('name', 'Week-specific version'); h.b.action('save'); h.week.act('update');
    assert.equal(h.state().saved.length, 2); assert.deepStrictEqual(h.state().saved[0], original);
    assert.notEqual(h.current().sessions[0].plan.id, original.id); assert.equal(h.current().sessions[0].plan.name, 'Week-specific version');
  });
  await check('adding a blank-focus practice preserves the focus until explicitly applied', h => {
    h.makeWeek(); h.populate(); h.week.act('add'); assert.equal(h.state().plan.focus, ''); assert.equal(h.current().sessions[0].plan.focus, '');
    assert.equal(h.state().plan.weekContext.focus, 'Sit-out foundation'); h.week.act('focus'); assert.equal(h.state().plan.focus, 'Sit-out foundation');
    assert.equal(h.current().sessions[0].plan.focus, ''); h.week.act('update'); assert.equal(h.current().sessions[0].plan.focus, 'Sit-out foundation');
  });
  await check('applying shared focus preserves an invalid visible edit until the coach corrects it', h => {
    h.makeWeek(); h.populate(); h.week.act('add'); h.weekField('focus', 'New foundation');
    const before = h.state().plan, attachment = h.weeks().attachment, bytes = h.values.get(h.b.keys.draft);
    let focused = 0, reported = 0;
    const invalid = {value:'-5',focus(){ focused++; },reportValidity(){ reported++; }}; h.root().invalidControl = invalid;
    h.week.act('focus'); assert.deepStrictEqual(h.state().plan, before); assert.deepStrictEqual(h.weeks().attachment, attachment);
    assert.equal(h.values.get(h.b.keys.draft), bytes); assert.equal(invalid.value, '-5'); assert.equal(focused, 1); assert.equal(reported, 1);
    h.root().invalidControl = null; h.week.act('focus'); assert.equal(h.state().plan.focus, 'New foundation'); assert.deepStrictEqual(h.weeks().attachment, attachment);
  });
  await check('attachment captures are independent and restore only existing week sessions', h => {
    h.makeWeek(); h.populate(); h.week.act('add'); const expected = h.weeks().attachment;
    const snapshot = h.weekApi.captureAttachment(); snapshot.sessionId = 'tampered'; assert.deepStrictEqual(h.weeks().attachment, expected);
    h.makeWeek('pups'); assert.equal(h.weeks().attachment, null);
    assert.equal(h.weekApi.restoreAttachment(expected), true); assert.equal(h.weeks().current, expected.weekId); assert.deepStrictEqual(h.weeks().attachment, expected);
    assert.equal(h.weekApi.restoreAttachment({weekId:expected.weekId,sessionId:'missing'}), false); assert.equal(h.weeks().attachment, null);
    h.weekApi.restoreAttachment(expected); h.week.act('remove-session', expected.sessionId);
    assert.equal(h.weekApi.restoreAttachment(expected), false); assert.equal(h.weeks().attachment, null);
  });
  await check('undoing a block edit keeps the active week session and allows saving back', h => {
    h.makeWeek(); h.populate(); h.week.act('add'); const attachment = h.weeks().attachment;
    h.b.action('remove', 0); h.b.action('undo'); assert.deepStrictEqual(h.weeks().attachment, attachment); assert.equal(h.state().plan.blocks.length, 1);
    h.field('notes', 'After undo'); h.week.act('update'); assert.equal(h.current().sessions[0].plan.notes, 'After undo');
  });
  await check('undoing a session switch restores the prior draft and its matching attachment', h => {
    h.makeWeek(); h.week.act('suggest'); const [first, second] = h.current().sessions;
    h.week.act('open', first.id); h.populate('First session edits'); const before = h.state().plan, attachment = h.weeks().attachment;
    h.week.act('open', second.id); assert.equal(h.weeks().attachment.sessionId, second.id);
    h.b.action('undo'); assert.deepStrictEqual(h.state().plan, before); assert.deepStrictEqual(h.weeks().attachment, attachment);
    h.week.act('update'); assert.equal(h.current().sessions[0].plan.name, 'First session edits'); assert.deepStrictEqual(h.current().sessions[1], second);
  });
  await check('completion requires actual teaching and preserves planned practice plus immutable snapshot', h => {
    h.b.action('complete'); assert.equal(h.state().saved.length, 0);
    h.populate(); h.b.action('complete'); assert.equal(h.state().saved.length, 0);
    h.b.action('save'); const planned = h.state().saved[0]; h.handoff('taught', 'Sit-out and turn-in'); h.handoff('revisit', 'Revisit hand control'); h.field('date', '2026-10-27'); h.b.action('complete');
    const completed = h.state().plan; assert.equal(completed.status, 'completed'); assert(completed.completedAt); assert.notEqual(completed.id, planned.id); assert.equal(completed.parentId, planned.id); assert.deepStrictEqual(h.state().saved[0], planned); assert.equal(h.state().saved.length, 2);
    h.field('name', 'Should not change'); h.handoff('taught', 'Should not change'); h.b.action('remove', 0); h.b.action('save'); h.b.action('complete');
    assert.deepStrictEqual(h.state().plan, completed); assert.equal(h.state().saved.length, 2); assert(h.root().querySelector('fieldset-plan').disabled);
  });
  await check('copying completed practice clears the new record and preserves the original', h => {
    h.populate(); h.handoff('taught', 'Taught foundation'); h.field('date', '2026-10-27'); h.field('revision', 'taught-v1'); h.b.action('complete'); const record = h.state().plan;
    h.b.action('duplicate'); const copy = h.state().plan; assert.equal(copy.status, 'planned'); assert.equal(copy.parentId, record.id); assert.notEqual(copy.id, record.id); assert.equal(copy.date, ''); assert.equal(copy.completedAt, ''); assert.equal(copy.revision, ''); assert(Object.values(copy.handoff).every(v => !v)); assert.deepStrictEqual(copy.blocks, record.blocks);
    h.field('name', 'Next lesson'); h.b.action('remove', 0); h.b.action('save'); assert.deepStrictEqual(h.state().saved.find(p => p.id === record.id), record);
  });
  await check('URL planning defaults cannot mutate a completed snapshot with no selected age', h => {
    h.populate(); h.handoff('taught', 'Foundation and first option'); h.b.action('complete'); const record = h.state().plan; assert.equal(record.age, '');
    h.render('age=11-14&program=black'); assert.deepStrictEqual(h.state().plan, record); assert.deepStrictEqual(h.state().saved[0], record);
  });
  await check('completed session saves once to its week and rejects later overwrites', h => {
    h.makeWeek(); h.populate(); h.week.act('add'); const sessionId = h.current().sessions[0].id; h.handoff('taught', 'Actually taught the partner response'); h.b.action('complete'); h.week.act('update');
    const original = plain(h.current().sessions[0]); assert.equal(original.plan.status, 'completed');
    h.b.action('duplicate'); h.field('name', 'Correction draft'); h.week.act('update'); assert.deepStrictEqual(h.current().sessions[0], original);
    h.week.act('open', sessionId); h.week.act('focus'); assert.equal(h.state().plan.status, 'completed');
    h.week.act('copy-session', sessionId); const next = h.current().sessions[1]; assert.equal(next.plan.status, 'planned'); assert.equal(next.plan.handoff.taught, ''); assert.notEqual(next.id, sessionId); assert.deepStrictEqual(h.current().sessions[0], original);
  });
  await check('adding a completed record preserves its original identity and teaching context', h => {
    h.populate(); h.handoff('taught', 'Original teaching'); h.b.action('complete'); const original = h.state().plan;
    h.makeWeek(); h.week.act('add'); assert.deepStrictEqual(h.current().sessions[0].plan, original); assert.deepStrictEqual(h.state().plan, original);
    assert.deepStrictEqual(h.state().saved[0], original); assert(h.html().includes('original teaching details preserved'));
  });
  await check('saving completed teaching to a week does not refresh its historical context', h => {
    h.makeWeek(); h.populate(); h.week.act('add'); h.handoff('taught', 'Original foundation'); h.b.action('complete'); const original = h.state().plan;
    h.weekField('focus', 'Next week focus'); h.weekField('cue', 'Changed after teaching'); h.week.act('update');
    assert.deepStrictEqual(h.current().sessions[0].plan, original); assert.deepStrictEqual(h.state().saved[0], original);
  });
  await check('copy week preserves source history and makes fresh independent planned sessions', h => {
    h.makeWeek(); h.populate(); h.handoff('taught', 'Group taught'); h.b.action('complete'); h.week.act('add'); h.weekField('revision', 'week-v2'); const original = h.current();
    h.week.act('copy'); const copy = h.current(); assert.notEqual(copy.id, original.id); assert.equal(copy.weekOf, ''); assert.equal(copy.revision, ''); assert.equal(copy.focus, original.focus); assert.equal(copy.owner, original.owner);
    const session = copy.sessions[0]; assert.notEqual(session.id, original.sessions[0].id); assert.equal(session.plan.status, 'planned'); assert.equal(session.plan.id, ''); assert.equal(session.plan.date, ''); assert.equal(session.plan.completedAt, ''); assert.equal(session.plan.weekContext.id, copy.id); assert(Object.values(session.plan.handoff).every(v => !v)); assert.deepStrictEqual(h.weeks().weeks[0], original);
  });
  await check('shared week import creates independent IDs without losing completed handoff evidence', async h => {
    h.makeWeek(); h.populate(); h.handoff('taught', 'Teach two responses'); h.handoff('revisit', 'Hand control next'); h.b.action('complete'); h.week.act('add'); const original = h.current();
    await h.importWeek({ format: 'grindstone-practice-week', version: 1, week: original }); const imported = h.current();
    assert.equal(h.weeks().weeks.length, 2); assert.notEqual(imported.id, original.id); assert.notEqual(imported.sessions[0].id, original.sessions[0].id); assert.equal(imported.sessions[0].plan.id, ''); assert.equal(imported.sessions[0].plan.weekContext.id, imported.id); assert.equal(imported.sessions[0].plan.status, 'completed'); assert.deepStrictEqual(imported.sessions[0].plan.handoff, original.sessions[0].plan.handoff); assert.deepStrictEqual(h.weeks().weeks[0], original);
  });
  await check('malformed or oversized week imports preserve both draft and stored week bytes', async h => {
    h.makeWeek(); h.populate(); h.week.act('add'); const before = h.state(), weekBytes = h.values.get(h.week.key);
    const invalid = ['{broken', '{}', { format: 'grindstone-practice-week', version: 2, week: h.current() }];
    const badPlan = { format: 'grindstone-practice-week', version: 1, week: plain(h.current()) }; badPlan.week.sessions[0].plan.blocks[0].minutes = -10; invalid.push(badPlan);
    const duplicate = { format: 'grindstone-practice-week', version: 1, week: plain(h.current()) }; duplicate.week.sessions.push(plain(duplicate.week.sessions[0])); invalid.push(duplicate);
    for (const value of invalid) { await h.importWeek(value); assert.deepStrictEqual(h.state(), before); assert.equal(h.values.get(h.week.key), weekBytes); assert(h.weeks().message.includes('Import stopped')); }
    await h.importWeek('{}', 12000001); assert.equal(h.values.get(h.week.key), weekBytes); assert.deepStrictEqual(h.state(), before);
  });
  await check('unreadable week storage is preserved and warnings remain after successful in-memory actions', h => {
    h.values.set(h.week.key, '{broken-original'); h.reload(); assert.equal(h.weeks().readable, false); h.makeWeek(); h.week.act('suggest');
    assert.equal(h.values.get(h.week.key), '{broken-original'); assert.equal(h.current().sessions.length, 5); assert(/unreadable|could not be read|preserved/i.test(h.html())); assert(/export/i.test(h.html()));
  });
  await check('failed week writes keep prior bytes and visible backup guidance after subsequent actions', h => {
    h.makeWeek(); const persisted = h.values.get(h.week.key); h.fail(true); h.week.act('suggest'); h.week.act('copy');
    assert.equal(h.values.get(h.week.key), persisted); assert.equal(h.weeks().weeks.length, 2); assert(/could not save|not saved|remain in this page/i.test(h.html())); assert(/export/i.test(h.html()));
  });
  await check('failed completed-record save never changes planned draft or named history', h => {
    h.populate(); h.handoff('taught', 'Actual teaching'); h.b.action('save'); const before = h.state(), bytes = h.values.get(h.b.keys.plans); h.fail(true); h.b.action('complete');
    assert.deepStrictEqual(h.state().plan, before.plan); assert.deepStrictEqual(h.state().saved, before.saved); assert.equal(h.values.get(h.b.keys.plans), bytes); assert.equal(h.state().plan.status, 'planned');
  });
  await check('unreadable named library cannot be replaced through completion', h => {
    h.values.set(h.b.keys.plans, '{original-corrupt'); h.reload(); h.populate(); h.handoff('taught', 'Actual teaching'); h.b.action('complete');
    assert.equal(h.values.get(h.b.keys.plans), '{original-corrupt'); assert.equal(h.state().plan.status, 'planned'); assert.equal(h.state().saved.length, 0);
  });
  await check('cancelled week open and deletes preserve draft and every saved session', h => {
    h.makeWeek(); h.week.act('suggest'); h.populate('Keep this draft'); const before = h.state(), original = h.current(); h.confirm(false); h.week.act('open', original.sessions[0].id); h.week.act('remove-session', original.sessions[0].id); h.week.act('remove-week');
    assert.deepStrictEqual(h.state(), before); assert.deepStrictEqual(h.current(), original); h.confirm(true); h.week.act('remove-week'); assert.deepStrictEqual(h.state(), before); assert.equal(h.weeks().weeks.length, 0);
  });
  await check('cancelled builder replacement keeps its active weekly session attachment', h => {
    h.makeWeek(); h.populate(); h.week.act('add'); h.field('notes', 'Edits still need saving to this session'); const attachment = h.weeks().attachment; h.confirm(false); h.b.action('new'); assert.deepStrictEqual(h.weeks().attachment, attachment);
    h.week.act('update'); assert.equal(h.current().sessions[0].plan.notes, 'Edits still need saving to this session');
  });
  await check('failed Save a copy keeps the active weekly session attachment and draft', h => {
    h.makeWeek(); h.populate(); h.week.act('add'); const attachment = h.weeks().attachment, before = h.state().plan; h.fail(true); h.b.action('duplicate'); assert.deepStrictEqual(h.weeks().attachment, attachment); assert.deepStrictEqual(h.state().plan, before);
  });
  await check('copy session and delete operate on the selected session, preserving neighbors', h => {
    h.makeWeek(); h.week.act('suggest'); const originals = h.current().sessions; h.week.act('copy-session', originals[1].id); assert.equal(h.current().sessions.length, 6); assert.deepStrictEqual(h.current().sessions.slice(0, 5), originals);
    h.week.act('remove-session', originals[1].id); assert.equal(h.current().sessions.length, 5); assert.deepStrictEqual(h.current().sessions.slice(0, 4), originals.filter((s, i) => i !== 1));
  });
  await check('week limit and session limit do not partially import or append data', async h => {
    h.makeWeek(); h.week.act('suggest'); for (let i = 0; i < 19; i++) h.week.act('copy-session', h.current().sessions[0].id); const full = h.current(); assert.equal(full.sessions.length, 24);
    h.week.act('copy-session', full.sessions[0].id); h.week.act('suggest'); h.week.act('add'); assert.deepStrictEqual(h.current(), full);
    for (let i = 1; i < 52; i++) h.week.act('new'); const bytes = h.values.get(h.week.key); await h.importWeek({ format: 'grindstone-practice-week', version: 1, week: full }); assert.equal(h.values.get(h.week.key), bytes); assert.equal(h.weeks().weeks.length, 52);
  });
  await check('handoff and shared context print as escaped text and survive reload', h => {
    h.makeWeek(); h.weekField('cue', '<script>cue</script>'); h.populate(); h.week.act('add'); h.week.act('focus'); h.handoff('taught', '<img src=x onerror=bad>'); h.handoff('revisit', 'Review & repeat'); h.field('owner', 'Coach A'); h.b.action('complete'); const record = h.state().plan; const html = h.b.printHtml(false);
    assert(html.includes('Completed practice')); assert(html.includes('Coach A')); assert(html.includes('&lt;script&gt;cue&lt;/script&gt;')); assert(html.includes('&lt;img src=x onerror=bad&gt;')); assert(html.includes('Review &amp; repeat')); assert(!html.includes('<script>')); h.reload(); assert.deepStrictEqual(h.state().plan, record);
  });
  await check('metadata validation rejects invalid dates, oversized handoffs and duplicate week IDs', h => {
    for (const value of ['2026-02-30', '10/26/2026', '2026-13-01']) assert.throws(() => h.week.date(value), /valid calendar/);
    const plan = h.state().plan; plan.handoff.taught = 'x'.repeat(4001); assert.throws(() => h.b.cleanPlan(plan), /4000/);
    const week = h.makeWeek(); h.values.set(h.week.key, JSON.stringify([week, week])); const bytes = h.values.get(h.week.key); h.reload(); assert.equal(h.weeks().readable, false); assert.equal(h.values.get(h.week.key), bytes);
  });
  await check('weekly writes use their own key and never overwrite builder or unrelated data', h => {
    h.values.set('team-favorites', 'unchanged'); h.makeWeek(); h.week.act('suggest'); h.week.act('copy'); assert.equal(h.values.get('team-favorites'), 'unchanged'); assert(h.writes.every(key => [h.week.key, h.b.keys.draft, h.b.keys.plans].includes(key)));
  });
  console.log('\n' + checks + ' checks passed; ' + failures + ' failed.'); if (failures) process.exitCode = 1;
}
main().catch(error => { console.error(error); process.exitCode = 1; });
