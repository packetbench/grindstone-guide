/* Optional weekly organization for the existing practice builder. No server storage. */
(function () {
  'use strict';
  const KEY = 'grindstone-practice-weeks-v1';
  const MAX_WEEKS = 52, MAX_SESSIONS = 24;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clone = value => JSON.parse(JSON.stringify(value));
  const uid = () => 'w-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
  const programs = () => window.GRINDSTONE_FRAMEWORKS?.programs || [];
  const purposes = () => window.GRINDSTONE_FRAMEWORKS?.sessions || [];
  let weeks = [], current = '', attachment = null, pendingAttachment = null, replacing = false, bridge, host, initialized = false, readable = true, message = '', storageMessage = '';
  function str(value, name, max = 500) {
    if (value == null) return '';
    if (typeof value !== 'string' || value.length > max) throw Error(name + ' must be text of at most ' + max + ' characters.');
    return value.replace(/\u0000/g, '');
  }
  function date(value) {
    const s = str(value, 'Date', 10);
    if (s && (!/^\d{4}-\d{2}-\d{2}$/.test(s) || !Number.isFinite(Date.parse(s + 'T12:00:00Z')) || new Date(s + 'T12:00:00Z').toISOString().slice(0, 10) !== s)) throw Error('Use a valid calendar date.');
    return s;
  }
  function cleanMeta(raw) {
    const h = raw.handoff || {}, w = raw.weekContext || {};
    return { date: date(raw.date), owner: str(raw.owner, 'Coach / owner', 120), revision: str(raw.revision, 'Revision', 80), status: raw.status === 'completed' ? 'completed' : 'planned', completedAt: str(raw.completedAt, 'Completion time', 40), parentId: str(raw.parentId, 'Original practice ID', 100),
      weekContext: {id:str(w.id,'Week ID',100), label:str(w.label,'Week label',120), focus:str(w.focus,'Shared focus',1000), cue:str(w.cue,'Shared cue'), outcome:str(w.outcome,'Desired outcome',1000)},
      handoff: Object.fromEntries(['taught','changed','worked','reliable','revisit'].map(k => [k,str(h[k], 'Handoff ' + k, 4000)])) };
  }
  function cleanWeek(raw, cleanPlan) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw) || raw.version !== 1 || !Array.isArray(raw.sessions) || raw.sessions.length > MAX_SESSIONS) throw Error('Choose a supported week with at most ' + MAX_SESSIONS + ' sessions.');
    const sessions = raw.sessions.map(s => {
      if (!s || typeof s !== 'object') throw Error('Invalid session.');
      return {id:str(s.id,'Session ID',100) || uid(), label:str(s.label,'Session label',120) || 'Practice', plan:cleanPlan(s.plan)};
    });
    if (new Set(sessions.map(s => s.id)).size !== sessions.length) throw Error('Session IDs must be distinct.');
    return {version:1, id:str(raw.id,'Week ID',100) || uid(), name:str(raw.name,'Week name',120) || 'My planning week', season:str(raw.season,'Season',80), weekOf:date(raw.weekOf), focus:str(raw.focus,'Shared focus',1000), cue:str(raw.cue,'Shared cue'), outcome:str(raw.outcome,'Desired outcome',1000), owner:str(raw.owner,'Week owner',120), revision:str(raw.revision,'Revision',80), lane:['mat-rats','pups','valkyries','custom'].includes(raw.lane) ? raw.lane : 'custom', sessions};
  }
  function cleanImport(value, cleanPlan) {
    if (typeof value !== 'string' || value.length > 12000000) throw Error('Choose a week JSON file smaller than 12 MB.');
    let data; try { data = JSON.parse(value); } catch (_) { throw Error('That file is not valid JSON.'); }
    if (data?.format !== 'grindstone-practice-week' || data.version !== 1) throw Error('Choose a Grindstone week export.');
    const week = cleanWeek(data.week, cleanPlan); week.id = uid();
    week.sessions.forEach(s => { s.id = uid(); s.plan.id = ''; s.plan.weekContext.id = week.id; });
    return week;
  }
  function init() {
    if (initialized || !bridge) return;
    initialized = true;
    try {
      const text = window.localStorage.getItem(KEY);
      if (text) {
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed) || parsed.length > MAX_WEEKS) throw Error('Invalid week library');
        weeks = parsed.map(w => cleanWeek(w, bridge.cleanPlan));
        if (new Set(weeks.map(w => w.id)).size !== weeks.length) throw Error('Duplicate weeks');
      }
    } catch (_) { weeks = []; readable = false; storageMessage = 'The week library could not be read. Existing data will not be overwritten. You can work here and export a week backup.'; }
    attachment = readable ? resolveAttachment(pendingAttachment) : null;
    if (attachment) current = attachment.weekId;
    pendingAttachment = null;
  }
  const selected = () => weeks.find(w => w.id === current);
  function resolveAttachment(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || !['weekId','sessionId'].every(key => typeof value[key] === 'string' && value[key].length > 0 && value[key].length <= 100)) return null;
    const w = weeks.find(v => v.id === value.weekId), s = w?.sessions.find(v => v.id === value.sessionId);
    return s ? {weekId:w.id,sessionId:s.id} : null;
  }
  // Keep the pointer in the same local autosave as its draft. cleanPlan excludes it
  // from named plans, exports and imports, so independent copies cannot inherit it.
  function readDraft(raw) { pendingAttachment = raw?.weekSession?.version === 1 ? raw.weekSession : null; }
  function serializeDraft(p) {
    const ref = replacing ? null : resolveAttachment(attachment);
    return {...p,weekSession:ref ? {version:1,...ref} : null};
  }
  function captureAttachment() { return attachment ? clone(attachment) : null; }
  function restoreAttachment(value) {
    const hadAttachment = Boolean(attachment);
    attachment = resolveAttachment(value);
    if (attachment) current = attachment.weekId;
    if (hadAttachment || attachment) bridge?.saveDraft?.();
    refresh();
    return Boolean(attachment);
  }
  function replaceAttached(p, ref) {
    // replacePlan remembers the old attachment for Undo. Its intermediate autosave
    // must not pair the newly opened draft with the previously active session.
    replacing = true;
    try { bridge.replacePlan(clone(p)); } finally { replacing = false; }
    restoreAttachment(ref);
  }
  function persist() {
    if (!readable) { storageMessage = 'Week changes remain in this page only; export a week backup. Existing unreadable storage is preserved.'; return false; }
    try { window.localStorage.setItem(KEY, JSON.stringify(weeks)); storageMessage = ''; return true; }
    catch (_) { storageMessage = 'Could not save weeks in this browser. Export your week before leaving this page.'; return false; }
  }
  function context(w) { return {id:w.id,label:w.name,focus:w.focus,cue:w.cue,outcome:w.outcome}; }
  function dated(start, offset) { if (!start) return ''; const d = new Date(start + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + offset); return d.toISOString().slice(0,10); }
  function draftCopy(plan) {
    const p = clone(plan); Object.assign(p, {id:'', parentId:plan.id || plan.parentId || '', status:'planned', completedAt:'', date:'', revision:'', handoff:{taught:'',changed:'',worked:'',reliable:'',revisit:''}}); return p;
  }
  function suggested(w, makePlan) {
    const rows = w.lane === 'mat-rats' ? [['Black · Monday','black',0,'core-a'],['Blue · Tuesday','blue',1,'core-a'],['Black · Wednesday','black',2,'core-b'],['Blue · Thursday','blue',3,'core-b'],['Black · Friday','black',4,'extension']]
      : w.lane === 'pups' ? [['Pups · Tuesday','pups',1,'core-a']]
      : w.lane === 'valkyries' ? [['Valkyries · Monday','valkyries',0,'core-a'],['Valkyries · Wednesday','valkyries',2,'core-b'],['Valkyries · Friday','valkyries',4,'extension']] : [];
    return rows.map(([label,program,offset,session]) => {
      const p = makePlan(), data = programs().find(x => x.id === program);
      Object.assign(p,{name:label,program,session,date:dated(w.weekOf,offset),focus:w.focus.slice(0,500),owner:w.owner,weekContext:context(w)});
      if (data) Object.assign(p,{framework:data.defaultFramework,target:data.minutes,startTime:data.start});
      if (program === 'pups') p.age = '4-6';
      return {id:uid(),label,plan:p};
    });
  }
  function download(data, name) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})), a = document.createElement('a');
    a.href = url; a.download = name; a.click(); window.setTimeout(() => URL.revokeObjectURL(url),1000);
  }
  function input(label,key,value,limit=500,type='text') { return '<label>' + esc(label) + '<input data-week-field="' + key + '" type="' + type + '" maxlength="' + limit + '" value="' + esc(value) + '"></label>'; }
  function render(open = false) { return '<details class="builder-weeks builder-no-print"'+(open?' open':'')+'><summary>Plan a week & share the coaching focus</summary><div data-week-content></div></details>'; }
  function refresh() {
    if (!host || !bridge) return;
    const w = selected(), p = bridge.getPlan();
    let html = '<p>Optional: group independent practices around a shared foundation. Open a session in the builder, edit it, then save it back here. A single practice works without a week.</p><p class="fine">Blue and Black can share a focus with different sessions. Pups revisit skills across Tuesdays. Valkyries keep their own plan. Session dates are planning aids; TeamSnap remains the schedule.</p><p role="status" class="builder-week-message">' + esc([message,storageMessage].filter(Boolean).join(' ')) + '</p>';
    html += '<div class="builder-week-controls"><label>Saved planning week<select data-week-select><option value="">Choose a week</option>' + weeks.map(v => '<option value="' + esc(v.id) + '"' + (v.id === current ? ' selected' : '') + '>' + esc([v.name,v.season,v.weekOf].filter(Boolean).join(' · ')) + '</option>').join('') + '</select></label><button type="button" data-week-action="new">Start a week</button></div>';
    if (w) {
      html += '<div class="builder-week-grid">' + input('Week name','name',w.name,120) + input('Season','season',w.season,80) + input('Monday of this week (optional)','weekOf',w.weekOf,10,'date') + input('Coach / owner','owner',w.owner,120) + input('Revision label','revision',w.revision,80) + '<label>Program grouping<select data-week-field="lane">' + [['mat-rats','Blue & Black'],['pups','Pups'],['valkyries','Valkyries'],['custom','Custom']].map(([id,l]) => '<option value="' + id + '"' + (w.lane === id ? ' selected' : '') + '>' + l + '</option>').join('') + '</select></label>' + input('Shared foundation / focus','focus',w.focus,1000) + input('Shared coaching cue','cue',w.cue) + input('What should improve?','outcome',w.outcome,1000) + '</div><p class="fine">Suggested blank sessions start with the weekly focus. Adding your current practice keeps its own focus and attaches the week context to the planned copy. Use “Apply current shared focus to builder” when you want to replace that practice’s focus, then save it back. Editing the week never overwrites saved sessions or completed records.</p><div class="builder-actions"><button type="button" data-week-action="suggest">Add suggested blank sessions</button><button type="button" data-week-action="add">Add current practice as a session</button><button type="button" data-week-action="copy">Copy week for next time</button><button type="button" data-week-action="export">Export week (.json)</button><button type="button" data-week-action="remove-week">Delete this week</button></div>';
      const active = attachment?.weekId === w.id ? w.sessions.find(s => s.id === attachment.sessionId) : null;
      if (active) html += '<div class="builder-week-active"><strong>Builder session: ' + esc(active.label) + '</strong><p>Edits stay in the builder draft until you save them to this session.</p><div class="builder-actions"><button type="button" data-week-action="update"' + (active.plan.status === 'completed' ? ' disabled' : '') + '>Save builder to this session</button><button type="button" data-week-action="focus"' + (p.status === 'completed' ? ' disabled' : '') + '>Apply current shared focus to builder</button></div>' + (active.plan.status === 'completed' ? '<p>Completed records stay as taught. Add a new session to make a revision.</p>' : '') + '</div>';
      html += '<div class="builder-week-sessions">' + w.sessions.map(s => {
        const prog = programs().find(v => v.id === s.plan.program), purpose = purposes().find(v => v.id === s.plan.session);
        return '<article data-week-session="' + esc(s.id) + '"><h3>' + esc(s.label) + '</h3><p>' + esc([s.plan.date,prog?.name,purpose?.title,s.plan.status === 'completed' ? 'Completed · ' + s.plan.completedAt.slice(0,10) : 'Planned',s.plan.revision].filter(Boolean).join(' · ')) + '</p><p><strong>Focus:</strong> ' + esc(s.plan.focus || 'Choose in the builder') + '</p>' + (s.plan.handoff?.revisit ? '<p><strong>Next coach:</strong> ' + esc(s.plan.handoff.revisit) + '</p>' : '') + '<div class="builder-actions"><button type="button" data-week-action="open">Open session</button><button type="button" data-week-action="copy-session">Copy as next session</button><button type="button" data-week-action="remove-session">Remove from week</button></div></article>';
      }).join('') + '</div>';
    }
    html += '<label class="builder-week-import">Import a shared week JSON<input type="file" data-week-import accept=".json,application/json"></label><p class="fine">Weeks save only in this browser. Share the exported file in the coaches’ text group with its owner and revision. Import makes a separate copy; it never merges changes automatically. Keep notes about group teaching, without private athlete details.</p>';
    host.innerHTML = html;
  }
  function announce(text) { message = text; bridge.notify([text,storageMessage].filter(Boolean).join(' ')); refresh(); }
  function addWeek(w) { if (weeks.length >= MAX_WEEKS) throw Error('This browser already has 52 weeks. Export and remove an old week first.'); weeks.push(w); current = w.id; persist(); }
  function updateSession(w, id, p) {
    const s = w.sessions.find(v => v.id === id); if (!s) throw Error('Choose a session first.');
    if (s.plan.status === 'completed') throw Error('Completed sessions are preserved. Add a new session for revisions.');
    s.plan = bridge.cleanPlan(p); s.label = s.plan.name;
    if (s.plan.status !== 'completed') s.plan.weekContext = context(w);
    persist();
  }
  function act(name, id) {
    const w = selected(), s = w?.sessions.find(v => v.id === id);
    try {
      if (name === 'new') { addWeek(cleanWeek({version:1,name:'My planning week',lane:'mat-rats',sessions:[]},bridge.cleanPlan)); restoreAttachment(null); announce('Week created. Add a shared focus and sessions when ready.'); return; }
      if (!w) return;
      if (name === 'export') { download({format:'grindstone-practice-week',version:1,week:cleanWeek(w,bridge.cleanPlan)},'grindstone-week-' + (w.weekOf || 'plan') + '.json'); announce('Week exported with its session plans and completed handoffs.'); return; }
      if (name === 'copy') { const copy = clone(w); copy.id = uid(); copy.name = (w.name + ' — next').slice(0,120); copy.weekOf = ''; copy.revision = ''; copy.sessions.forEach(v => { v.id = uid(); v.plan = draftCopy(v.plan); v.plan.weekContext = context(copy); }); addWeek(copy); restoreAttachment(null); announce('Independent week copied. Set the new dates and review each session.'); return; }
      if (name === 'remove-week') { if (!window.confirm('Delete this week and its session copies from this browser? Export it first if you need its history. The current builder draft stays.')) return; weeks = weeks.filter(v => v.id !== w.id); current = ''; persist(); restoreAttachment(null); announce('Week removed. Builder draft kept.'); return; }
      if (name === 'suggest') { const rows = suggested(w,bridge.newPlan); if (!rows.length) throw Error('For a custom group, add the current practice as a session.'); if (w.sessions.length + rows.length > MAX_SESSIONS) throw Error('A week can contain at most 24 sessions.'); if (w.sessions.length && !window.confirm('Add another set of blank sessions? Existing sessions stay.')) return; w.sessions.push(...rows); persist(); announce('Blank sessions added. Open one and choose its time framework and activities.'); return; }
      if (name === 'add') {
        if (!bridge.valid()) return;
        if (w.sessions.length >= MAX_SESSIONS) throw Error('A week can contain at most 24 sessions.');
        const p = bridge.cleanPlan(bridge.getPlan());
        if (p.status !== 'completed') { p.parentId = p.id || p.parentId || ''; p.id = ''; p.weekContext = context(w); }
        const entry = {id:uid(),label:p.name,plan:p};
        w.sessions.push(entry); persist(); replaceAttached(p,{weekId:w.id,sessionId:entry.id});
        announce(p.status === 'completed' ? 'Completed record added with its original teaching details preserved.' : 'Independent session added and opened in the builder. Its source practice stays unchanged.');
        return;
      }
      if (name === 'update') { if (!bridge.valid()) return; if (attachment?.weekId !== w.id) throw Error('Choose a session first.'); updateSession(w,attachment.sessionId,bridge.getPlan()); announce('Session saved back to the week, including its handoff.'); return; }
      if (name === 'focus') { if (!bridge.valid()) return; const p = bridge.getPlan(); if (p.status === 'completed') return; p.focus = w.focus.slice(0,500); p.weekContext = context(w); bridge.replacePlan(p); announce('Shared focus and cue applied to this builder draft only.'); return; }
      if (!s) return;
      if (name === 'open') { if (!bridge.valid()) return; if (!window.confirm('Open this week session in the builder? Save the current draft to its week or named library first if you need to keep it. Undo can restore the draft.')) return; replaceAttached(s.plan,{weekId:w.id,sessionId:s.id}); announce('Opened ' + s.label + '. Save back to this session after editing.'); return; }
      if (name === 'copy-session') { if (w.sessions.length >= MAX_SESSIONS) throw Error('A week can contain at most 24 sessions.'); const p = draftCopy(s.plan); p.name = (p.name + ' — next').slice(0,120); p.weekContext = context(w); w.sessions.push({id:uid(),label:p.name,plan:p}); persist(); announce('Independent session copied; dates and handoff cleared.'); return; }
      if (name === 'remove-session') { if (!window.confirm('Remove this session copy from the week? Export the week first if you need it. The builder draft stays.')) return; w.sessions = w.sessions.filter(v => v.id !== id); persist(); if (attachment?.weekId === w.id && attachment.sessionId === id) restoreAttachment(null); announce('Session removed from this week.'); }
    } catch (e) { announce(e.message); }
  }
  function bind(element, api) {
    bridge = api; host = element?.querySelector('[data-week-content]'); if (!host) return;
    init(); refresh();
    if (host.dataset.weekBound) return; host.dataset.weekBound = 'true';
    host.addEventListener('input', e => {
      const key = e.target.dataset.weekField, w = selected(); if (!key || !w) return; e.target.setCustomValidity?.(''); if (!e.target.validity.valid) return;
      try { const value = e.target.value; if (key === 'weekOf' && value && new Date(date(value) + 'T12:00:00Z').getUTCDay() !== 1) { e.target.setCustomValidity('Choose the Monday of this planning week, or leave it blank.'); e.target.reportValidity(); return; } w[key] = value; message = ''; persist(); host.querySelector('.builder-week-message').textContent = storageMessage || message || 'Week saved in this browser.'; } catch (err) { announce(err.message); }
    });
    host.addEventListener('change', async e => {
      if (e.target.matches('[data-week-select]')) { current = e.target.value; refresh(); return; }
      if (!e.target.matches('[data-week-import]')) return;
      const file = e.target.files?.[0]; if (!file) return;
      try { if (file.size > 12000000) throw Error('Choose a week file smaller than 12 MB.'); const w = cleanImport(await file.text(),bridge.cleanPlan); addWeek(w); restoreAttachment(null); announce('Week imported as a separate local copy.'); } catch (err) { announce('Import stopped: ' + err.message); }
    });
    host.addEventListener('click', e => { const b = e.target.closest('[data-week-action]'); if (b && !b.disabled) act(b.dataset.weekAction,b.closest('[data-week-session]')?.dataset.weekSession); });
  }
  const labels = {taught:'Actually taught',changed:'Changed from the plan',worked:'What worked',reliable:'What the group can do reliably',revisit:'Next coach: revisit / next step'};
  function handoffHtml(p) {
    return '<section class="builder-handoff builder-no-print"><h2>After practice: leave the next coach a handoff</h2><p>Record the teaching that happened and what the group needs next. Completing the practice saves a separate record; future practices start from a copy.</p><fieldset data-plan-edit><div class="builder-week-grid">' + Object.entries(labels).map(([k,l]) => '<label>' + l + '<textarea rows="2" maxlength="4000" data-handoff-field="' + k + '">' + esc(p.handoff?.[k]) + '</textarea></label>').join('') + '</div><button type="button" data-action="complete">Save completed practice</button></fieldset><p class="fine">Use group-level coaching notes. Do not include private athlete or health details in shared exports.</p></section>';
  }
  function printMeta(p) {
    const w = p.weekContext || {}, h = p.handoff || {};
    return '<section class="builder-print-handoff"><p><strong>' + (p.status === 'completed' ? 'Completed practice' : 'Planned practice') + '</strong>' + (p.date ? ' · ' + esc(p.date) : '') + (p.owner ? ' · Coach: ' + esc(p.owner) : '') + (p.revision ? ' · Revision: ' + esc(p.revision) : '') + '</p>' + (w.label ? '<p><strong>Planning week:</strong> ' + esc(w.label) + '</p>' : '') + (w.cue ? '<p><strong>Shared cue:</strong> ' + esc(w.cue) + '</p>' : '') + (w.outcome ? '<p><strong>Desired outcome:</strong> ' + esc(w.outcome) + '</p>' : '') + (Object.values(h).some(Boolean) ? '<h2>Practice handoff</h2>' + Object.entries(labels).filter(([k]) => h[k]).map(([k,l]) => '<p class="builder-preline"><strong>' + l + ':</strong> ' + esc(h[k]) + '</p>').join('') : '') + '</section>';
  }
  window.GRINDSTONE_WEEKS = {render,bind,refresh,cleanMeta,handoffHtml,printMeta,draftCopy,readDraft,serializeDraft,captureAttachment,restoreAttachment,detach:() => restoreAttachment(null), testing:{cleanWeek,cleanImport,suggested,date,cleanMeta,draftCopy,act,updateSession,key:KEY,getState:()=>clone({weeks,current,attachment,message,storageMessage,readable}),reset:()=>{weeks=[];current='';attachment=null;pendingAttachment=null;replacing=false;host=null;bridge=null;initialized=false;readable=true;message='';storageMessage='';}}};
})();
