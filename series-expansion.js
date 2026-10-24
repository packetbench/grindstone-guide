/* Integrate researched series after the base pathway, without changing saved IDs. */
(() => {
  'use strict';
  const pathway = window.GRINDSTONE_PATHWAY;
  if (!pathway) return;
  const modules = [window.GRINDSTONE_SERIES_NEUTRAL, window.GRINDSTONE_SERIES_TOP, window.GRINDSTONE_SERIES_ESCAPES, window.GRINDSTONE_SERIES_FOUNDATION, window.GRINDSTONE_SERIES_TOP_ADDITIONS, window.GRINDSTONE_SERIES_NEUTRAL_ADDITIONS, window.GRINDSTONE_SERIES_READY_ADDITIONS].filter(Boolean);
  const used = new Set([...pathway.series, ...pathway.sequences].map(item => item.id));
  for (const module of modules) {
    for (const series of module.series || []) {
      if (used.has(series.id)) throw new Error('Duplicate series ID: ' + series.id);
      if (series.kind === 'foundation') pathway.series.unshift(series);
      else pathway.series.push(series);
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
  // The series tier describes its starting foundation, not the hardest optional branch.
  // Familiar two-choice work is Intermediate; explicit ages and saved plans are unchanged.
  const tiers = {
    S16: 'Intermediate', S18: 'Intermediate', S19: 'Intermediate', S20: 'Intermediate',
    S21: 'Beginner', S23: 'Intermediate', S27: 'Intermediate',
    S28: 'Beginner', S30: 'Intermediate', S10: 'Intermediate', S11: 'Intermediate', S12: 'Intermediate'
  };
  for (const item of [...pathway.series, ...pathway.sequences]) {
    if (tiers[item.id]) item.tier = tiers[item.id];
  }
  for (const [id, move, note] of [
    ['S21', 'N21', 'Beginner foundation: learn the ordinary half and finish first. The suck-back is a separately taught Intermediate option.'],
    ['S28', 'N42', 'Beginner foundation: learn the pass-by to standing rear control first. The knee-block finish is a separately taught Intermediate option.']
  ]) {
    const series = pathway.series.find(item => item.id === id);
    if (!series) continue;
    series.readiness = note + ' ' + series.readiness;
    for (const branch of series.branches || []) {
      branch.tier = branch.move_ids.includes(move) ? 'Intermediate' : 'Beginner';
      if (branch.tier === 'Intermediate') branch.readiness = 'Intermediate option: ' + branch.readiness;
    }
    const member = series.members?.find(item => item.move_id === move);
    if (member) member.note = 'Intermediate option. ' + member.note;
  }
  const crossface = pathway.series.find(item => item.id === 'S27');
  if (crossface) crossface.readiness = crossface.readiness.replace('This advanced choice card', 'This choice card');
})();
