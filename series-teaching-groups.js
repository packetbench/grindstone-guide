/* Planning suggestions reviewed against the actual prerequisites, not ID prefixes.
   USA Wrestling's age guidance emphasizes experience; its curriculum levels are
   not age permissions. These group choices are Grindstone coaching judgments. */
(() => {
  'use strict';
  const moves = window.GRINDSTONE?.moves || [];
  const pathway = window.GRINDSTONE_PATHWAY;
  if (!pathway) return;
  const groups = ['7-10', '11-14'];
  const common = 'Ready 7–10 and 11–14 wrestlers after the listed prerequisite skills and partner receiving are dependable. Teach the individual action before adding a reaction choice. Group placement is a planning suggestion, not automatic clearance.';
  for (const id of ['A01','A02','A03','A04','A05','A15','A16','A17','A19','A24','N01','N02','N03','N04','N05','N11']) {
    const move = moves.find(item => item.id === id);
    if (!move) continue;
    move.tier = 'Intermediate';
    move.age_groups = [...groups];
    move.age_note = common;
  }
  const half = pathway.series.find(item => item.id === 'S21');
  if (half) {
    half.age_groups = [...groups];
    half.readiness = 'Beginner foundation: teach the ordinary half and pin finish first. Ready 7–10 and 11–14 pairs can begin there. The suck-back is a separately taught Intermediate option, added only after the changeover, underarm controls and supported receiving are dependable. Pups use the short half-nelson lesson in their season pathway.';
    half.setup = 'Start with the ordinary half and finish. Check B26 and B28, match partners for size and control, and agree on a slow turn and prompt release. Add N21 only after its separate seated receiving lesson; a series does not require teaching every option in one practice.';
    half.steps = [
      'Check B26 and B28 first. Give pairs time to learn and repeat the ordinary half without requiring the suck-back.',
      'When ready for a second option, teach N21 in isolation, starting with its seated receiving rehearsal before adding the light half-nelson start.',
      'After both options are dependable, take three announced repetitions of each. Bottom states the response; top names the option before moving.',
      'Use two 20-second choice turns with only the two rehearsed responses. Top chooses once, reaches the controlled endpoint and resets. Swap roles.',
      'Reset for a blocked turn, lost connection, trapped arm or unfamiliar reaction. Return to individual instruction if the choice work breaks down.'
    ];
    half.branches.forEach(branch => { branch.age_groups = [...groups]; });
  }
  const pass = pathway.series.find(item => item.id === 'S28');
  if (pass) {
    pass.age_groups = [...groups];
    pass.readiness = 'Beginner foundation: ready 7–10 and 11–14 pairs can learn the standing pass-by and rear-control stop. The knee-block finish remains an Intermediate option for prepared 11–14 pairs with reliable receiving. Younger pairs work the open-path capture and reset, not the complete two-choice finish drill.';
    pass.branches.forEach(branch => { branch.age_groups = branch.move_ids.includes('N42') ? ['11-14'] : [...groups]; });
    pass.steps = [
      'For a short first lesson, teach N41 only: establish the tie, pass to balanced rear control, then release. Use 4–6 minutes and alternate roles; the knee-block branch is not required.',
      'For an 8-minute review block, minutes 0–2 check the shared tie, prompt release and the endpoint of each option selected for today.',
      'Minutes 2–5: alternate repetitions of the selected familiar option or options. Ready 7–10 pairs keep the standing N41 endpoint. Include N42 only for prepared 11–14 pairs after its separate receiving lesson.',
      'Minutes 5–7: if both eligible options are dependable, the receiver supplies one of the two taught responses at walking speed. With N41 alone, vary the timing of the cooperative pass and reset whenever the path closes; do not improvise a knee block.',
      'Minutes 7–8: demonstrate one clean option and name its stop condition. Unfamiliar techniques need their own teaching time; finishing the clock does not establish readiness.'
    ];
  }
  // Optional later placements, rather than a calendar requirement for every pair.
  for (const phaseId of ['youth-4','youth-5','youth-6']) {
    const phase = pathway.groups.flatMap(group => group.phases).find(item => item.id === phaseId);
    if (phase && !phase.series_ids.includes('S21')) phase.series_ids.push('S21');
  }
  const later = pathway.groups.flatMap(group => group.phases).find(item => item.id === 'youth-6');
  if (later && !later.series_ids.includes('S28')) later.series_ids.push('S28');
  window.GRINDSTONE_TEACHING_GROUP_REVIEW = {
    reviewed: '2026-10-24',
    rationale: 'The teaching tier describes the starting skill; each optional branch keeps its own prerequisites. Common connected skills should not disappear from the same group that a series recommends. Pups have selected short wrestling lessons as well as movement work.',
    sources: [
      {title:'USA Wrestling — Techniques by Age',url:'https://www.themat.com/news/2019/october/10/techniques-by-age'},
      {title:'USA Wrestling — Folkstyle Level 1',url:'https://www.usawmembership.com/usa_wrestling_core_curriculum/1/download_pdf'},
      {title:'USA Wrestling — Folkstyle Level 2',url:'https://www.usawmembership.com/usa_wrestling_core_curriculum/2/download_pdf'}
    ]
  };
})();
