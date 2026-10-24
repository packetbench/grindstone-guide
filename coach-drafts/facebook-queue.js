(() => {
  'use strict';
  const key = 'grindstone-facebook-queue-v1';
  const data = JSON.parse(document.getElementById('queue-data').textContent);
  const people = [...data.coaches, ...(data.support || [])];
  const sections = [...document.querySelectorAll('[data-coach-id]')];
  const rows = [...document.querySelectorAll('[data-query-id]')];
  const queryIds = new Set(people.flatMap(c => c.queries.map(q => q.id)));
  const coachIds = new Set(people.map(c => c.id));
  const filter = document.getElementById('coach-filter');
  const unchecked = document.getElementById('unchecked-only');
  const saveState = document.getElementById('queue-save-state');
  const status = document.getElementById('status');
  let state = {version: 1, checked: {}, notes: {}};
  let storageReady = true;
  let toastTimer;
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (saved && typeof saved === 'object') {
      for (const [id, value] of Object.entries(saved.checked || {})) {
        if (queryIds.has(id) && value === true) state.checked[id] = true;
      }
      for (const [id, value] of Object.entries(saved.notes || {})) {
        if (coachIds.has(id) && typeof value === 'string') state.notes[id] = value;
      }
    }
  } catch {
    storageReady = false;
    saveState.textContent = 'Saved progress could not be read. You can still use this queue and export your progress.';
  }
  function announce(message) {
    clearTimeout(toastTimer);
    status.textContent = message;
    toastTimer = setTimeout(() => { status.textContent = ''; }, 4200);
  }
  function save() {
    try {
      localStorage.setItem(key, JSON.stringify({...state, updated: new Date().toISOString()}));
      storageReady = true;
      saveState.textContent = 'Saved in this browser. Export a JSON backup to keep or share your progress.';
    } catch {
      storageReady = false;
      saveState.textContent = 'Not saved: browser storage is unavailable. Use Export progress JSON to keep your checks and notes.';
    }
  }
  function update() {
    let shown = 0;
    for (const section of sections) {
      const coachVisible = filter.value === 'all' || section.dataset.coachId === filter.value;
      section.hidden = !coachVisible;
      const coachRows = [...section.querySelectorAll('[data-query-id]')];
      const checkedCount = coachRows.filter(row => state.checked[row.dataset.queryId]).length;
      section.querySelector('[data-coach-progress]').textContent = checkedCount + ' / ' + coachRows.length + ' checked';
      for (const row of coachRows) {
        const isChecked = state.checked[row.dataset.queryId] === true;
        row.querySelector('[data-query-check]').checked = isChecked;
        row.classList.toggle('is-checked', isChecked);
        row.hidden = unchecked.checked && isChecked;
        if (coachVisible && !row.hidden) shown++;
      }
    }
    document.getElementById('queue-total').textContent = Object.values(state.checked).filter(Boolean).length + ' / ' + rows.length;
    document.getElementById('queue-empty').hidden = shown > 0 || !unchecked.checked;
  }
  for (const section of sections) {
    const id = section.dataset.coachId;
    const notes = section.querySelector('[data-coach-notes]');
    const printed = section.querySelector('[data-print-notes]');
    notes.value = state.notes[id] || '';
    printed.textContent = notes.value.trim() || 'No notes recorded.';
    notes.addEventListener('input', () => {
      state.notes[id] = notes.value;
      printed.textContent = notes.value.trim() || 'No notes recorded.';
      save();
    });
  }
  for (const row of rows) {
    row.querySelector('[data-query-check]').addEventListener('change', event => {
      state.checked[row.dataset.queryId] = event.target.checked;
      save();
      update();
    });
    row.querySelector('[data-copy-query]').addEventListener('click', async () => {
      const query = row.dataset.query;
      try {
        await navigator.clipboard.writeText(query);
        announce('Copied: ' + query);
      } catch {
        const range = document.createRange();
        range.selectNodeContents(row.querySelector('.query-label span'));
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        announce('Query selected. Press Ctrl+C or use Copy to copy it.');
      }
    });
  }
  filter.addEventListener('change', update);
  unchecked.addEventListener('change', update);
  document.querySelectorAll('[data-coach-jump]').forEach(link => {
    link.addEventListener('click', () => {
      filter.value = 'all';
      update();
    });
  });
  function exportPerson(person) {
    return {id: person.id, name: person.name, context: person.context,
      notes: state.notes[person.id] || '',
      queries: person.queries.map(query => ({...query, checked: state.checked[query.id] === true}))};
  }
  document.getElementById('export-queue').addEventListener('click', () => {
    const exported = {
      title: data.title, version: data.version, prepared: data.prepared,
      exported: new Date().toISOString(), purpose: data.purpose,
      coaches: data.coaches.map(exportPerson),
      support: (data.support || []).map(exportPerson)
    };
    const blob = new Blob([JSON.stringify(exported, null, 2) + '\n'], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'facebook-queue-progress-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce('Progress export prepared. Your browser handles the download.');
  });
  document.getElementById('print-queue').addEventListener('click', () => window.print());
  // Reuse the established profile names when the companion data is available.
  const profiles = window.COACH_DRAFTS?.profiles || [];
  for (const profile of profiles) {
    const title = document.getElementById('title-' + profile.id);
    if (title && profile.name) title.textContent = profile.name;
  }
  update();
  if (storageReady && (Object.values(state.checked).some(Boolean) || Object.values(state.notes).some(Boolean))) {
    saveState.textContent = 'Saved progress loaded from this browser. Export a JSON backup to keep or share it.';
  }
})();
