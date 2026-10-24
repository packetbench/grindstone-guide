/* Buildless, browser-local practice planning. Catalog references never come from imported URLs. */
(function () {
  'use strict';
  const VERSION = 1;
  const DRAFT_KEY = 'grindstone-practice-draft-v1';
  const PLANS_KEY = 'grindstone-practice-plans-v1';
  const TYPES = { warmup: 'Warm-up', move: 'Move', series: 'Technique series', drill: 'Movement / partner / situational drill', strength: 'Strength', endurance: 'Endurance', game: 'Game', water: 'Water / reset', custom: 'Coach-written block' };
  const AGES = ['4-6', '7-10', '11-14'];
  const SECTIONS = { prepare: 'Prepare / warm-up', staples: 'Recurring staples', teach: 'Foundation & option', choices: 'Reactions / situations', physical: 'Physical development', game: 'Game', recap: 'Recap / pickup', reset: 'Water / reset' };
  const DELIVERY = { whole: 'Whole group', pairs: 'Partners', stations: 'Station rotations' };
  const frameworks = () => window.GRINDSTONE_FRAMEWORKS || { programs: [], frameworks: [], sessions: [], stages: [] };
  const known = (items, id) => items.find(item => item.id === id);
  let pendingContext = null;
  const MAX_BLOCKS = 100;
  let catalog = [], byId = new Map(), plan, saved = [], root, ready = false;
  let storageError = '', notice = '', undoState = null, initialBackup = null, savedReadable = true, printListenerInstalled = false;
  let picker = { type: 'move', search: '', matchAge: false, selected: '', family: '', destination: '' };
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const text = value => typeof value === 'string' ? value : '';
  const list = value => Array.isArray(value) ? value.filter(x => typeof x === 'string') : (typeof value === 'string' && value ? [value] : []);
  const clone = value => JSON.parse(JSON.stringify(value));
  const age = value => text(value).replace(/[–—]/g, '-');
  const lines = value => list(value).join('\n');
  const uid = () => 'p-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  const number = value => Number.isFinite(Number(value)) ? Number(value) : 0;
  const formatMinutes = n => Number.isInteger(n) ? String(n) : n.toFixed(1);
  const clock = n => Math.floor(n) + ':' + (Math.round((n % 1) * 60)).toString().padStart(2, '0');
  function safeUrl(value) {
    try { const u = new URL(value); return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : ''; } catch (_) { return ''; }
  }
  function newPlan() { return { version: VERSION, id: '', name: 'My practice', age: '', target: 0, program: '', framework: '', session: '', stage: '', startTime: '', focus: '', notes: '', blocks: [] }; }
  function wallClock(offset) {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(plan.startTime || '')) return '';
    const [hours, minutes] = plan.startTime.split(':').map(Number), seconds = ((hours * 60 + minutes + offset) * 60) % 86400;
    const h = Math.floor(seconds / 3600), m = Math.floor(seconds % 3600 / 60), s = seconds % 60;
    return (h % 12 || 12) + ':' + String(m).padStart(2, '0') + (s ? ':' + String(s).padStart(2, '0') : '') + (h < 12 ? ' am' : ' pm');
  }
  function timeRange(time) { return clock(time.start) + '–' + clock(time.end) + (plan.startTime ? ' · ' + wallClock(time.start) + '–' + wallClock(time.end) : ''); }
  function seriesPath(id, pathway) {
    if ((pathway.series || []).some(series => series.id === id)) return '#season?view=series&series=' + encodeURIComponent(id);
    for (const group of pathway.groups || []) {
      const phase = (group.phases || []).find(p => list(p.series_ids).concat(list(p.sequence_ids)).includes(id));
      if (phase) return '#season?age=' + encodeURIComponent(age(group.age_group)) + '&phase=' + encodeURIComponent(phase.id);
    }
    return '#season';
  }
  function pathwayPath() { return '#season' + (plan.age ? '?age=' + encodeURIComponent(plan.age) : ''); }
  function normalizeCatalog() {
    const d = window.GRINDSTONE || {}, k = window.GRINDSTONE_KYLE || {};
    const ins = (window.GRINDSTONE_KYLE_INSTRUCTION || {}).entries || k.instruction || {};
    const v = window.GRINDSTONE_VIDEO_ADDITIONS || {}, pathway = window.GRINDSTONE_PATHWAY || {};
    const out = [];
    function add(item) {
      item.age_groups = list(item.age_groups).map(age).filter(x => AGES.includes(x));
      item.steps = list(item.steps); item.cues = list(item.cues); item.types = list(item.types);
      item.status = item.status || (item.steps.length ? 'Written coaching guide' : 'Video reference — preview before teaching');
      item.video = safeUrl(item.video); item.minutes = Math.max(0.5, Math.min(120, number(item.minutes) || 5));
      out.push(item);
    }
    (d.moves || []).forEach(m => add({ id: m.id, title: m.name, types: ['move', 'drill'].concat(m.tier === 'Pup' ? ['warmup'] : []), category: m.category, tier: m.tier, summary: m.purpose, instructions: m.drill || m.purpose, drill: m.drill, steps: m.steps, cues: m.cues, readiness: m.prerequisite, boundary: m.boundary, fix: [m.error, m.fix].filter(Boolean).join(' Correction: '), path: '#move/' + encodeURIComponent(m.id), video: ((d.videos || {})[m.id] || {}).video?.url, minutes: 5 }));
    (d.games || []).forEach(g => add({ id: g.id, title: g.name, types: ['game'], category: 'Games', tier: '', summary: g.format, instructions: [g.play, g.scoring ? 'Scoring: ' + g.scoring : '', g.reset ? 'Reset: ' + g.reset : '', g.timing ? 'Timing: ' + g.timing : ''].filter(Boolean).join('\n\n'), setup: [g.equipment ? 'Equipment: ' + g.equipment : '', g.setup].filter(Boolean).join('\n'), steps: [...(g.steps || [g.play]), g.variation ? 'Variation: ' + g.variation : ''].filter(Boolean), cues: g.cues || [], boundary: g.boundary, path: '#game/' + encodeURIComponent(g.id), video: ((d.videos || {})[g.id] || {}).video?.url, minutes: parseFloat(g.minutes), status: 'Written game guide', ageNote: g.ages }));
    (k.entries || []).forEach(e => {
      const g = ins[e.id] || {}, isGame = e.kind === 'game';
      add({ id: 'kyle:' + e.id, title: e.name, types: isGame ? ['game'] : ['move', 'drill'].concat(e.id === 'K02' ? ['warmup'] : []), category: e.category, tier: g.tier || '', summary: g.purpose || e.description, instructions: g.drill ? [g.drill.setup, g.drill.rounds, g.drill.goal].filter(Boolean).join('\n') : g.purpose || e.description, setup: g.setup, steps: g.steps, cues: g.cues || e.focus, readiness: g.readiness, boundary: lines(g.safety), path: '#moves/kyle/' + e.id, video: e.video?.url, minutes: 5, adaptation: Array.isArray(g.age_adaptations) ? g.age_adaptations.map(a => a.group + ': ' + a.text).join('\n') : '', sourceNote: g.verification || e.note });
    });
    (v.entries || []).forEach(e => add({ id: 'facebook:' + e.id, title: e.title, types: e.kind === 'game' ? ['game'] : ['move', 'drill'].concat(e.category === 'movement' ? ['warmup'] : []), category: e.category, tier: e.tier || '', summary: e.description || e.observed, instructions: list(e.steps).length ? lines(e.steps) : 'Preview the linked video and choose a task and coaching cues before teaching. ' + (e.description || e.observed || ''), steps: e.steps, cues: e.cues, readiness: e.readiness, boundary: [lines(e.boundaries), lines(e.focus)].filter(Boolean).join('\n'), path: '#moves/videos/' + e.id, video: e.url, minutes: 5, adaptation: e.age_adaptations && typeof e.age_adaptations === 'object' ? Object.entries(e.age_adaptations).map(([a, val]) => a + ': ' + val).join('\n') : '', sourceNote: e.verification, status: list(e.steps).length ? 'Written coaching adaptation' : 'Video reference — no complete written instruction' }));
    (pathway.series || []).forEach(s => {
      const branches = (s.branches || []).map(b => ({ title: text(b.title), when: text(b.when), action: text(b.action), readiness: text(b.readiness) }));
      const instructions = [s.summary, 'Common foundation: ' + s.foundation, 'Choose one option to teach first; reset to the foundation before trying a different response.', ...branches.map(b => b.title + '\nWhen: ' + b.when + '\nOption: ' + b.action + (b.readiness ? '\nBefore adding this option: ' + b.readiness : '')), s.verification ? 'Source scope: ' + s.verification : ''].filter(Boolean).join('\n\n');
      add({ id: 'series:' + s.id, title: s.title, types: ['series'], category: 'Technique series', tier: s.tier, summary: s.summary, foundation: s.foundation, branches, instructions, setup: s.setup, steps: s.steps, cues: s.cues, readiness: s.readiness, boundary: lines(s.boundaries), age_groups: s.age_groups, path: seriesPath(s.id, pathway), move_ids: list(s.move_ids), minutes: s.minutes, status: 'Common foundation with reaction-based options' });
    });
    // Keep legacy source IDs so saved practices and earlier links retain their guides.
    (pathway.sequences || []).forEach(s => add({ id: 'series:' + s.id, kind: 'sequence', title: s.title, types: ['drill'], category: 'Linked movement drill', tier: s.tier, summary: s.summary, instructions: s.summary, setup: s.setup, steps: s.steps, cues: s.cues, readiness: s.readiness, boundary: lines(s.boundaries), age_groups: s.age_groups, path: seriesPath(s.id, pathway), move_ids: list(s.move_ids), minutes: s.minutes, status: 'Linked movement drill' }));
    (pathway.activities || []).forEach(a => add({ id: 'activity:' + a.id, title: a.title, types: [a.type], category: TYPES[a.type] || 'Activity', summary: a.summary || lines(a.instructions), instructions: lines(a.instructions), steps: list(a.steps).length ? a.steps : list(a.instructions), cues: a.cues, boundary: a.boundary, age_groups: a.age_groups, minutes: a.minutes, status: 'Written coaching activity' }));
    out.forEach(item => {
      const moveId = item.id.replace(/^kyle:/, '');
      item.memberships = (pathway.series || []).flatMap(series => (series.members || []).filter(member => member.move_id === moveId).map(member => ({ id: series.id, title: series.title, role: member.role, note: member.note })));
    });
    return out;
  }
  function refreshCatalog() { catalog = normalizeCatalog(); byId = new Map(catalog.map(x => [x.id, x])); }
  function boundedString(value, name, limit, required) {
    if (value == null && !required) return '';
    if (typeof value !== 'string' || value.length > limit) throw new Error(name + ' must be text of at most ' + limit + ' characters.');
    return value.replace(/\u0000/g, '');
  }
  function cleanPlan(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('This file does not contain a practice.');
    if (raw.version !== VERSION) throw new Error('This practice uses an unsupported file version.');
    if (!Array.isArray(raw.blocks) || raw.blocks.length > MAX_BLOCKS) throw new Error('A practice can have at most ' + MAX_BLOCKS + ' blocks.');
    const a = age(raw.age);
    if (a && !AGES.includes(a)) throw new Error('Choose a supported age group or leave it blank.');
    const target = raw.target == null ? 0 : raw.target;
    if (typeof target !== 'number' || !Number.isFinite(target) || target < 0 || target > 240 || !Number.isInteger(target * 2)) throw new Error('Target duration must be 0–240 minutes in half-minute increments.');
    const startTime = boundedString(raw.startTime, 'Start time', 5, false);
    if (startTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime)) throw new Error('Start time must use HH:MM.');
    const choice = (key, items) => known(items, boundedString(raw[key], key, 60, false))?.id || '';
    return { version: VERSION, id: boundedString(raw.id, 'Plan ID', 100, false), name: boundedString(raw.name, 'Practice name', 120, true) || 'My practice', age: a, target, startTime, program: choice('program', frameworks().programs), framework: choice('framework', frameworks().frameworks), session: choice('session', frameworks().sessions), stage: choice('stage', frameworks().stages), focus: boundedString(raw.focus, 'Focus', 500, false), notes: boundedString(raw.notes, 'Notes', 12000, false), blocks: raw.blocks.map((b, i) => {
      if (!b || typeof b !== 'object' || !Object.hasOwn(TYPES, b.type)) throw new Error('Block ' + (i + 1) + ' has an unsupported type.');
      if (typeof b.minutes !== 'number' || !Number.isFinite(b.minutes) || b.minutes < 0.5 || b.minutes > 120 || !Number.isInteger(b.minutes * 2)) throw new Error('Block ' + (i + 1) + ' needs 0.5–120 minutes in half-minute increments.');
      const sourceId = boundedString(b.sourceId, 'Guide ID', 100, false), source = byId.get(sourceId);
      const clean = { id: 'b-' + i, type: b.type, minutes: b.minutes, sourceId: source ? sourceId : '', name: boundedString(b.name, 'Block title', 200, true), instructions: boundedString(b.instructions, 'Block task', 16000, false), cues: boundedString(b.cues, 'Coaching cues', 6000, false), setup: boundedString(b.setup, 'Setup', 6000, false), readiness: boundedString(b.readiness, 'Readiness', 6000, false), boundary: boundedString(b.boundary, 'Boundaries', 10000, false), adaptation: boundedString(b.adaptation, 'Age adaptations', 10000, false), steps: [] };
      clean.section = Object.hasOwn(SECTIONS, b.section) ? b.section : '';
      clean.delivery = Object.hasOwn(DELIVERY, b.delivery) ? b.delivery : 'whole';
      clean.rotation = boundedString(b.rotation, 'Station / partner plan', 6000, false);
      if (source?.kind === 'sequence' && clean.type === 'series') clean.type = 'drill';
      if (b.steps != null && (!Array.isArray(b.steps) || b.steps.length > 60)) throw new Error('A block can contain at most 60 instruction steps.');
      clean.steps = (b.steps || []).map(s => boundedString(s, 'Instruction step', 4000, true));
      return clean;
    }) };
  }
  function parseImport(value) {
    if (typeof value !== 'string' || value.length > 2000000) throw new Error('Choose a practice JSON file smaller than 2 MB.');
    let data;
    try { data = JSON.parse(value); } catch (_) { throw new Error('That file is not valid JSON.'); }
    if (!data || data.format !== 'grindstone-practice' || data.version !== VERSION) throw new Error('Choose a Grindstone practice export (.json).');
    const imported = cleanPlan(data.plan); imported.id = '';
    return imported;
  }
  function storageRead(key) { try { return window.localStorage.getItem(key); } catch (_) { storageError = 'Browser storage is unavailable. Your work remains in this page only; export a JSON backup before leaving.'; return null; } }
  function storageWrite(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); storageError = ''; return true; }
    catch (_) { storageError = 'Could not save to this browser. Your work remains in this page only; export a JSON backup before leaving.'; return false; }
  }
  function init() {
    refreshCatalog();
    if (ready) return;
    plan = newPlan();
    const draft = storageRead(DRAFT_KEY), library = storageRead(PLANS_KEY);
    if (draft) { try { plan = cleanPlan(JSON.parse(draft)); initialBackup = clone(plan); } catch (_) { notice = 'The previous browser draft could not be read. Start a new plan or import a JSON backup.'; } }
    if (library) { try { const parsed = JSON.parse(library); if (!Array.isArray(parsed) || parsed.length > 100) throw new Error(); saved = parsed.map(cleanPlan); } catch (_) { notice += ' Saved plans could not be read; they have not been overwritten. Export this draft to keep it.'; saved = []; savedReadable = false; } }
    ready = true;
  }
  function autoSave() { storageWrite(DRAFT_KEY, plan); updateStatus(); }
  function timing(blocks) { let elapsed = 0; return blocks.map(b => { const start = elapsed; elapsed += b.minutes; return { start, end: elapsed }; }); }
  function totalMinutes() { return plan.blocks.reduce((n, b) => n + b.minutes, 0); }
  function summaryHtml() {
    const total = totalMinutes(), delta = total - plan.target;
    return '<strong>' + formatMinutes(total) + ' min planned</strong><span>' + plan.blocks.length + ' block' + (plan.blocks.length === 1 ? '' : 's') + '</span>' + (plan.target ? '<span class="' + (delta > 0 ? 'is-over' : '') + '">' + (delta === 0 ? 'On target' : formatMinutes(Math.abs(delta)) + ' min ' + (delta > 0 ? 'over' : 'under') + ' your ' + formatMinutes(plan.target) + '-min target') + '</span>' : '<span>Set a target if useful.</span>');
  }
  function statusText() { return [notice, storageError || 'Draft autosaves in this browser. Saved plans do not sync across devices.'].filter(Boolean).join(' '); }
  function updateStatus() { if (root) { const el = root.querySelector('.builder-status'); if (el) el.textContent = statusText(); } }
  function notify(message) { notice = message; updateStatus(); }
  function remember() { undoState = clone(plan); }
  function options(values, selected, label) { return values.map(value => '<option value="' + esc(value) + '"' + (value === selected ? ' selected' : '') + '>' + esc(label ? label(value) : value) + '</option>').join(''); }
  function catalogMatches(item) {
    if (!item.types.includes(picker.type)) return false;
    if (picker.family && item.id !== 'series:' + picker.family && !item.memberships.some(m => m.id === picker.family)) return false;
    if (picker.matchAge && plan.age && item.age_groups.length && !item.age_groups.includes(plan.age)) return false;
    const q = picker.search.trim().toLowerCase();
    return !q || [item.id, item.title, item.summary, item.category, item.tier, item.status, ...item.memberships.map(m => m.title + ' ' + m.role)].join(' ').toLowerCase().includes(q);
  }
  function visibleCatalog() { return catalog.filter(catalogMatches); }
  function pickerHtml() {
    const families = window.GRINDSTONE_PATHWAY?.series || [];
    return '<h2 id="builder-library-title">Choose today’s work</h2><p>Choose a guide for a timeline slot, or add another block. A series groups options from the same position.</p><label>Block type<select data-picker="type">' + options(Object.keys(TYPES), picker.type, x => TYPES[x]) + '</select></label><div class="builder-resource-controls"><label>Series filter<select data-picker="family"><option value="">All guides</option>' + options(families.map(s => s.id), picker.family, id => families.find(s => s.id === id).title) + '</select></label><label>Find a guide<input type="search" data-picker="search" value="' + esc(picker.search) + '" placeholder="Name, cue or technique"></label><label class="builder-check"><input type="checkbox" data-picker="matchAge"' + (picker.matchAge ? ' checked' : '') + '> Match age-tagged activities to my group</label><small>General guides remain available. Check each guide’s prerequisites; this filter is not a clearance to teach.</small><label>Library guide<select data-picker="selected" size="8" aria-describedby="builder-match-count"></select></label><p id="builder-match-count" class="builder-match-count"></p></div><div class="builder-resource-preview"></div><label>Put this work in<select data-picker="destination"></select></label><button type="button" data-action="add">Add block to practice</button>';
  }
  function resourcePreview(item) {
    if (picker.type === 'water') return '<h3>Water / reset</h3><p>Add a short drink, partner change and check-in. Adjust its length for your group.</p>';
    if (picker.type === 'custom') return '<h3>Your coaching task</h3><p>Add a blank block, then write instructions, rounds, rest and cues.</p>';
    if (!item) return '<p>No matching guide. Change the search or choose a coach-written block.</p>';
    const optionsHtml = item.foundation ? '<div class="pathway-foundation"><h4>Common foundation</h4><p>' + esc(item.foundation) + '</p></div><div class="pathway-branches">' + (item.branches || []).map(b => '<section class="pathway-branch"><h4>' + esc(b.title) + '</h4><p><strong>When:</strong> ' + esc(b.when) + '</p><p><strong>Option:</strong> ' + esc(b.action) + '</p>' + (b.readiness ? '<p><strong>Before adding this option:</strong> ' + esc(b.readiness) + '</p>' : '') + '</section>').join('') + '</div>' : '';
    return '<h3>' + esc(item.title) + '</h3><p class="builder-source-status">' + esc(item.status) + (item.tier ? ' · ' + esc(item.tier) : '') + '</p><p>' + esc(item.summary) + '</p>' + (item.memberships.length ? '<ul class="builder-memberships">' + item.memberships.map(m => '<li><strong>' + esc(m.title + ' · ' + m.role) + '</strong>' + (m.note ? '<br>' + esc(m.note) : '') + '</li>').join('') + '</ul>' : '') + optionsHtml + (item.types.includes('game') ? '<p class="builder-preline">' + esc(item.instructions) + '</p>' : '') + (item.readiness ? '<p><strong>Ready when:</strong> ' + esc(item.readiness) + '</p>' : '') + (item.age_groups.length ? '<p><strong>Written for:</strong> ' + esc(item.age_groups.join(', ')) + '</p>' : '') + (item.boundary ? '<p><strong>Boundaries:</strong> ' + esc(item.boundary) + '</p>' : '') + (item.steps.length ? '<details><summary>Read instruction before adding</summary>' + (item.setup ? '<p>' + esc(item.setup) + '</p>' : '') + '<ol>' + item.steps.map(s => '<li>' + esc(s) + '</li>').join('') + '</ol>' + (item.adaptation ? '<p class="builder-preline">' + esc(item.adaptation) + '</p>' : '') + '</details>' : '') + linksHtml(item);
  }
  function linksHtml(item) { return (item.path ? '<a href="' + esc(item.path) + '" target="_blank" rel="noopener">Open full guide ↗</a>' : '') + (item.video ? '<a href="' + esc(item.video) + '" target="_blank" rel="noopener">Watch source video ↗</a>' : ''); }
  function updatePicker() {
    if (!root) return;
    const controls = root.querySelector('.builder-resource-controls'), isManual = ['custom', 'water'].includes(picker.type);
    controls.hidden = isManual;
    const matches = visibleCatalog();
    if (!matches.some(x => x.id === picker.selected)) picker.selected = matches[0]?.id || '';
    const select = root.querySelector('[data-picker="selected"]');
    select.innerHTML = matches.map(item => '<option value="' + esc(item.id) + '"' + (item.id === picker.selected ? ' selected' : '') + '>' + esc(item.title + ' · ' + item.id + (item.steps.length ? '' : ' · video reference')) + '</option>').join('');
    root.querySelector('#builder-match-count').textContent = matches.length + ' matching guides';
    root.querySelector('.builder-resource-preview').innerHTML = resourcePreview(byId.get(picker.selected));
    if (!plan.blocks.some(b => b.id === picker.destination)) picker.destination = '';
    root.querySelector('[data-picker="destination"]').innerHTML = '<option value="">Add at end of practice</option>' + options(plan.blocks.map(b => b.id), picker.destination, id => { const i = plan.blocks.findIndex(b => b.id === id); return 'Replace ' + (i + 1) + '. ' + plan.blocks[i].name + ' · keep ' + formatMinutes(plan.blocks[i].minutes) + ' min'; });
    const add = root.querySelector('[data-action="add"]');
    add.textContent = picker.destination ? 'Use in selected slot' : 'Add block to practice';
    add.disabled = (!picker.destination && plan.blocks.length >= MAX_BLOCKS) || (!isManual && !picker.selected);
  }
  function blockFrom(item, type) {
    const placement = { section: '', delivery: 'whole', rotation: '' };
    if (!item) return { ...placement, id: uid(), type, sourceId: '', name: type === 'water' ? 'Water and reset' : 'Coach-written block', minutes: type === 'water' ? 2 : 5, instructions: type === 'water' ? 'Drink water, check in with athletes and reset the practice space.' : '', cues: '', setup: '', readiness: '', boundary: '', adaptation: '', steps: [] };
    return { ...placement, id: uid(), type, sourceId: item.id, name: item.title, minutes: item.minutes, instructions: item.instructions || item.summary || '', cues: lines(item.cues), setup: item.setup || '', readiness: item.readiness || '', boundary: item.boundary || '', adaptation: item.adaptation || '', steps: clone(item.steps) };
  }
  function blockHtml(b, i, time) {
    const source = byId.get(b.sourceId), hasDetails = b.steps.length || b.setup || b.readiness || b.boundary || b.adaptation;
    return '<article class="builder-block" data-block-index="' + i + '"><div class="builder-block-heading"><h3><span class="builder-block-number">' + (i + 1) + '.</span> <span data-block-title>' + esc(b.name || TYPES[b.type]) + '</span></h3><span class="builder-block-time">' + esc(timeRange(time)) + '</span></div><div class="builder-block-actions"><button type="button" data-action="up" aria-label="Move block ' + (i + 1) + ' up"' + (i === 0 ? ' disabled' : '') + '>↑ Up</button><button type="button" data-action="down" aria-label="Move block ' + (i + 1) + ' down"' + (i === plan.blocks.length - 1 ? ' disabled' : '') + '>↓ Down</button><button type="button" data-action="remove" aria-label="Remove block ' + (i + 1) + '">Remove</button></div><div class="builder-block-fields"><label>Block name<input data-block-field="name" maxlength="200" value="' + esc(b.name) + '"></label><label>Minutes<input data-block-field="minutes" type="number" min="0.5" max="120" step="0.5" required value="' + b.minutes + '"></label><label>Type<select data-block-field="type">' + options(Object.keys(TYPES), b.type, x => TYPES[x]) + '</select></label><label>Practice section<select data-block-field="section"><option value="">Custom section</option>' + options(Object.keys(SECTIONS), b.section, x => SECTIONS[x]) + '</select></label><label>Delivery<select data-block-field="delivery">' + options(Object.keys(DELIVERY), b.delivery, x => DELIVERY[x]) + '</select></label><label>Task, rounds and rest<textarea data-block-field="instructions" rows="4" maxlength="16000">' + esc(b.instructions) + '</textarea></label><label>Coaching cues<textarea data-block-field="cues" rows="2" maxlength="6000">' + esc(b.cues) + '</textarea></label><label>Partner / station plan (optional)<textarea data-block-field="rotation" rows="2" maxlength="6000" placeholder="Coach, group, task at each station; work, rest and changeover time within this block.">' + esc(b.rotation) + '</textarea></label></div>' + (source ? '<p class="builder-source-status">' + esc(source.status) + ' · ' + esc(source.id) + '</p>' + linksHtml(source) + '<div class="builder-block-actions"><button type="button" data-action="reload-guide">Reload guide details</button><button type="button" data-action="detach-guide">Keep as coach-written task</button></div>' : '') + (hasDetails ? '<details class="builder-block-detail"><summary>Instruction, readiness and boundaries</summary>' + (b.setup ? '<p><strong>Setup:</strong> ' + esc(b.setup) + '</p>' : '') + (b.readiness ? '<p><strong>Ready when:</strong> ' + esc(b.readiness) + '</p>' : '') + (b.steps.length ? '<ol>' + b.steps.map(s => '<li>' + esc(s) + '</li>').join('') + '</ol>' : '') + (b.adaptation ? '<p class="builder-preline">' + esc(b.adaptation) + '</p>' : '') + (b.boundary ? '<p class="builder-preline"><strong>Boundaries:</strong> ' + esc(b.boundary) + '</p>' : '') + '<p class="builder-detail-note">Your task and cues above can be edited. Reloading restores the guide wording; your timing stays.</p></details>' : '') + '</article>';
  }
  function savedOptions() { return '<option value="">Choose a saved practice</option>' + saved.map(p => '<option value="' + esc(p.id) + '">' + esc(p.name + (p.age ? ' · ' + p.age : '') + ' · ' + formatMinutes(p.blocks.reduce((n, b) => n + b.minutes, 0)) + ' min') + '</option>').join(''); }
  function planningHtml() {
    const data = frameworks();
    return '<section class="builder-planning builder-no-print"><h2>Set up the practice</h2><p>Use an editable time framework, then choose the moves, tasks and games for each slot. Program and age are separate choices.</p><div class="builder-planning-grid"><label>Program<select data-plan-field="program"><option value="">Custom / choose a program</option>' + options(data.programs.map(p => p.id), plan.program, id => known(data.programs, id).name) + '</select></label><label>Time framework<select data-plan-field="framework"><option value="">Choose a practice length</option>' + options(data.frameworks.map(f => f.id), plan.framework, id => known(data.frameworks, id).title) + '</select></label><label>Session purpose<select data-plan-field="session"><option value="">Choose for today</option>' + options(data.sessions.map(s => s.id), plan.session, id => known(data.sessions, id).title) + '</select></label><label>Learning stage<select data-plan-field="stage"><option value="">Choose by readiness</option>' + options(data.stages.map(s => s.id), plan.stage, id => known(data.stages, id).title) + '</select></label></div><div class="builder-program-note"></div><div class="builder-session-note"></div><div class="builder-stage-note"></div><div class="builder-framework-preview"></div><button type="button" data-action="framework">Use this time framework</button><p class="fine">Minutes include demonstrations, partner turns, water and transitions. Adjust the blocks rather than filling spare time with extra fatigue.</p><div class="builder-context"></div></section>';
  }
  function updatePlanning() {
    if (!root) return;
    const data = frameworks(), program = known(data.programs, plan.program), framework = known(data.frameworks, plan.framework), session = known(data.sessions, plan.session), stage = known(data.stages, plan.stage);
    root.querySelector('.builder-program-note').innerHTML = program ? '<p><strong>' + esc(program.name) + ':</strong> ' + esc((Array.isArray(program.days) ? program.days.join(', ') : program.days) + ' · ' + program.minutes + ' minutes · ' + program.location) + '<br>' + esc(program.entrance) + '</p>' : '';
    root.querySelector('.builder-session-note').innerHTML = session ? '<p><strong>' + esc(session.title) + ':</strong> ' + esc(session.description) + '</p>' : '';
    root.querySelector('.builder-stage-note').innerHTML = stage ? '<p><strong>' + esc(stage.title) + ':</strong> ' + esc(stage.description) + '</p>' : '';
    root.querySelector('[data-action="framework"]').disabled = !framework;
    root.querySelector('.builder-framework-preview').innerHTML = framework ? '<p>' + esc(framework.summary) + '</p><ol class="builder-timeline">' + framework.blocks.map((b, i) => '<li><strong>' + formatMinutes(b.minutes) + ' min</strong><span>' + esc(b.name) + '</span></li>').join('') + '</ol>' : '';
    const pending = pendingContext;
    root.querySelector('.builder-context').innerHTML = pending ? '<h3>From the season pathway</h3><p><strong>' + esc(pending.title) + '</strong></p><p>' + esc(pending.focus) + '</p><button type="button" data-action="context">Use this session focus</button><p class="fine">Updates age, session purpose and focus; your practice blocks stay in place.</p>' : '';
  }
  function frameworkBlocks(framework) {
    return framework.blocks.map(slot => ({ ...blockFrom(null, slot.type), section: slot.section, name: slot.name, minutes: slot.minutes, instructions: slot.instructions, cues: lines(slot.cues) }));
  }
  function setProgram(id) {
    const program = known(frameworks().programs, id);
    plan.program = program?.id || '';
    if (program) { plan.framework = program.defaultFramework; plan.target = program.minutes; plan.startTime = program.start; }
  }
  function render(params) {
    init();
    const requested = params && (params.get('series') || params.get('sequence'));
    const selectedGuide = byId.get('series:' + requested);
    if (selectedGuide) { picker.type = selectedGuide.types[0]; picker.search = ''; picker.family = ''; picker.selected = selectedGuide.id; picker.matchAge = false; notice = (picker.type === 'series' ? 'Series' : 'Drill') + ' selected below. Review it, then choose its place in the practice.'; }
    const requestedActivity = params && params.get('activity'), activity = byId.get('activity:' + requestedActivity);
    if (activity) { picker.type = activity.types[0]; picker.search = ''; picker.family = ''; picker.selected = activity.id; picker.matchAge = false; notice = 'Activity selected below. Review it, then choose its place in the practice.'; }
    const requestedMove = byId.get(params?.get('move'));
    if (requestedMove?.types.includes('move')) { picker.type = 'move'; picker.search = ''; picker.family = ''; picker.selected = requestedMove.id; picker.matchAge = false; notice = 'Move selected below. Choose a slot or add it at the end of your practice.'; }
    const requestedAge = age(params && params.get('age'));
    if (!plan.age && AGES.includes(requestedAge)) plan.age = requestedAge;
    const requestedProgram = params?.get('program');
    if (!plan.program && !plan.blocks.length && known(frameworks().programs, requestedProgram)) setProgram(requestedProgram);
    const group = window.GRINDSTONE_PATHWAY?.groups.find(g => g.age_group === requestedAge), phase = group?.phases.find(p => p.id === params?.get('phase'));
    const sessionId = params?.get('session'), cycleKey = { 'core-a': 'core_a', 'core-b': 'core_b', extension: 'extension' }[sessionId];
    pendingContext = phase?.practice_cycle?.[cycleKey] ? { title: phase.title + ' · ' + phase.practice_cycle[cycleKey].title, focus: phase.practice_cycle[cycleKey].focus, age: requestedAge, session: sessionId } : null;
    return '<section id="practice-builder" class="practice-builder"><div class="builder-no-print"><p class="eyebrow">COACH PLANNING</p><h1>Build a practice</h1><p>Plan the time, choose a foundation, and build the practice your group needs. Keep familiar staples, teach a useful option, then let wrestlers read and respond.</p><nav class="builder-tabs" aria-label="Practice planning"><a href="#practices" aria-current="page">Build a practice</a><a data-pathway-link href="' + esc(pathwayPath()) + '">Season pathway</a><a href="#season?view=series">Technique series</a></nav></div><p class="builder-status builder-no-print" role="status" aria-live="polite">' + esc(statusText()) + '</p>' + planningHtml() + '<div class="builder-toolbar builder-no-print"><label>Practice name<input data-plan-field="name" maxlength="120" value="' + esc(plan.name) + '"></label><label for="builder-age">Age group (optional)<select id="builder-age" aria-label="Age group (optional)" data-plan-field="age"><option value="">Choose for this group</option>' + options(AGES, plan.age, a => 'Ages ' + a.replace('-', '–')) + '</select></label><label>Target minutes (optional)<input data-plan-field="target" type="number" min="0" max="240" step="0.5" placeholder="No target" value="' + (plan.target || '') + '"></label><label>Start time (optional)<input data-plan-field="startTime" type="time" value="' + esc(plan.startTime) + '"></label><label>Today’s focus (optional)<input data-plan-field="focus" maxlength="500" value="' + esc(plan.focus) + '" placeholder="e.g. sit-out: hip-heist or rise with forward pressure"></label></div><div class="builder-layout builder-no-print"><aside class="builder-library" aria-labelledby="builder-library-title">' + pickerHtml() + '</aside><section class="builder-draft" aria-labelledby="builder-draft-title"><h2 id="builder-draft-title">Your practice</h2><div class="builder-summary" aria-live="polite">' + summaryHtml() + '</div><div class="builder-block-list"></div><label class="builder-notes">Coach notes<textarea data-plan-field="notes" rows="3" maxlength="12000" placeholder="Partner groups, equipment, adaptations or what to revisit next time.">' + esc(plan.notes) + '</textarea></label><div class="builder-actions"><button type="button" data-action="save">Save named practice</button><button type="button" data-action="duplicate">Save a copy</button><button type="button" data-action="new">Start blank</button><button type="button" data-action="undo"' + (undoState ? '' : ' disabled') + '>Undo last structural change</button><button type="button" data-action="print">Print run sheet</button></div><label class="builder-check"><input type="checkbox" data-print-details> Include full move instruction in printout</label><p class="fine builder-no-print">Game rules, setup and steps are always included in the run sheet.</p></section></div><section class="builder-saved builder-no-print"><h2>Saved practices & backups</h2><p>Stored on this browser only. Export a JSON file to keep a backup or share with another coach. Import creates a separate draft.</p><label>Saved practice<select data-saved-plan>' + savedOptions() + '</select></label><div class="builder-actions"><button type="button" data-action="load">Load selected</button><button type="button" data-action="delete">Delete selected</button><button type="button" data-action="export">Export current practice (.json)</button><button type="button" data-action="backup"' + (initialBackup ? '' : ' disabled') + '>Restore draft from page load</button></div><label>Import practice JSON<input type="file" data-import accept=".json,application/json"></label></section><section class="builder-print-sheet" aria-label="Printable practice"></section></section>';
  }
  function renderBlocks(focusIndex) {
    if (!root) return;
    const times = timing(plan.blocks);
    root.querySelector('.builder-block-list').innerHTML = plan.blocks.length ? plan.blocks.map((b, i) => blockHtml(b, i, times[i])).join('') : '<div class="builder-empty"><h3>Choose a time framework or start blank</h3><p>Use the setup above for editable slots. Then choose guides on the left and put them in the slots you want.</p></div>';
    updateSummary();
    root.querySelector('[data-action="undo"]').disabled = !undoState;
    updatePicker();
    if (focusIndex != null) root.querySelector('[data-block-index="' + focusIndex + '"] input')?.focus();
  }
  function updateSummary() { if (!root) return; root.querySelector('.builder-summary').innerHTML = summaryHtml(); const times = timing(plan.blocks); root.querySelectorAll('.builder-block-time').forEach((el, i) => { if (times[i]) el.textContent = timeRange(times[i]); }); }
  function updatePlanFields() { root.querySelectorAll('[data-plan-field]').forEach(el => { const key = el.dataset.planField; el.value = key === 'target' ? (plan.target || '') : plan[key]; }); root.querySelector('[data-pathway-link]').href = pathwayPath(); updatePlanning(); }
  function updateSavedOptions() { root.querySelector('[data-saved-plan]').innerHTML = savedOptions(); }
  function validFields() { const invalid = root.querySelector(':invalid'); if (invalid) { invalid.reportValidity(); notify('Check the highlighted field before saving or printing.'); return false; } return true; }
  function changed(message, focusIndex) { autoSave(); renderBlocks(focusIndex); notify(message); }
  function saveNamed(copy) {
    if (!validFields()) return;
    if (!savedReadable) { notify('Existing saved-plan data could not be read, so it is being preserved. Export this practice as JSON to keep your work.'); return; }
    const current = cleanPlan(plan);
    if (copy) { current.id = uid(); current.name = (current.name + ' — copy').slice(0, 120); } else if (!current.id) current.id = uid();
    const existing = saved.findIndex(p => p.id === current.id);
    if (existing < 0 && saved.length >= 100) { notify('This browser already has 100 saved plans. Export or remove one before saving another.'); return; }
    const next = clone(saved); if (existing < 0) next.push(current); else next[existing] = current;
    if (!storageWrite(PLANS_KEY, next)) { updateStatus(); return; }
    saved = next; plan = clone(current); autoSave(); updatePlanFields(); updateSavedOptions(); notify('Saved “' + plan.name + '” in this browser.');
  }
  function printHtml(details) {
    const times = timing(plan.blocks);
    return '<header><p class="eyebrow">GRINDSTONE WRESTLING · COACH RUN SHEET</p><h1>' + esc(plan.name) + '</h1><p>' + (plan.age ? 'Ages ' + esc(plan.age) + ' · ' : '') + formatMinutes(totalMinutes()) + ' minutes' + (plan.target ? ' · target ' + formatMinutes(plan.target) + ' minutes' : '') + '</p>' + (plan.focus ? '<p><strong>Focus:</strong> ' + esc(plan.focus) + '</p>' : '') + '</header>' + printPlanning() + plan.blocks.map((b, i) => '<article class="builder-print-block"><h2>' + esc(timeRange(times[i])) + ' · ' + esc(b.name) + ' <small>(' + formatMinutes(b.minutes) + ' min)</small></h2>' + printDelivery(b) + '<p class="builder-preline">' + esc(b.instructions) + '</p>' + (b.cues ? '<p class="builder-preline"><strong>Cues:</strong> ' + esc(b.cues) + '</p>' : '') + (b.readiness ? '<p><strong>Ready when:</strong> ' + esc(b.readiness) + '</p>' : '') + (b.boundary ? '<p class="builder-preline"><strong>Boundaries:</strong> ' + esc(b.boundary) + '</p>' : '') + (byId.get(b.sourceId)?.status.includes('Video reference') ? '<p><strong>Video reference:</strong> coach must preview and choose the instruction.</p>' : '') + (details || b.type === 'game' ? (b.setup ? '<p><strong>Setup:</strong> ' + esc(b.setup) + '</p>' : '') + (b.steps.length ? '<ol>' + b.steps.map(s => '<li>' + esc(s) + '</li>').join('') + '</ol>' : '') + (b.adaptation ? '<p class="builder-preline">' + esc(b.adaptation) + '</p>' : '') : '') + '</article>').join('') + (plan.notes ? '<section><h2>Coach notes</h2><p class="builder-preline">' + esc(plan.notes) + '</p></section>' : '') + '<footer>Grindstone Guide · Custom practice · Timing includes instruction, turns and recovery.</footer>';
  }
  function printPlanning() {
    const data = frameworks(), program = known(data.programs, plan.program), session = known(data.sessions, plan.session), stage = known(data.stages, plan.stage);
    return '<div class="builder-print-meta">' + (program ? '<p><strong>Program:</strong> ' + esc(program.name + ' · ' + program.location) + '</p>' : '') + (session ? '<p><strong>' + esc(session.title) + ':</strong> ' + esc(session.description) + '</p>' : '') + (stage ? '<p><strong>Learning stage:</strong> ' + esc(stage.title + ' — ' + stage.description) + '</p>' : '') + '</div>';
  }
  function printDelivery(block) { return (block.section ? '<p><strong>Section:</strong> ' + esc(SECTIONS[block.section]) + '</p>' : '') + '<p><strong>Delivery:</strong> ' + esc(DELIVERY[block.delivery] || 'Whole group') + '</p>' + (block.rotation ? '<p class="builder-preline"><strong>Partner / station plan:</strong> ' + esc(block.rotation) + '</p>' : ''); }
  function exportPlan() {
    if (!validFields()) return;
    const blob = new Blob([JSON.stringify({ format: 'grindstone-practice', version: VERSION, plan: cleanPlan(plan) }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = 'grindstone-practice-' + (plan.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 34) || 'plan') + '.json'; a.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('Practice JSON exported. Keep it as a backup or import it on another device.');
  }
  function action(name, index) {
    const b = plan.blocks[index];
    if (name === 'framework') {
      const frame = known(frameworks().frameworks, plan.framework); if (!frame) return;
      if (plan.blocks.length && !window.confirm('Replace the current blocks with editable time slots? Save or export your draft first to keep a copy. Undo can restore it.')) return;
      remember(); plan.blocks = frameworkBlocks(frame); plan.target = frame.minutes; picker.destination = ''; updatePlanFields(); changed('Time framework added. Choose guides for the slots, then adjust tasks and minutes for your group.');
    }
    if (name === 'context' && pendingContext) { remember(); plan.age = pendingContext.age; plan.session = pendingContext.session; plan.focus = pendingContext.focus.slice(0, 500); updatePlanFields(); changed('Season focus applied. Your practice blocks stay in place.'); }
    if (name === 'add') {
      const destination = plan.blocks.findIndex(block => block.id === picker.destination), previous = plan.blocks[destination];
      if (!previous && plan.blocks.length >= MAX_BLOCKS) return;
      const item = byId.get(picker.selected); if (!['custom', 'water'].includes(picker.type) && !item) return;
      if (previous && !window.confirm('Replace the task and coaching details in “' + previous.name + '”? Its minutes, practice section and station plan stay. Undo can restore it.')) return;
      remember(); const next = blockFrom(['custom', 'water'].includes(picker.type) ? null : item, picker.type);
      if (previous) { Object.assign(next, { id: previous.id, minutes: previous.minutes, section: previous.section, delivery: previous.delivery, rotation: previous.rotation }); plan.blocks[destination] = next; }
      else plan.blocks.push(next);
      changed(previous ? 'Guide placed in the slot; its time and delivery stay.' : 'Block added. Edit its task and minutes for your group.', previous ? destination : plan.blocks.length - 1);
    }
    if ((name === 'up' || name === 'down') && b) { const to = index + (name === 'up' ? -1 : 1); if (to < 0 || to >= plan.blocks.length) return; remember(); [plan.blocks[index], plan.blocks[to]] = [plan.blocks[to], plan.blocks[index]]; changed('Block moved.', to); }
    if (name === 'remove' && b) { remember(); plan.blocks.splice(index, 1); changed('Block removed. Undo can restore it.'); }
    if (name === 'undo' && undoState) { const current = clone(plan); plan = undoState; undoState = current; updatePlanFields(); changed('Restored the previous practice structure.'); }
    if (name === 'reload-guide' && b && byId.has(b.sourceId)) { if (!window.confirm('Replace this block’s edited task and cues with its guide wording? Timing stays the same.')) return; remember(); const restored = blockFrom(byId.get(b.sourceId), b.type); Object.assign(restored, { id: b.id, minutes: b.minutes, section: b.section, delivery: b.delivery, rotation: b.rotation }); plan.blocks[index] = restored; changed('Guide details restored.', index); }
    if (name === 'detach-guide' && b) { remember(); b.sourceId = ''; b.type = 'custom'; changed('Kept the task and instructions as a coach-written block.', index); }
    if (name === 'save') saveNamed(false);
    if (name === 'duplicate') saveNamed(true);
    if (name === 'new') { if ((plan.blocks.length || plan.notes) && !window.confirm('Start a blank practice? Export or save this draft first if you need to keep it. Undo can restore it during this session.')) return; remember(); plan = newPlan(); updatePlanFields(); changed('Started a blank practice.'); }
    if (name === 'load') { const chosen = saved.find(p => p.id === root.querySelector('[data-saved-plan]').value); if (!chosen) { notify('Choose a saved practice first.'); return; } if (plan.blocks.length && !window.confirm('Replace this draft with “' + chosen.name + '”? Undo can restore the current draft.')) return; remember(); plan = clone(chosen); updatePlanFields(); changed('Loaded “' + chosen.name + '”.'); }
    if (name === 'delete') { const id = root.querySelector('[data-saved-plan]').value, chosen = saved.find(p => p.id === id); if (!chosen) { notify('Choose a saved practice first.'); return; } if (!window.confirm('Delete the saved practice “' + chosen.name + '” from this browser? The current draft is kept. Export the saved plan first if you need a backup.')) return; const next = saved.filter(p => p.id !== id); if (storageWrite(PLANS_KEY, next)) { saved = next; if (plan.id === id) { plan.id = ''; autoSave(); } updateSavedOptions(); notify('Saved practice deleted. The current draft is unchanged.'); } else updateStatus(); }
    if (name === 'backup' && initialBackup) { if (!window.confirm('Restore the draft that was present when this page first loaded? Undo can restore your current work.')) return; remember(); plan = clone(initialBackup); updatePlanFields(); changed('Restored the draft from page load.'); }
    if (name === 'export') exportPlan();
    if (name === 'print') { if (!validFields()) return; if (!plan.blocks.length) { notify('Add at least one block before printing.'); return; } root.querySelector('.builder-print-sheet').innerHTML = printHtml(root.querySelector('[data-print-details]').checked); window.print(); }
  }
  function bind(element) {
    root = element; if (!root) return; renderBlocks(); updatePlanning();
    if (!printListenerInstalled && window.addEventListener) {
      window.addEventListener('beforeprint', () => { if (root && root.isConnected) root.querySelector('.builder-print-sheet').innerHTML = printHtml(root.querySelector('[data-print-details]').checked); });
      printListenerInstalled = true;
    }
    if (root.dataset.builderBound) return; root.dataset.builderBound = 'true';
    root.addEventListener('input', e => {
      const el = e.target;
      if (el.dataset.picker === 'search') { picker.search = el.value; updatePicker(); return; }
      const field = el.dataset.planField;
      if (field) {
        if ((field === 'target' || field === 'startTime') && !el.validity.valid) return;
        if (field === 'program') { setProgram(el.value); updatePlanFields(); notice = 'Schedule and target updated. Existing block lengths stay as written; use the framework button to replace them.'; }
        else { plan[field] = field === 'target' ? number(el.value) : el.value; notice = ''; }
        autoSave(); updateSummary(); updatePlanning();
        if (field === 'age') { updatePicker(); root.querySelector('[data-pathway-link]').href = pathwayPath(); }
        return;
      }
      const key = el.dataset.blockField;
      if (key) { const block = plan.blocks[Number(el.closest('[data-block-index]').dataset.blockIndex)]; if (key === 'minutes' && !el.validity.valid) return; block[key] = key === 'minutes' ? number(el.value) : el.value; if (key === 'name') el.closest('[data-block-index]').querySelector('[data-block-title]').textContent = block.name || TYPES[block.type]; notice = ''; autoSave(); updateSummary(); }
    });
    root.addEventListener('change', async e => {
      const el = e.target;
      if (el.dataset.picker) { picker[el.dataset.picker] = el.type === 'checkbox' ? el.checked : el.value; if (el.dataset.picker === 'type' && !['move', 'drill', 'series'].includes(picker.type)) { picker.family = ''; root.querySelector('[data-picker="family"]').value = ''; } updatePicker(); return; }
      if (!el.matches('[data-import]')) return;
      const file = el.files && el.files[0]; if (!file) return;
      try { if (file.size > 2000000) throw new Error('Choose a JSON file smaller than 2 MB.'); const imported = parseImport(await file.text()); if (plan.blocks.length && !window.confirm('Open the imported practice as this draft? Undo can restore the current draft.')) return; remember(); plan = imported; updatePlanFields(); changed('Imported “' + plan.name + '”. Save it in this browser if you want to keep it.'); }
      catch (err) { notify('Import stopped: ' + err.message); }
      finally { el.value = ''; }
    });
    root.addEventListener('click', e => { const button = e.target.closest('[data-action]'); if (!button || button.disabled) return; const block = button.closest('[data-block-index]'); action(button.dataset.action, block ? Number(block.dataset.blockIndex) : -1); });
  }
  window.GRINDSTONE_BUILDER = { render, bind, testing: { normalizeCatalog, cleanPlan, parseImport, timing, esc, safeUrl, blockFrom, action, printHtml, keys: { draft: DRAFT_KEY, plans: PLANS_KEY }, getState: () => clone({ plan, saved, storageError, picker }), reset: () => { ready = false; root = null; initialBackup = null; saved = []; savedReadable = true; storageError = ''; notice = ''; undoState = null; picker = { type: 'move', search: '', matchAge: false, selected: '', family: '', destination: '' }; pendingContext = null; } } };
})();
