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
  const historyDrafts = new Map();
  let root, state, ticket = 0, archiveTicket = 0;
  const draftKey = record => record.season + '\n' + record.group;
  function forgetHistoryDraft(editor) { if (editor?.record) historyDrafts.delete(draftKey(editor.record)); }
  function rememberHistoryDraft() {
    if (!root?.isConnected || !state?.editor?.dirty || !['session','curriculum'].includes(state.editor.kind)) return;
    captureEditor();
    historyDrafts.set(draftKey(state.editor.record),{editor:state.editor,view:state.view});
  }
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
  function archiveFolderUrl() {
    const configured = window.GRINDSTONE_TRACKER_CONFIG?.archiveFolderUrl;
    return typeof configured === 'string' && /^https:\/\/drive\.google\.com\/drive\/folders\/[A-Za-z0-9_-]+$/.test(configured) ? configured : 'https://drive.google.com/drive/folders/1nH6QOx1E0mTWGiRg9MroZ6iJX9PQuXK_';
  }
  function archiveFileUrl(value) {
    return typeof value === 'string' && /^https:\/\/drive\.google\.com\/file\/d\/[A-Za-z0-9_-]+\/view$/.test(value) ? value : '';
  }
  function archiveSummaryHtml() {
    const status = state.archiveLoading ? 'Checking the Drive archive connection…' : state.archiveError ? 'Drive archive status is unavailable. Use Refresh records to try again; tracker records and teaching history are separate.' : !state.archiveLoaded ? 'Drive archive status has not loaded.' : state.archive.enabled ? 'Newly completed practices automatically queue for PDF and JSON copies, normally within about 5 minutes. Corrections create a separate revision. Each practice’s status confirms when its files are ready.' : 'Connection pending. Newly completed practices will automatically queue for PDF and JSON copies once the Drive connection is enabled. Copies normally take about 5 minutes; corrections will create separate revisions.';
    return '<p><strong>Drive archive.</strong> ' + esc(status) + '</p><p><a href="' + esc(archiveFolderUrl()) + '" target="_blank" rel="noopener noreferrer">Open practice archive folder</a>. Coaches need permission to view this restricted folder.</p>';
  }
  function archiveRetryHtml(item) {
    if (state.library) return '<p class="tracker-fine"><a href="#tracker?season=' + esc(encodeURIComponent(state.season)) + '&amp;group=' + esc(item.group) + '">Manage this copy in the tracker</a>.</p>';
    return (state.archiveRetryFailed.has(item.id) ? '<p class="tracker-fine" role="status">The retry could not be requested. Use Refresh records to check the latest status.</p>' : '') + '<p class="tracker-actions">' + button('retry-archive',state.archiveRetrying.has(item.id) ? 'Requesting retry…' : 'Retry Drive copy',item.id,state.archiveRetrying.has(item.id) ? ' disabled' : '') + '</p>';
  }
  function archiveCardHtml(item) {
    if (item.status !== 'completed') return '';
    if (state.archiveLoading) return '<p class="tracker-fine">Checking Drive copy status…</p>';
    if (state.archiveError || !state.archiveLoaded) return '<p class="tracker-fine">Drive copy status unavailable. Use Refresh records to check again.</p>';
    if (!state.archive.enabled) return '<p class="tracker-fine">Drive connection pending.</p>';
    const job = state.archive.jobs.find(entry => entry.sessionId === item.id && entry.revision === item.revision);
    if (!job) return item.archive?.warning ? '<p class="tracker-fine">The practice is saved, but its Drive copy was not queued. Retry the copy for this revision.</p>' + archiveRetryHtml(item) : '<p class="tracker-fine">No Drive copy for this revision.</p>';
    if (job.status === 'pending') return '<p class="tracker-fine">Drive copy queued for revision ' + Number(item.revision) + '. PDF and JSON are not ready yet. Use Refresh records to check progress.</p>';
    if (job.status === 'failed') return '<p class="tracker-fine">Drive copy could not be completed for revision ' + Number(item.revision) + '. ' + (job.retryable ? 'The archive service can retry this copy.' : 'The archive connection may need attention before another attempt.') + '</p>' + archiveRetryHtml(item);
    const pdf = archiveFileUrl(job.pdfUrl), json = archiveFileUrl(job.jsonUrl);
    if (!pdf || !json) return '<p class="tracker-fine">Drive reports this revision archived, but its file links are unavailable. Use Refresh records or the archive folder to check.</p>';
    return '<p class="tracker-fine">Drive copy ready · revision ' + Number(item.revision) + '.</p><p class="tracker-actions"><a href="' + esc(pdf) + '" target="_blank" rel="noopener noreferrer">Open PDF</a><a href="' + esc(json) + '" target="_blank" rel="noopener noreferrer">Open JSON</a></p>';
  }
  function paintArchive() {
    if (!root?.isConnected) return;
    const summary = root.querySelector('[data-tracker-archive-summary]');
    if (summary) summary.innerHTML = archiveSummaryHtml();
    root.querySelectorAll('[data-tracker-archive-session]').forEach(element => {
      const item = state.data.sessions.find(record => record.season === state.season && record.id === element.dataset.trackerArchiveSession);
      if (item) element.innerHTML = archiveCardHtml(item);
    });
  }
  async function loadArchive() {
    const current = ++archiveTicket, active = state, season = state.season, selectedGroup = state.group;
    state.archiveLoading = true; state.archiveLoaded = false; state.archiveError = false; state.archive = {enabled:false,jobs:[]};
    paintArchive();
    try {
      const result = S()?.archiveStatus ? await S().archiveStatus(season) : {enabled:false,jobs:[]};
      if (current !== archiveTicket || active !== state || season !== state.season || selectedGroup !== state.group || !root?.isConnected) return;
      if (!result || typeof result.enabled !== 'boolean' || !Array.isArray(result.jobs)) throw new Error('Invalid archive status');
      state.archive = {enabled:result.enabled,jobs:result.jobs.filter(job => job && typeof job.sessionId === 'string' && Number.isSafeInteger(job.revision) && job.revision > 0 && ['pending','archived','failed'].includes(job.status)).map(job => ({sessionId:job.sessionId,revision:job.revision,status:job.status,pdfUrl:archiveFileUrl(job.pdfUrl),jsonUrl:archiveFileUrl(job.jsonUrl),retryable:job.retryable === true}))};
      state.archiveLoaded = true;
    } catch (_) {
      if (current !== archiveTicket || active !== state || season !== state.season || selectedGroup !== state.group || !root?.isConnected) return;
      state.archiveError = true;
    }
    state.archiveLoading = false; paintArchive();
  }
  async function retryArchive(id) {
    const item = records().find(record => record.id === id && record.status === 'completed');
    const job = state.archive.jobs.find(entry => entry.sessionId === id && entry.revision === item?.revision);
    if (!item || (job ? job.status !== 'failed' : !item.archive?.warning) || !state.archive.enabled || state.archiveRetrying.has(id)) return;
    const actor = currentActor() || String(window.prompt('Your name for this Drive archive retry:') || '').trim();
    if (!actor) return;
    const active = state, season = state.season, selectedGroup = state.group;
    state.actor = actor; state.archiveRetrying.add(id); state.archiveRetryFailed.delete(id); paintArchive();
    try {
      await S().retryArchive(id,item.revision,actor);
      active.archiveRetrying.delete(id);
      if (active !== state || season !== state.season || selectedGroup !== state.group || !root?.isConnected) return;
      void loadArchive();
    } catch (_) {
      active.archiveRetrying.delete(id);
      if (active !== state || season !== state.season || selectedGroup !== state.group || !root?.isConnected) return;
      state.archiveRetryFailed.add(id); paintArchive();
    }
  }
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
  function render(params, library = false) {
    rememberHistoryDraft();
    const valid = M()?.groups || [];
    const requested = param(params,'group');
    let builderGroup = '';
    if (!library && param(params,'from') === 'builder') { try { builderGroup = B()?.current()?.program || ''; } catch (_) { /* The loader reports unreadable builder data without changing it. */ } }
    const season = String(param(params,'season') || '').trim();
    state = {library,group:valid.some(g => g.id === requested) ? requested : library ? 'all' : valid.some(g => g.id === builderGroup) ? builderGroup : 'blue',season:season && season.length <= 80 && !/[\u0000-\u001f\u007f]/.test(season) ? season : defaultSeason(),data:{sessions:[],curricula:[],mode:'local'},view:param(params,'view') === 'coverage' ? 'coverage' : 'schedule',editor:null,copyPending:false,actor:state?.actor || '',message:'',error:false,loading:true,loaded:false,fromBuilder:!library && param(params,'from') === 'builder',planStatus:['active','planned','completed','cancelled','all'].includes(param(params,'status')) ? param(params,'status') : 'active',planId:/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,99}$/.test(param(params,'plan') || '') ? param(params,'plan') : '',filter:library ? String(param(params,'q') || '').trim().slice(0,200) : '',history:null,archive:{enabled:false,jobs:[]},archiveLoading:true,archiveLoaded:false,archiveError:false,archiveRetrying:new Set(),archiveRetryFailed:new Set()};
    return '<section id="practice-tracker" class="practice-tracker' + (library ? ' practice-plans' : '') + '"><p role="status">' + (library ? 'Loading saved practices…' : 'Loading group schedules…') + '</p></section>';
  }
  function renderPlans(params) { return render(params,true); }
  const planBlocks = plan => Array.isArray(plan?.blocks) ? plan.blocks.filter(block => block && typeof block === 'object' && !Array.isArray(block)) : [];
  const blockMinutes = block => Number.isFinite(Number(block.minutes)) && Number(block.minutes) >= 0 ? Number(block.minutes) : 0;
  const planMinutes = plan => Math.round(planBlocks(plan).reduce((total,block) => total + blockMinutes(block),0) * 10) / 10;
  const groupName = id => M().groups.find(group => group.id === id)?.name || id;
  const statusName = status => status === 'completed' ? 'Completed' : status === 'cancelled' ? 'Cancelled' : 'Scheduled';
  function plansPath(overrides = {}) {
    const next = {group:state.group,season:state.season,status:state.planStatus,q:state.filter,plan:state.planId,...overrides};
    const params = new URLSearchParams({season:next.season});
    if (next.group && next.group !== 'all') params.set('group',next.group);
    if (next.status && next.status !== 'active') params.set('status',next.status);
    if (next.q) params.set('q',next.q);
    if (next.plan) params.set('plan',next.plan);
    return '#plans?' + params.toString();
  }
  function plansHeader() {
    const options = (entries,value) => entries.map(([id,label]) => '<option value="' + esc(id) + '"' + (id === value ? ' selected' : '') + '>' + esc(label) + '</option>').join('');
    return '<div class="tracker-heading"><p class="eyebrow">Grindstone practice library</p><h1>Practice Plans</h1><p class="page-title">Find a scheduled or completed practice, open its saved instructions, then print it or reuse a separate copy. The shared original stays unchanged.</p></div>' +
      '<div class="tracker-actions plans-navigation"><a class="button secondary" href="#practices">Build a practice</a><a class="button secondary" href="#tracker?season=' + esc(encodeURIComponent(state.season)) + (state.group !== 'all' ? '&amp;group=' + esc(state.group) : '') + '">Practice tracker</a>' + button('refresh','Refresh records') + '</div>' +
      '<form class="plans-filters" data-plans-filters><label>Season<select data-plan-filter="season" name="season">' + seasonOptions() + '</select></label><label>Group<select data-plan-filter="group" name="group">' + options([['all','All groups'],...M().groups.map(g => [g.id,g.name])],state.group) + '</select></label><label>Practices<select data-plan-filter="status" name="status">' + options([['active','Scheduled & completed'],['planned','Scheduled'],['completed','Completed'],['cancelled','Cancelled'],['all','All, including cancelled']],state.planStatus) + '</select></label><label class="plans-search">Search plans<input type="search" data-plan-filter="q" name="q" maxlength="200" value="' + esc(state.filter) + '" placeholder="Name, coach, focus or activity"></label><button type="submit" class="tracker-primary">Find plans</button></form>' +
      '<p class="tracker-mode' + (state.loaded && state.data.mode === 'shared' ? ' is-shared' : '') + '">' + (!state.loaded ? (state.loading ? 'Loading shared practice snapshots…' : 'Practice records could not be loaded. Refresh to try again.') : state.data.mode === 'shared' ? '<strong>Shared practice snapshots.</strong> Browser-only builder drafts are not included. Schedule a plan in the tracker to make it available here.' : '<strong>Local tracker preview only.</strong> These snapshots are saved in this browser, not shared with other coaches. Browser-only builder drafts are not included.') + '</p>' +
      '<details class="plans-archive-info"><summary>Drive copies and access</summary><div data-tracker-archive-summary>' + archiveSummaryHtml() + '</div></details>' +
      '<div data-tracker-message class="tracker-message' + (state.error ? ' is-error' : '') + '" role="' + (state.error ? 'alert' : 'status') + '">' + esc(state.message) + '</div>';
  }
  function snapshotNames(item, depth = 0) {
    if (!item || typeof item !== 'object' || depth > 12) return [];
    const names = [item.name,item.title,item.coach].filter(value => typeof value === 'string');
    for (const key of ['components','activities','rotation','stations','guide','guides','series','selections']) {
      const child = item[key];
      if (Array.isArray(child)) names.push(...child.flatMap(entry => snapshotNames(entry,depth + 1)));
      else if (child && typeof child === 'object') names.push(...snapshotNames(child,depth + 1));
    }
    return names;
  }
  function planRows() {
    const words = state.filter.toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const statusMatches = item => state.planStatus === 'all' || (state.planStatus === 'active' ? item.status !== 'cancelled' : item.status === state.planStatus);
    return state.data.sessions.filter(item => item.season === state.season && (state.group === 'all' || item.group === state.group) && statusMatches(item)).filter(item => planBlocks(item.plan).length).filter(item => {
      const haystack = [item.name,item.author,item.lead,item.location,item.plan?.name,item.plan?.focus,...planBlocks(item.plan).flatMap(block => snapshotNames(block))].join(' ').toLocaleLowerCase();
      return words.every(word => haystack.includes(word));
    }).sort((a,b) => {
      const aPlanned = a.status === 'planned', bPlanned = b.status === 'planned';
      if (aPlanned !== bPlanned) return aPlanned ? -1 : 1;
      const dates = (a.date + a.startTime).localeCompare(b.date + b.startTime);
      return (aPlanned ? dates : -dates) || a.id.localeCompare(b.id);
    });
  }
  function planCard(item) {
    return '<article class="tracker-session"><div class="tracker-card-heading"><div><span class="tracker-badge ' + esc(item.status) + '">' + statusName(item.status) + '</span><h3><a href="' + esc(plansPath({plan:item.id})) + '">' + esc(item.name) + '</a></h3></div><p class="tracker-date">' + dateLabel(item.date) + (item.startTime ? '<br>' + timeLabel(item.startTime) : '') + '</p></div><p class="tracker-fine"><strong>' + esc(groupName(item.group)) + '</strong> · ' + planMinutes(item.plan) + ' minutes · revision ' + item.revision + '</p><dl class="tracker-details"><div><dt>Location</dt><dd>' + esc(item.location || 'Not set') + '</dd></div><div><dt>Lead coach</dt><dd>' + esc(item.lead || 'To be assigned') + '</dd></div><div><dt>Plan author</dt><dd>' + esc(item.author || 'Not recorded') + '</dd></div></dl>' + (item.plan?.focus ? '<p class="tracker-fine">' + esc(item.plan.focus) + '</p>' : '') + '<p class="tracker-actions"><a class="button secondary" href="' + esc(plansPath({plan:item.id})) + '">Open saved plan</a></p>' + (item.status === 'completed' ? '<div data-tracker-archive-session="' + esc(item.id) + '">' + archiveCardHtml(item) + '</div>' : '') + '</article>';
  }
  function plansListHtml() {
    const rows = planRows();
    return '<section class="tracker-panel plans-results"><h2>Saved plans <span class="tracker-fine">(' + rows.length + ')</span></h2><p class="tracker-fine">Only sessions with an attached plan appear here. Sessions recorded without a plan remain in the <a href="#tracker?season=' + esc(encodeURIComponent(state.season)) + '">tracker</a>.</p><div class="tracker-card-grid">' + (rows.length ? rows.map(planCard).join('') : '<p class="tracker-empty">No saved plan snapshots match these filters. Try another group or season, clear the search, or schedule a saved plan in the tracker.</p>') + '</div></section>';
  }
  function applyPlansFilters() {
    const read = key => root.querySelector('[data-plan-filter="' + key + '"]')?.value || '';
    const next = plansPath({season:read('season'),group:read('group'),status:read('status'),q:read('q').trim().slice(0,200),plan:''});
    window.location.hash = next;
  }
  function header() {
    return '<div class="tracker-heading"><p class="eyebrow">Coach planning</p><h1>Practice & season tracker</h1><p class="page-title">Schedule a saved plan. After practice, confirm what you taught. Your group’s first-covered and last-reviewed dates update from those completed practices.</p></div>' +
      '<nav class="tracker-groups" aria-label="Practice groups">' + M().groups.map(g => '<button type="button" data-tracker-action="group" data-id="' + esc(g.id) + '" aria-pressed="' + (g.id === state.group) + '">' + esc(g.name) + '</button>').join('') + '</nav>' +
      '<div class="tracker-toolbar"><form data-tracker-season><label>Season<select name="season" aria-describedby="tracker-season-help">' + seasonOptions() + '</select></label><span id="tracker-season-help" class="tracker-fine">Choose a season to view its schedule and teaching history.</span></form><div class="tracker-actions">' + button('refresh','Refresh records') + '<a class="button secondary" href="#practices">Practice builder</a><a class="button secondary" href="#plans?season=' + esc(encodeURIComponent(state.season)) + '&amp;group=' + esc(state.group) + '">Browse practice plans</a></div></div>' +
      '<p class="tracker-mode ' + (state.loaded && state.data.mode === 'shared' ? 'is-shared' : '') + '">' + (!state.loaded ? (state.loading ? 'Checking tracker storage…' : 'Records have not loaded. Refresh to try again; no teaching history has been changed.') : state.data.mode === 'shared' ? '<strong>Shared tracker.</strong> Saved changes are visible to other coaches and families. Enter your name when making a change.' : '<strong>Local preview only.</strong> These records stay in this browser. Other coaches cannot see them until shared storage is connected.') + '</p>' +
      '<div class="tracker-mode" data-tracker-archive-summary>' + archiveSummaryHtml() + '</div>' +
      (state.group === 'valkyries' ? '<p class="tracker-fine tracker-independent">Valkyries have their own schedule and season goals. Nothing here copies dates, attendance rules or expectations from Mat Rats.</p>' : '') +
      '<p class="tracker-fine">Track group teaching here. Keep individual athlete, health and caregiver details out of public notes. “Covered” records a teaching opportunity, not an individual wrestler’s mastery.</p>' +
      '<div data-tracker-message class="tracker-message' + (state.error ? ' is-error' : '') + '" role="' + (state.error ? 'alert' : 'status') + '">' + esc(state.message) + '</div>' +
      '<nav class="tracker-views" aria-label="Group tracker view">' + button('schedule-view','Schedule & completed practices','', ' aria-pressed="' + (state.view === 'schedule') + '"') + button('coverage-view','Season skills','', ' aria-pressed="' + (state.view === 'coverage') + '"') + '</nav>';
  }
  function sessionCard(item) {
    return '<article class="tracker-session"><div class="tracker-card-heading"><div><span class="tracker-badge ' + esc(item.status) + '">' + esc(item.status === 'completed' ? 'Completed' : item.status === 'cancelled' ? 'Cancelled' : 'Planned') + '</span><h3>' + esc(item.name) + '</h3></div><p class="tracker-date">' + dateLabel(item.date) + (item.startTime ? '<br>' + timeLabel(item.startTime) : '') + '</p></div><dl class="tracker-details"><div><dt>Location</dt><dd>' + esc(item.location || 'Not set') + '</dd></div><div><dt>Lead coach</dt><dd>' + esc(item.lead || 'To be assigned') + '</dd></div><div><dt>Plan author</dt><dd>' + esc(item.author || 'Not recorded') + '</dd></div></dl>' +
      (item.status === 'completed' ? '<p class="tracker-fine">' + (item.skills?.length ? item.skills.length + ' confirmed skills: ' + item.skills.slice(0,4).map(s => esc(s.title)).join(', ') + (item.skills.length > 4 ? '…' : '') : 'No skills recorded: ' + esc(item.noSkillReason || 'See practice notes')) + '</p>' : '') +
      (item.notes ? '<details><summary>Practice notes</summary><p class="tracker-preline">' + esc(item.notes) + '</p></details>' : '') +
      (item.status === 'completed' ? '<div data-tracker-archive-session="' + esc(item.id) + '">' + archiveCardHtml(item) + '</div>' : '') +
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
    const e = state.editor;
    return '<details class="tracker-picker"' + (e.pickerOpen ?? !e.options.length ? ' open' : '') + '><summary>Add skills from the library or your own notes</summary><label>Find a skill<input type="search" data-tracker-skill-search value="' + esc(e.skillSearch || '') + '" placeholder="Try double leg, stand-up or sprawl"></label><div data-tracker-skill-results class="tracker-skill-results">' + skillResults(e.skillSearch || '') + '</div><div class="tracker-manual-skill"><label>Coach-written skill<input data-tracker-manual maxlength="120" value="' + esc(e.manualSkill || '') + '" placeholder="A specific skill not in the library"></label>' + button('add-manual','Add skill') + '</div><p class="tracker-fine">Use the same library skill when possible so reviews update its existing history.</p></details>';
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
      '<div class="tracker-form-grid"><label class="tracker-wide">Practice group<select name="group" data-tracker-session-group' + (d.revision ? ' disabled aria-describedby="tracker-group-locked"' : '') + '>' + M().groups.map(g => '<option value="' + esc(g.id) + '"' + (d.group === g.id ? ' selected' : '') + '>' + esc(g.name) + '</option>').join('') + '</select></label></div>' + (d.revision ? '<p id="tracker-group-locked" class="tracker-fine">This saved record stays with its group. If it was filed under the wrong group, cancel it here and schedule its saved plan under the correct group. Earlier history remains available.</p>' : '<p class="tracker-fine">Changing the group updates its default location and time. A location or time you already customized is kept.</p>') +
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
  function stepsHtml(steps) { return Array.isArray(steps) && steps.length ? '<ol class="tracker-snapshot-steps">' + steps.filter(step => typeof step === 'string').map(step => '<li>' + esc(step) + '</li>').join('') + '</ol>' : ''; }
  function guideSnapshotHtml(guide, print = false) {
    if (!guide || typeof guide !== 'object') return '';
    const steps = Array.isArray(guide.steps) ? guide.steps : [], cues = Array.isArray(guide.cues) ? guide.cues.join(' · ') : guide.cues;
    return '<details class="tracker-snapshot-guide"' + (print ? ' open' : '') + '><summary>Saved teaching guide: ' + esc(guide.title || 'Instruction') + '</summary>' + snapshotFields([['Setup',guide.setup],['Task',guide.task]]) + (steps.length ? '<ol>' + steps.map(step => '<li>' + esc(step) + '</li>').join('') + '</ol>' : '') + snapshotFields([['Cues',cues],['Ready when',guide.readiness],['Boundaries',guide.boundary],['Age guidance',guide.ageNote],['Adaptations',guide.adaptation],['Source scope',guide.sourceNote]]) + '</details>';
  }
  function seriesSnapshotHtml(series, print = false) {
    if (!series || typeof series !== 'object') return '';
    const selections = Array.isArray(series.selections) ? series.selections : [], guides = Array.isArray(series.guides) ? series.guides : [];
    return '<section class="tracker-snapshot-series"><h5>' + (series.kind === 'foundation' ? 'Selected foundation skills' : 'Selected series options') + '</h5>' + (selections.length ? '<ul>' + selections.map(s => '<li>' + esc(s.title || '') + '</li>').join('') + '</ul>' : '') + guides.map(guide => guideSnapshotHtml(guide,print)).join('') + '</section>';
  }
  function activitySnapshotHtml(activity,label,print = false) {
    if (!activity || typeof activity !== 'object') return '';
    return '<article class="tracker-snapshot-activity"><h4>' + esc(label) + ': ' + esc(activity.name || activity.title || 'Activity') + '</h4>' + snapshotFields([['Task',activity.task || activity.instructions],['Cues',Array.isArray(activity.cues) ? activity.cues.join(' · ') : activity.cues],['Coach',activity.coach],['Equipment',activity.equipment],['Space',activity.space],['Partner groups',activity.group],['Turns & recovery',activity.rounds],['Simpler version',activity.simpler],['Success',activity.success],['Stop / reset',activity.stop],['Source scope',activity.sourceNote],['Setup',activity.setup],['Boundaries',activity.boundary],['Ready when',activity.readiness]]) + stepsHtml(activity.steps) + guideSnapshotHtml(activity.guide,print) + seriesSnapshotHtml(activity.series,print) + '</article>';
  }
  function componentsSnapshotHtml(block, print = false) {
    const c = block.components || {}, activities = Array.isArray(c.activities) ? c.activities : Array.isArray(block.activities) ? block.activities : [], rotation = c.rotation, stations = Array.isArray(rotation?.stations) ? rotation.stations : [];
    const minutes = value => typeof value === 'number' && Number.isFinite(value) ? value : 'not recorded';
    return (activities.length ? '<section class="tracker-snapshot-components"><h4>Additional activities in this slot</h4><p class="tracker-fine">These activities share the block’s ' + minutes(block.minutes) + ' minutes, including its main task.</p>' + activities.map((a,i) => activitySnapshotHtml(a,'Activity ' + (i + 1),print)).join('') + '</section>' : '') + seriesSnapshotHtml(c.series,print) + (rotation ? '<section class="tracker-snapshot-components"><h4>Simultaneous station rotation</h4><p class="tracker-fine">One shared clock: ' + minutes(rotation.rounds) + ' rounds × ' + minutes(rotation.workMinutes) + ' minutes of work; ' + minutes(rotation.changeMinutes) + ' minutes between rounds. Briefing: ' + minutes(rotation.briefingMinutes) + ' minutes. Finish / reset: ' + minutes(rotation.finishMinutes) + ' minutes.</p>' + stations.map((s,i) => activitySnapshotHtml(s,'Station ' + (i + 1),print)).join('') + '</section>' : '');
  }
  function copyConfirmationHtml() {
    if (!state.library || !state.copyPending) return '';
    return '<section class="tracker-notice" role="region" aria-labelledby="tracker-copy-confirm-title" aria-describedby="tracker-copy-confirm-help" data-plan-copy-confirm tabindex="-1"><h3 id="tracker-copy-confirm-title">Open a separate builder copy?</h3><p id="tracker-copy-confirm-help">This replaces your current browser draft with a new copy of this saved plan. The shared plan stays unchanged. In the builder, Undo last structural change can restore your previous draft.</p><div class="tracker-actions">' + button('confirm-builder-copy','Open separate copy','',' class="tracker-primary"') + button('cancel-builder-copy','Keep current draft') + '</div></section>';
  }
  function planActionsHtml() { return '<div class="tracker-actions">' + button('print-plan','Print saved plan') + button('builder-copy','Open a separate copy in builder') + '</div>'; }
  function planViewHtml(print = false) {
    const d = state.editor.record, p = d.plan, blocks = planBlocks(p); let elapsed = 0;
    const close = state.library ? '<a class="button secondary" href="' + esc(plansPath({plan:''})) + '">Back to plans</a>' : button('close-editor','Close plan');
    return '<section class="tracker-editor tracker-plan-view"' + (print ? '' : ' data-tracker-editor tabindex="-1"') + '><div class="tracker-section-heading"><div><p class="eyebrow">Grindstone · saved practice snapshot</p><' + (print ? 'h1' : 'h2') + '>' + esc(p?.name || d.name) + '</' + (print ? 'h1' : 'h2') + '></div>' + (print ? '' : close) + '</div><p><strong>' + esc(groupName(d.group)) + '</strong> · ' + dateLabel(d.date) + (d.startTime ? ' · ' + timeLabel(d.startTime) : '') + ' · ' + statusName(d.status) + ' · revision ' + d.revision + '</p>' + snapshotFields([['Location',d.location],['Plan author',d.author],['Lead coach',d.lead],['Focus',p?.focus]]) + planSummary(p) + (print ? '' : planActionsHtml() + copyConfirmationHtml()) + snapshotFields([['Planning week',p?.weekContext?.label],['Shared week focus',p?.weekContext?.focus],['Shared cue',p?.weekContext?.cue],['Desired outcome',p?.weekContext?.outcome]]) +
      (d.status === 'completed' ? '<section class="tracker-confirmed-skills"><h3>Confirmed teaching</h3><p class="tracker-fine">These are the skills confirmed after practice. The saved plan below may include activities that were skipped.</p>' + (d.skills?.length ? '<ul>' + d.skills.map(item => '<li>' + esc(item.title) + '</li>').join('') + '</ul>' : '<p>' + esc(d.noSkillReason || 'No skills recorded.') + '</p>') + snapshotFields([['Practice reflection',d.notes]]) + '</section>' : snapshotFields([['Session notes',d.notes]])) +
      '<ol class="tracker-plan-blocks">' + blocks.map(b => {
        const start = elapsed; elapsed = Math.round((elapsed + blockMinutes(b)) * 10) / 10;
        return '<li><h3>' + esc(b.title || b.name || b.type || 'Practice block') + '</h3><p class="tracker-fine">' + start + '–' + elapsed + ' min · ' + blockMinutes(b) + ' minutes</p>' + snapshotFields([['Task',b.instructions],['Setup',b.setup],['Cues',Array.isArray(b.cues) ? b.cues.join(' · ') : b.cues],['Ready when',b.readiness],['Boundaries',b.boundary],['Age guidance',b.ageNote],['Adaptations',b.adaptation],['Source scope',b.sourceNote],['Delivery',b.delivery],['Partner / station plan',b.rotation]]) + stepsHtml(b.steps) + componentsSnapshotHtml(b,print) + snapshotFields([['Notes',b.notes]]) + '</li>';
      }).join('') + '</ol>' + snapshotFields([['Plan notes',p?.notes]]) + (Object.values(p?.handoff || {}).some(value => typeof value === 'string' && value.trim()) ? '<section><h3>Handoff saved with the source plan</h3>' + snapshotFields([['Actually taught',p.handoff.taught],['Changed from the plan',p.handoff.changed],['What worked',p.handoff.worked],['Reliable skills',p.handoff.reliable],['Next coach',p.handoff.revisit]]) + '</section>' : '') + (print ? '' : (d.status === 'completed' ? '<div data-tracker-archive-session="' + esc(d.id) + '">' + archiveCardHtml(d) + '</div>' : '') + '<div class="tracker-actions">' + button('print-plan','Print saved plan') + button('builder-copy','Open a separate copy in builder') + close + '</div>') + '</section>';
  }
  function printPlan() {
    if (state.editor?.kind !== 'plan' || !planBlocks(state.editor.record.plan).length) return;
    const sheet = root.querySelector('.tracker-print-sheet');
    if (!sheet) return;
    sheet.innerHTML = planViewHtml(true); sheet.setAttribute('data-ready','true');
    try { window.print(); }
    finally { sheet.removeAttribute('data-ready'); sheet.innerHTML = ''; }
  }
  function historyHtml() {
    if (!state.history) return '';
    const h = state.history;
    return '<section class="tracker-history" data-tracker-history tabindex="-1"><div class="tracker-section-heading"><h2>Change history</h2>' + button('close-history','Close history') + '</div><p>Restoring opens a draft of that version. Saving it creates a new revision; earlier records remain available.</p>' + (h.loading ? '<p role="status">Loading earlier versions…</p>' : h.error ? '<p role="alert">' + esc(h.error) + '</p>' : !h.items.length ? '<p>No earlier records found.</p>' : '<ol>' + h.items.map((item,i) => '<li><h3>Revision ' + Number(item.revision) + '</h3><p>' + esc(item.actor || 'Name not recorded') + ' · ' + esc(item.savedAt ? new Date(item.savedAt).toLocaleString() : 'Time not recorded') + '</p><p>' + (h.kind === 'session' ? esc(item.record?.name || '') + ' · ' + dateLabel(item.record?.date) + ' · ' + esc(item.record?.status || '') : Number(item.record?.skills?.length || 0) + ' expected skills') + '</p>' + button('restore','Review this version',String(i)) + '</li>').join('') + '</ol>') + '</section>';
  }
  function paint(focusEditor) {
    if (!root || !state) return;
    root.innerHTML = (state.library ? plansHeader() : header()) + (state.loading ? '<p role="status">Loading records…</p>' : !state.loaded ? '' : (state.editor ? state.editor.kind === 'session' ? sessionEditorHtml() : state.editor.kind === 'curriculum' ? curriculumEditorHtml() : planViewHtml() : '') + (state.library ? plansListHtml() : historyHtml() + (state.view === 'coverage' ? coverageHtml() : scheduleHtml()))) + '<div class="tracker-print-sheet" aria-hidden="true"></div>';
    if (focusEditor) root.querySelector('[data-tracker-editor]')?.focus();
  }
  async function load() {
    const current = ++ticket, active = state;
    void loadArchive();
    try {
      const data = await S().load(state.season);
      if (current !== ticket || active !== state || !root?.isConnected) return;
      state.data = data; state.loading = false; state.loaded = true;
      if (state.library) {
        state.message = ''; state.error = false;
        const selected = state.data.sessions.find(item => item.season === state.season && item.id === state.planId && planBlocks(item.plan).length);
        state.editor = selected ? {kind:'plan',record:selected,dirty:false} : null;
        if (state.planId && !selected) notify('This saved plan was not found in the selected season. Choose another plan below or check the shared link.',true);
        paint();
        const restored = window.GRINDSTONE_NAVIGATION?.plansReady?.({selected:!!selected});
        if (selected && !restored) root.querySelector('[data-tracker-editor]')?.focus();
        return;
      }
      const savedDraft = historyDrafts.get(draftKey(state));
      if (savedDraft) {
        historyDrafts.delete(draftKey(state)); state.editor = savedDraft.editor; state.view = savedDraft.view; state.fromBuilder = false;
        notify('Restored your unsaved ' + (state.editor.kind === 'curriculum' ? 'season expectations' : 'practice changes') + ' after browser navigation. Review and save them when ready; nothing was published automatically.',false);
      } else if (state.fromBuilder) { state.fromBuilder = false; const plan = B()?.current(); if (plan?.blocks?.length) openSession(sessionDefaults(plan),false,false); else notify('Start or save a plan in the practice builder, then schedule it here.',false); }
      paint(!!state.editor);
    } catch (error) { if (current !== ticket || active !== state) return; state.loading = false; notify(error.message || 'Could not load the tracker. Refresh to try again.',true); paint(); if (state.library) window.GRINDSTONE_NAVIGATION?.plansReady?.({selected:false}); }
  }
  function selectedSkills() { const e = state.editor; return e.options.filter(s => e.selected.has(s.id)).map(skill); }
  function captureSession() {
    const form = root.querySelector('[data-tracker-session-form]');
    if (!form || state.editor?.kind !== 'session') return;
    const e = state.editor, data = new FormData(form);
    ['name','date','startTime','location','author','lead','actor','notes','noSkillReason','status'].forEach(key => { if (data.has(key)) e.record[key] = String(data.get(key)).trim(); });
    e.correction = String(data.get('correction') || '').trim();
  }
  function captureEditor() {
    captureSession();
    if (state.editor?.kind === 'curriculum') { const actor = root.querySelector('[data-tracker-curriculum-form] [name="actor"]'); if (actor) state.editor.record.actor = actor.value; }
    if (state.editor) {
      const search = root.querySelector('[data-tracker-skill-search]'), manual = root.querySelector('[data-tracker-manual]'), picker = root.querySelector('.tracker-picker');
      if (search) state.editor.skillSearch = search.value;
      if (manual) state.editor.manualSkill = manual.value;
      if (picker) state.editor.pickerOpen = picker.open;
    }
  }
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
  function discard() { if (!state.editor?.dirty) return true; if (!window.confirm('Discard your unsaved tracker changes?')) return false; forgetHistoryDraft(state.editor); state.editor.dirty = false; return true; }
  function closeEditor() { if (!discard()) return; forgetHistoryDraft(state.editor); state.editor = null; paint(); }
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
      e.saving = false; e.dirty = false; forgetHistoryDraft(e);
      if (e !== state.editor) return;
      state.actor = record.actor;
      const list = kind === 'session' ? state.data.sessions : state.data.curricula, index = list.findIndex(s => s.id === result.id);
      if (index >= 0) list[index] = result; else list.push(result);
      state.editor = null;
      notify(kind === 'session' ? result.status === 'completed' ? 'Practice confirmed. Checked skills now update this group’s teaching history.' + (result.archive?.warning ? ' The practice is saved, but its Drive copy needs attention. Check the archive status below.' : '') : result.status === 'cancelled' ? 'Practice marked cancelled. It does not count toward teaching coverage.' : 'Practice scheduled. Confirm what was taught after practice to update coverage.' : 'Season expectations saved for ' + group().name + '.',false);
      paint(); root.querySelector('[data-tracker-message]')?.scrollIntoView({block:'nearest'});
      if (kind === 'session' && result.status === 'completed') void loadArchive();
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
    if (state.library && !['refresh','builder-copy','confirm-builder-copy','cancel-builder-copy','print-plan'].includes(action)) return;
    captureEditor();
    if (action === 'new') { if (discard()) openSession(sessionDefaults(),false,false); }
    else if (action === 'edit' || action === 'complete') { if (record() && discard()) openSession(record(),action === 'complete',false); }
    else if (action === 'close-editor') closeEditor();
    else if (action === 'group') { if (!discard()) return; state.editor = null; state.history = null; state.group = id; state.filter = ''; state.message = ''; updateAddress(); paint(); void loadArchive(); }
    else if (action === 'schedule-view' || action === 'coverage-view') { state.view = action === 'coverage-view' ? 'coverage' : 'schedule'; updateAddress(); captureSession(); paint(); }
    else if (action === 'refresh') { if (!discard()) return; state.copyPending = false; state.editor = null; state.history = null; state.loading = true; paint(); await load(); }
    else if (action === 'print-plan') printPlan();
    else if (action === 'retry-archive') await retryArchive(id);
    else if (action === 'curriculum') { if (discard()) openCurriculum(); }
    else if (action === 'view-plan') { if (record() && discard()) { state.editor = {kind:'plan',record:record(),dirty:false}; state.history = null; paint(true); } }
    else if (action === 'cancel-builder-copy' && state.library) { state.copyPending = false; paint(); root.querySelector('[data-tracker-action="builder-copy"]')?.focus(); }
    else if (action === 'builder-copy' || action === 'confirm-builder-copy' && state.library && state.copyPending) {
      const plan = state.editor?.record.plan;
      if (!plan) return;
      if (action === 'builder-copy' && B().current()?.blocks?.length) {
        if (state.library) { state.copyPending = true; paint(); root.querySelector('[data-plan-copy-confirm]')?.focus(); return; }
        if (!window.confirm('Open this plan as a separate builder draft? The builder’s Undo can restore your current draft.')) return;
      }
      B().importPlan(clone(plan)); state.copyPending = false; state.editor = null; window.location.hash = '#practices';
    }
    else if (action === 'history') await showHistory('session',id);
    else if (action === 'curriculum-history') await showHistory('curriculum',id);
    else if (action === 'close-history') { state.history = null; paint(); }
    else if (action === 'restore') restore(id);
    else if (action === 'add-skill') { const s = allSkills().find(item => item.id === id); if (s) { addSkills([s]); Array.from(root.querySelectorAll('[data-tracker-skill]')).find(field => field.dataset.trackerSkill === s.id)?.focus(); } }
    else if (action === 'add-manual') {
      const field = root.querySelector('[data-tracker-manual]'), title = field.value.trim();
      if (!title) { field.focus(); return; }
      const normalized = title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      let hash = 2166136261; for (const c of normalized || title) hash = Math.imul(hash ^ c.charCodeAt(0),16777619);
      const slug = (normalized.slice(0,65) || 'skill') + '-' + (hash >>> 0).toString(36);
      addSkills([{id:'manual:' + slug,title,path:'',category:'Coach-written skill'}]); field.value = ''; field.focus();
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
    root.addEventListener('keydown',event => {
      if (state.library && state.copyPending && event.key === 'Escape') { event.preventDefault(); void action({dataset:{trackerAction:'cancel-builder-copy'}}); return; }
      if (event.key !== 'Enter' || event.isComposing) return;
      if (event.target.matches('[data-tracker-skill-search]')) { event.preventDefault(); return; }
      if (event.target.matches('[data-tracker-manual]')) { event.preventDefault(); Promise.resolve(action({dataset:{trackerAction:'add-manual'}})).catch(error => notify(error.message || 'Could not add that skill.',true)); }
    });
    root.addEventListener('change',event => {
      const target = event.target, e = state.editor;
      if (state.library && target.matches('[data-plan-filter]') && target.dataset.planFilter !== 'q') { applyPlansFilters(); return; }
      if (target.name === 'season' && target.closest('[data-tracker-season]')) {
        if (target.value === state.season) return;
        if (!discard()) { target.value = state.season; return; }
        state.season = target.value; state.editor = null; state.history = null; state.message = ''; state.loading = true; state.loaded = false; updateAddress(); paint(); load();
        return;
      }
      if (target.matches('[data-tracker-session-group]') && e?.kind === 'session') {
        if (e.record.revision || !M().groups.some(g => g.id === target.value)) { target.value = e.record.group; return; }
        const before = M().groups.find(g => g.id === e.record.group), next = M().groups.find(g => g.id === target.value);
        captureSession(); e.record.group = next.id; state.group = next.id;
        if (!e.record.location || e.record.location === before?.location) e.record.location = next.location;
        if (!e.record.startTime || e.record.startTime === before?.start) e.record.startTime = next.start;
        e.dirty = true; state.filter = ''; updateAddress(); paint(true); void loadArchive(); return;
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
      if (state.library && form.matches('[data-plans-filters]')) { event.preventDefault(); applyPlansFilters(); }
      else if (form.matches('[data-tracker-session-form]')) { event.preventDefault(); save(form,'session'); }
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
    else { forgetHistoryDraft(state.editor); state.editor.dirty = false; }
  },true);
  // Registered before the app router: capture visible form values before Back/Forward replaces the page.
  window.addEventListener('popstate',rememberHistoryDraft);
  window.addEventListener('hashchange',rememberHistoryDraft);
  window.addEventListener('beforeunload', event => { if (root?.isConnected && state?.editor?.dirty) { event.preventDefault(); event.returnValue = ''; } });
  window.GRINDSTONE_TRACKER = {render,renderPlans,bind};
}());
