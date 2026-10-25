/* Group schedules and confirmed teaching history. Scheduling never marks a skill taught. */
(function () {
  'use strict';
  const M = () => window.GRINDSTONE_TRACKER_MODEL;
  const B = () => window.GRINDSTONE_BUILDER?.tracker;
  const S = () => window.GRINDSTONE_TRACKER_STORE;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));
  const uid = () => 'session-' + (window.crypto?.randomUUID ? window.crypto.randomUUID() : Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10));
  const today = () => { const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(p => [p.type,p.value])); return parts.year + '-' + parts.month + '-' + parts.day; };
  const defaultSeason = () => { const date = today(), y = Number(date.slice(0,4)) - (Number(date.slice(5,7)) < 7 ? 1 : 0); return y + '-' + (y + 1); };
  const visitedSeasons = new Set();
  let root, state, ticket = 0;
  function seasonOptions() {
    visitedSeasons.add(state.season);
    const currentYear = Number(defaultSeason().slice(0,4)), years = new Set();
    for (let year = currentYear - 5; year <= currentYear + 3; year++) years.add(year + '-' + (year + 1));
    const named = [];
    for (const season of visitedSeasons) {
      const match = /^(\d{4})-(\d{4})$/.exec(season);
      if (match && Number(match[2]) === Number(match[1]) + 1) years.add(season);
      else named.push(season);
    }
    const option = season => '<option value="' + esc(season) + '"' + (season === state.season ? ' selected' : '') + '>' + esc(season) + '</option>';
    return [...years].sort().reverse().map(option).join('') + (named.length ? '<optgroup label="Existing named seasons">' + named.sort().map(option).join('') + '</optgroup>' : '');
  }
  function param(params, key) { return typeof params?.get === 'function' ? params.get(key) : params?.[key]; }
  function curriculumId() { let hash = 2166136261; for (const c of state.season) hash = Math.imul(hash ^ c.charCodeAt(0),16777619); return 'curriculum:' + state.season.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,45) + '-' + (hash >>> 0).toString(36) + ':' + state.group; }
  function skill(raw) { return {id:raw.id, title:raw.title || raw.name || raw.id, path:raw.path || raw.route || '', category:raw.category || ''}; }
  function safePath(path) { return typeof path === 'string' && /^#(?:move\/|moves\/|game\/|games\/|season\?|practices\?)/.test(path) ? path : ''; }
  function skillName(item) { const p = safePath(item.path); return (p ? '<a href="' + esc(p) + '">' + esc(item.title) + '</a>' : esc(item.title)) + ' <span class="tracker-skill-id">' + esc(item.id) + '</span>'; }
  function dateLabel(value) { if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return 'Not recorded'; return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(value + 'T12:00:00Z')); }
  function timeLabel(value) { if (!/^\d{2}:\d{2}$/.test(value || '')) return ''; const [h,m] = value.split(':').map(Number); return (h % 12 || 12) + ':' + String(m).padStart(2,'0') + (h < 12 ? ' am' : ' pm'); }
  function allSkills() { const catalog = B()?.catalog() || []; return M().candidates({blocks:catalog.map(item => ({sourceId:item.id}))},catalog); }
  function group() { return M().groups.find(g => g.id === state.group) || M().groups[0]; }
  function records() { return state.data.sessions.filter(item => item.group === state.group && item.season === state.season); }
  function curriculum() { return state.data.curricula.find(item => item.group === state.group && item.season === state.season); }
  function expected() { return curriculum() || {id:curriculumId(),revision:0,group:state.group,season:state.season,skills:[]}; }
  function button(action, label, id, extra) { return '<button type="button" data-tracker-action="' + action + '"' + (id ? ' data-id="' + esc(id) + '"' : '') + (extra || '') + '>' + label + '</button>'; }
  function notify(message, error) {
    state.message = message; state.error = !!error;
    const box = root?.querySelector('[data-tracker-message]');
    if (box) { box.textContent = message; box.className = 'tracker-message' + (error ? ' is-error' : ''); box.setAttribute('role', error ? 'alert' : 'status'); }
  }
  function currentActor() { return state.actor || ''; }
  function sessionDefaults(plan) {
    const g = group();
    return {id:uid(),revision:0,season:state.season,group:state.group,date:today(),startTime:plan?.startTime || g.start || '',location:g.location || '',author:plan?.owner || plan?.author || currentActor(),lead:'',name:plan?.name || 'Group practice',status:'planned',plan:clone(plan) || null,skills:[],notes:'',noSkillReason:'',actor:currentActor()};
  }
  function render(params) {
    const valid = M()?.groups || [];
    const requested = param(params,'group');
    const season = String(param(params,'season') || '').trim();
    state = {group:valid.some(g => g.id === requested) ? requested : 'blue',season:season && season.length <= 80 && !/[\u0000-\u001f\u007f]/.test(season) ? season : defaultSeason(),data:{sessions:[],curricula:[],mode:'local'},view:param(params,'view') === 'coverage' ? 'coverage' : 'schedule',editor:null,actor:state?.actor || '',message:'',error:false,loading:true,loaded:false,fromBuilder:param(params,'from') === 'builder',filter:'',history:null};
    return '<section id="practice-tracker" class="practice-tracker"><p role="status">Loading group schedules…</p></section>';
  }
  function header() {
    return '<div class="tracker-heading"><p class="eyebrow">Coach planning</p><h1>Practice & season tracker</h1><p class="page-title">Schedule a saved plan. After practice, confirm what you taught. Your group’s first-covered and last-reviewed dates update from those completed practices.</p></div>' +
      '<nav class="tracker-groups" aria-label="Practice groups">' + M().groups.map(g => '<button type="button" data-tracker-action="group" data-id="' + esc(g.id) + '" aria-pressed="' + (g.id === state.group) + '">' + esc(g.name) + '</button>').join('') + '</nav>' +
      '<div class="tracker-toolbar"><form data-tracker-season><label>Season<select name="season" aria-describedby="tracker-season-help">' + seasonOptions() + '</select></label><span id="tracker-season-help" class="tracker-fine">Choose a season to view its schedule and teaching history.</span></form><div class="tracker-actions">' + button('refresh','Refresh records') + '<a class="button secondary" href="#practices">Practice builder</a></div></div>' +
      '<p class="tracker-mode ' + (state.loaded && state.data.mode === 'shared' ? 'is-shared' : '') + '">' + (!state.loaded ? (state.loading ? 'Checking tracker storage…' : 'Records have not loaded. Refresh to try again; no teaching history has been changed.') : state.data.mode === 'shared' ? '<strong>Shared tracker.</strong> Saved changes are visible to other coaches and families. Enter your name when making a change.' : '<strong>Local preview only.</strong> These records stay in this browser. Other coaches cannot see them until shared storage is connected.') + '</p>' +
      (state.group === 'valkyries' ? '<p class="tracker-fine tracker-independent">Valkyries have their own schedule and season goals. Nothing here copies dates, attendance rules or expectations from Mat Rats.</p>' : '') +
      '<p class="tracker-fine">Track group teaching here. Keep individual athlete, health and caregiver details out of public notes. “Covered” records a teaching opportunity, not an individual wrestler’s mastery.</p>' +
      '<div data-tracker-message class="tracker-message' + (state.error ? ' is-error' : '') + '" role="' + (state.error ? 'alert' : 'status') + '">' + esc(state.message) + '</div>' +
      '<nav class="tracker-views" aria-label="Group tracker view">' + button('schedule-view','Schedule & completed practices','', ' aria-pressed="' + (state.view === 'schedule') + '"') + button('coverage-view','Season skills','', ' aria-pressed="' + (state.view === 'coverage') + '"') + '</nav>';
  }
  function sessionCard(item) {
    return '<article class="tracker-session"><div class="tracker-card-heading"><div><span class="tracker-badge ' + esc(item.status) + '">' + esc(item.status === 'completed' ? 'Completed' : item.status === 'cancelled' ? 'Cancelled' : 'Planned') + '</span><h3>' + esc(item.name) + '</h3></div><p class="tracker-date">' + dateLabel(item.date) + (item.startTime ? '<br>' + timeLabel(item.startTime) : '') + '</p></div><dl class="tracker-details"><div><dt>Location</dt><dd>' + esc(item.location || 'Not set') + '</dd></div><div><dt>Lead coach</dt><dd>' + esc(item.lead || 'To be assigned') + '</dd></div><div><dt>Plan author</dt><dd>' + esc(item.author || 'Not recorded') + '</dd></div></dl>' +
      (item.status === 'completed' ? '<p class="tracker-fine">' + (item.skills?.length ? item.skills.length + ' confirmed skills: ' + item.skills.slice(0,4).map(s => esc(s.title)).join(', ') + (item.skills.length > 4 ? '…' : '') : 'No skills recorded: ' + esc(item.noSkillReason || 'See practice notes')) + '</p>' : '') +
      (item.notes ? '<details><summary>Practice notes</summary><p class="tracker-preline">' + esc(item.notes) + '</p></details>' : '') +
      '<div class="tracker-actions">' + (item.status === 'planned' ? button('complete','Confirm what was taught',item.id,' class="tracker-primary"') : '') + button('edit',item.status === 'completed' ? 'Correct completed record' : 'Edit practice',item.id) + (item.plan ? button('view-plan','View saved plan',item.id) : '') + button('history','History',item.id) + '</div></article>';
  }
  function scheduleHtml() {
    const list = records(), planned = list.filter(s => s.status === 'planned').sort((a,b) => (a.date + a.startTime).localeCompare(b.date + b.startTime)), completed = list.filter(s => s.status === 'completed').sort((a,b) => b.date.localeCompare(a.date)), cancelled = list.filter(s => s.status === 'cancelled').sort((a,b) => b.date.localeCompare(a.date));
    return '<section class="tracker-panel"><div class="tracker-section-heading"><div><h2>' + esc(group().name) + ' practices</h2><p>Dates, locations and coaches can change each week. Scheduling a plan does not mark its skills covered.</p></div>' + button('new','Schedule a practice','',' class="tracker-primary"') + '</div>' +
      '<h3 class="tracker-subheading">Scheduled <span>' + planned.length + '</span></h3><div class="tracker-card-grid">' + (planned.length ? planned.map(sessionCard).join('') : '<p class="tracker-empty">No practices scheduled for this group yet. Choose a saved plan or record a practice without one.</p>') + '</div>' +
      '<h3 class="tracker-subheading">Completed <span>' + completed.length + '</span></h3><div class="tracker-card-grid">' + (completed.length ? completed.map(sessionCard).join('') : '<p class="tracker-empty">Completed practices will appear here after a coach confirms what was taught.</p>') + '</div>' +
      (cancelled.length ? '<details class="tracker-cancelled"><summary>Cancelled practices (' + cancelled.length + ')</summary><div class="tracker-card-grid">' + cancelled.map(sessionCard).join('') + '</div></details>' : '') + '</section>';
  }
  function extraCoverage() {
    const target = expected(), ids = new Set(target.skills.map(s => s.id)), extra = new Map();
    records().filter(s => s.status === 'completed').forEach(s => (s.skills || []).forEach(item => { if (!ids.has(item.id)) extra.set(item.id,item); }));
    return M().coverage({...target,skills:[...extra.values()]},records());
  }
  function coverageTable(rows) {
    const query = state.filter.trim().toLowerCase(), filtered = rows.filter(s => (s.title + ' ' + s.category + ' ' + s.id).toLowerCase().includes(query));
    if (!filtered.length) return '<p class="tracker-empty">' + (query ? 'No skills match that search.' : 'No skills in this list yet.') + '</p>';
    return '<div class="tracker-coverage-table"><table><caption class="sr-only">' + esc(group().name) + ' teaching coverage</caption><thead><tr><th scope="col">Skill</th><th scope="col">First covered</th><th scope="col">Last reviewed</th><th scope="col">Practices</th></tr></thead><tbody>' + filtered.map(s => '<tr><th scope="row">' + skillName(s) + (s.category ? '<small>' + esc(s.category) + '</small>' : '') + '</th><td data-label="First covered">' + (s.firstCovered ? dateLabel(s.firstCovered) : '<span class="tracker-not-yet">Not yet covered</span>') + '</td><td data-label="Last reviewed">' + (s.lastReviewed ? dateLabel(s.lastReviewed) : '—') + '</td><td data-label="Practices">' + Number(s.count || 0) + '</td></tr>').join('') + '</tbody></table></div>';
  }
  function coverageHtml() {
    const saved = curriculum(), rows = M().coverage(expected(),records()), count = rows.filter(s => s.count > 0).length, extras = extraCoverage();
    return '<section class="tracker-panel"><div class="tracker-section-heading"><div><h2>' + esc(group().name) + ' season skills</h2><p>' + (saved ? 'These are the group’s agreed teaching goals for ' + esc(state.season) + '. Edit them as the season develops.' : 'Choose this group’s teaching goals. Start with suggested pathway skills, then keep, remove or add what fits your wrestlers.') + '</p></div>' + button('curriculum',saved ? 'Edit season expectations' : 'Set season expectations','',' class="tracker-primary"') + '</div>' +
      (saved ? '<p class="tracker-progress"><strong>' + count + ' of ' + rows.length + '</strong> expected skills covered in confirmed practices.</p>' : '<p class="tracker-notice">No season expectations have been saved for this group. Suggested lists are a starting point for coaches, not a required curriculum.</p>') +
      '<p class="tracker-fine"><a href="#in-progress/season-expectations">Review the proposed group baselines</a>. Coaches set and can revise this group’s list; a baseline does not replace saved selections.</p>' +
      '<label class="tracker-search">Search skill or category<input type="search" data-tracker-coverage-search value="' + esc(state.filter) + '" placeholder="Stand-up, half nelson, bottom…"></label><div data-coverage-list>' + coverageTable(rows) + (extras.length ? '<h3>Other skills taught</h3><p class="tracker-fine">Confirmed in practice, but not currently part of the expected list. Add any of these through Edit season expectations.</p>' + coverageTable(extras) : '') + '</div>' +
      (saved ? '<div class="tracker-actions">' + button('curriculum-history','Season-goal history',saved.id) + '</div>' : '') + '</section>';
  }
  function input(name,label,value,attributes) { return '<label>' + label + '<input name="' + name + '" value="' + esc(value) + '" ' + (attributes || '') + '></label>'; }
  function planSummary(plan) {
    if (!plan) return '<p class="tracker-fine">No plan attached. You can still confirm skills after this practice.</p>';
    const blocks = plan.blocks || [], total = blocks.reduce((n,b) => n + Number(b.minutes || 0),0);
    return '<p class="tracker-plan-summary"><strong>' + esc(plan.name || 'Saved practice') + '</strong> · ' + blocks.length + ' blocks · ' + total + ' minutes. A snapshot is kept with this session; later builder edits do not change it.</p>';
  }
  function chosenSkillsHtml() {
    const e = state.editor;
    return '<div class="tracker-skill-options">' + (e.options.length ? e.options.map(s => '<label class="tracker-check"><input type="checkbox" data-tracker-skill="' + esc(s.id) + '"' + (e.selected.has(s.id) ? ' checked' : '') + '><span>' + esc(s.title) + '<small><span class="tracker-skill-id">' + esc(s.id) + '</span>' + (s.category ? ' · ' + esc(s.category) : '') + '</small></span></label>').join('') : '<p class="tracker-fine">No skills selected yet. Add them from the library or enter a coach-written skill below.</p>') + '</div>';
  }
  function pickerHtml() {
    return '<details class="tracker-picker"' + (!state.editor.options.length ? ' open' : '') + '><summary>Add skills from the library or your own notes</summary><label>Find a skill<input type="search" data-tracker-skill-search placeholder="Try double leg, stand-up or sprawl"></label><div data-tracker-skill-results class="tracker-skill-results">' + skillResults('') + '</div><div class="tracker-manual-skill"><label>Coach-written skill<input data-tracker-manual maxlength="120" placeholder="A specific skill not in the library"></label>' + button('add-manual','Add skill') + '</div><p class="tracker-fine">Use the same library skill when possible so reviews update its existing history.</p></details>';
  }
  function skillResults(query) {
    const included = new Set(state.editor.options.map(s => s.id));
    const matching = allSkills().filter(s => !included.has(s.id) && (s.title + ' ' + s.category + ' ' + s.id).toLowerCase().includes(query.toLowerCase()));
    return matching.slice(0,30).map(s => '<div><span><strong>' + esc(s.title) + '</strong><small><span class="tracker-skill-id">' + esc(s.id) + '</span>' + (s.category ? ' · ' + esc(s.category) : '') + '</small></span>' + button('add-skill','Add <span class="sr-only">' + esc(s.title) + ' (' + esc(s.id) + ')</span>',s.id) + '</div>').join('') + (matching.length > 30 ? '<p class="tracker-fine">Showing 30 of ' + matching.length + ' matching skills. Type more to narrow the list.</p>' : !matching.length ? '<p class="tracker-fine">No more matching library skills.</p>' : '');
  }
  function completionHtml() {
    const e = state.editor, d = e.record;
    return '<section data-tracker-completion' + (d.status === 'completed' ? '' : ' hidden') + '><h3>Confirm what was actually taught</h3><p>Skills are prefilled from the plan. Uncheck anything skipped, add extras and then save. Only checked skills update coverage. This is a group teaching record, not a skill test for individual wrestlers.</p><div data-tracker-chosen>' + chosenSkillsHtml() + '</div>' + pickerHtml() + '<label>If no skills were taught, explain why<input name="noSkillReason" maxlength="500" value="' + esc(d.noSkillReason) + '" placeholder="For example, practice ended before instruction"></label></section>';
  }
  function sessionEditorTitle(e) { return e.restoring ? 'Restore an earlier practice version' : e.record.status === 'completed' ? e.originalStatus === 'completed' ? 'Review completed practice' : 'Confirm completed practice' : e.record.revision ? 'Edit practice' : 'Schedule a practice'; }
  function sessionEditorHtml() {
    const e = state.editor, d = e.record;
    let saved = [], savedError = '';
    try { saved = B()?.saved() || []; } catch (error) { savedError = error.message || 'This browser’s saved plans could not be loaded.'; }
    const shared = state.data.sessions.filter(s => s.plan && s.id !== d.id).sort((a,b) => b.date.localeCompare(a.date));
    return '<section class="tracker-editor" data-tracker-editor tabindex="-1"><div class="tracker-section-heading"><div><p class="eyebrow">' + esc(group().name) + ' · ' + esc(state.season) + '</p><h2 data-tracker-editor-title>' + sessionEditorTitle(e) + '</h2></div>' + button('close-editor','Close') + '</div><form data-tracker-session-form>' +
      '<div class="tracker-form-grid"><label class="tracker-wide">Saved practice<select data-tracker-plan><option value="">' + (d.plan ? 'Keep the attached plan' : 'Choose a saved practice, or leave unattached') + '</option>' + (saved.length ? '<optgroup label="Saved in this browser">' + saved.map((p,i) => '<option value="local:' + i + '">' + esc(p.name || 'Untitled practice') + '</option>').join('') + '</optgroup>' : '') + (shared.length ? '<optgroup label="Plans already in this season’s tracker">' + shared.map(s => '<option value="session:' + esc(s.id) + '">' + esc(s.name) + ' · ' + esc(s.group) + ' · ' + dateLabel(s.date) + '</option>').join('') + '</optgroup>' : '') + '</select></label></div>' + (savedError ? '<p role="alert" class="tracker-message is-error">' + esc(savedError) + ' Existing data has not been changed. You can still use a plan already in the tracker.</p>' : '') + '<div data-tracker-plan-summary>' + planSummary(d.plan) + '</div>' +
      '<div class="tracker-form-grid">' + input('name','Practice name',d.name,'required maxlength="160"') + '<label>Status<select name="status"><option value="planned"' + (d.status === 'planned' ? ' selected' : '') + '>Planned</option><option value="completed"' + (d.status === 'completed' ? ' selected' : '') + '>Completed — confirm skills below</option><option value="cancelled"' + (d.status === 'cancelled' ? ' selected' : '') + '>Cancelled</option></select></label>' +
      input('date','Practice date',d.date,'type="date" required') + input('startTime','Start time',d.startTime,'type="time"') + input('location','Building / location',d.location,'required maxlength="160"') + input('author','Plan author',d.author,'required maxlength="120"') + input('lead','Coach who leads / led it',d.lead,'maxlength="120"') + input('actor','Your name (saving this change)',d.actor || currentActor(),'required maxlength="120" autocomplete="name"') + '</div>' +
      '<label>Public group practice notes<textarea name="notes" rows="3" maxlength="8000" placeholder="What worked, what to revisit, equipment or a coaching handoff.">' + esc(d.notes) + '</textarea></label>' +
      (e.requireReason ? '<label>Reason for this correction<input name="correction" required maxlength="500" value="' + esc(e.correction || '') + '" placeholder="What changed, and why?"></label>' : '') + completionHtml() +
      '<p data-tracker-form-error class="tracker-message is-error" role="alert"></p><div class="tracker-actions"><button type="submit" class="tracker-primary" data-tracker-save>' + (d.status === 'completed' ? 'Confirm completed practice' : d.status === 'cancelled' ? 'Save cancelled practice' : 'Save scheduled practice') + '</button>' + button('close-editor','Cancel changes') + '</div><p class="tracker-fine">Saving a correction keeps the earlier version in History. A cancelled practice stays in the schedule history and does not count as taught.</p></form></section>';
  }
  function curriculumEditorHtml() {
    const e = state.editor;
    return '<section class="tracker-editor" data-tracker-editor tabindex="-1"><div class="tracker-section-heading"><div><p class="eyebrow">' + esc(group().name) + ' · ' + esc(state.season) + '</p><h2>' + (e.restoring ? 'Restore earlier season expectations' : 'Choose season expectations') + '</h2></div>' + button('close-editor','Close') + '</div><form data-tracker-curriculum-form><p>Choose what you expect this group to learn. Removing a goal does not erase completed teaching history.</p>' + input('actor','Your name (saving these goals)',e.record.actor || currentActor(),'required maxlength="120" autocomplete="name"') + '<div class="tracker-actions">' + button('suggestions','Add suggested pathway skills') + button('select-all','Check all listed skills') + button('unselect-all','Uncheck all listed skills') + '</div><div data-tracker-chosen>' + chosenSkillsHtml() + '</div>' + pickerHtml() + '<p data-tracker-form-error class="tracker-message is-error" role="alert"></p><div class="tracker-actions"><button type="submit" class="tracker-primary">Save season expectations</button>' + button('close-editor','Cancel changes') + '</div></form></section>';
  }
  function snapshotFields(entries) { return entries.filter(([,value]) => typeof value === 'string' && value.trim()).map(([label,value]) => '<p class="tracker-preline"><strong>' + esc(label) + ':</strong> ' + esc(value) + '</p>').join(''); }
  function guideSnapshotHtml(guide) {
    if (!guide || typeof guide !== 'object') return '';
    const steps = Array.isArray(guide.steps) ? guide.steps : [], cues = Array.isArray(guide.cues) ? guide.cues.join(' · ') : guide.cues;
    return '<details class="tracker-snapshot-guide"><summary>Saved teaching guide: ' + esc(guide.title || 'Instruction') + '</summary>' + snapshotFields([['Setup',guide.setup],['Task',guide.task]]) + (steps.length ? '<ol>' + steps.map(step => '<li>' + esc(step) + '</li>').join('') + '</ol>' : '') + snapshotFields([['Cues',cues],['Ready when',guide.readiness],['Boundaries',guide.boundary],['Age guidance',guide.ageNote],['Adaptations',guide.adaptation],['Source scope',guide.sourceNote]]) + '</details>';
  }
  function seriesSnapshotHtml(series) {
    if (!series || typeof series !== 'object') return '';
    const selections = Array.isArray(series.selections) ? series.selections : [], guides = Array.isArray(series.guides) ? series.guides : [];
    return '<section class="tracker-snapshot-series"><h5>' + (series.kind === 'foundation' ? 'Selected foundation skills' : 'Selected series options') + '</h5>' + (selections.length ? '<ul>' + selections.map(s => '<li>' + esc(s.title || '') + '</li>').join('') + '</ul>' : '') + guides.map(guideSnapshotHtml).join('') + '</section>';
  }
  function activitySnapshotHtml(activity,label) {
    if (!activity || typeof activity !== 'object') return '';
    return '<article class="tracker-snapshot-activity"><h4>' + esc(label) + ': ' + esc(activity.name || activity.title || 'Activity') + '</h4>' + snapshotFields([['Task',activity.task || activity.instructions],['Cues',Array.isArray(activity.cues) ? activity.cues.join(' · ') : activity.cues],['Coach',activity.coach],['Equipment',activity.equipment],['Space',activity.space],['Partner groups',activity.group],['Turns & recovery',activity.rounds],['Simpler version',activity.simpler],['Success',activity.success],['Stop / reset',activity.stop]]) + guideSnapshotHtml(activity.guide) + seriesSnapshotHtml(activity.series) + '</article>';
  }
  function componentsSnapshotHtml(block) {
    const c = block.components || {}, activities = Array.isArray(c.activities) ? c.activities : Array.isArray(block.activities) ? block.activities : [], rotation = c.rotation, stations = Array.isArray(rotation?.stations) ? rotation.stations : [];
    const minutes = value => typeof value === 'number' && Number.isFinite(value) ? value : 'not recorded';
    return (activities.length ? '<section class="tracker-snapshot-components"><h4>Additional activities in this slot</h4><p class="tracker-fine">These activities share the block’s ' + minutes(block.minutes) + ' minutes, including its main task.</p>' + activities.map((a,i) => activitySnapshotHtml(a,'Activity ' + (i + 1))).join('') + '</section>' : '') + seriesSnapshotHtml(c.series) + (rotation ? '<section class="tracker-snapshot-components"><h4>Simultaneous station rotation</h4><p class="tracker-fine">One shared clock: ' + minutes(rotation.rounds) + ' rounds × ' + minutes(rotation.workMinutes) + ' minutes of work; ' + minutes(rotation.changeMinutes) + ' minutes between rounds. Briefing: ' + minutes(rotation.briefingMinutes) + ' minutes. Finish / reset: ' + minutes(rotation.finishMinutes) + ' minutes.</p>' + stations.map((s,i) => activitySnapshotHtml(s,'Station ' + (i + 1))).join('') + '</section>' : '');
  }
  function planViewHtml() {
    const d = state.editor.record, p = d.plan;
    const blocks = p?.blocks || []; let elapsed = 0;
    return '<section class="tracker-editor" data-tracker-editor tabindex="-1"><div class="tracker-section-heading"><div><p class="eyebrow">Saved practice snapshot</p><h2>' + esc(p?.name || d.name) + '</h2></div>' + button('close-editor','Close') + '</div>' + planSummary(p) + '<ol class="tracker-plan-blocks">' + blocks.map(b => {
      const start = elapsed; elapsed += Number(b.minutes || 0);
      return '<li><h3>' + esc(b.title || b.name || b.type || 'Practice block') + '</h3><p class="tracker-fine">' + start + '–' + elapsed + ' min · ' + Number(b.minutes || 0) + ' minutes</p>' + (b.instructions ? '<p class="tracker-preline">' + esc(b.instructions) + '</p>' : '') + snapshotFields([['Setup',b.setup],['Cues',Array.isArray(b.cues) ? b.cues.join(' · ') : b.cues],['Ready when',b.readiness],['Boundaries',b.boundary],['Age guidance',b.ageNote],['Adaptations',b.adaptation]]) + componentsSnapshotHtml(b) + (b.notes ? '<p class="tracker-preline">' + esc(b.notes) + '</p>' : '') + '</li>';
    }).join('') + '</ol>' + (p?.notes ? '<p class="tracker-preline">' + esc(p.notes) + '</p>' : '') + '<div class="tracker-actions">' + button('builder-copy','Open a separate copy in builder') + button('close-editor','Close plan') + '</div></section>';
  }
  function historyHtml() {
    if (!state.history) return '';
    const h = state.history;
    return '<section class="tracker-history" data-tracker-history tabindex="-1"><div class="tracker-section-heading"><h2>Change history</h2>' + button('close-history','Close history') + '</div><p>Restoring opens a draft of that version. Saving it creates a new revision; earlier records remain available.</p>' + (h.loading ? '<p role="status">Loading earlier versions…</p>' : h.error ? '<p role="alert">' + esc(h.error) + '</p>' : !h.items.length ? '<p>No earlier records found.</p>' : '<ol>' + h.items.map((item,i) => '<li><h3>Revision ' + Number(item.revision) + '</h3><p>' + esc(item.actor || 'Name not recorded') + ' · ' + esc(item.savedAt ? new Date(item.savedAt).toLocaleString() : 'Time not recorded') + '</p><p>' + (h.kind === 'session' ? esc(item.record?.name || '') + ' · ' + dateLabel(item.record?.date) + ' · ' + esc(item.record?.status || '') : Number(item.record?.skills?.length || 0) + ' expected skills') + '</p>' + button('restore','Review this version',String(i)) + '</li>').join('') + '</ol>') + '</section>';
  }
  function paint(focusEditor) {
    if (!root || !state) return;
    root.innerHTML = header() + (state.loading ? '<p role="status">Loading records…</p>' : !state.loaded ? '' : (state.editor ? state.editor.kind === 'session' ? sessionEditorHtml() : state.editor.kind === 'curriculum' ? curriculumEditorHtml() : planViewHtml() : '') + historyHtml() + (state.view === 'coverage' ? coverageHtml() : scheduleHtml()));
    if (focusEditor) root.querySelector('[data-tracker-editor]')?.focus();
  }
  async function load() {
    const current = ++ticket, active = state;
    try {
      const data = await S().load(state.season);
      if (current !== ticket || active !== state || !root?.isConnected) return;
      state.data = data; state.loading = false; state.loaded = true;
      if (state.fromBuilder) { state.fromBuilder = false; const plan = B()?.current(); if (plan?.blocks?.length) openSession(sessionDefaults(plan),false,false); else notify('Start or save a plan in the practice builder, then schedule it here.',false); }
      paint(!!state.editor);
    } catch (error) { if (current !== ticket || active !== state) return; state.loading = false; notify(error.message || 'Could not load the tracker. Refresh to try again.',true); paint(); }
  }
  function selectedSkills() { const e = state.editor; return e.options.filter(s => e.selected.has(s.id)).map(skill); }
  function captureSession() {
    const form = root.querySelector('[data-tracker-session-form]');
    if (!form || state.editor?.kind !== 'session') return;
    const e = state.editor, data = new FormData(form);
    ['name','date','startTime','location','author','lead','actor','notes','noSkillReason','status'].forEach(key => { if (data.has(key)) e.record[key] = String(data.get(key)).trim(); });
    e.correction = String(data.get('correction') || '').trim();
  }
  function captureEditor() { captureSession(); if (state.editor?.kind === 'curriculum') { const actor = root.querySelector('[data-tracker-curriculum-form] [name="actor"]'); if (actor) state.editor.record.actor = actor.value; } }
  function openSession(record,complete,restoring) {
    const d = clone(record), existing = Number(d.revision) > 0;
    if (complete) d.status = 'completed';
    d.actor = currentActor();
    const candidates = M().candidates(d.plan || {}, B()?.catalog() || []), choices = new Map();
    [...candidates,...(d.skills || [])].forEach(s => choices.set(s.id,skill(s)));
    const initial = record.status === 'completed' ? (d.skills || []) : candidates;
    state.editor = {kind:'session',record:d,originalStatus:record.status,options:[...choices.values()],selected:new Set(initial.map(s => s.id)),requireReason:!!restoring || (existing && record.status === 'completed'),restoring:!!restoring,dirty:false,correction:''};
    state.history = null; paint(true);
  }
  function openCurriculum(record,restoring) {
    const d = clone(record || expected());
    d.actor = currentActor();
    const options = d.skills.length ? d.skills : (record || curriculum() ? [] : M().seed(state.group,B()?.catalog() || [],window.GRINDSTONE_PATHWAY || {}));
    state.editor = {kind:'curriculum',record:d,options:options.map(skill),selected:new Set(options.map(s => s.id)),restoring:!!restoring,dirty:false};
    state.history = null; paint(true);
  }
  function discard() { return !state.editor?.dirty || window.confirm('Discard your unsaved tracker changes?'); }
  function closeEditor() { if (!discard()) return; state.editor = null; paint(); }
  function refreshSkills() {
    root.querySelector('[data-tracker-chosen]').innerHTML = chosenSkillsHtml();
    const query = root.querySelector('[data-tracker-skill-search]')?.value || '';
    const results = root.querySelector('[data-tracker-skill-results]'); if (results) results.innerHTML = skillResults(query);
  }
  function addSkills(items) {
    const e = state.editor;
    items.forEach(s => { if (!e.options.some(item => item.id === s.id)) e.options.push(skill(s)); e.selected.add(s.id); });
    e.dirty = true; refreshSkills();
  }
  function updateAddress() { const params = new URLSearchParams({group:state.group,season:state.season}); if (state.view === 'coverage') params.set('view','coverage'); const hash = '#tracker?' + params.toString(); if (window.GRINDSTONE_NAVIGATION?.replaceRoute) window.GRINDSTONE_NAVIGATION.replaceRoute(hash); else window.history.replaceState(window.history.state,'',hash); }
  async function showHistory(kind,id) {
    if (!discard()) return;
    state.editor = null; state.history = {kind,id,items:[],loading:true}; paint();
    root.querySelector('[data-tracker-history]')?.focus();
    const current = state.history;
    try { const items = await S().history(kind,id); if (current !== state.history) return; current.items = items; current.loading = false; paint(); }
    catch (error) { if (current !== state.history) return; current.error = error.message || 'Could not load history.'; current.loading = false; paint(); }
  }
  function restore(index) {
    const history = state.history, item = history?.items[Number(index)]; if (!item?.record) return;
    const latest = history.kind === 'session' ? state.data.sessions.find(s => s.id === history.id) : state.data.curricula.find(c => c.id === history.id);
    const record = {...clone(item.record),revision:latest?.revision || 0};
    if (history.kind === 'session') openSession(record,false,true); else openCurriculum(record,true);
    state.editor.dirty = true;
  }
  async function save(form,kind) {
    const e = state.editor; if (!e || e.saving) return;
    const errorBox = form.querySelector('[data-tracker-form-error]'); errorBox.textContent = '';
    try {
      let record;
      if (kind === 'session') {
        captureSession();
        if (e.requireReason && !e.correction) throw new Error('Add a short reason for the correction.');
        const raw = {...e.record,skills:e.record.status === 'completed' ? selectedSkills() : []};
        if (e.correction) raw.notes = [raw.notes,'Correction: ' + e.correction].filter(Boolean).join('\n\n');
        record = M().cleanSession(raw,{today:today()});
      } else record = M().cleanCurriculum({...e.record,actor:new FormData(form).get('actor'),skills:selectedSkills()});
      e.saving = true; form.querySelectorAll('button').forEach(b => { b.disabled = true; });
      const result = await (kind === 'session' ? S().saveSession(record) : S().saveCurriculum(record));
      if (e !== state.editor) return;
      state.actor = record.actor;
      const list = kind === 'session' ? state.data.sessions : state.data.curricula, index = list.findIndex(s => s.id === result.id);
      if (index >= 0) list[index] = result; else list.push(result);
      state.editor = null;
      notify(kind === 'session' ? result.status === 'completed' ? 'Practice confirmed. Checked skills now update this group’s teaching history.' : result.status === 'cancelled' ? 'Practice marked cancelled. It does not count toward teaching coverage.' : 'Practice scheduled. Confirm what was taught after practice to update coverage.' : 'Season expectations saved for ' + group().name + '.',false);
      paint(); root.querySelector('[data-tracker-message]')?.scrollIntoView({block:'nearest'});
    } catch (error) {
      e.saving = false; form.querySelectorAll('button').forEach(b => { b.disabled = false; });
      errorBox.textContent = error.message || 'Could not save. Your changes are still here.';
      if (error.status === 409 || error.code === 'conflict') errorBox.innerHTML = esc(errorBox.textContent) + ' Your draft is preserved. ' + button('latest','Open the latest saved version');
      errorBox.scrollIntoView({block:'nearest'});
    }
  }
  async function action(buttonElement) {
    const action = buttonElement.dataset.trackerAction, id = buttonElement.dataset.id;
    const record = () => state.data.sessions.find(s => s.id === id);
    if (state.editor?.saving) return;
    captureEditor();
    if (action === 'new') { if (discard()) openSession(sessionDefaults(),false,false); }
    else if (action === 'edit' || action === 'complete') { if (record() && discard()) openSession(record(),action === 'complete',false); }
    else if (action === 'close-editor') closeEditor();
    else if (action === 'group') { if (!discard()) return; state.editor = null; state.history = null; state.group = id; state.filter = ''; state.message = ''; updateAddress(); paint(); }
    else if (action === 'schedule-view' || action === 'coverage-view') { state.view = action === 'coverage-view' ? 'coverage' : 'schedule'; updateAddress(); captureSession(); paint(); }
    else if (action === 'refresh') { if (!discard()) return; state.editor = null; state.history = null; state.loading = true; paint(); await load(); }
    else if (action === 'curriculum') { if (discard()) openCurriculum(); }
    else if (action === 'view-plan') { if (record() && discard()) { state.editor = {kind:'plan',record:record(),dirty:false}; state.history = null; paint(true); } }
    else if (action === 'builder-copy') { const plan = state.editor?.record.plan; if (plan) { if (B().current()?.blocks?.length && !window.confirm('Open this plan as a separate builder draft? The builder’s Undo can restore your current draft.')) return; B().importPlan(clone(plan)); state.editor = null; window.location.hash = '#practices'; } }
    else if (action === 'history') await showHistory('session',id);
    else if (action === 'curriculum-history') await showHistory('curriculum',id);
    else if (action === 'close-history') { state.history = null; paint(); }
    else if (action === 'restore') restore(id);
    else if (action === 'add-skill') { const s = allSkills().find(item => item.id === id); if (s) addSkills([s]); }
    else if (action === 'add-manual') {
      const field = root.querySelector('[data-tracker-manual]'), title = field.value.trim();
      if (!title) { field.focus(); return; }
      const normalized = title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      let hash = 2166136261; for (const c of normalized || title) hash = Math.imul(hash ^ c.charCodeAt(0),16777619);
      const slug = (normalized.slice(0,65) || 'skill') + '-' + (hash >>> 0).toString(36);
      addSkills([{id:'manual:' + slug,title,path:'',category:'Coach-written skill'}]); field.value = '';
    } else if (action === 'suggestions') addSkills(M().seed(state.group,B()?.catalog() || [],window.GRINDSTONE_PATHWAY || {}));
    else if (action === 'select-all' || action === 'unselect-all') { state.editor.selected = new Set(action === 'select-all' ? state.editor.options.map(s => s.id) : []); state.editor.dirty = true; refreshSkills(); }
    else if (action === 'latest') {
      if (!window.confirm('Open the latest saved version and discard this unsaved draft?')) return;
      const previous = state.editor, data = await S().load(state.season); state.data = data;
      const record = (previous.kind === 'session' ? data.sessions : data.curricula).find(item => item.id === previous.record.id);
      if (!record) throw new Error('This record is no longer available. Your draft is still open.');
      if (previous.kind === 'session') openSession(record,false,false); else openCurriculum(record,false);
    }
  }
  function bind(container) {
    root = container?.matches?.('#practice-tracker') ? container : container?.querySelector?.('#practice-tracker') || document.querySelector('#practice-tracker');
    if (!root) return;
    if (!M() || !S() || !B()) { root.innerHTML = '<p role="alert">The tracker could not load its planning tools. Reload the page to try again.</p>'; return; }
    root.addEventListener('click',event => { const b = event.target.closest('[data-tracker-action]'); if (b && root.contains(b)) { event.preventDefault(); Promise.resolve(action(b)).catch(error => notify(error.message || 'That action could not be completed.',true)); } });
    root.addEventListener('input',event => {
      if (event.target.matches('[data-tracker-coverage-search]')) { state.filter = event.target.value; root.querySelector('[data-coverage-list]').innerHTML = coverageTable(M().coverage(expected(),records())) + (extraCoverage().length ? '<h3>Other skills taught</h3>' + coverageTable(extraCoverage()) : ''); }
      if (event.target.matches('[data-tracker-skill-search]')) root.querySelector('[data-tracker-skill-results]').innerHTML = skillResults(event.target.value);
      if (event.target.closest('[data-tracker-editor]') && state.editor && !event.target.matches('[data-tracker-skill-search]')) state.editor.dirty = true;
    });
    root.addEventListener('change',event => {
      const target = event.target, e = state.editor;
      if (target.name === 'season' && target.closest('[data-tracker-season]')) {
        if (target.value === state.season) return;
        if (!discard()) { target.value = state.season; return; }
        state.season = target.value; state.editor = null; state.history = null; state.message = ''; state.loading = true; state.loaded = false; updateAddress(); paint(); load();
        return;
      }
      if (target.matches('[data-tracker-skill]') && e) { if (target.checked) e.selected.add(target.dataset.trackerSkill); else e.selected.delete(target.dataset.trackerSkill); e.dirty = true; }
      if (target.matches('[data-tracker-plan]') && target.value !== '' && e?.kind === 'session') {
        let plan;
        try { plan = target.value.startsWith('local:') ? (B().saved() || [])[Number(target.value.slice(6))] : state.data.sessions.find(s => s.id === target.value.slice(8))?.plan; }
        catch (error) { notify(error.message || 'Could not open that saved practice.',true); return; }
        if (!plan) return;
        captureSession(); e.record.plan = clone(plan); e.record.name = plan.name || e.record.name; e.record.author = plan.owner || plan.author || e.record.author;
        const candidates = M().candidates(plan,B().catalog()); e.options = candidates.map(skill); e.selected = new Set(candidates.map(s => s.id)); e.dirty = true;
        paint(true);
      }
      if (target.name === 'status' && e?.kind === 'session') {
        captureSession(); const panel = root.querySelector('[data-tracker-completion]'); panel.hidden = target.value !== 'completed';
        root.querySelector('[data-tracker-editor-title]').textContent = sessionEditorTitle(e);
        root.querySelector('[data-tracker-save]').textContent = target.value === 'completed' ? 'Confirm completed practice' : target.value === 'cancelled' ? 'Save cancelled practice' : 'Save scheduled practice';
        e.dirty = true;
      }
    });
    root.addEventListener('submit',event => {
      const form = event.target;
      if (form.matches('[data-tracker-session-form]')) { event.preventDefault(); save(form,'session'); }
      else if (form.matches('[data-tracker-curriculum-form]')) { event.preventDefault(); save(form,'curriculum'); }
      else if (form.matches('[data-tracker-season]')) {
        event.preventDefault();
      }
    });
    paint(); load();
  }
  // Changing a guide or site tab must not silently drop an unfinished session form.
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link || !root?.isConnected || !state?.editor?.dirty || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target === '_blank' || link.hasAttribute('download')) return;
    const href = link.getAttribute('href');
    if (!href || href === '#' || href === window.location.hash) return;
    if (!window.confirm('Leave the tracker and discard your unsaved changes?')) { event.preventDefault(); event.stopImmediatePropagation(); }
    else state.editor.dirty = false;
  },true);
  window.addEventListener('beforeunload', event => { if (root?.isConnected && state?.editor?.dirty) { event.preventDefault(); event.returnValue = ''; } });
  window.GRINDSTONE_TRACKER = {render,bind};
}());
