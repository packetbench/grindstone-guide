/* Foundation skill selections and preserved teaching snapshots for the live practice builder. */
(function () {
  'use strict';
  const MAX_GUIDES = 24;
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
  function cleanBlock(raw) {
    if (raw.components == null) return {};
    const value = object(raw.components, 'Practice components');
    if (value.version !== 1) throw Error('Unsupported practice-components version.');
    if (value.rotation != null) throw Error('This file contains preview-only structured stations. Keep the original file and open it in the planning preview.');
    if (value.series == null) return {};
    const s = object(value.series, 'Selected series');
    const series = {id:field(s.id, 'Series ID', 100), selections:list(s.selections).map(item => ({key:field(item.key, 'Branch key', 100), title:field(item.title, 'Branch title', 300)})), guides:[]};
    if (s.kind != null) {
      if (s.kind !== 'foundation') throw Error('Unsupported selected-series kind.');
      series.kind = s.kind;
    }
    if (!Array.isArray(s.selections) || s.selections.length < 1 || s.selections.length > 20 || new Set(series.selections.map(item => item.key)).size !== s.selections.length) throw Error('Choose 1–20 distinct skills.');
    if (!Array.isArray(s.guides) || s.guides.length > MAX_GUIDES) throw Error('Too many selected-series guides.');
    series.guides = s.guides.map(cleanGuide);
    return {components:{version:1,series}};
  }
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
    return isFoundation(series) ? '<section class="component-picker" data-component-series="' + esc(item.id) + '">' + renderChoices(series, null, 'picker') + '<p class="fine">Only checked ' + (isFoundation(series) ? 'skills' : 'options') + ' are added. Linked instruction and source notes travel with them.</p></section>' : '';
  }
  function applyPicker(block, item, container, catalog) {
    if (!isFoundation(seriesData(item?.id))) return block;
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
  function renderBlock(block,index,catalog) {
    const current = seriesData(block.sourceId), saved = block.components?.series;
    if (!isFoundation(current) && !saved) return '';
    let html = '<section class="practice-components" data-component-block="' + index + '">';
    if (isFoundation(current)) html += '<details class="component-series"><summary>Choose the core skills taught in this block</summary>' + (selectionStatus(block) ? '<p class="component-warning">' + esc(selectionStatus(block)) + '</p>' : '') + renderChoices(current,saved ? saved.selections.map(item => item.key) : current.branches.map(branchKey),'block') + '<button type="button" data-component-action="apply-series">Apply selected skills to this block</button><p class="fine">Applying replaces the skill task and teaching steps. Your timing and partner notes stay.</p></details>';
    else if (selectionStatus(block)) html += '<p class="component-warning">' + esc(selectionStatus(block)) + '</p>';
    if (saved?.guides.length) html += '<details><summary>' + (isFoundation(saved) ? 'Selected core skills: linked teaching cards' : 'Saved selections: linked teaching cards') + '</summary>' + saved.guides.map(guide => guideHtml(guide,catalog,true)).join('') + '</details>';
    return html + '</section>';
  }
  function printBlock(block,catalog) {
    const saved = block.components?.series;
    if (!saved) return '';
    return '<section class="component-print"><h3>' + (isFoundation(saved) || isFoundation(seriesData(saved.id)) ? 'Selected core skills' : 'Saved series selections') + '</h3><ul>' + saved.selections.map(item => '<li>' + esc(item.title) + '</li>').join('') + '</ul>' + (selectionStatus(block) ? '<p>' + esc(selectionStatus(block)) + '</p>' : '') + saved.guides.map(guide => guideHtml(guide,catalog,true)).join('') + '</section>';
  }
  function bind(container,options) {
    if (!container || container.dataset.componentsBound) return;
    container.dataset.componentsBound = 'true';
    container.addEventListener('click',event => {
      const button = event.target.closest('[data-component-action="apply-series"]');
      if (!button || button.disabled || options.getPlan().status === 'completed') return;
      const host = button.closest('[data-component-block]'), index = Number(host?.dataset.componentBlock), block = options.getPlan().blocks[index];
      if (!host || !block || !isFoundation(seriesData(block.sourceId))) return;
      if (!window.confirm('Replace this block’s skill task and teaching steps with the selected core skills? Timing and partner notes stay.')) return;
      try {
        const keys = Array.from(host.querySelectorAll('[data-component-branch="block"]')).filter(el => el.checked).map(el => el.value);
        const next = selectSeries(block,keys,options.getCatalog());
        options.beforeChange?.();
        options.getPlan().blocks[index] = next;
        options.onChange({render:true,message:'Selected core skills applied. Separate setups, readiness and source guidance stay included.'});
      } catch (error) { options.onChange({render:false,message:error.message}); }
    });
  }
  window.GRINDSTONE_COMPONENTS = {cleanBlock,renderPicker,applyPicker,renderBlock,printBlock,bind,selectSeries,reloadBlock,selectionStatus,testing:{branchKey,snapshot,cleanGuide,guideHtml,trustedLinks}};
})();
