/* Shared-session editing. Browser autosave never writes a shared revision. */
(function () {
  'use strict';
  const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));
  const equal = (a,b) => JSON.stringify(a) === JSON.stringify(b);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const model = () => window.GRINDSTONE_TRACKER_MODEL;
  const store = () => window.GRINDSTONE_TRACKER_STORE;
  const currentSeason = () => { const now = new Date(), y = now.getFullYear() - (now.getMonth() < 6 ? 1 : 0); return y + '-' + (y + 1); };
  const seasonOk = value => /^\d{4}-\d{4}$/.test(value || '') && Number(value.slice(5)) === Number(value.slice(0,4)) + 1;
  let bridge, root, attachment = null, pending = null, route = null, generation = 0, listTicket = 0, bindTicket = 0, busy = false;
  let season = currentSeason(), group = '', q = '', selected = '', rows = [], loaded = false, loading = false, actor = '', reason = '', message = '', error = '', conflict = false;
  const acknowledged = new Map();
  function endpoint() {
    try { const u = new URL(String(window.GRINDSTONE_TRACKER_CONFIG?.endpoint || '')); if (u.username || u.password || u.search || u.hash || (u.protocol !== 'https:' && !(u.protocol === 'http:' && ['localhost','127.0.0.1','[::1]'].includes(u.hostname)))) return ''; return u.href.replace(/\/$/,'').replace(/\/api$/,''); } catch (_) { return ''; }
  }
  function syncAddress() { const hash=String(window.location?.hash || ''); if(!/^#practices(?:\?|$)/.test(hash))return;const params=new URLSearchParams(hash.includes('?')?hash.slice(hash.indexOf('?')+1):'');if(attachment){params.set('edit',attachment.record.id);params.set('season',attachment.record.season);}else params.delete('edit');const next='#practices'+(params.toString()?'?'+params.toString():'');if(window.GRINDSTONE_NAVIGATION?.replaceRoute)window.GRINDSTONE_NAVIGATION.replaceRoute(next);else window.history?.replaceState(window.history.state,'',next); }
  function key(a) { return a.endpoint + '|' + a.record.id; }
  function validated(value) {
    if (!value || value.version !== 1 || !endpoint() || value.endpoint !== endpoint()) return null;
    try {
      const record = model().cleanSession(value.record);
      if (!record.id || !Number.isInteger(record.revision) || record.revision < 1 || !record.plan?.blocks || !seasonOk(record.season)) return null;
      return {version:1, endpoint:endpoint(), record, baseline:clone(value.baseline || {})};
    } catch (_) { return null; }
  }
  function readDraft(raw) { attachment = raw?.weekSession ? null : validated(raw?.sharedSession); if (attachment) { season = attachment.record.season; selected = attachment.record.id; } generation++; if (raw?.sharedSession && !attachment) message = 'Your draft is preserved as a local copy; its saved-practice connection could not be restored.'; }
  function serializeDraft(plan) { return {...plan, sharedSession:clone(attachment), ...(attachment ? {weekSession:null} : {})}; }
  function captureAttachment() { return clone(attachment); }
  function restoreAttachment(value) {
    attachment = validated(value); generation++; pending = null; conflict = false;
    if (attachment) { const newest = acknowledged.get(key(attachment)); if (newest && newest.revision > attachment.record.revision) attachment.record = clone(newest); }
    syncAddress();refresh();
  }
  function detach() { attachment = null; generation++; pending = null; conflict = false; reason = ''; syncAddress();refresh(); }
  function editorPlan(record) {
    const p = bridge.cleanPlan(record.plan, {preserveSnapshot:true});
    return {...p, id:'', name:record.name.length <= 120 ? record.name : p.name, date:record.date, startTime:record.startTime, owner:record.author, program:record.group, status:'planned', completedAt:''};
  }
  // Apply only editor-visible changes to the saved snapshot. Untouched unknown
  // fields and retired guides remain intact, including when blocks are reordered.
  function delta(original, before, after) {
    if (equal(before,after)) return clone(original);
    if (Array.isArray(before) && Array.isArray(after)) {
      return after.map((value,index) => {
        let old = index;
        if (value && typeof value === 'object' && value.id) old = before.findIndex(item => item?.id === value.id);
        return old < 0 || !Array.isArray(original) ? clone(value) : delta(original[old],before[old],value);
      });
    }
    if (before && after && typeof before === 'object' && typeof after === 'object' && !Array.isArray(before) && !Array.isArray(after)) {
      const result = original && typeof original === 'object' && !Array.isArray(original) ? clone(original) : {};
      for (const field of new Set([...Object.keys(before),...Object.keys(after)])) {
        if (!Object.hasOwn(after,field)) delete result[field];
        else if (!equal(before[field],after[field])) result[field] = delta(original?.[field],before[field],after[field]);
      }
      return result;
    }
    return clone(after);
  }
  function say(value, isError = false) { message = isError ? '' : value; error = isError ? value : ''; refresh(); bridge?.notify(value); }
  function filtered() { const term = q.trim().toLowerCase(); return rows.filter(r => (!group || r.group === group) && (!term || [r.name,r.author,r.lead,r.date,r.plan?.focus].join(' ').toLowerCase().includes(term))); }
  async function loadList() {
    const ticket = ++listTicket, requestedSeason = season;
    loading = true; error = ''; refresh();
    try {
      if (!endpoint() || !store()) throw Error('Shared practice storage is not connected. Your browser drafts remain available below.');
      const result = await store().load(requestedSeason);
      if (ticket !== listTicket || requestedSeason !== season) return;
      if (result.mode !== 'shared') throw Error('Shared practice storage is not connected. Browser-only records are not listed here.');
      rows = (result.sessions || []).filter(r => r.season === requestedSeason && Array.isArray(r.plan?.blocks)).map(r => model().cleanSession(r));
      rows.sort((a,b) => b.date.localeCompare(a.date) || a.name.localeCompare(b.name)); loaded = true;
      if (!rows.some(r => r.id === selected)) selected = filtered()[0]?.id || '';
      return true;
    } catch (e) { if (ticket === listTicket) { rows = []; loaded = false; error = String(e.message || 'Could not load saved practices.'); } }
    finally { if (ticket === listTicket) { loading = false; refresh(); } }
  }
  async function open(id, mode = 'edit') {
    if (busy) { say('Wait for the current shared save to finish before loading another practice.',true); return; }
    const record = rows.find(r => r.id === id);
    if (!record) { say('That saved practice is not in this season. Refresh the list and choose it again.',true); return; }
    try {
      const next = editorPlan(record), context = {version:1,endpoint:endpoint(),record:clone(record),baseline:clone(next)};
      selected = record.id; if (!filtered().some(item => item.id === record.id)) { group = record.group; q = ''; }
      if (mode === 'copy') { Object.assign(next,window.GRINDSTONE_WEEKS?.draftCopy(next) || {id:'',status:'planned',date:'',completedAt:''}); }
      const request = {plan:next, context:mode === 'copy' ? null : context, mode, fingerprint:JSON.stringify(bridge.getPlan())};
      if (occupied(bridge.getPlan())) { pending = request; error = ''; refresh(); root?.querySelector('[data-shared-action="confirm-load"]')?.focus(); }
      else applyLoad(request);
    } catch (e) { say(e.message,true); }
  }
  function occupied(p) { return !!(attachment || p.blocks.length || p.notes?.trim() || p.focus?.trim() || p.owner?.trim() || p.date || (p.name && p.name !== 'My practice')); }
  function applyLoad(request) { pending = null; conflict = false; reason = ''; bridge.replaceSharedPlan(request.plan,request.context); say(request.mode === 'copy' ? 'Opened a separate browser draft. Save it locally, or schedule it in the tracker to share a new practice.' : 'Editing saved practice revision ' + request.context.record.revision + '. Changes stay in this browser until you save them to the shared practice.'); }
  function confirmLoad() { if (!pending || busy) return; if (pending.fingerprint !== JSON.stringify(bridge.getPlan())) { pending.fingerprint = JSON.stringify(bridge.getPlan()); say('Your draft changed while this confirmation was open. Review it, then confirm again to replace it.'); return; } applyLoad(pending); }
  function cancelLoad() { pending = null;syncAddress();say('Kept your current draft.'); }
  async function save(values = {}) {
    if (busy || !attachment || !bridge || !bridge.valid()) return;
    actor = String(values.actor ?? actor).trim(); reason = String(values.reason ?? reason).trim();
    if (!actor || actor.length > 120) { say('Enter your name as the editor before saving this shared practice.',true); root?.querySelector('[data-shared-field="actor"]')?.focus(); return; }
    if (attachment.record.status === 'completed' && (!reason || reason.length > 1000)) { say('Describe the correction before saving a completed practice. Confirmed teaching will stay unchanged.',true); root?.querySelector('[data-shared-field="reason"]')?.focus(); return; }
    const context = clone(attachment), token = generation, sentPlan = bridge.getPlan();
    try {
      if (context.endpoint !== endpoint()) throw Error('The tracker connection changed. Keep a local copy and reload the saved practice from the new connection.');
      const before = editorPlan(context.record), edited = bridge.cleanPlan(sentPlan,{preserveSnapshot:true}); edited.id = before.id;
      if (edited.program !== context.record.group) throw Error('This practice belongs to ' + context.record.group + '. Change its group in the tracker, or open a separate copy.');
      const updated = clone(context.record); updated.plan = delta(context.record.plan,before,edited); updated.actor = actor;
      for (const [editorField,recordField] of [['name','name'],['date','date'],['startTime','startTime'],['owner','author']]) if (edited[editorField] !== before[editorField]) updated[recordField] = edited[editorField];
      if (updated.status === 'completed') updated.plan.sharedCorrection = {reason,actor,baseRevision:context.record.revision};
      const payload = model().cleanSession(updated);
      busy = true; error = ''; message = 'Saving changes to the shared practice…'; refresh();
      const result = await store().saveSession(payload), record = model().cleanSession(result);
      if (record.id !== context.record.id || record.group !== context.record.group || record.season !== context.record.season || record.revision <= context.record.revision) throw Error('The server returned an unexpected saved revision. Your draft is preserved; reload the list before retrying.');
      acknowledged.set(key(context),clone(record));
      if (token === generation && attachment?.record.id === record.id) {
        attachment.record = clone(record); attachment.baseline = editorPlan(record); conflict = false;
        const localSaved = bridge.saveDraft();
        const changedDuringSave = !equal(sentPlan,bridge.getPlan());
        message = 'Saved shared revision ' + record.revision + '. ' + (changedDuringSave ? 'Edits made while saving remain local; save again to include them.' : 'Earlier revisions remain in session history.');
        if (result.archive?.warning || result.archiveWarning) message += ' Archive: ' + String(result.archive?.warning || result.archiveWarning).slice(0,600);
        if (!localSaved) message += ' Browser autosave is unavailable; export your draft before leaving.';
        const index = rows.findIndex(r => r.id === record.id); if (index >= 0) rows[index] = record;
      } else { message = 'Saved revision ' + record.revision + ' of “' + record.name + '”. Your current draft was not changed.'; }
    } catch (e) { if (token === generation) { conflict = e.status === 409; error = (conflict ? 'Another coach saved a newer revision. Your draft is unchanged. Load the latest version, or keep your work as a separate local copy. ' : '') + String(e.message || 'Shared save failed. Your draft is preserved.'); message = ''; } }
    finally { busy = false; refresh(); bridge?.notify(error || message); }
  }
  function detachAsCopy() { if (busy || !attachment) return; const p = window.GRINDSTONE_WEEKS?.draftCopy(bridge.getPlan()) || {...bridge.getPlan(),id:'',date:''}; bridge.replaceSharedPlan(p,null); say('Kept your work as a separate browser draft. This does not create a second shared scheduled practice.'); }
  async function reloadLatest() { const id = attachment?.record.id; if (!id || busy) return; season = attachment.record.season; const token=generation, host=root, binding=bindTicket, requestedSeason=season; const ok=await loadList(); if (ok && token===generation && host===root && root?.isConnected !== false && binding===bindTicket && requestedSeason===season) await open(id,'edit'); }
  function prepare(params) { const id = params?.get('edit'), s = params?.get('season'); if (seasonOk(s)) season = s; route = id ? {id,season} : null; }
  function body() {
    const list = filtered(), years = new Set([season,currentSeason(),attachment?.record.season].filter(Boolean)); const year = Number(currentSeason().slice(0,4)); for(let y=year-5;y<=year+2;y++) years.add(y+'-'+(y+1));
    const options = list.map(r => '<option value="'+esc(r.id)+'"'+(r.id===selected?' selected':'')+'>'+esc(r.date+' · '+r.group+' · '+r.name+' ('+r.status+')')+'</option>').join('');
    const context = attachment ? '<div class="builder-shared-edit"><h3>Editing saved practice</h3><p><strong>'+esc(attachment.record.name)+'</strong> · '+esc(attachment.record.group)+' · '+esc(attachment.record.date)+' · shared revision '+attachment.record.revision+'</p><p>Browser autosave keeps your working draft here. Save explicitly to update this same shared practice. Group, location, lead coach, attendance status and confirmed teaching stay unchanged.</p>'+(attachment.record.status==='completed'?'<p><strong>Completed-practice correction:</strong> this changes the saved plan, not what was confirmed taught. A new revision and archive copy will be created.</p>':'')+'<div class="builder-shared-fields"><label>Your name (editor)<input data-shared-field="actor" maxlength="120" value="'+esc(actor)+'"></label>'+(attachment.record.status==='completed'?'<label>Correction reason<textarea data-shared-field="reason" maxlength="1000">'+esc(reason)+'</textarea></label>':'')+'</div><div class="builder-actions"><button type="button" data-shared-action="save"'+(busy?' disabled':'')+'>Save changes to saved practice</button><button type="button" data-shared-action="reload-latest"'+(busy?' disabled':'')+'>Load latest saved revision</button><button type="button" data-shared-action="detach"'+(busy?' disabled':'')+'>Keep as separate local copy</button></div></div>' : '';
    return '<h2>Load a saved practice</h2><p>Open a shared scheduled or completed plan to edit it, or start from a separate copy. <a href="#plans">Browse full saved plans</a>.</p><details class="builder-shared-picker"'+(!attachment?' open':'')+'><summary>Choose a shared practice</summary><div class="builder-shared-fields"><label>Season<select data-shared-filter="season">'+[...years].sort().reverse().map(s=>'<option'+(s===season?' selected':'')+'>'+esc(s)+'</option>').join('')+'</select></label><label>Group<select data-shared-filter="group"><option value="">All groups</option>'+['pups','blue','black','valkyries'].map(g=>'<option value="'+g+'"'+(g===group?' selected':'')+'>'+g[0].toUpperCase()+g.slice(1)+'</option>').join('')+'</select></label><label>Search<input type="search" data-shared-filter="q" value="'+esc(q)+'" placeholder="Name, coach, date or focus"></label></div><label>Saved practice<select data-shared-select>'+options+'</select></label><div class="builder-actions"><button type="button" data-shared-action="load-edit"'+(!list.length||loading||busy?' disabled':'')+'>Edit saved practice</button><button type="button" data-shared-action="load-copy"'+(!list.length||loading||busy?' disabled':'')+'>Open separate local copy</button><button type="button" data-shared-action="refresh"'+(loading?' disabled':'')+'>Refresh list</button></div><p data-shared-count>'+ (loading?'Loading shared practices…':loaded&&!list.length?'No saved plans match these filters.':'')+'</p></details>'+context+(pending?'<div class="builder-shared-confirm" role="region" aria-label="Replace current builder draft"><h3>Open '+esc(pending.plan.name)+'?</h3><p>Your current browser draft will be replaced. Its shared version is unchanged. Undo restores this draft and its saved-practice connection.</p><button type="button" data-shared-action="confirm-load">Open '+(pending.mode==='copy'?'separate copy':'saved practice')+'</button> <button type="button" data-shared-action="cancel-load">Keep current draft</button></div>':'')+'<p role="status" aria-live="polite" class="'+(error?'builder-shared-error':'')+'">'+esc(error||message)+'</p>';
  }
  function render() { return '<section class="builder-shared builder-no-print" data-shared-root>'+body()+'</section>'; }
  function refreshOptions() { const select=root?.querySelector('[data-shared-select]'); if(select){const list=filtered();if(!list.some(r=>r.id===selected))selected=list[0]?.id||'';select.innerHTML=list.map(r=>'<option value="'+esc(r.id)+'"'+(r.id===selected?' selected':'')+'>'+esc(r.date+' · '+r.group+' · '+r.name+' ('+r.status+')')+'</option>').join('');root.querySelectorAll('[data-shared-action="load-edit"], [data-shared-action="load-copy"]').forEach(button=>{button.disabled=!list.length||loading||busy;});const count=root.querySelector('[data-shared-count]');if(count)count.textContent=loading?'Loading shared practices…':loaded&&!list.length?'No saved plans match these filters.':'';}}
  function refresh() { const el = root?.querySelector('[data-shared-root]'), picker=root?.querySelector('.builder-shared-picker'), wasOpen=picker?.open; if(el){el.innerHTML=body();if(typeof wasOpen==='boolean'){const nextPicker=root?.querySelector('.builder-shared-picker');if(nextPicker)nextPicker.open=wasOpen;}} bridge?.updateSaveLabels?.(); }
  function bind(element, api) {
    root=element;bridge=api;const binding=++bindTicket;refresh();
    if(!root.dataset.sharedBound){root.dataset.sharedBound='true';
    root.addEventListener('input',event=>{const f=event.target.dataset?.sharedField;if(f==='actor')actor=event.target.value;if(f==='reason')reason=event.target.value;if(event.target.dataset?.sharedFilter==='q'){q=event.target.value;refreshOptions();}});
    root.addEventListener('change',event=>{const f=event.target.dataset?.sharedFilter;if(f==='season'){season=event.target.value;selected='';loadList();}if(f==='group'){group=event.target.value;selected=filtered()[0]?.id||'';refresh();}if(f==='q'){q=event.target.value;refreshOptions();}if(event.target.hasAttribute?.('data-shared-select'))selected=event.target.value;});
    root.addEventListener('click',event=>{const button=event.target.closest?.('[data-shared-action]');if(!button||!root.contains(button))return;const action=button.dataset.sharedAction;if(action==='load-edit'||action==='load-copy')open(selected,action==='load-copy'?'copy':'edit');if(action==='confirm-load')confirmLoad();if(action==='cancel-load')cancelLoad();if(action==='save')save();if(action==='refresh')loadList();if(action==='reload-latest')reloadLatest();if(action==='detach')detachAsCopy();});
    }
    const requested = route; route=null;
    if(requested && !(attachment?.record.id===requested.id && attachment.record.season===requested.season)){const token=generation, host=root;loadList().then(ok=>{if(ok && binding===bindTicket && token===generation && root===host && root?.isConnected !== false && season===requested.season)open(requested.id,'edit');});}
    else if(!loaded&&!loading)loadList();
  }
  function reset(){attachment=null;pending=null;route=null;root=null;bridge=null;generation++;listTicket++;bindTicket++;busy=false;rows=[];loaded=false;loading=false;actor='';reason='';message='';error='';conflict=false;selected='';group='';q='';season=currentSeason();acknowledged.clear();}
  window.GRINDSTONE_PRACTICE_SAVED={readDraft,serializeDraft,captureAttachment,restoreAttachment,detach,attached:captureAttachment,prepare,render,refresh,bind,save,busy:()=>busy,testing:{state:()=>clone({attachment,pending,rows,season,group,q,selected,loaded,loading,busy,message,error,conflict}),loadList,open,confirmLoad,cancelLoad,save,detachAsCopy,reloadLatest,reset}};
})();
