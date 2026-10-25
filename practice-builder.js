/* Buildless, browser-local practice planning. Catalog references never come from imported URLs. */
(function () {
  'use strict';
  const VERSION = 1;
  const weeks = () => window.GRINDSTONE_WEEKS;
  const components = () => window.GRINDSTONE_COMPONENTS;
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
  let storageError = '', notice = '', undoState = null, undoAttachment = null, initialBackup = null, savedReadable = true, printListenerInstalled = false;
  const emptyPicker = () => ({ type: '', search: '', matchAge: true, selected: '', family: '', destination: '', position: '', purpose: '', use: '', category: '', seriesChoices: {} });
  let picker = emptyPicker();
  let pendingReplacement = null, placementNotice = '', placementError = false;
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
  function newPlan() { return { version: VERSION, id: '', name: 'My practice', age: '', target: 0, program: '', framework: '', session: '', stage: '', startTime: '', focus: '', notes: '', blocks: [], ...(weeks()?.cleanMeta({}) || {}) }; }
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
  const tierAges = tier => tier === 'Pup' ? AGES : ['Beginner', 'Intermediate'].includes(tier) ? ['7-10', '11-14'] : tier === 'Advanced' ? ['11-14'] : [];
  const groupAge = () => plan.age || (plan.program === 'pups' ? '4-6' : '');
  function gameAges(game) {
    if (Array.isArray(game.age_groups)) return game.age_groups;
    return game.id <= 'G10' ? AGES : game.id <= 'G20' ? ['7-10', '11-14'] : ['11-14'];
  }
  function guideNotesHtml(item) {
    return [['Teaching-group guidance', item.ageNote], ['Age adaptations & restrictions', item.adaptation], ['Source scope', item.sourceNote]].filter(([,value]) => value).map(([label,value]) => '<p class="builder-preline"><strong>' + label + ':</strong> ' + esc(value) + '</p>').join('');
  }
  function retainedNote(value, current, name) {
    const previous = boundedString(value, name, 12000, false);
    return !current || previous.includes(current) ? previous : previous ? previous + '\nCurrent guide: ' + current : current;
  }
  function timingMismatch(block) { return block.type === 'game' && block.guideMinutes > 0 && block.minutes !== block.guideMinutes && !block.timingConfirmed; }
  function timingNote(block, controls) {
    if (!timingMismatch(block)) return '';
    const description = 'Timing needs review: this slot is ' + formatMinutes(block.minutes) + ' minutes; the copied game is ' + formatMinutes(block.guideMinutes) + ' minutes. Adjust the task, rounds and rest to fill the slot, or use the guide duration.';
    return '<p class="builder-notice">' + esc(description) + '</p>' + (controls ? '<div class="builder-block-actions"><button type="button" data-action="guide-duration">Use ' + formatMinutes(block.guideMinutes) + '-minute guide duration</button><button type="button" data-action="confirm-timing">I adjusted the rounds for this slot</button></div>' : '');
  }
  function normalizeCatalog() {
    const d = window.GRINDSTONE || {}, k = window.GRINDSTONE_KYLE || {};
    const ins = (window.GRINDSTONE_KYLE_INSTRUCTION || {}).entries || k.instruction || {};
    const v = window.GRINDSTONE_VIDEO_ADDITIONS || {}, pathway = window.GRINDSTONE_PATHWAY || {};
    const out = [];
    function gameSetup(entry, setup) {
      const q = entry.quick || {};
      return [['Equipment',entry.equipment],['Players',q.players],['Space',q.space],['Start',q.start],['Goal',q.goal],['Reset',q.reset]].filter(([,value])=>value).map(([label,value])=>label+': '+value).concat(setup || []).join('\n');
    }
    function add(item) {
      item.age_groups = list(item.age_groups).map(age).filter(x => AGES.includes(x));
      item.ageNote = item.ageNote || (item.age_groups.length ? 'Suggested teaching groups: ' + item.age_groups.join(', ') + '. Readiness and prerequisites still apply.' : 'Teaching group not assigned. Coach reference; select an appropriate adaptation before teaching.');
      item.steps = list(item.steps); item.cues = list(item.cues); item.types = list(item.types);
      item.status = item.status || (item.steps.length ? 'Written coaching guide' : 'Video reference — preview before teaching');
      item.video = safeUrl(item.video); item.minutes = Math.max(0.5, Math.min(120, number(item.minutes) || 5));
      out.push(item);
    }
    (d.moves || []).forEach(m => add({ id: m.id, title: m.name, types: ['move', 'drill'].concat(m.tier === 'Pup' ? ['warmup'] : []), category: m.category, tier: m.tier, age_groups: m.age_groups || tierAges(m.tier), sourceNote: ((d.research || {})[m.id] || {}).research?.source_limits || ((d.videos || {})[m.id] || {}).video?.verified_by, summary: m.purpose, instructions: m.drill || m.purpose, drill: m.drill, steps: m.steps, cues: m.cues, readiness: m.prerequisite, boundary: m.boundary, fix: [m.error, m.fix].filter(Boolean).join(' Correction: '), path: '#move/' + encodeURIComponent(m.id), video: ((d.videos || {})[m.id] || {}).video?.url, minutes: 5 }));
    (d.games || []).forEach(g => add({ id: g.id, title: g.name, types: ['game'], category: 'Games', tier: '', summary: g.description || g.format, instructions: [g.play, g.scoring ? 'Scoring: ' + g.scoring : '', g.reset ? 'Reset: ' + g.reset : '', g.timing ? 'Timing: ' + g.timing : ''].filter(Boolean).join('\n\n'), setup: gameSetup(g,g.setup), steps: [...(g.steps || [g.play]), g.variation ? 'Variation: ' + g.variation : ''].filter(Boolean), cues: g.cues || [], boundary: g.boundary, path: '#game/' + encodeURIComponent(g.id), video: ((d.videos || {})[g.id] || {}).video?.url, minutes: parseFloat(g.minutes), status: 'Written game guide', ageNote: g.ages, adaptation: g.quick?.adaptation || '', age_groups: gameAges(g), sourceNote: [...new Set([((d.videos || {})[g.id] || {}).video?.note, ((d.videos || {})[g.id] || {}).note, g.video_note].filter(Boolean))].join('\n') }));
    (k.entries || []).forEach(e => {
      const g = ins[e.id] || {}, isGame = e.kind === 'game';
      add({ id: 'kyle:' + e.id, title: e.name, types: isGame ? ['game'] : ['move', 'drill'].concat(e.id === 'K02' ? ['warmup'] : []), category: e.category, tier: g.tier || '', age_groups: g.age_groups || e.age_groups || tierAges(g.tier), summary: isGame ? e.description : g.purpose || e.description, instructions: g.drill ? [g.drill.setup, g.drill.rounds, g.drill.goal].filter(Boolean).join('\n') : g.purpose || e.description, setup: isGame ? gameSetup(e,g.setup) : g.setup, steps: g.steps, cues: g.cues || e.focus, readiness: g.readiness, boundary: lines(g.safety), path: '#moves/kyle/' + e.id, video: e.video?.url, minutes: e.minutes || 5, adaptation: Array.isArray(g.age_adaptations) ? g.age_adaptations.map(a => a.group + ': ' + a.text).join('\n') : '', sourceNote: g.verification || e.note });
    });
    (v.entries || []).forEach(e => add({ id: 'facebook:' + e.id, title: e.title, types: e.kind === 'game' ? ['game'] : ['move', 'drill'].concat(e.category === 'movement' ? ['warmup'] : []), category: e.category, tier: e.tier || '', age_groups: e.age_groups || tierAges(e.tier), summary: e.description || e.observed, instructions: list(e.steps).length ? lines(e.steps) : 'Preview the linked video and choose a task and coaching cues before teaching. ' + (e.description || e.observed || ''), setup: e.kind === 'game' ? gameSetup(e,e.setup) : e.setup, steps: e.steps, cues: e.cues, readiness: e.readiness, boundary: [lines(e.boundaries), lines(e.focus)].filter(Boolean).join('\n'), path: '#moves/videos/' + e.id, video: e.url, minutes: e.minutes || 5, adaptation: e.age_adaptations && typeof e.age_adaptations === 'object' ? Object.entries(e.age_adaptations).map(([a, val]) => a + ': ' + val).join('\n') : '', sourceNote: e.verification, status: list(e.steps).length ? 'Written coaching adaptation' : 'Video reference — no complete written instruction' }));
    (pathway.series || []).forEach(s => {
      const foundation = s.kind === 'foundation';
      const branches = (s.branches || []).map(b => ({ title: text(b.title), when: text(b.when), action: text(b.action), readiness: text(b.readiness) }));
      const instructions = [s.summary, (foundation ? 'Match essentials: ' : 'Common foundation: ') + s.foundation, foundation ? 'Choose one or more core skills to teach separately. Set up each skill in its own position; do not automatically chain these skills together.' : 'Choose one option to teach first; reset to the foundation before trying a different response.', ...branches.map(b => b.title + (foundation ? '\nSkill purpose: ' : '\nWhen: ') + b.when + (foundation ? '\nTeach: ' : '\nOption: ') + b.action + (b.readiness ? (foundation ? '\nBefore this skill: ' : '\nBefore adding this option: ') + b.readiness : '')), s.verification ? 'Source scope: ' + s.verification : ''].filter(Boolean).join('\n\n');
      add({ id: 'series:' + s.id, kind: s.kind, title: s.title, types: ['series'], category: foundation ? 'Match essentials' : 'Technique series', tier: s.tier, summary: s.summary, foundation: s.foundation, branches, instructions, setup: s.setup, steps: s.steps, cues: s.cues, readiness: s.readiness, boundary: lines(s.boundaries), age_groups: s.age_groups, path: seriesPath(s.id, pathway), move_ids: list(s.move_ids), minutes: s.minutes, status: foundation ? 'Core skills across match positions — teach separately' : 'Common foundation with reaction-based options' });
    });
    // Keep legacy source IDs so saved practices and earlier links retain their guides.
    (pathway.sequences || []).forEach(s => add({ id: 'series:' + s.id, kind: 'sequence', title: s.title, types: ['drill'], category: 'Linked movement drill', tier: s.tier, summary: s.summary, instructions: s.summary, setup: s.setup, steps: s.steps, cues: s.cues, readiness: s.readiness, boundary: lines(s.boundaries), age_groups: s.age_groups, path: seriesPath(s.id, pathway), move_ids: list(s.move_ids), minutes: s.minutes, status: 'Linked movement drill' }));
    (pathway.activities || []).forEach(a => add({ id: 'activity:' + a.id, title: a.title, types: [a.type], category: TYPES[a.type] || 'Activity', summary: a.summary || lines(a.instructions), instructions: lines(a.instructions), steps: list(a.steps).length ? a.steps : list(a.instructions), cues: a.cues, readiness: a.readiness, move_ids: list(a.move_ids), boundary: a.boundary, sourceNote: [a.sourceNote, ...(a.sources || []).map(x => x.title + ': ' + x.url)].filter(Boolean).join('\n'), age_groups: a.age_groups, path: '#season?' + new URLSearchParams({age: list(a.age_groups).map(age).find(value => AGES.includes(value)) || '', activity: a.id}), minutes: a.minutes, status: 'Written coaching activity' }));
    out.forEach(item => {
      const moveId = item.id.replace(/^kyle:/, '');
      item.memberships = (pathway.series || []).flatMap(series => (series.members || []).filter(member => member.move_id === moveId).map(member => ({ id: series.id, title: series.title, role: member.role, note: member.note })));
      const tags = window.GRINDSTONE_CATALOG_TAGS?.resolve(item.id);
      item.categoryLabel = tags?.categoryLabel || item.category;
      item.positions = list(tags?.positions); item.purposes = list(tags?.purposes); item.uses = list(tags?.uses);
      item.aliases = list(tags?.aliases); item.coreSkills = list(tags?.coreSkills); item.searchText = text(tags?.searchText);
      if (tags) {
        item.category = tags.category;
        item.age_groups = list(tags.age_groups).map(age).filter(value => AGES.includes(value));
        item.ageStatus = tags.ageStatus; item.ageBasis = tags.ageBasis;
        item.ageNote = [tags.ageNote, item.ageNote].filter((value,index,all) => value && all.indexOf(value) === index).join('\n');
        if (Array.isArray(tags.memberships)) item.memberships = clone(tags.memberships);
      }
    });
    return out.sort((a,b) => Number(b.kind === 'foundation') - Number(a.kind === 'foundation'));
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
    const blockIds = new Set();
    return { ...(weeks()?.cleanMeta(raw) || {}), version: VERSION, id: boundedString(raw.id, 'Plan ID', 100, false), name: boundedString(raw.name, 'Practice name', 120, true) || 'My practice', age: a, target, startTime, program: choice('program', frameworks().programs), framework: choice('framework', frameworks().frameworks), session: choice('session', frameworks().sessions), stage: choice('stage', frameworks().stages), focus: boundedString(raw.focus, 'Focus', 500, false), notes: boundedString(raw.notes, 'Notes', 12000, false), blocks: raw.blocks.map((b, i) => {
      if (!b || typeof b !== 'object' || !Object.hasOwn(TYPES, b.type)) throw new Error('Block ' + (i + 1) + ' has an unsupported type.');
      if (typeof b.minutes !== 'number' || !Number.isFinite(b.minutes) || b.minutes < 0.5 || b.minutes > 120 || !Number.isInteger(b.minutes * 2)) throw new Error('Block ' + (i + 1) + ' needs 0.5–120 minutes in half-minute increments.');
      const sourceId = boundedString(b.sourceId, 'Guide ID', 100, false), source = byId.get(sourceId);
      let blockId = typeof b.id === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(b.id) ? b.id : 'b-' + i;
      if (blockIds.has(blockId)) { let suffix = 1; while (blockIds.has('b-' + i + '-' + suffix)) suffix++; blockId = 'b-' + i + '-' + suffix; }
      blockIds.add(blockId);
      const clean = { id: blockId, type: b.type, minutes: b.minutes, sourceId: source || raw.status === 'completed' ? sourceId : '', name: boundedString(b.name, 'Block title', 200, true), instructions: boundedString(b.instructions, 'Block task', 16000, false), cues: boundedString(b.cues, 'Coaching cues', 6000, false), setup: boundedString(b.setup, 'Setup', 6000, false), readiness: boundedString(b.readiness, 'Readiness', 6000, false), boundary: boundedString(b.boundary, 'Boundaries', 10000, false), adaptation: boundedString(b.adaptation, 'Age adaptations', 12000, false), steps: [] };
      clean.adaptation = raw.status === 'completed' ? boundedString(b.adaptation, 'Age adaptations', 12000, false) : retainedNote(b.adaptation, source?.adaptation, 'Age adaptations');
      clean.ageNote = raw.status === 'completed' ? boundedString(b.ageNote, 'Teaching-group guidance', 12000, false) : retainedNote(b.ageNote, source?.ageNote, 'Teaching-group guidance');
      clean.sourceNote = raw.status === 'completed' ? boundedString(b.sourceNote, 'Source scope', 12000, false) : retainedNote(b.sourceNote, source?.sourceNote, 'Source scope');
      clean.guideMinutes = typeof b.guideMinutes === 'number' && Number.isFinite(b.guideMinutes) && b.guideMinutes > 0 && b.guideMinutes <= 120 ? b.guideMinutes : raw.status !== 'completed' && source?.types.includes('game') ? source.minutes : 0;
      clean.timingConfirmed = b.timingConfirmed === true;
      clean.section = Object.hasOwn(SECTIONS, b.section) ? b.section : '';
      clean.delivery = Object.hasOwn(DELIVERY, b.delivery) ? b.delivery : 'whole';
      clean.rotation = boundedString(b.rotation, 'Station / partner plan', 6000, false);
      if (raw.status !== 'completed' && source?.kind === 'sequence' && clean.type === 'series') clean.type = 'drill';
      if (b.steps != null && (!Array.isArray(b.steps) || b.steps.length > 60)) throw new Error('A block can contain at most 60 instruction steps.');
      clean.steps = (b.steps || []).map(s => boundedString(s, 'Instruction step', 4000, true));
      if (Object.hasOwn(b,'frameworkPrompt')) clean.frameworkPrompt = boundedString(b.frameworkPrompt, 'Original framework task', 16000, false);
      else if (raw.status !== 'completed') { const original = inferredFrameworkPrompt(b); if (original) clean.frameworkPrompt = original; }
      if (components()) Object.assign(clean, components().cleanBlock(b, catalog, {status:raw.status}));
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
    if (draft) { try { const raw = JSON.parse(draft); plan = cleanPlan(raw); weeks()?.readDraft?.(raw); initialBackup = clone(plan); } catch (_) { notice = 'The previous browser draft could not be read. Start a new plan or import a JSON backup.'; } }
    if (library) { try { const parsed = JSON.parse(library); if (!Array.isArray(parsed) || parsed.length > 100) throw new Error(); saved = parsed.map(cleanPlan); } catch (_) { notice += ' Saved plans could not be read; they have not been overwritten. Export this draft to keep it.'; saved = []; savedReadable = false; } }
    ready = true;
  }
  function autoSave() { const savedDraft = storageWrite(DRAFT_KEY, weeks()?.serializeDraft?.(plan) || plan); updateStatus(); return savedDraft; }
  function timing(blocks) { let elapsed = 0; return blocks.map(b => { const start = elapsed; elapsed += b.minutes; return { start, end: elapsed }; }); }
  function totalMinutes() { return plan.blocks.reduce((n, b) => n + b.minutes, 0); }

  const promptText = value => text(value).normalize('NFC').replace(/\s+/g,' ').trim();
  const isWarmup = block => block.section === 'prepare' || block.type === 'warmup';
  function warmupIdeasText() {
    return 'Warm-up options (use a familiar mix):\n' + list(frameworks().warmupIdeas).map(idea => '• ' + idea).join('\n') + '\nKeep it light and familiar; adapt to the group and leave everyone ready to learn.';
  }
  function warmupIdeasHtml(block, print = false) {
    if (!isWarmup(block) || plan.status === 'completed' || (print && text(block.instructions).includes('Warm-up options (use a familiar mix):'))) return '';
    return '<div class="builder-notice"><strong>Familiar warm-up</strong><p>Use your usual warm-up; no need to fill this slot each practice. Mix a few familiar options:</p><ul>' + list(frameworks().warmupIdeas).map(idea => '<li>' + esc(idea) + '</li>').join('') + '</ul><p>Keep it light and familiar; adapt to the group and leave everyone ready to learn.</p></div>';
  }
  function inferredFrameworkPrompt(block) {
    if (!promptText(block.instructions)) return '';
    const matching = frameworks().frameworks.flatMap(frame => frame.blocks).find(slot => !isWarmup(slot) && !['reset','recap'].includes(slot.section) && slot.type !== 'water' && promptText(slot.instructions) === promptText(block.instructions));
    return matching?.instructions || '';
  }
  function frameworkPrompt(block, record = plan) {
    if (Object.hasOwn(block,'frameworkPrompt')) return block.frameworkPrompt;
    return record?.status === 'completed' ? '' : inferredFrameworkPrompt(block);
  }
  function needsFrameworkTask(block, record = plan) {
    if (isWarmup(block)) return false;
    const original = promptText(frameworkPrompt(block,record));
    if (!original) return false;
    if (block.components?.activities?.some(activity => text(activity.name).trim() && text(activity.task).trim())) return false;
    const stations = block.components?.rotation?.stations;
    if (stations?.length && stations.every(station => text(station.name).trim() && text(station.task).trim())) return false;
    const task = promptText(block.instructions);
    return !task || task === original;
  }
  function unfilledSlots(record = plan) {
    return record.blocks.map((block,index) => ({block,index})).filter(({block}) => needsFrameworkTask(block,record));
  }
  function unfilledOverview(print = false) {
    const slots = unfilledSlots();
    if (!slots.length) return '';
    const ordered = [...slots].sort((a,b) => Number(b.block.section === 'teach') - Number(a.block.section === 'teach'));
    return '<div class="builder-unfilled-warning"><strong>' + slots.length + ' framework ' + (slots.length === 1 ? 'slot still needs' : 'slots still need') + ' a task.</strong><p>Choose a guide or write the actual activity for these slots. A time allocation alone does not identify what to teach.</p><ul>' + ordered.map(({block,index}) => '<li>' + (print || plan.status === 'completed' ? esc((index + 1) + '. ' + block.name) : '<button type="button" data-action="review-slot" data-slot-id="' + esc(block.id) + '">' + esc((index + 1) + '. ' + block.name) + '</button>') + '</li>').join('') + '</ul></div>';
  }
  function slotTaskWarning(block, print = false) {
    if (!needsFrameworkTask(block)) return '';
    return '<div class="builder-unfilled-warning"><strong>' + (block.section === 'teach' ? 'Choose a skill' : 'Needs a task') + '</strong><p>This framework slot still needs its actual activity. Choose a guide, write the task below, or complete the named tasks in its station rotation.</p>' + (!print && plan.status !== 'completed' ? '<button type="button" data-action="choose-slot">' + (block.section === 'teach' ? 'Choose a skill for this slot' : 'Choose a guide for this slot') + '</button>' : '') + '</div>';
  }
  function updateUnfilled() {
    const overview = root.querySelector('.builder-unfilled-overview'), html = unfilledOverview();
    if (overview && overview.innerHTML !== html) overview.innerHTML = html;
    root.querySelectorAll('[data-slot-readiness]').forEach(el => {
      const block = plan.blocks.find(item => item.id === el.dataset.slotReadiness), markup = block ? slotTaskWarning(block) : '';
      if (el.innerHTML !== markup) el.innerHTML = markup;
    });
    root.querySelectorAll('[data-slot-activities]').forEach(el => {
      const block = plan.blocks.find(item => item.id === el.dataset.slotActivities), markup = block ? slotActivitiesSummary(block) : '';
      if (el.innerHTML !== markup) el.innerHTML = markup;
    });
  }
  function slotActivitiesSummary(block) {
    const activities = block.components?.activities || [];
    return activities.length ? '<p class="builder-notice"><strong>Added to this slot:</strong> ' + activities.map(activity => esc(activity.name || 'Activity name needed')).join(' · ') + '</p>' : '';
  }

  function summaryHtml() {
    const total = totalMinutes(), delta = total - plan.target, timingCount = plan.blocks.filter(timingMismatch).length, unfilled = unfilledSlots().length;
    return '<strong>' + formatMinutes(total) + ' min planned</strong><span>' + plan.blocks.length + ' block' + (plan.blocks.length === 1 ? '' : 's') + '</span>' + (plan.target ? '<span class="' + (delta > 0 ? 'is-over' : '') + '">' + (delta === 0 ? 'Time on target' : formatMinutes(Math.abs(delta)) + ' min ' + (delta > 0 ? 'over' : 'under') + ' your ' + formatMinutes(plan.target) + '-min target') + '</span>' : '<span>Set a target if useful.</span>') + (timingCount ? '<span class="is-over">' + timingCount + ' game timing ' + (timingCount === 1 ? 'needs' : 'checks need') + ' review</span>' : '') + (unfilled ? '<span class="is-over">' + unfilled + (unfilled === 1 ? ' slot needs a task' : ' slots need a task') + '</span>' : '');
  }
  function statusText() { return [notice, storageError || 'Draft autosaves in this browser. Saved plans do not sync across devices.'].filter(Boolean).join(' '); }
  function updateStatus() { if (root) { const el = root.querySelector('.builder-status'); if (el) el.textContent = statusText(); } }
  function notify(message) { notice = message; updateStatus(); }
  function remember() { undoState = clone(plan); undoAttachment = weeks()?.captureAttachment?.() || null; }
  function options(values, selected, label) { return values.map(value => '<option value="' + esc(value) + '"' + (value === selected ? ' selected' : '') + '>' + esc(label ? label(value) : value) + '</option>').join(''); }
function tagDefinitions(key) { return window.GRINDSTONE_CATALOG_TAGS?.definitions?.[key] || []; }
  function tagLabel(key, id) { return tagDefinitions(key).find(item => item.id === id)?.label || id; }
  function categoryChoices() { return [...new Map(catalog.filter(item => item.category).map(item => [item.category, {id:item.category,label:item.categoryLabel || item.category}])).values()].sort((a,b) => a.label.localeCompare(b.label)); }
  function catalogMatches(item) {
    if (picker.type && !item.types.includes(picker.type)) return false;
    if (picker.category && item.category !== picker.category) return false;
    if (picker.position && !item.positions.includes(picker.position)) return false;
    if (picker.purpose && !item.purposes.includes(picker.purpose)) return false;
    if (picker.use && !item.uses.includes(picker.use)) return false;
    if (picker.family && item.id !== 'series:' + picker.family && !item.memberships.some(m => m.id === picker.family)) return false;
    if (picker.matchAge && groupAge() && !item.age_groups.includes(groupAge())) return false;
    const words = picker.search.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const haystack = [item.id, item.title, item.summary, item.category, item.categoryLabel, item.tier, item.status, item.searchText, ...item.aliases, ...item.cues, ...item.memberships.map(m => m.title + ' ' + m.role)].join(' ').toLowerCase();
    return words.every(word => haystack.includes(word));
  }
  function visibleCatalog() { return catalog.filter(catalogMatches); }
  function clearPickerFilters(key) {
    clearPlacement();
    const keys = ['type','search','family','position','purpose','use','category'];
    if (!key) { for (const field of keys) picker[field] = ''; picker.matchAge = true; }
    else if (keys.includes(key)) picker[key] = '';
    else if (key === 'matchAge') picker.matchAge = true;
    updatePicker();
  }
  function suggestedUses() {
    const slot = plan.blocks.find(block => block.id === picker.destination);
    if (!slot) return [];
    const bySection = {prepare:['warmup'],staples:['review'],teach:['teach'],choices:['reaction','situational'],physical:['strength','endurance'],game:['game'],recap:['review']};
    return (bySection[slot.section] || (['warmup','strength','endurance','game'].includes(slot.type) ? [slot.type] : [])).filter(id => tagDefinitions('uses').some(item => item.id === id));
  }
  function filterChipsHtml() {
    const labels = {type: value => TYPES[value],search:value => '“' + value + '”',category:value => categoryChoices().find(item => item.id === value)?.label || value,position:value => tagLabel('positions',value),purpose:value => tagLabel('purposes',value),use:value => tagLabel('uses',value),family:value => window.GRINDSTONE_PATHWAY?.series?.find(item => item.id === value)?.title || value};
    const prefixes = {type:'Type',search:'Search',category:'Category',position:'Position',purpose:'Purpose',use:'Use',family:'Series'};
    const chips = Object.keys(labels).filter(key => picker[key]).map(key => {
      const label = prefixes[key] + ': ' + labels[key](picker[key]);
      return '<button type="button" data-clear-filter="' + key + '" aria-label="' + esc('Remove ' + label + ' filter') + '">' + esc(label) + ' <span aria-hidden="true">×</span></button>';
    });
    if (!picker.matchAge) chips.push('<button type="button" data-clear-filter="matchAge" aria-label="Return to suggested teaching group">All groups + unassigned <span aria-hidden="true">×</span></button>');
    return chips.join('');
  }
  function pickerHtml() {
    const families = [...(window.GRINDSTONE_PATHWAY?.series || [])].sort((a,b) => Number(b.kind === 'foundation') - Number(a.kind === 'foundation'));
    const taggedSelect = (key, definition, label) => '<label>' + label + '<select data-picker="' + key + '"><option value="">Any ' + label.toLowerCase() + '</option>' + options(tagDefinitions(definition).map(item => item.id), picker[key], id => tagLabel(definition,id)) + '</select></label>';
    return '<h2 id="builder-library-title">Choose today’s work</h2><p>Find a guide by what you want to practice. Technique series share a starting position; Foundation Series collects match essentials to teach separately.</p>' +
      '<label>Put this work in<select data-picker="destination"></select></label><div class="builder-slot-suggestion"></div>' +
      '<div class="builder-resource-controls"><label>Find a guide<input type="search" data-picker="search" value="' + esc(picker.search) + '" placeholder="Name, cue, alias or series"></label>' +
      '<div class="builder-tag-filters">' + taggedSelect('position','positions','Position') + taggedSelect('purpose','purposes','Purpose') + taggedSelect('use','uses','Practice use') + '</div>' +
      '<label class="builder-check"><input type="checkbox" data-picker="matchAge"' + (picker.matchAge ? ' checked' : '') + '> Suggested for selected group</label><p class="builder-group-guidance"></p></div>' +
      '<details class="builder-more-filters"' + (picker.type || picker.category || picker.family ? ' open' : '') + '><summary>More filters / custom blocks</summary><div class="builder-secondary-filters">' +
      '<label>Category<select data-picker="category"><option value="">All categories</option>' + options(categoryChoices().map(item => item.id),picker.category,id => categoryChoices().find(item => item.id === id).label) + '</select></label>' +
      '<label>Series<select data-picker="family"><option value="">All series and guides</option>' + options(families.map(s => s.id), picker.family, id => families.find(s => s.id === id).title) + '</select></label>' +
      '<label>Block type<select data-picker="type"><option value="">All guide types</option>' + options(Object.keys(TYPES), picker.type, x => TYPES[x]) + '</select></label></div><p>Block type is optional. Choose Water / reset or Coach-written block to add your own task.</p></details>' +
      '<div class="builder-filter-summary"><div class="builder-filter-chips" aria-label="Active guide filters"></div><button type="button" data-action="clear-filters">Clear filters</button></div>' +
      '<div class="builder-guide-results"><p id="builder-match-count" class="builder-match-count" role="status" aria-live="polite"></p><label>Library guide<select data-picker="selected" size="8" aria-describedby="builder-match-count"></select></label></div>' +
      '<div class="builder-resource-preview"></div><div class="builder-placement-actions"><button type="button" data-action="append" hidden>Add to this slot</button><button type="button" data-action="add">Add block to practice</button></div><p class="builder-add-help fine" hidden>Add keeps what is already in the slot. Fill changes its main task; added activities stay. Both keep the slot’s time.</p><div class="builder-placement-feedback" aria-live="polite"></div>';
  }
  function guideTagsHtml(item) {
    const groups = [['Category',item.categoryLabel ? [item.categoryLabel] : []],['Position',item.positions.map(id => tagLabel('positions',id))],['Purpose',item.purposes.map(id => tagLabel('purposes',id))],['Practice use',item.uses.map(id => tagLabel('uses',id))]];
    return '<dl class="builder-guide-tags">' + groups.filter(([,values]) => values.length).map(([label,values]) => '<div><dt>' + label + '</dt><dd>' + values.map(esc).join(' · ') + '</dd></div>').join('') + '</dl>';
  }
  function resourcePreview(item) {
    if (picker.type === 'water') return '<h3>Water / reset</h3><p>Add a short drink, partner change and check-in. Adjust its length for your group.</p>';
    if (picker.type === 'custom') return '<h3>Your coaching task</h3><p>Add a blank block, then write instructions, rounds, rest and cues.</p>';
    if (!item) return '<p>No matching guide. Change the search or choose a coach-written block.</p>';
    const foundation = item.kind === 'foundation';
    const optionsHtml = item.foundation ? '<div class="pathway-foundation"><h4>' + (foundation ? 'Match essentials' : 'Common foundation') + '</h4><p>' + esc(item.foundation) + '</p></div>' + (foundation ? '<h4>Core skills</h4>' : '') + '<div class="pathway-branches">' + (item.branches || []).map(b => '<section class="pathway-branch"><h4>' + esc(b.title) + '</h4><p><strong>' + (foundation ? 'Skill purpose:' : 'When:') + '</strong> ' + esc(b.when) + '</p><p><strong>' + (foundation ? 'Teach:' : 'Option:') + '</strong> ' + esc(b.action) + '</p>' + (b.readiness ? '<p><strong>' + (foundation ? 'Before this skill:' : 'Before adding this option:') + '</strong> ' + esc(b.readiness) + '</p>' : '') + '</section>').join('') + '</div>' : '';
    return '<h3>' + esc(item.title) + '</h3><p class="builder-source-status">' + esc(item.status) + (item.tier ? ' · ' + esc(item.tier) : '') + '</p><p>' + esc(item.summary) + '</p>' + guideTagsHtml(item) + (item.memberships.length ? '<ul class="builder-memberships">' + item.memberships.map(m => '<li><strong>' + esc(m.title + ' · ' + m.role) + '</strong>' + (m.note ? '<br>' + esc(m.note) : '') + '</li>').join('') + '</ul>' : '') + (optionsHtml ? '<details class="builder-series-reference"><summary>Read full series instruction</summary>' + optionsHtml + '</details>' : '') + guideNotesHtml(item) + (item.types.includes('game') ? '<p class="builder-preline">' + esc(item.instructions) + '</p>' : '') + (item.readiness ? '<p><strong>Ready when:</strong> ' + esc(item.readiness) + '</p>' : '') + (item.age_groups.length ? '<p><strong>Suggested teaching groups:</strong> ' + esc(item.age_groups.join(', ')) + '</p>' : '') + (item.boundary ? '<p><strong>Boundaries:</strong> ' + esc(item.boundary) + '</p>' : '') + (item.steps.length ? '<details><summary>Read instruction before adding</summary>' + (item.setup ? '<p>' + esc(item.setup) + '</p>' : '') + '<ol>' + item.steps.map(s => '<li>' + esc(s) + '</li>').join('') + '</ol>' + '</details>' : '') + linksHtml(item) + (components()?.renderPicker(item, catalog, picker.seriesChoices[item.id]) || '');
  }
  function linksHtml(item) { return (item.path ? '<a href="' + esc(item.path) + '" target="_blank" rel="noopener">Open full guide ↗</a>' : '') + (item.video ? '<a href="' + esc(item.video) + '" target="_blank" rel="noopener">Watch source video ↗</a>' : ''); }
  function updateDestinationLabels() {
    if (!root) return;
    const missingDestination = picker.destination && !plan.blocks.some(b => b.id === picker.destination);
    root.querySelector('[data-picker="destination"]').innerHTML = '<option value="">Add at end of practice</option>' + (missingDestination ? '<option value="' + esc(picker.destination) + '" selected>Selected slot was removed — choose another</option>' : '') + options(plan.blocks.map(b => b.id), picker.destination, id => { const i = plan.blocks.findIndex(b => b.id === id); return 'Slot ' + (i + 1) + '. ' + plan.blocks[i].name + ' · keep ' + formatMinutes(plan.blocks[i].minutes) + ' min'; });
  }
  function updatePicker() {
    if (!root) return;
    const isManual = ['custom', 'water'].includes(picker.type);
    root.querySelector('.builder-resource-controls').hidden = isManual;
    root.querySelector('.builder-guide-results').hidden = isManual;
    const matches = visibleCatalog();
    if (!matches.some(x => x.id === picker.selected)) picker.selected = matches[0]?.id || '';
    const select = root.querySelector('[data-picker="selected"]');
    select.innerHTML = matches.map(item => '<option value="' + esc(item.id) + '"' + (item.id === picker.selected ? ' selected' : '') + '>' + esc(item.title + ' · ' + item.id + (!item.age_groups.length ? ' · group unassigned' : '') + (item.steps.length ? '' : ' · video reference')) + '</option>').join('');
    root.querySelector('#builder-match-count').textContent = matches.length + (matches.length === 1 ? ' matching guide' : ' matching guides') + (picker.matchAge && groupAge() ? ' suggested for ages ' + groupAge() : ' across the catalog') + (matches.length ? '.' : '. Clear a filter to broaden the results.');
    root.querySelector('.builder-filter-chips').innerHTML = filterChipsHtml();
    root.querySelector('.builder-group-guidance').textContent = !picker.matchAge ? 'Browsing all groups and unassigned coach references. These results are not a recommendation for this group; check each guide’s readiness, adaptations and boundaries.' : groupAge() ? 'Suggestions for ages ' + groupAge() + ' use documented ages or teaching tiers. Unassigned references are excluded. Uncheck to browse all groups and unassigned references. Readiness and prerequisites still apply.' : 'Choose an age group above for teaching suggestions. With no group selected, this catalog includes unassigned references; check readiness and prerequisites before teaching.';
    for (const key of ['type','search','family','position','purpose','use','category','matchAge']) {
      const field = root.querySelector('[data-picker="' + key + '"]');
      if (field) { if (key === 'matchAge') field.checked = picker.matchAge; else if (field.value !== picker[key]) field.value = picker[key]; }
    }
    root.querySelector('.builder-resource-preview').innerHTML = resourcePreview(byId.get(picker.selected));
    const missingDestination = picker.destination && !plan.blocks.some(b => b.id === picker.destination);
    if (missingDestination) { pendingReplacement = null; placementNotice = 'The selected slot no longer exists. Choose another slot or explicitly choose “Add at end of practice”.'; placementError = true; }
    updateDestinationLabels();
    const suggestions = suggestedUses();
    root.querySelector('.builder-slot-suggestion').innerHTML = suggestions.length ? '<p>Suggested for this slot: ' + suggestions.map(id => '<button type="button" data-suggest-use="' + esc(id) + '"' + (picker.use === id ? ' disabled' : '') + '>Filter by ' + esc(tagLabel('uses',id)) + '</button>').join(' ') + '</p><small>Optional; your search and other filters stay in place.</small>' : '';
    const collection = !isManual && components()?.isCollection?.(picker.selected);
    const add = root.querySelector('[data-action="add"]');
    add.textContent = collection ? (picker.destination ? 'Split this slot into moves' : 'Add moves as separate blocks') : picker.destination ? 'Fill this slot' : 'Add block to practice';
    add.disabled = (!picker.destination && plan.blocks.length >= MAX_BLOCKS) || (!isManual && !picker.selected);
    const append = root.querySelector('[data-action="append"]');
    append.hidden = !picker.destination || isManual || collection;
    append.disabled = missingDestination || !picker.selected || !components();
    const help = root.querySelector('.builder-add-help');
    help.hidden = isManual || (!picker.destination && !collection);
    help.textContent = collection ? 'Each move gets its own editable block. An existing slot’s minutes are divided between them; current planned work is kept as a separate block. Review the split before adding. You can move blocks or insert water breaks afterward.' : 'Add keeps what is already in the slot. Fill changes its main task; added activities stay. Both keep the slot’s time.';
    updatePlacement();
  }

  function placementLabel(block) {
    const selections = block.components?.series?.selections || [];
    return block.name + (selections.length ? ' · ' + selections.map(item => item.title).join(', ') : '');
  }
  function updatePlacement() {
    if (!root) return;
    const panel = root.querySelector('.builder-placement-feedback');
    if (!panel) return;
    const pending = pendingReplacement;
    const split = pending?.blocks ? '<div class="builder-replace-review" role="group" aria-label="Review separate move blocks"><p><strong>' + (pending.destination ? 'Divide “' + esc(pending.previousName) + '” into ' : 'Add ') + pending.blocks.length + ' separate blocks?</strong></p><ol>' + pending.blocks.map(block => '<li>' + esc(block.name) + ' — ' + formatMinutes(block.minutes) + ' min</li>').join('') + '</ol><p>' + formatMinutes(pending.total) + ' minutes total' + (pending.destination ? '; the practice total stays the same.' : ' will be added to the practice.') + ' This is an even starting split, not a recommended teaching dose. Adjust each block’s minutes, repetitions and rest for your group.</p>' + (pending.kept ? '<p>Your current activity, notes and any added tasks or stations are kept in the first block. Review station timing if that block is now shorter.</p>' : '') + '<p>Each move keeps its own instruction and series context. Reorder or remove blocks and put water breaks between them as needed. Undo restores the previous structure.</p><div><button type="button" data-action="confirm-replace">Use these blocks</button><button type="button" data-action="cancel-replace">Cancel</button></div></div>' : '';
    panel.innerHTML = (split || (pending ? '<div class="builder-replace-review" role="group" aria-label="Confirm slot contents"><p><strong>Fill “' + esc(pending.previousName) + '” with “' + esc(placementLabel(pending.next)) + '”?</strong></p><p>The slot keeps its ' + formatMinutes(pending.next.minutes) + ' minutes, practice section and station arrangements. This guide supplies the main task and linked teaching details for that time. Any added activities stay. Undo can return to the previous task.</p><div><button type="button" data-action="confirm-replace">Use this guide</button><button type="button" data-action="cancel-replace">Cancel</button></div></div>' : '')) + (placementNotice ? '<p class="builder-placement-' + (placementError ? 'error' : 'success') + '" role="' + (placementError ? 'alert' : 'status') + '">' + esc(placementNotice) + '</p>' : '');
  }
  function placementMessage(message, error = false) {
    placementNotice = message; placementError = error; updatePlacement(); notify(message);
  }
  function clearPlacement() { pendingReplacement = null; placementNotice = ''; placementError = false; updatePlacement(); }
  function splitMinutes(total, count) {
    const units = total * 2;
    if (!Number.isInteger(units) || count < 1 || units < count) throw Error('This slot is too short for ' + count + ' separate blocks. Allow at least ' + formatMinutes(count / 2) + ' minutes, or choose fewer moves. Nothing has changed.');
    return Array.from({length:count}, (_, index) => (Math.floor(units / count) + (index < units % count ? 1 : 0)) / 2);
  }
  function emptyFrameworkSlot(block) {
    if (block.sourceId || block.components?.activities?.length || block.components?.rotation || block.components?.series || text(block.rotation).trim()) return false;
    if (['setup','readiness','boundary','adaptation','ageNote','sourceNote'].some(key => text(block[key]).trim()) || block.steps?.length) return false;
    const task = promptText(block.instructions);
    if (!task && !text(block.cues).trim()) return !text(block.name).trim() || block.name === 'Coach-written block';
    return frameworks().frameworks.some(frame => frame.blocks.some(slot => slot.type !== 'water' && slot.section !== 'recap' && task === promptText(slot.instructions) && promptText(block.cues) === promptText(slot.cues)));
  }
  function prepareCollection(item, previous) {
    const prepared = preparedBlock(item,null), guides = components().expandedGuides(prepared,catalog);
    if (!guides?.length) throw Error('No individual moves are available for this collection. Choose an individual guide instead.');
    const kept = !!previous && !emptyFrameworkSlot(previous);
    const blocks = kept ? [clone(previous)] : [];
    for (const guide of guides) {
      if (kept && previous.sourceId === guide.id) continue;
      const block = blockFrom(guide,guide.types[0]);
      if (previous) { block.section = previous.section; block.delivery = previous.delivery === 'stations' ? 'whole' : previous.delivery; }
      blocks.push(block);
    }
    const total = previous ? previous.minutes : Math.max(prepared.minutes,blocks.length / 2);
    const minutes = splitMinutes(total,blocks.length);
    if (plan.blocks.length - (previous ? 1 : 0) + blocks.length > MAX_BLOCKS) throw Error('These moves would exceed the 100-block practice limit. Remove some blocks or choose fewer moves first.');
    blocks.forEach((block,index) => { block.minutes = minutes[index]; block.timingConfirmed = false; });
    if (previous && !kept) blocks[0].id = previous.id;
    return {blocks,total,kept};
  }
  function preparedBlock(item, previous) {
    const manual = ['custom','water'].includes(picker.type);
    let next = blockFrom(manual ? null : item,picker.type || item?.types[0]);
    if (components() && !manual) next = components().applyPicker(next,item,root,catalog);
    if (previous?.components?.rotation) next.components = {...(next.components || {}),version:1,rotation:clone(previous.components.rotation)};
    if (previous?.components?.activities) next.components = {...(next.components || {}),version:1,activities:clone(previous.components.activities)};
    if (previous) { Object.assign(next,{id:previous.id,minutes:previous.minutes,section:previous.section,delivery:previous.delivery,rotation:previous.rotation}); const original = frameworkPrompt(previous); if (original) next.frameworkPrompt = original; }
    return next;
  }
  function blockFrom(item, type) {
    const placement = { section: '', delivery: 'whole', rotation: '' };
    if (!item) return { ...placement, id: uid(), type, sourceId: '', name: type === 'water' ? 'Water and reset' : 'Coach-written block', minutes: type === 'water' ? 2 : 5, instructions: type === 'water' ? 'Drink water, check in with athletes and reset the practice space.' : '', cues: '', setup: '', readiness: '', boundary: '', adaptation: '', ageNote: '', sourceNote: '', guideMinutes: 0, timingConfirmed: false, steps: [] };
    return { ...placement, id: uid(), type, sourceId: item.id, name: item.title, minutes: item.minutes, instructions: item.instructions || item.summary || '', cues: lines(item.cues), setup: item.setup || '', readiness: item.readiness || '', boundary: item.boundary || '', adaptation: item.adaptation || '', ageNote: item.ageNote || '', sourceNote: item.sourceNote || '', guideMinutes: item.types.includes('game') ? item.minutes : 0, timingConfirmed: false, steps: clone(item.steps) };
  }
  function blockHtml(b, i, time) {
    const source = byId.get(b.sourceId), hasDetails = b.steps.length || b.setup || b.readiness || b.boundary || b.adaptation;
    return '<article class="builder-block" data-block-index="' + i + '"><div class="builder-block-heading"><h3><span class="builder-block-number">' + (i + 1) + '.</span> <span data-block-title>' + esc(b.name || TYPES[b.type]) + '</span></h3><span class="builder-block-time">' + esc(timeRange(time)) + '</span></div><div class="builder-block-actions"><button type="button" data-action="up" aria-label="Move block ' + (i + 1) + ' up"' + (i === 0 ? ' disabled' : '') + '>↑ Up</button><button type="button" data-action="down" aria-label="Move block ' + (i + 1) + ' down"' + (i === plan.blocks.length - 1 ? ' disabled' : '') + '>↓ Down</button><button type="button" data-action="remove" aria-label="Remove block ' + (i + 1) + '">Remove</button><button type="button" data-action="choose-slot">Choose guide for this slot</button></div><div data-slot-readiness="' + esc(b.id) + '">' + slotTaskWarning(b) + '</div>' + warmupIdeasHtml(b) + '<div data-slot-activities="' + esc(b.id) + '">' + slotActivitiesSummary(b) + '</div><div class="builder-block-fields"><label>Block name<input data-block-field="name" maxlength="200" value="' + esc(b.name) + '"></label><label>Minutes<input data-block-field="minutes" type="number" min="0.5" max="120" step="0.5" required value="' + b.minutes + '"></label><label>Type<select data-block-field="type">' + options(Object.keys(TYPES), b.type, x => TYPES[x]) + '</select></label><label>Practice section<select data-block-field="section"><option value="">Custom section</option>' + options(Object.keys(SECTIONS), b.section, x => SECTIONS[x]) + '</select></label><label>Delivery<select data-block-field="delivery">' + options(Object.keys(DELIVERY), b.delivery, x => DELIVERY[x]) + '</select></label><label>Task, rounds and rest<textarea data-block-field="instructions" rows="4" maxlength="16000">' + esc(b.instructions) + '</textarea></label><label>Coaching cues<textarea data-block-field="cues" rows="2" maxlength="6000">' + esc(b.cues) + '</textarea></label><label>Partner / station plan (optional)<textarea data-block-field="rotation" rows="2" maxlength="6000" placeholder="Coach, group, task at each station; work, rest and changeover time within this block.">' + esc(b.rotation) + '</textarea></label></div>' + (source ? '<p class="builder-source-status">' + esc(source.status) + ' · ' + esc(source.id) + '</p>' + linksHtml(source) + '<div class="builder-block-actions"><button type="button" data-action="reload-guide">Reload guide details</button><button type="button" data-action="detach-guide">Keep as coach-written task</button></div>' : '') + guideNotesHtml(b) + '<div class="builder-timing-note">' + timingNote(b, true) + '</div>' + (hasDetails ? '<details class="builder-block-detail"><summary>Instruction, readiness and boundaries</summary>' + (b.setup ? '<p><strong>Setup:</strong> ' + esc(b.setup) + '</p>' : '') + (b.readiness ? '<p><strong>Ready when:</strong> ' + esc(b.readiness) + '</p>' : '') + (b.steps.length ? '<ol>' + b.steps.map(s => '<li>' + esc(s) + '</li>').join('') + '</ol>' : '') + (b.boundary ? '<p class="builder-preline"><strong>Boundaries:</strong> ' + esc(b.boundary) + '</p>' : '') + '<p class="builder-detail-note">Your task and cues above can be edited. Reloading restores the guide wording; your timing stays.</p></details>' : '') + (components()?.renderBlock(b, i, catalog, groupAge()) || '') + '</article><div class="builder-block-actions"><button type="button" data-action="water-after" data-slot-id="' + esc(b.id) + '" aria-label="Add water break after block ' + (i + 1) + '">+ Water break · 2 min</button></div>';
  }
  function savedOptions() { return '<option value="">Choose a saved practice</option>' + saved.map(p => '<option value="' + esc(p.id) + '">' + esc(p.name + (p.age ? ' · ' + p.age : '') + ' · ' + formatMinutes(p.blocks.reduce((n, b) => n + b.minutes, 0)) + ' min' + (p.status === 'completed' ? ' · completed' : ' · planned') + (p.date ? ' · ' + p.date : '')) + '</option>').join(''); }
  function planningHtml() {
    const data = frameworks();
    return '<section class="builder-planning builder-no-print"><fieldset data-plan-edit><h2>Set up the practice</h2><p>Use an editable time framework, then choose the moves, tasks and games for each slot. Program and age are separate choices.</p><div class="builder-planning-grid"><label>Program<select data-plan-field="program"><option value="">Custom / choose a program</option>' + options(data.programs.map(p => p.id), plan.program, id => known(data.programs, id).name) + '</select></label><label>Time framework<select data-plan-field="framework"><option value="">Choose a practice length</option>' + options(data.frameworks.map(f => f.id), plan.framework, id => known(data.frameworks, id).title) + '</select></label><label>Session purpose<select data-plan-field="session"><option value="">Choose for today</option>' + options(data.sessions.map(s => s.id), plan.session, id => known(data.sessions, id).title) + '</select></label><label>Learning stage<select data-plan-field="stage"><option value="">Choose by readiness</option>' + options(data.stages.map(s => s.id), plan.stage, id => known(data.stages, id).title) + '</select></label></div><div class="builder-program-note"></div><div class="builder-session-note"></div><div class="builder-stage-note"></div><div class="builder-framework-preview"></div><button type="button" data-action="framework">Use this time framework</button><p class="fine">Minutes include demonstrations, partner turns, water and transitions. Adjust the blocks rather than filling spare time with extra fatigue.</p><div class="builder-context"></div></fieldset></section>';
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
    return framework.blocks.map(slot => ({ ...blockFrom(null, slot.type), section: slot.section, name: slot.name, minutes: slot.minutes, instructions: isWarmup(slot) ? slot.instructions + '\n\n' + warmupIdeasText() : slot.instructions, cues: lines(slot.cues), ...(!isWarmup(slot) && !['reset','recap'].includes(slot.section) && slot.type !== 'water' ? {frameworkPrompt:slot.instructions} : {}) }));
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
    if (selectedGuide) { picker.type = selectedGuide.types[0]; picker.search = ''; picker.family = ''; picker.position = ''; picker.purpose = ''; picker.use = ''; picker.category = ''; picker.selected = selectedGuide.id; notice = (picker.type === 'series' ? 'Series' : 'Drill') + ' selected below. Review it, then choose its place in the practice.'; }
    const requestedActivity = params && params.get('activity'), activity = byId.get('activity:' + requestedActivity);
    if (activity) { picker.type = activity.types[0]; picker.search = ''; picker.family = ''; picker.position = ''; picker.purpose = ''; picker.use = ''; picker.category = ''; picker.selected = activity.id; notice = 'Activity selected below. Review it, then choose its place in the practice.'; }
    const requestedMove = byId.get(params?.get('move'));
    if (requestedMove?.types.includes('move')) { picker.type = 'move'; picker.search = ''; picker.family = ''; picker.position = ''; picker.purpose = ''; picker.use = ''; picker.category = ''; picker.selected = requestedMove.id; notice = 'Move selected below. Choose a slot or add it at the end of your practice.'; }
    const requestedGame = byId.get(params?.get('game'));
    if (requestedGame?.types.includes('game')) { picker.type = 'game'; picker.search = ''; picker.family = ''; picker.position = ''; picker.purpose = ''; picker.use = ''; picker.category = ''; picker.selected = requestedGame.id; notice = 'Game selected below. Choose a slot or add it at the end of your practice.'; }
    const requestedAge = age(params && params.get('age'));
    if (plan.status !== 'completed' && !plan.age && AGES.includes(requestedAge)) plan.age = requestedAge;
    const requestedProgram = params?.get('program');
    if (plan.status !== 'completed' && !plan.program && !plan.blocks.length && known(frameworks().programs, requestedProgram)) setProgram(requestedProgram);
    const linkedGuide = selectedGuide || activity || requestedMove || (requestedGame?.types.includes('game') ? requestedGame : null);
    if (linkedGuide && picker.matchAge && groupAge() && !linkedGuide.age_groups.includes(groupAge())) notice = '“' + linkedGuide.title + '” is outside the current teaching-group suggestions. Uncheck “Match suggested teaching group” to review broader references; your practice is unchanged.';
    const group = window.GRINDSTONE_PATHWAY?.groups.find(g => g.age_group === requestedAge), phase = group?.phases.find(p => p.id === params?.get('phase'));
    const sessionId = params?.get('session'), cycleKey = { 'core-a': 'core_a', 'core-b': 'core_b', extension: 'extension' }[sessionId];
    pendingContext = phase?.practice_cycle?.[cycleKey] ? { title: phase.title + ' · ' + phase.practice_cycle[cycleKey].title, focus: phase.practice_cycle[cycleKey].focus, age: requestedAge, session: sessionId } : null;
    return '<section id="practice-builder" class="practice-builder"><div class="builder-no-print"><p class="eyebrow">COACH PLANNING</p><h1>Build a practice</h1><p>Plan the time, choose a foundation, and build the practice your group needs. Keep familiar staples, teach a useful option, then let wrestlers read and respond.</p><ol class="builder-quick-start"><li><strong>Set the time:</strong> choose a program or practice length, then use the time framework.</li><li><strong>Choose the work:</strong> select a slot and choose guides. Individual guides can share a slot; a series creates separate move blocks and divides the slot’s time.</li><li><strong>Make it yours:</strong> adjust minutes, move blocks and add water breaks between them.</li><li><strong>Keep it:</strong> save or export your draft, or print the run sheet.</li></ol><nav class="builder-shortcuts" aria-label="Builder shortcuts"><button type="button" data-action="jump-setup">Setup</button><button type="button" data-action="jump-library">Choose work</button><button type="button" data-action="jump-practice">Your practice</button><button type="button" data-action="save" data-save-label="Save">Save</button><button type="button" data-action="print">Print</button></nav><nav class="builder-tabs" aria-label="Practice planning"><a href="#practices" aria-current="page">Build a practice</a><a data-pathway-link href="' + esc(pathwayPath()) + '">Season pathway</a><a href="#season?view=series">Technique series</a><a href="#tracker">Schedule &amp; coverage</a></nav></div><p class="builder-status builder-no-print" role="status" aria-live="polite">' + esc(statusText()) + '</p><div class="builder-record-status builder-no-print" role="status"></div><div class="builder-unfilled-overview builder-no-print">' + unfilledOverview() + '</div>' + (weeks()?.render(params?.get('view') === 'week') || '') + planningHtml() + '<fieldset data-plan-edit class="builder-toolbar builder-no-print"><label>Practice name<input data-plan-field="name" maxlength="120" value="' + esc(plan.name) + '"></label><label for="builder-age">Age group (optional)<select id="builder-age" aria-label="Age group (optional)" data-plan-field="age"><option value="">Choose for this group</option>' + options(AGES, plan.age, a => 'Ages ' + a.replace('-', '–')) + '</select></label><label>Target minutes (optional)<input data-plan-field="target" type="number" min="0" max="240" step="0.5" placeholder="No target" value="' + (plan.target || '') + '"></label><label>Start time (optional)<input data-plan-field="startTime" type="time" value="' + esc(plan.startTime) + '"></label><label>Today’s focus (optional)<input data-plan-field="focus" maxlength="500" value="' + esc(plan.focus) + '" placeholder="e.g. sit-out: hip-heist or rise with forward pressure"></label><label>Practice date<input type="date" data-plan-field="date" value="' + esc(plan.date) + '"></label><label>Coach / owner<input data-plan-field="owner" maxlength="120" value="' + esc(plan.owner) + '"></label><label>Revision label<input data-plan-field="revision" maxlength="80" value="' + esc(plan.revision) + '"></label></fieldset><div class="builder-layout builder-no-print"><aside class="builder-library" aria-labelledby="builder-library-title"><fieldset data-plan-edit>' + pickerHtml() + '</fieldset></aside><section class="builder-draft" aria-labelledby="builder-draft-title"><h2 id="builder-draft-title" tabindex="-1">Your practice</h2><div class="builder-summary" aria-live="polite">' + summaryHtml() + '</div><fieldset data-plan-edit><div class="builder-block-list"></div><label class="builder-notes">Coach notes<textarea data-plan-field="notes" rows="3" maxlength="12000" placeholder="Partner groups, equipment, adaptations or what to revisit next time.">' + esc(plan.notes) + '</textarea></label></fieldset><div class="builder-actions"><button type="button" data-action="save" data-save-label="Save named practice">Save named practice</button><button type="button" data-action="duplicate">Save a copy</button><button type="button" data-action="new">Start blank</button><button type="button" data-action="undo"' + (undoState ? '' : ' disabled') + '>Undo last structural change</button><button type="button" data-action="print">Print run sheet</button></div><label class="builder-check"><input type="checkbox" data-print-details> Include full move instruction in printout</label><p class="fine builder-no-print">Game rules, age restrictions and source scope are always included in the run sheet. Review any timing warning before using it.</p></section></div>' + (weeks()?.handoffHtml(plan) || '') + '<section class="builder-saved builder-no-print"><h2>Saved practices & backups</h2><p><a class="button outline" href="#tracker?from=builder">Schedule this practice / record teaching</a></p><p>Stored on this browser only. Export a JSON file to keep a backup or share with another coach. Import opens a separate local copy. Completed records stay read-only; use Save completed record to keep them in this browser’s saved library.</p><label>Saved practice<select data-saved-plan>' + savedOptions() + '</select></label><div class="builder-actions"><button type="button" data-action="load">Load selected</button><button type="button" data-action="delete">Delete selected</button><button type="button" data-action="export">Export current practice (.json)</button><button type="button" data-action="backup"' + (initialBackup ? '' : ' disabled') + '>Restore draft from page load</button></div><label>Import practice JSON<input type="file" data-import accept=".json,application/json"></label></section><section class="builder-print-sheet" aria-label="Printable practice"></section></section>';
  }
  function renderBlocks(focusIndex) {
    if (!root) return;
    const times = timing(plan.blocks);
    root.querySelector('.builder-block-list').innerHTML = plan.blocks.length ? plan.blocks.map((b, i) => blockHtml(b, i, times[i])).join('') : '<div class="builder-empty"><h3>Choose a time framework or start blank</h3><p>Use the setup above for editable slots. Then choose guides on the left and put them in the slots you want.</p></div>';
    updateSummary();
    root.querySelector('[data-action="undo"]').disabled = !undoState;
    updatePicker(); updateRecord();
    if (focusIndex != null) (root.querySelector('[data-block-index="' + focusIndex + '"] input') || root.querySelector('[data-action="add"]'))?.focus();
  }
  function updateSummary() { if (!root) return; components()?.refresh(root, plan); updateUnfilled(); const summary = root.querySelector('.builder-summary'), markup = summaryHtml(); if (summary.innerHTML !== markup) summary.innerHTML = markup; const times = timing(plan.blocks); root.querySelectorAll('.builder-timing-note').forEach((el, i) => { el.innerHTML = timingNote(plan.blocks[i], true); }); root.querySelectorAll('.builder-block-time').forEach((el, i) => { if (times[i]) el.textContent = timeRange(times[i]); }); }
  function updatePlanFields() { root.querySelectorAll('[data-plan-field]').forEach(el => { const key = el.dataset.planField; el.value = key === 'target' ? (plan.target || '') : plan[key]; }); root.querySelector('[data-pathway-link]').href = pathwayPath(); updatePlanning(); updateRecord(); weeks()?.refresh(); }
  function completedNeedsSave() { return plan.status === 'completed' && !saved.some(record => record.id === plan.id && record.status === 'completed'); }
  function updateRecord() {
    if (!root) return;
    const completed = plan.status === 'completed';
    root.querySelectorAll('[data-plan-edit]').forEach(el => { el.disabled = completed; });
    root.querySelectorAll('[data-handoff-field]').forEach(el => { el.value = plan.handoff?.[el.dataset.handoffField] || ''; });
    const banner = root.querySelector('.builder-record-status');
    const needsSave = completedNeedsSave();
    if (banner) banner.textContent = completed ? 'Completed practice record · ' + (plan.completedAt || '').slice(0, 10) + '. This record is read-only. ' + (needsSave ? 'It is not yet in this browser’s saved library. Use Save completed record to keep its date, teaching notes and handoff unchanged. ' : 'The original is in this browser’s saved library. ') + 'Use Save a copy to plan the next practice or make a correction.' : '';
    const saveButtons = new Set([root.querySelector('[data-action="save"]'), ...root.querySelectorAll('[data-action="save"]')]);
    saveButtons.forEach(button => { if (!button) return; button.disabled = completed && !needsSave; button.textContent = needsSave ? 'Save completed record' : button.dataset?.saveLabel || 'Save named practice'; });
  }
  function replaceDraft(next) { remember(); plan = cleanPlan(next); updatePlanFields(); changed('Practice opened in the builder.'); }
  function completePlan() {
    if (!validFields(true)) return;
    if (!savedReadable) { notify('Save is unavailable. Export the practice to preserve your work.'); return; }
    if (!plan.blocks.length || !plan.handoff?.taught?.trim()) { notify('Add a practice block and a short “Actually taught” handoff before completing.'); return; }
    if (saved.length >= 100) { notify('This browser already has 100 saved practices. Export and remove one before completing another.'); return; }
    const completed = cleanPlan(plan);
    Object.assign(completed, {id:uid(), parentId:plan.id || plan.parentId || '', status:'completed', completedAt:new Date().toISOString()});
    const next = [...saved, completed];
    if (!storageWrite(PLANS_KEY, next)) { updateStatus(); return; }
    remember(); saved = next; plan = clone(completed); autoSave(); updateSavedOptions(); updatePlanFields(); renderBlocks(); weeks()?.refresh();
    notify('Completed practice saved as a separate, read-only record. If it belongs to a planning week, save it back to that session too.');
  }
  function updateSavedOptions() { root.querySelector('[data-saved-plan]').innerHTML = savedOptions(); }
  function incompleteStationTasks() {
    return plan.blocks.flatMap((block,index) => (components()?.readinessProblems?.(block) || []).map(message => 'Block ' + (index + 1) + ': ' + message));
  }
  function draftWarning() { const issues = incompleteStationTasks(); return issues.length ? ' Draft has ' + issues.length + ' unfinished station ' + (issues.length === 1 ? 'task' : 'tasks') + '; fill names and tasks before practice. They stay marked in print.' : ''; }
  function validFields(forCompletion = false) {
    const invalid = root.querySelector('input:invalid, select:invalid, textarea:invalid');
    if (invalid) {
      for (let details = invalid.closest?.('details'); details; details = details.parentElement?.closest?.('details')) details.open = true;
      invalid.focus?.(); invalid.reportValidity?.();
      notify('Check the highlighted input before continuing. Its invalid value has not been applied.'); return false;
    }
    const missing = incompleteStationTasks();
    if (forCompletion && missing.length) { notify('Finish the station tasks before marking this practice complete. ' + missing[0]); return false; }
    return true;
  }
  function changed(message, focusIndex) { clearPlacement(); autoSave(); renderBlocks(focusIndex); notify(message); }
  function saveNamed(copy) {
    if (!validFields()) return;
    if (!savedReadable) { notify('Existing saved-plan data could not be read, so it is being preserved. Export this practice as JSON to keep your work.'); return; }
    const saveCompleted = !copy && plan.status === 'completed';
    if (saveCompleted && !completedNeedsSave()) { notify('This completed record is already in this browser’s saved library. Use Save a copy to create an editable practice.'); return; }
    const current = cleanPlan(copy && plan.status === 'completed' && weeks() ? weeks().draftCopy(plan) : plan);
    if (copy) { current.id = uid(); current.name = (current.name + ' — copy').slice(0, 120); } else if (saveCompleted || !current.id) current.id = uid();
    const existing = saved.findIndex(p => p.id === current.id);
    if (existing < 0 && saved.length >= 100) { notify('This browser already has 100 saved plans. Export or remove one before saving another.'); return; }
    const next = clone(saved); if (existing < 0) next.push(current); else next[existing] = current;
    if (!storageWrite(PLANS_KEY, next)) { updateStatus(); return; }
    saved = next; if (copy) weeks()?.detach();
    const completedCopy = copy && plan.status === 'completed';
    if (completedCopy) { plan = clone(current); clearPlacement(); }
    else { plan.id = current.id; plan.name = current.name; }
    autoSave(); updatePlanFields(); updateSavedOptions();
    if (completedCopy) renderBlocks();
    notify((saveCompleted ? 'Saved completed record “' : 'Saved “') + plan.name + '” in this browser.' + (saveCompleted ? ' Its date, teaching notes and handoff remain read-only.' : draftWarning()));
  }
  function printHtml(details) {
    const times = timing(plan.blocks);
    return '<header><p class="eyebrow">GRINDSTONE WRESTLING · COACH RUN SHEET</p><h1>' + esc(plan.name) + '</h1><p>' + (plan.age ? 'Ages ' + esc(plan.age) + ' · ' : '') + formatMinutes(totalMinutes()) + ' minutes' + (plan.target ? ' · target ' + formatMinutes(plan.target) + ' minutes' : '') + '</p>' + (plan.focus ? '<p><strong>Focus:</strong> ' + esc(plan.focus) + '</p>' : '') + unfilledOverview(true) + '</header>' + printPlanning() + (weeks()?.printMeta(plan) || '') + plan.blocks.map((b, i) => '<article class="builder-print-block"><h2>' + esc(timeRange(times[i])) + ' · ' + esc(b.name) + ' <small>(' + formatMinutes(b.minutes) + ' min)</small></h2>' + slotTaskWarning(b,true) + warmupIdeasHtml(b,true) + printDelivery(b) + guideNotesHtml(b) + timingNote(b, false) + '<p class="builder-preline">' + esc(b.instructions) + '</p>' + (b.cues ? '<p class="builder-preline"><strong>Cues:</strong> ' + esc(b.cues) + '</p>' : '') + (b.readiness ? '<p><strong>Ready when:</strong> ' + esc(b.readiness) + '</p>' : '') + (b.boundary ? '<p class="builder-preline"><strong>Boundaries:</strong> ' + esc(b.boundary) + '</p>' : '') + (byId.get(b.sourceId)?.status.includes('Video reference') ? '<p><strong>Video reference:</strong> coach must preview and choose the instruction.</p>' : '') + (details || b.type === 'game' ? (b.setup ? '<p><strong>Setup:</strong> ' + esc(b.setup) + '</p>' : '') + (b.steps.length ? '<ol>' + b.steps.map(s => '<li>' + esc(s) + '</li>').join('') + '</ol>' : '') : '') + (components()?.printBlock(b, catalog) || '') + '</article>').join('') + (plan.notes ? '<section><h2>Coach notes</h2><p class="builder-preline">' + esc(plan.notes) + '</p></section>' : '') + '<footer>Grindstone Guide · Custom practice · Timing includes instruction, turns and recovery.</footer>';
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
    notify('Practice JSON exported. Keep it as a backup or import it on another device.' + draftWarning());
  }
  function action(name, index) {
    if (plan.status === 'completed' && !['save','duplicate','new','load','delete','backup','export','print','undo','jump-setup','jump-library','jump-practice','review-slot'].includes(name)) { notify('This is a completed record. Save a copy to edit a new practice.'); return; }
    if (name.startsWith('jump-')) {
      const target = {'jump-setup':'[data-plan-field="program"]','jump-library':'[data-picker="search"]','jump-practice':'#builder-draft-title'}[name];
      const node = target && root.querySelector(target); node?.scrollIntoView?.({block:'start'}); node?.focus?.(); return;
    }
    if (name === 'clear-filters') { clearPickerFilters(); return; }
    if (['framework','context','up','down','remove','water-after','undo','reload-guide','detach-guide','guide-duration','confirm-timing','new','load','backup'].includes(name) && !validFields()) return;
    const b = plan.blocks[index];
    if (name === 'framework') {
      const frame = known(frameworks().frameworks, plan.framework); if (!frame) return;
      if (plan.blocks.length && !window.confirm('Replace the current blocks with editable time slots? Save or export your draft first to keep a copy. Undo can restore it.')) return;
      remember(); plan.blocks = frameworkBlocks(frame); plan.target = frame.minutes; picker.destination = ''; updatePlanFields(); changed('Time framework added. Choose guides for the slots, then adjust tasks and minutes for your group.');
    }
    if (name === 'context' && pendingContext) { remember(); plan.age = pendingContext.age; plan.session = pendingContext.session; plan.focus = pendingContext.focus.slice(0, 500); updatePlanFields(); changed('Season focus applied. Your practice blocks stay in place.'); }

    if (name === 'review-slot' && b) { const task = root.querySelector('[data-block-index="' + index + '"] [data-block-field="instructions"]'); task?.scrollIntoView?.({block:'center'}); task?.focus?.(); return; }
    if (name === 'choose-slot' && b) { clearPlacement(); picker.destination = b.id; updatePicker(); const search = root.querySelector('[data-picker="search"]'); search?.scrollIntoView?.({block:'start'}); search?.focus?.(); return; }
    if (name === 'add' || name === 'append') {
      if (!validFields()) { placementMessage('Check the highlighted input first. Its invalid value has not been applied; your slot is unchanged.',true); return; }
      const destination = plan.blocks.findIndex(block => block.id === picker.destination), previous = plan.blocks[destination];
      if (picker.destination && !previous) { pendingReplacement = null; placementMessage('The selected slot no longer exists. Choose another slot or explicitly choose “Add at end of practice”.',true); return; }
      if (name === 'append' && !previous) { placementMessage('Choose an existing slot before adding another activity to it.',true); return; }
      if (!previous && plan.blocks.length >= MAX_BLOCKS) { placementMessage('This practice already has 100 blocks. Remove a block before adding another.',true); return; }
      const item = byId.get(picker.selected);
      if (!['custom','water'].includes(picker.type) && (!item || !catalogMatches(item))) { placementMessage('Choose a matching guide before adding it to this practice.',true); return; }
      if (!['custom','water'].includes(picker.type) && components()?.isCollection?.(item?.id)) {
        try {
          const split = prepareCollection(item,previous);
          pendingReplacement = {...split,destination:previous?.id || '',previous:previous ? JSON.stringify(previous) : '',previousName:previous?.name || '',sourceId:picker.selected,type:picker.type};
          placementNotice = ''; placementError = false; updatePlacement();
          const review = root.querySelector('[data-action="confirm-replace"]'); review?.scrollIntoView?.({block:'nearest'}); review?.focus?.();
        } catch (err) { pendingReplacement = null; placementMessage(err.message,true); }
        return;
      }
      if (name === 'append') {
        let combined;
        try {
          if (['custom','water'].includes(picker.type) || !components()) throw Error('Choose a library guide to add to this slot.');
          combined = components().appendActivity(previous,preparedBlock(item,null));
        } catch (err) { pendingReplacement = null; placementMessage(err.message,true); return; }
        remember(); plan.blocks[destination] = combined; pendingReplacement = null;
        changed('Activity added within the existing slot.',destination);
        placementMessage('Added “' + item.title + '” to slot ' + (destination + 1) + '. Existing tasks stay; share the same ' + formatMinutes(combined.minutes) + ' minutes between them.'); return;
      }
      let next;
      try { next = preparedBlock(item,previous); } catch (err) { pendingReplacement = null; placementMessage(err.message,true); return; }
      if (previous) {
        pendingReplacement = {destination:previous.id,previous:JSON.stringify(previous),previousName:previous.name,next,sourceId:picker.selected,type:picker.type};
        placementNotice = ''; placementError = false; updatePlacement(); const review = root.querySelector('[data-action="confirm-replace"]'); review?.scrollIntoView?.({block:'nearest'}); review?.focus?.(); return;
      }
      remember(); pendingReplacement = null; plan.blocks.push(next);
      changed('Block added. Edit its task and minutes for your group.',plan.blocks.length - 1);
      placementMessage('Added “' + placementLabel(next) + '” at the end of the practice.');
    }
    if (name === 'cancel-replace') { pendingReplacement = null; placementMessage('Selection cancelled. Your slot is unchanged.'); root.querySelector('[data-action="add"]')?.focus(); return; }
    if (name === 'confirm-replace') {
      if (!validFields()) { placementMessage('Check the highlighted input before filling this slot. Its invalid value has not been applied.',true); return; }
      const pending = pendingReplacement; if (!pending) { placementMessage('Choose the guide and slot, then review your choice again.',true); return; }
      const destination = plan.blocks.findIndex(block => block.id === pending.destination), previous = plan.blocks[destination];
      if (pending.blocks) {
        if ((pending.destination && (!previous || JSON.stringify(previous) !== pending.previous)) || picker.destination !== pending.destination || picker.selected !== pending.sourceId || picker.type !== pending.type) {
          pendingReplacement = null; placementMessage('The slot or guide changed after the split was prepared. Review the current selection again.',true); return;
        }
        if (plan.blocks.length - (previous ? 1 : 0) + pending.blocks.length > MAX_BLOCKS) { pendingReplacement = null; placementMessage('This split would exceed the 100-block practice limit. Choose fewer moves or remove a block.',true); return; }
        remember();
        const at = previous ? destination : plan.blocks.length;
        plan.blocks.splice(at,previous ? 1 : 0,...pending.blocks);
        if (previous) picker.destination = pending.blocks[0].id;
        pendingReplacement = null;
        changed('Individual move blocks added. Adjust their minutes and move them as needed.',at);
        placementMessage('Added ' + pending.blocks.length + ' separate blocks sharing ' + formatMinutes(pending.total) + ' minutes' + (previous ? '; the practice total stayed the same.' : '.') + ' Use the water-break button between blocks when needed.');
        return;
      }
      if (!previous || JSON.stringify(previous) !== pending.previous || picker.destination !== pending.destination || picker.selected !== pending.sourceId || picker.type !== pending.type) {
        pendingReplacement = null; placementMessage('The slot or guide changed after this choice was prepared. Review the current guide and choose the slot again.',true); return;
      }
      remember(); plan.blocks[destination] = pending.next; pendingReplacement = null;
      changed('Guide placed in the slot; its time and delivery stay.',destination);
      placementMessage('Filled slot ' + (destination + 1) + ' with “' + placementLabel(plan.blocks[destination]) + '”. Its time and station arrangements stayed.');
      return;
    }
    if ((name === 'up' || name === 'down') && b) { const to = index + (name === 'up' ? -1 : 1); if (to < 0 || to >= plan.blocks.length) return; remember(); [plan.blocks[index], plan.blocks[to]] = [plan.blocks[to], plan.blocks[index]]; changed('Block moved.', to); }
    if (name === 'remove' && b) { remember(); plan.blocks.splice(index, 1); changed('Block removed. Undo can restore it.', Math.min(index, plan.blocks.length - 1)); }
    if (name === 'water-after' && b) {
      if (plan.blocks.length >= MAX_BLOCKS) { notify('This practice already has 100 blocks. Remove a block before adding a water break.'); return; }
      const water = blockFrom(null,'water'); water.section = 'reset';
      remember(); clearPlacement(); plan.blocks.splice(index + 1,0,water);
      changed('Added a 2-minute water break. The practice is 2 minutes longer; adjust the break or another block to fit your target.',index + 1);
    }
    if (name === 'undo' && undoState) { const current = clone(plan), currentAttachment = weeks()?.captureAttachment?.() || null; plan = undoState; undoState = current; const previousAttachment = undoAttachment; undoAttachment = currentAttachment; weeks()?.restoreAttachment?.(previousAttachment); updatePlanFields(); changed('Restored the previous practice structure.'); }
    if (name === 'reload-guide' && b && byId.has(b.sourceId)) { if (!window.confirm('Replace this block’s edited task and cues with its guide wording? Timing stays the same.')) return; remember(); let restored = blockFrom(byId.get(b.sourceId), b.type); if (components()) restored = components().reloadBlock(b, restored, catalog); Object.assign(restored, { id: b.id, minutes: b.minutes, section: b.section, delivery: b.delivery, rotation: b.rotation, ...(b.frameworkPrompt ? {frameworkPrompt:b.frameworkPrompt} : {}) }); plan.blocks[index] = restored; changed('Guide details restored.', index); }
    if (name === 'detach-guide' && b) { remember(); b.sourceId = ''; b.type = 'custom'; changed('Kept the task and instructions as a coach-written block.', index); }
    if (name === 'guide-duration' && b && b.guideMinutes) { remember(); b.minutes = b.guideMinutes; b.timingConfirmed = false; changed('Used the guide duration. Review the practice total.', index); }
    if (name === 'confirm-timing' && b && timingMismatch(b)) { remember(); b.timingConfirmed = true; changed('Game timing marked reviewed for this slot. Your edited task and rounds are kept.', index); }
    if (name === 'complete') completePlan();
    if (name === 'save') saveNamed(false);
    if (name === 'duplicate') saveNamed(true);
    if (name === 'new') { if ((plan.blocks.length || plan.notes) && !window.confirm('Start a blank practice? Export or save this draft first if you need to keep it. Undo can restore it during this session.')) return; remember(); weeks()?.detach(); plan = newPlan(); updatePlanFields(); changed('Started a blank practice.'); }
    if (name === 'load') { const chosen = saved.find(p => p.id === root.querySelector('[data-saved-plan]').value); if (!chosen) { notify('Choose a saved practice first.'); return; } if (plan.blocks.length && !window.confirm('Replace this draft with “' + chosen.name + '”? Undo can restore the current draft.')) return; remember(); weeks()?.detach(); plan = clone(chosen); updatePlanFields(); changed('Loaded “' + chosen.name + '”.'); }
    if (name === 'delete') { const id = root.querySelector('[data-saved-plan]').value, chosen = saved.find(p => p.id === id); if (!chosen) { notify('Choose a saved practice first.'); return; } if (!window.confirm('Delete the saved practice “' + chosen.name + '” from this browser? The current draft is kept. Export the saved plan first if you need a backup.')) return; const next = saved.filter(p => p.id !== id); if (storageWrite(PLANS_KEY, next)) { saved = next; if (plan.id === id) { plan.id = ''; autoSave(); } updateSavedOptions(); updateRecord(); notify('Saved practice deleted. The current draft is unchanged.'); } else updateStatus(); }
    if (name === 'backup' && initialBackup) { if (!window.confirm('Restore the draft that was present when this page first loaded? Undo can restore your current work.')) return; remember(); weeks()?.detach(); plan = clone(initialBackup); updatePlanFields(); changed('Restored the draft from page load.'); }
    if (name === 'export') exportPlan();
    if (name === 'print') { if (!validFields()) return; if (draftWarning()) notify('Printing a draft with unfinished station tasks.' + draftWarning()); if (!plan.blocks.length) { notify('Add at least one block before printing.'); return; } root.querySelector('.builder-print-sheet').innerHTML = printHtml(root.querySelector('[data-print-details]').checked); window.print(); }
  }
  function bind(element) {
    root = element; if (!root) return; renderBlocks(); updatePlanning();
    weeks()?.bind(root, {getPlan:() => clone(plan), cleanPlan, newPlan, replacePlan:replaceDraft, notify, valid:validFields, saveDraft:autoSave});
    components()?.bind(root, {getPlan:() => plan, getCatalog:() => catalog, getAge:groupAge, valid:validFields, beforeChange:remember, onChange:({render,message}) => {autoSave(); if(render)renderBlocks(); else updateSummary(); if(message)notify(message);}});
    updateRecord();
    if (!printListenerInstalled && window.addEventListener) {
      window.addEventListener('beforeprint', () => { if (root && root.isConnected) root.querySelector('.builder-print-sheet').innerHTML = printHtml(root.querySelector('[data-print-details]').checked); });
      printListenerInstalled = true;
    }
    if (root.dataset.builderBound) return; root.dataset.builderBound = 'true';
    root.addEventListener('input', e => {
      const el = e.target;
      if (plan.status === 'completed' && (el.dataset.planField || el.dataset.blockField || el.dataset.handoffField || el.dataset.picker)) return;
      if (el.dataset.handoffField) { plan.handoff = plan.handoff || {}; plan.handoff[el.dataset.handoffField] = el.value; autoSave(); return; }
      if (el.dataset.picker === 'search') { clearPlacement(); picker.search = el.value; updatePicker(); return; }
      const field = el.dataset.planField;
      if (field) {
        if ((field === 'target' || field === 'startTime' || field === 'date') && !el.validity.valid) return;
        if (field === 'program') { clearPlacement(); setProgram(el.value); updatePlanFields(); updatePicker(); notice = 'Schedule and target updated. Existing block lengths stay as written; use the framework button to replace them.'; }
        else { plan[field] = field === 'target' ? number(el.value) : el.value; notice = ''; }
        autoSave(); updateSummary(); updatePlanning();
        if (field === 'age') { clearPlacement(); updatePicker(); root.querySelector('[data-pathway-link]').href = pathwayPath(); }
        return;
      }
      const key = el.dataset.blockField;
      if (key) { const block = plan.blocks[Number(el.closest('[data-block-index]').dataset.blockIndex)]; if (key === 'minutes' && !el.validity.valid) return; block[key] = key === 'minutes' ? number(el.value) : el.value; if (key === 'minutes' || key === 'instructions') block.timingConfirmed = false; if (key === 'name') el.closest('[data-block-index]').querySelector('[data-block-title]').textContent = block.name || TYPES[block.type]; if (key === 'name' || key === 'minutes') updateDestinationLabels(); notice = ''; autoSave(); updateSummary(); }
    });
    root.addEventListener('change', async e => {
      const el = e.target;
      if (el.dataset.componentBranch === 'picker') {
        if (plan.status === 'completed') return;
        picker.seriesChoices[picker.selected] = Array.from(root.querySelectorAll('[data-component-branch="picker"]')).filter(field => field.checked).map(field => field.value);
        clearPlacement(); return;
      }
      if (el.dataset.picker) { if (plan.status === 'completed') return; clearPlacement(); picker[el.dataset.picker] = el.type === 'checkbox' ? el.checked : el.value; updatePicker(); return; }
      if (!el.matches('[data-import]')) return;
      const file = el.files && el.files[0]; if (!file) return;
      if (!validFields()) { el.value = ''; return; }
      try { if (file.size > 2000000) throw new Error('Choose a JSON file smaller than 2 MB.'); const imported = parseImport(await file.text()); if (plan.blocks.length && !window.confirm('Open the imported practice as this draft? Undo can restore the current draft.')) return; remember(); weeks()?.detach(); plan = imported; updatePlanFields(); changed('Imported “' + plan.name + '”. ' + (plan.status === 'completed' ? 'Use Save completed record to keep this read-only record in the saved library.' : 'Save it in this browser if you want to keep it.')); }
      catch (err) { notify('Import stopped: ' + err.message); }
      finally { el.value = ''; }
    });
    root.addEventListener('click', e => {
      const filter = e.target.closest('[data-clear-filter], [data-suggest-use]');
      if (filter) { if (filter.disabled || plan.status === 'completed') return; if (filter.dataset.clearFilter) clearPickerFilters(filter.dataset.clearFilter); else if (suggestedUses().includes(filter.dataset.suggestUse)) { clearPlacement(); picker.use = filter.dataset.suggestUse; updatePicker(); } return; }
      const button = e.target.closest('[data-action]'); if (!button || button.disabled) return; const block = button.closest('[data-block-index]'); action(button.dataset.action, button.dataset.slotId ? plan.blocks.findIndex(item => item.id === button.dataset.slotId) : block ? Number(block.dataset.blockIndex) : -1); });
  }
  // The tracker receives copies, never mutable references to a builder draft.
  const tracker = {
    catalog() { init(); return clone(catalog); },
    saved() { init(); if (!savedReadable) throw Error('The saved practice library could not be read. Existing data is preserved.'); return clone(saved); },
    current() { init(); return clone(plan); },
    importPlan(raw) {
      init();
      const imported = cleanPlan(raw);
      const next = weeks()?.draftCopy(imported) || {...imported, id:'', status:'planned', completedAt:''};
      remember(); weeks()?.detach(); plan = next;
      if (!autoSave()) throw Error('The practice copy is open in memory, but browser storage is unavailable. Export it before leaving.');
      return clone(plan);
    }
  };
  window.GRINDSTONE_BUILDER = { render, bind, tracker, testing: { normalizeCatalog, catalogMatches, clearPickerFilters, suggestedUses, splitMinutes, prepareCollection, emptyFrameworkSlot, needsFrameworkTask, unfilledSlots, inferredFrameworkPrompt, cleanPlan, parseImport, timing, esc, safeUrl, blockFrom, action, printHtml, newPlan, replaceDraft, completePlan, keys: { draft: DRAFT_KEY, plans: PLANS_KEY }, getState: () => clone({ plan, saved, storageError, picker, pendingReplacement, placementNotice, placementError }), reset: () => { ready = false; root = null; initialBackup = null; saved = []; savedReadable = true; storageError = ''; notice = ''; undoState = null; undoAttachment = null; picker = emptyPicker(); pendingReplacement = null; placementNotice = ''; placementError = false; pendingContext = null; } } };
})();
