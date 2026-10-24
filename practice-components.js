/* Optional series choices and simultaneous stations for the existing practice builder. */
(function () {
  'use strict';
  const MAX_STATIONS = 12, MAX_GUIDES = 24;
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const clone = value => JSON.parse(JSON.stringify(value));
  const list = value => Array.isArray(value) ? value : [];
  const lines = value => Array.isArray(value) ? value.join('\n') : value || '';
  const catalogMap = catalog => new Map(list(catalog).map(item => [item.id, item]));
  const seriesData = id => (window.GRINDSTONE_PATHWAY?.series || []).find(item => 'series:' + item.id === id);
  const isFoundation = series => series?.kind === 'foundation';
  function field(value, name, limit = 12000) {
    if (value == null) return '';
    if (typeof value !== 'string' || value.length > limit) throw Error(name + ' must be text of at most ' + limit + ' characters.');
    return value.replace(/\u0000/g, '');
  }
  function strings(value, name, count = 60, size = 4000) {
    if (value == null) return [];
    if (!Array.isArray(value) || value.length > count) throw Error(name + ' has too many entries.');
    return value.map(item => field(item, name, size));
  }
  function number(value, name, min, max, integer = false) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max || (integer ? !Number.isInteger(value) : !Number.isInteger(value * 2))) throw Error(name + ' is outside its permitted range.');
    return value;
  }
  function object(value, name) { if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error(name + ' must be an object.'); return value; }
  function branchKey(branch) {
    let hash = 2166136261;
    for (const ch of String(branch.title).toLowerCase()) { hash ^= ch.charCodeAt(0); hash = Math.imul(hash, 16777619); }
    return 'branch-' + (hash >>> 0).toString(36);
  }
  const sourceIdFor = (id, map) => map.has(id) ? id : map.has('kyle:' + id) ? 'kyle:' + id : '';
  function cleanGuide(raw) {
    object(raw, 'Guide snapshot');
    const out = {};
    for (const key of ['sourceId','title','task','setup','readiness','boundary','adaptation','ageNote','sourceNote']) out[key] = field(raw[key], 'Guide ' + key, key === 'sourceId' ? 100 : key === 'title' ? 200 : key === 'task' ? 16000 : 12000);
    out.steps = strings(raw.steps, 'Guide steps');
    out.cues = strings(raw.cues, 'Guide cues', 30);
    return out;
  }
  function snapshot(item) {
    return cleanGuide({sourceId:item.id, title:item.title, task:item.instructions || item.summary || '', setup:item.setup, readiness:item.readiness, boundary:item.boundary, adaptation:item.adaptation, ageNote:item.ageNote, sourceNote:item.sourceNote, steps:item.steps, cues:item.cues});
  }
  function cleanStation(raw) {
    object(raw, 'Station');
    const out = {name:field(raw.name, 'Station name', 200), task:field(raw.task, 'Station task', 16000)};
    for (const key of ['coach','equipment','space','group','rounds','simpler','success','stop']) out[key] = field(raw[key], 'Station ' + key, 4000);
    if (raw.guide) out.guide = cleanGuide(raw.guide);
    return out;
  }
  function cleanBlock(raw) {
    if (raw.components == null) return {};
    const value = object(raw.components, 'Practice components');
    if (value.version !== 1) throw Error('Unsupported practice-components version.');
    const clean = {version:1};
    if (value.series != null) {
      const s = object(value.series, 'Selected series');
      clean.series = {id:field(s.id, 'Series ID', 100), selections:list(s.selections).map(item => ({key:field(item.key, 'Branch key', 100), title:field(item.title, 'Branch title', 300)})), guides:[]};
      if (s.kind != null) {
        if (s.kind !== 'foundation') throw Error('Unsupported selected-series kind.');
        clean.series.kind = s.kind;
      }
      if (!Array.isArray(s.selections) || s.selections.length < 1 || s.selections.length > 20 || new Set(clean.series.selections.map(item => item.key)).size !== s.selections.length) throw Error(isFoundation(s) ? 'Choose 1–20 distinct core skills.' : 'Choose 1–20 distinct series options.');
      if (!Array.isArray(s.guides) || s.guides.length > MAX_GUIDES) throw Error('Too many selected-series guides.');
      clean.series.guides = s.guides.map(cleanGuide);
    }
    if (value.rotation != null) {
      const r = object(value.rotation, 'Station rotation');
      clean.rotation = {
        rounds:number(r.rounds, 'Rotation rounds', 1, 30, true),
        workMinutes:number(r.workMinutes, 'Minutes per round', 0.5, 120),
        changeMinutes:number(r.changeMinutes, 'Changeover minutes', 0, 30),
        briefingMinutes:number(r.briefingMinutes, 'Briefing minutes', 0, 60),
        finishMinutes:number(r.finishMinutes, 'Finish minutes', 0, 60),
        showAll:r.showAll === true, stations:[]
      };
      if (!Array.isArray(r.stations) || r.stations.length > MAX_STATIONS) throw Error('A rotation can contain at most ' + MAX_STATIONS + ' stations.');
      clean.rotation.stations = r.stations.map(cleanStation);
      if (rotationMinutes(clean.rotation) > 120) throw Error('A station rotation must fit within 120 minutes.');
    }
    return {components:clean};
  }
  function rotationMinutes(rotation) { return rotation.briefingMinutes + rotation.rounds * rotation.workMinutes + Math.max(0, rotation.rounds - 1) * rotation.changeMinutes + rotation.finishMinutes; }
  function newRotation() { return {rounds:3,workMinutes:5,changeMinutes:1,briefingMinutes:2,finishMinutes:1,showAll:false,stations:[cleanStation({name:'Station 1'}),cleanStation({name:'Station 2'}),cleanStation({name:'Station 3'})]}; }
  function selectionStatus(block) {
    const selected = block.components?.series;
    if (!selected) return '';
    const current = seriesData(selected.id);
    const keys = new Set(list(current?.branches).map(branchKey));
    return !current || selected.selections.some(item => !keys.has(item.key)) ? (isFoundation(selected) || isFoundation(current) ? 'A saved core skill is no longer in the current collection. Your saved instruction is preserved. Review before replacing it with current skills.' : 'A saved series option is no longer in the current collection. Your saved instruction is preserved. Review before replacing it with current options.') : '';
  }
  function selectSeries(block, keys, catalog) {
    const series = seriesData(block.sourceId);
    if (!series) throw Error('This series is not available for new selections.');
    const foundation = isFoundation(series);
    if (!Array.isArray(keys) || new Set(keys).size !== keys.length) throw Error(foundation ? 'Choose distinct core skills.' : 'Choose distinct series options.');
    const selected = series.branches.filter(branch => keys.includes(branchKey(branch)));
    if (!selected.length || selected.length !== new Set(keys).size) throw Error(foundation ? 'Choose at least one available core skill.' : 'Choose at least one available series option.');
    const map = catalogMap(catalog);
    const foundationIds = foundation ? [] : list(series.members).filter(member => /^foundation$/i.test(member.role)).map(member => member.move_id);
    const ids = [...new Set([...foundationIds, ...selected.flatMap(branch => list(branch.move_ids))])].map(id => sourceIdFor(id, map)).filter(Boolean);
    const guides = ids.map(id => snapshot(map.get(id)));
    const base = map.get(block.sourceId);
    const next = clone(block);
    next.components = {...(next.components || {}),version:1,series:{id:block.sourceId,...(foundation ? {kind:'foundation'} : {}),selections:selected.map(branch => ({key:branchKey(branch),title:branch.title})),guides}};
    next.instructions = [series.summary, (foundation ? 'Match essentials: ' : 'Common foundation: ') + series.foundation, foundation ? 'Core skills selected for today. Teach each skill separately in its own starting position. These skills do not automatically chain together; use only the coach-announced task and cooperative receiving role.' : 'Today’s chosen options only. Start every attempt from the common foundation; the partner supplies only a taught response.', ...selected.map(branch => branch.title + (foundation ? '\nSkill purpose: ' : '\nWhen: ') + branch.when + (foundation ? '\nTeach: ' : '\nOption: ') + branch.action + (branch.readiness ? (foundation ? '\nBefore this skill: ' : '\nBefore adding this option: ') + branch.readiness : '')), foundation ? 'Reset: release and rebuild the current skill’s starting position after each attempt. Stop if position or receiving control is lost. Before a different skill, stop and establish its separate setup and receiving role; do not force a transition.' : 'Reset: release and return to the shared starting position after each attempt. If the position or receiving control is lost, stop and rebuild; do not force a different option.', series.verification ? 'Source scope: ' + series.verification : ''].filter(Boolean).join('\n\n');
    next.setup = foundation ? [series.setup, 'Set up each selected skill separately, with its own starting position, prerequisites and receiving role. Change skills only after the coach has explained the next setup.'].filter(Boolean).join('\n') : series.setup || next.setup;
    next.readiness = series.readiness || next.readiness;
    next.boundary = lines(series.boundaries) || next.boundary;
    next.steps = foundation ? [
      'Choose the core skill to work on and establish its own starting position. Check its prerequisites and the partner’s receiving role before starting.',
      'Teach or recall that skill separately with cooperative receiving, then use only the resistance its guide and the pair’s readiness permit.',
      'Release and rebuild the same skill’s setup after each attempt. Give feedback and stop for lost position, discomfort or unreliable receiving control.',
      'Before another selected skill, pause and establish its separate setup and partner roles. Do not automatically chain the selected skills or add a mat return to an escape drill.'
    ] : [
      'Establish the common foundation and check each selected option’s prerequisites and the partner’s receiving role.',
      'Teach or recall each selected option separately with the receiver giving its announced, cooperative response.',
      'Let partners choose only between the selected, already-learned responses when they are ready. Use one option per attempt.',
      'Release, reset to the foundation and give feedback. Stop for lost position, discomfort or unreliable receiving.'
    ];
    next.cues = lines(series.cues);
    next.ageNote = base?.ageNote || next.ageNote || '';
    next.sourceNote = [series.verification, ...list(series.sources).map(source => source.title + (source.note ? ': ' + source.note : ''))].filter(Boolean).join('\n') || next.sourceNote || '';
    return next;
  }
  function renderChoices(series, selections, context) {
    const keys = selections || [branchKey(series.branches[0])], foundation = isFoundation(series);
    return '<fieldset class="component-options"><legend>' + (foundation ? 'Core skills to teach today' : 'Options to teach today') + '</legend><p>' + (foundation ? 'Choose one or more skills appropriate for the pair. Each keeps its own setup, prerequisites and receiving controls. Teach them separately; selection does not create a move sequence.' : 'The shared foundation, readiness and reset guidance stay with every selection. Choose options already appropriate for the pair.') + '</p>' + series.branches.map(branch => '<label class="component-choice"><input type="checkbox" data-component-branch="' + esc(context) + '" value="' + branchKey(branch) + '"' + (keys.includes(branchKey(branch)) ? ' checked' : '') + '><span><strong>' + esc(branch.title) + '</strong><small>' + (foundation ? 'Skill purpose: ' : 'When: ') + esc(branch.when) + '</small>' + (branch.readiness ? '<small>' + (foundation ? 'Before this skill: ' : 'Before this option: ') + esc(branch.readiness) + '</small>' : '') + '</span></label>').join('') + '</fieldset>';
  }
  function renderPicker(item) {
    const series = seriesData(item?.id);
    return series ? '<section class="component-picker" data-component-series="' + esc(item.id) + '">' + renderChoices(series, null, 'picker') + '<p class="fine">Only checked ' + (isFoundation(series) ? 'skills' : 'options') + ' are added. Linked instruction and source notes travel with them.</p></section>' : '';
  }
  function applyPicker(block, item, container, catalog) {
    if (!seriesData(item?.id)) return block;
    const fields = container?.querySelectorAll?.('[data-component-branch="picker"]');
    // Non-DOM callers retain their original whole-series block unless they supply a choice.
    if (!fields || !fields.length) return block;
    return selectSeries(block, Array.from(fields).filter(el => el.checked).map(el => el.value), catalog);
  }
  function reloadBlock(previous, reloaded, catalog) {
    const saved = previous.components;
    if (!saved) return reloaded;
    if (saved.series) {
      if (selectionStatus(previous)) return clone(previous);
      const next = selectSeries({...reloaded,components:clone(saved)}, saved.series.selections.map(item => item.key), catalog);
      return next;
    }
    return {...reloaded,components:clone(saved)};
  }
  function trustedLinks(guide, catalog) {
    const item = catalogMap(catalog).get(guide.sourceId);
    if (!item) return '<p class="fine">Original guide is no longer in the current collection; saved instruction is retained.</p>';
    const links = [];
    if (/^#(?:(?:move|game)\/[A-Z]\d+|moves\/(?:kyle|videos)\/[A-Z]\d+|season\?)/.test(item.path || '')) links.push('<a href="' + esc(item.path) + '" target="_blank" rel="noopener">Open ' + esc(item.title) + '</a>');
    try { const url = new URL(item.video); if (['https:','http:'].includes(url.protocol)) links.push('<a href="' + esc(url.href) + '" target="_blank" rel="noopener">Watch source video</a>'); } catch (_) {}
    return links.length ? '<div class="component-links">' + links.join(' ') + '</div>' : '';
  }
  function guideHtml(guide, catalog, full) {
    if (!guide) return '';
    const notes = [['Ready when',guide.readiness],['Boundaries',guide.boundary],['Age guidance',guide.ageNote],['Age adaptations',guide.adaptation],['Source scope',guide.sourceNote]];
    return '<div class="component-guide"><h5>' + esc(guide.title) + '</h5>' + trustedLinks(guide,catalog) + (full ? (guide.setup ? '<p><strong>Setup:</strong> ' + esc(guide.setup) + '</p>' : '') + '<p class="component-preline">' + esc(guide.task) + '</p>' + (guide.steps.length ? '<ol>' + guide.steps.map(step => '<li>' + esc(step) + '</li>').join('') + '</ol>' : '') : '') + (guide.cues.length ? '<p><strong>Cues:</strong> ' + esc(guide.cues.join(' · ')) + '</p>' : '') + notes.filter(([,value]) => value).map(([label,value]) => '<p class="component-preline"><strong>' + label + ':</strong> ' + esc(value) + '</p>').join('') + '</div>';
  }
  function problems(block) {
    const r = block.components?.rotation, found = [];
    if (!r) return found;
    if (!r.stations.length) found.push('Add at least one station.');
    r.stations.forEach((station,i) => { if (!station.name.trim() || !station.task.trim()) found.push('Station ' + (i + 1) + ' needs a name and a task.'); });
    if (rotationMinutes(r) !== block.minutes) found.push('Rotation totals ' + rotationMinutes(r) + ' minutes; the practice slot is ' + block.minutes + '. Use the rotation total or adjust the shared timing.');
    return found;
  }
  function timingHtml(block, controls) {
    const r = block.components?.rotation;
    if (!r) return '';
    return '<div class="component-timing"><p><strong>Shared elapsed time: ' + rotationMinutes(r) + ' minutes.</strong> ' + r.briefingMinutes + ' briefing + ' + r.rounds + ' rounds × ' + r.workMinutes + ' work + ' + Math.max(0,r.rounds - 1) + ' changes × ' + r.changeMinutes + ' + ' + r.finishMinutes + ' finish. Stations run simultaneously; their individual task times are not added together.</p><p class="fine">Copied guides may describe a longer drill or game. Choose turns, recovery and a stopping point that fit each work period; copying a guide does not shorten its rules or rounds.</p>' + (r.rounds < r.stations.length ? '<p class="fine">There are fewer rounds than stations; not every group will visit every station.</p>' : '') + (problems(block).length ? '<ul class="component-warning">' + problems(block).map(text => '<li>' + esc(text) + '</li>').join('') + '</ul>' : '') + (controls ? '<button type="button" data-component-action="use-total">Use rotation total for this block</button>' : '') + '</div>';
  }
  function stationFields(station,index,catalog,age,showAll) {
    const allowed = list(catalog).filter(item => !item.types.includes('series') && (showAll || !age || item.age_groups?.includes(age)));
    const select = '<label>Fill from a guide (optional)<select data-station-source="' + index + '"><option value="">Choose a guide or write your own</option>' + allowed.map(item => '<option value="' + esc(item.id) + '">' + esc(item.title + ' · ' + item.id) + '</option>').join('') + '</select></label>';
    const input = (key,label,required = false) => '<label>' + label + '<input data-station-field="' + key + '" data-station-index="' + index + '" value="' + esc(station[key]) + '" maxlength="' + (key === 'name' ? 200 : 4000) + '"' + (required ? ' required' : '') + '></label>';
    const area = (key,label,required = false) => '<label>' + label + '<textarea data-station-field="' + key + '" data-station-index="' + index + '" rows="' + (key === 'task' ? 4 : 2) + '" maxlength="' + (key === 'task' ? 16000 : 4000) + '"' + (required ? ' required' : '') + '>' + esc(station[key]) + '</textarea></label>';
    return '<article class="component-station"><h4>Station ' + (index + 1) + '</h4>' + input('name','Station name',true) + select + area('task','Task, partner roles and repetitions',true) + '<details><summary>Coach, equipment and adaptations</summary><div class="component-field-grid">' + input('coach','Coach / role') + input('equipment','Equipment') + input('space','Space / location') + input('group','Group size / partner arrangement') + area('rounds','Turns, recovery and role swaps within the work period') + area('simpler','Simpler version') + area('success','What success looks like') + area('stop','Stop and reset conditions') + '</div></details>' + (station.guide ? '<details><summary>Linked instruction, cues & boundaries</summary>' + guideHtml(station.guide,catalog,true) + '</details>' : '') + '<button type="button" data-component-action="remove-station" data-station-index="' + index + '">Remove station ' + (index + 1) + '</button></article>';
  }
  function renderBlock(block,index,catalog,age = '') {
    const series = seriesData(block.sourceId), saved = block.components?.series, rotation = block.components?.rotation;
    const foundation = isFoundation(series) || isFoundation(saved);
    let html = '<section class="practice-components" data-component-block="' + index + '">';
    if (series) html += '<details class="component-series"><summary>' + (foundation ? 'Choose the core skills taught in this block' : 'Choose the options taught in this series block') + '</summary>' + (selectionStatus(block) ? '<p class="component-warning">' + esc(selectionStatus(block)) + '</p>' : '') + renderChoices(series,saved ? saved.selections.map(item => item.key) : series.branches.map(branchKey),'block') + '<button type="button" data-component-action="apply-series">Apply selected ' + (foundation ? 'skills' : 'options') + ' to this block</button><p class="fine">Applying replaces the series task and teaching steps. Your timing and station notes stay.</p></details>';
    else if (saved) html += '<p class="component-warning">' + esc(selectionStatus(block)) + '</p>';
    if (saved?.guides.length) html += '<details><summary>' + (foundation ? 'Selected core skills: linked teaching cards' : 'Selected options: linked teaching cards') + '</summary>' + saved.guides.map(guide => guideHtml(guide,catalog,true)).join('') + '</details>';
    if (!rotation) return html + '<button type="button" data-component-action="add-rotation">Add structured station rotation</button><p class="fine">Keep the existing partner/station notes. A rotation uses one shared clock for simultaneous stations.</p></section>';
    html += '<h3>Simultaneous station rotation</h3><div class="component-field-grid">' + [['rounds','Number of rounds',1,30,1],['workMinutes','Work minutes per round',0.5,120,0.5],['changeMinutes','Minutes between rounds',0,30,0.5],['briefingMinutes','Briefing / demonstration minutes',0,60,0.5],['finishMinutes','Finish / reset minutes',0,60,0.5]].map(([key,label,min,max,step]) => '<label>' + label + '<input type="number" required min="' + min + '" max="' + max + '" step="' + step + '" data-rotation-field="' + key + '" value="' + rotation[key] + '"></label>').join('') + '</div><div data-component-timing>' + timingHtml(block,true) + '</div><p>Divide athletes into groups, give each a different starting station, then move to the next station on the shared signal. Include recovery and partner swaps inside each work period.</p><label class="component-choice"><input type="checkbox" data-component-broad' + (rotation.showAll ? ' checked' : '') + '><span>Include broader or unassigned coach references in station guide choices</span></label><div class="component-stations">' + rotation.stations.map((station,i) => stationFields(station,i,catalog,age,rotation.showAll)).join('') + '</div><div class="component-actions"><button type="button" data-component-action="add-station"' + (rotation.stations.length >= MAX_STATIONS ? ' disabled' : '') + '>Add a station</button><button type="button" data-component-action="remove-rotation">Remove structured rotation</button></div></section>';
    return html;
  }
  function printBlock(block,catalog) {
    const component = block.components;
    if (!component) return '';
    let html = '<section class="component-print">';
    if (component.series) html += '<h3>' + (isFoundation(component.series) || isFoundation(seriesData(component.series.id)) ? 'Selected core skills' : 'Selected series options') + '</h3><ul>' + component.series.selections.map(item => '<li>' + esc(item.title) + '</li>').join('') + '</ul>' + (selectionStatus(block) ? '<p>' + esc(selectionStatus(block)) + '</p>' : '') + component.series.guides.map(guide => guideHtml(guide,catalog,true)).join('');
    if (component.rotation) {
      html += '<h3>Station rotation · one shared clock</h3>' + timingHtml(block,false) + component.rotation.stations.map((station,i) => '<article class="component-station-print"><h4>Station ' + (i + 1) + ': ' + esc(station.name || 'Name needed') + '</h4><p class="component-preline"><strong>Task:</strong> ' + esc(station.task || 'Task needed before use') + '</p>' + [['Coach',station.coach],['Equipment',station.equipment],['Space',station.space],['Group',station.group],['Turns & recovery',station.rounds],['Simpler version',station.simpler],['Success',station.success],['Stop / reset',station.stop]].filter(([,value]) => value).map(([label,value]) => '<p class="component-preline"><strong>' + label + ':</strong> ' + esc(value) + '</p>').join('') + guideHtml(station.guide,catalog,true) + '</article>').join('');
    }
    return html + '</section>';
  }
  function refresh(container, plan) {
    container?.querySelectorAll?.('[data-component-block]').forEach(host => {
      const block = plan.blocks[Number(host.dataset.componentBlock)], panel = host.querySelector('[data-component-timing]');
      if (block && panel) panel.innerHTML = timingHtml(block,true);
    });
  }
  function bind(container, options) {
    if (!container || container.dataset.componentsBound) return;
    container.dataset.componentsBound = 'true';
    const changed = (message,render = true) => options.onChange?.({message,render});
    const locate = el => {
      if (options.getPlan().status === 'completed') return null;
      const host = el.closest('[data-component-block]');
      if (!host) return null;
      const index = Number(host.dataset.componentBlock), block = options.getPlan().blocks[index];
      return block ? {host,index,block} : null;
    };
    function error(err) { changed(err.message,false); }
    container.addEventListener('input', event => {
      const el = event.target;
      if (!el.dataset.stationField && !el.dataset.rotationField) return;
      const found = locate(el); if (!found) return;
      const r = found.block.components?.rotation; if (!r) return;
      try {
        if (el.dataset.stationField) {
          const key = el.dataset.stationField, station = r.stations[Number(el.dataset.stationIndex)];
          if (!station || !['name','task','coach','equipment','space','group','rounds','simpler','success','stop'].includes(key)) return;
          station[key] = field(el.value,'Station ' + key,key === 'name' ? 200 : key === 'task' ? 16000 : 4000);
        } else {
          el.setCustomValidity?.('');
          if (!el.validity.valid) return;
          const key = el.dataset.rotationField;
          if (!['rounds','workMinutes','changeMinutes','briefingMinutes','finishMinutes'].includes(key)) return;
          const candidate = {...r,[key]:Number(el.value)};
          cleanBlock({components:{version:1,rotation:candidate}});
          r[key] = Number(el.value);
        }
        found.host.querySelector('[data-component-timing]').innerHTML = timingHtml(found.block,true);
        changed('',false);
      } catch (err) { el.setCustomValidity?.(err.message); error(err); }
    });
    container.addEventListener('change', event => {
      const el = event.target;
      if (el.dataset.stationSource == null && !el.hasAttribute('data-component-broad')) return;
      const found = locate(el); if (!found) return;
      const r = found.block.components?.rotation; if (!r) return;
      if (el.hasAttribute('data-component-broad')) { r.showAll = el.checked; changed('Station guide choices updated.'); return; }
      const station = r.stations[Number(el.dataset.stationSource)], guide = catalogMap(options.getCatalog()).get(el.value);
      if (!station || !guide) return;
      const age = options.getAge?.();
      if (guide.types.includes('series') || (!r.showAll && age && !guide.age_groups?.includes(age))) { el.value = ''; changed('Choose an age-matched guide or explicitly include broader references.',false); return; }
      if (station.task && !window.confirm('Replace this station’s task and linked instruction with “' + guide.title + '”? Coach and station arrangements stay.')) { el.value = ''; return; }
      options.beforeChange?.();
      station.name = guide.title; station.task = guide.instructions || guide.summary || ''; station.guide = snapshot(guide);
      changed('Guide copied to the station. Review turns, recovery and the simpler version.');
    });
    container.addEventListener('click', event => {
      const button = event.target.closest('[data-component-action]');
      if (!button || button.disabled) return;
      const found = locate(button); if (!found) return;
      const {block,host,index} = found, action = button.dataset.componentAction;
      try {
        if (action === 'apply-series') {
          const foundation = isFoundation(seriesData(block.sourceId));
          if (!window.confirm('Replace this block’s series task and teaching steps with the selected ' + (foundation ? 'core skills' : 'options') + '? Timing and station notes stay.')) return;
          const keys = Array.from(host.querySelectorAll('[data-component-branch="block"]')).filter(el => el.checked).map(el => el.value);
          const next = selectSeries(block,keys,options.getCatalog()); options.beforeChange?.(); options.getPlan().blocks[index] = next; changed(foundation ? 'Selected core skills applied. Separate setups, readiness and source guidance stay included.' : 'Selected options applied. Foundation, readiness and source guidance stay included.'); return;
        }
        if (action === 'add-rotation') {
          options.beforeChange?.(); block.components = {...(block.components || {}),version:1,rotation:newRotation()}; block.delivery = 'stations'; changed('Rotation added. Fill the station tasks and choose the shared timing.'); return;
        }
        const r = block.components?.rotation; if (!r) return;
        if (action === 'remove-rotation') {
          if (!window.confirm('Remove these structured stations? The original partner/station text stays.')) return;
          options.beforeChange?.(); delete block.components.rotation; changed('Structured rotation removed. Existing notes are retained.'); return;
        }
        if (action === 'add-station' && r.stations.length < MAX_STATIONS) { options.beforeChange?.(); r.stations.push(cleanStation({name:'Station ' + (r.stations.length + 1)})); changed('Station added. Give it a task.'); return; }
        if (action === 'remove-station') {
          const i = Number(button.dataset.stationIndex); if (!r.stations[i]) return;
          if (!window.confirm('Remove “' + r.stations[i].name + '” from this rotation?')) return;
          options.beforeChange?.(); r.stations.splice(i,1); changed('Station removed; shared timing is unchanged.'); return;
        }
        if (action === 'use-total') { options.beforeChange?.(); block.minutes = rotationMinutes(r); changed('Practice block now uses the shared rotation time.'); }
      } catch (err) { error(err); }
    });
  }
  window.GRINDSTONE_COMPONENTS = {cleanBlock,renderPicker,applyPicker,renderBlock,printBlock,bind,refresh,selectSeries,reloadBlock,selectionStatus,rotationMinutes,problems,testing:{branchKey,snapshot,cleanGuide,cleanStation,newRotation,guideHtml,trustedLinks}};
})();
