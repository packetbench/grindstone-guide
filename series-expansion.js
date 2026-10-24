/* Integrate researched series after the base pathway, without changing saved IDs. */
(() => {
  'use strict';
  const pathway = window.GRINDSTONE_PATHWAY;
  if (!pathway) return;
  const modules = [window.GRINDSTONE_SERIES_NEUTRAL, window.GRINDSTONE_SERIES_TOP, window.GRINDSTONE_SERIES_ESCAPES].filter(Boolean);
  const used = new Set([...pathway.series, ...pathway.sequences].map(item => item.id));
  for (const module of modules) {
    for (const series of module.series || []) {
      if (used.has(series.id)) throw new Error('Duplicate series ID: ' + series.id);
      pathway.series.push(series);
      used.add(series.id);
    }
    for (const [phaseId, ids] of Object.entries(module.placements || {})) {
      const group = pathway.groups.find(item => item.phases.some(phase => phase.id === phaseId));
      const phase = group?.phases.find(item => item.id === phaseId);
      if (!phase) throw new Error('Unknown series phase: ' + phaseId);
      for (const id of ids) {
        const series = pathway.series.find(item => item.id === id);
        if (!series || !series.age_groups.includes(group.age_group)) throw new Error('Invalid series placement: ' + id + '/' + phaseId);
        if (!phase.series_ids.includes(id)) phase.series_ids.push(id);
      }
    }
  }
})();
