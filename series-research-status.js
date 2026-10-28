/* Unresolved technique questions stay separate from usable move instructions. */
(() => {
  'use strict';
  const modules = [window.GRINDSTONE_SERIES_NEUTRAL_NEXT, window.GRINDSTONE_SERIES_TOP_NEXT, window.GRINDSTONE_SERIES_DEFENSE_NEXT, window.GRINDSTONE_SERIES_WESTERN, window.GRINDSTONE_SERIES_NAVY, window.GRINDSTONE_SERIES_LEG_ONE, window.GRINDSTONE_SERIES_LEG_TWO, window.GRINDSTONE_SERIES_LEG_ESCAPES, window.GRINDSTONE_SERIES_NEXT_NEUTRAL, window.GRINDSTONE_SERIES_NEXT_TOP, window.GRINDSTONE_SERIES_NEXT_BOTTOM].filter(Boolean);
  const held = modules.flatMap(module => module.research_status?.held || []);
  const clarified = modules.flatMap(module => module.research_status?.resolved || []);
  held.unshift({
    id: 'Short bar to opposite half: side change and release', proposal: 21,
    title: 'Half-and-bar research: usable preview alternative', status: 'source-found',
    sources: [{title:'Logan Stieber / RUDIS — Arm Bar Half',url:'https://www.youtube.com/watch?v=sMvoi7E5lZg'},{title:'Logan Stieber / RUDIS — Circle to the Head',url:'https://www.youtube.com/watch?v=APFl5zg3WRM'},{title:'Gene Mills — Half Nelson Arm Bar',url:'https://www.youtube.com/watch?v=kOQjp1wKuec'},{title:'Gene Mills — The Crusher (separate finish candidate)',url:'https://www.youtube.com/watch?v=j9WcFhkT9qw'}, 'https://www.attackstylewrestling.com/chicken-wing-series/'],
    attempted_alternatives: 'The Stieber demonstrations were checked through automatic transcripts and selected decoded frames; S51 reuses A23 and adds N95/N96 with the stated practice limits. The user-supplied Mills videos were also checked through automatic transcripts and sampled frames. These are distinct variations, not interchangeable proof of the retired instructions.',
    known: 'S51 is a usable preview alternative built around the existing short-bar foundation: N95 adds the opposite-half turn and N96 supplies a bounded circle-to-head side-turn. Mills starts his separate half-and-bar lesson with the half, then adds the bar. The Crusher uses half-nelson/far-wrist control and remains a separate candidate.',
    missing: 'A complete guide for the distinct Mills half-first variation, including its entry, finish, release and overlap check. The unsupported N34/S26 draft remains retired and outside the usable library; the Stieber preview does not validate its old side-change and release instructions.',
    research_update: 'Review the usable S51/N95/N96 preview through the links below while the Mills half-first candidate is developed separately. Keep Q01 open for that remaining work. No coach reply is required to continue reviewing free sources, and the retired draft must not be restored by relabeling it.',
    guide_links: [{label:'Arm Bar Finishing Series preview',href:'#season?view=series&series=S51'},{label:'Opposite Half Turn',href:'#move/N95'},{label:'Circle-to-Head Turn',href:'#move/N96'},{label:'Existing Short-Bar Foundation',href:'#move/A23'}]
  });
  // Persistent references for replies in the text group. Never renumber old questions.
  const questionNumbers = {
    'Short bar to opposite half: side change and release': 'Q01',
    'Tight-waist hip-down and clear-to-escape': 'Q02',
    'Switch / re-switch step-over continuation': 'Q03',
    'Established leg-ride defense': 'Q04',
    'Two-hand elbow-lift single-leg kickout video': 'Q05',
    'High-crotch corner lift / elevated high-single continuation': 'Q06',
    'Sprawled high-crotch head-inside / hook-ankle and peek-out options': 'Q07',
    'Collar-tie ankle pick, knee pull and missed-pick continuation': 'Q08',
    'Inside-tie attack family': 'Q09',
    'Down-block to go-behind or timed re-shot': 'Q10',
    'top-cradle-barbell': 'Q11',
    'top-cradle-crunch': 'Q12',
    'top-two-on-one-half': 'Q13',
    'top-two-on-one-stack': 'Q14',
    'top-claw-options': 'Q15',
    'top-far-side-tilt': 'Q16',
    'western-extended-turk': 'Q17',
    'navy-low-leg-transition': 'Q18',
    'parallel-wrist-videos': 'Q19',
    'parallel-armbar-followups': 'Q20',
    'leg-switch-review': 'Q21',
    'leg-defense-full-video-endpoint': 'Q22',
    'one-leg-power-half-finish': 'Q23',
    'overtie-foot-sweep': 'Q24',
    'russian-wrist-reaction-options': 'Q25',
    'armbar-high-post-continuation': 'Q26',
    'rear-quadpod-control-series': 'Q27',
    'tripod-shrug-branches': 'Q28',
    'low-single-finish-options': 'Q29',
    'standing-return-options': 'Q30'
  };
  const followUps = {
    'overtie-foot-sweep': {research_update:'Use S50 for the supported overtie choices. Review the sweep and sprawled-single cutback as separate additions, including the exact contact, reaction and controlled finish before either becomes a usable guide.',guide_links:[{label:'Overtie Attack Series preview',href:'#season?view=series&series=S50'},{label:'Overtie single entry',href:'#move/N84'}]},
    'russian-wrist-reaction-options': {research_update:'S19 now includes the supported head-post/high-crotch entry. Continue checking each remaining wrist, head and elbow response against a matching demonstration; keep the other Wheeler lunge endpoints distinct.',guide_links:[{label:'Russian two-on-one series',href:'#season?view=series&series=S19'},{label:'Head-post clear to high crotch',href:'#move/N87'}]},
    'armbar-high-post-continuation': {research_update:'The bounded turns in S51 are available for preview. Review the later sit-in, high-post and leg-in continuations separately, including when the bar must release; do not imply they are included in N95 or N96.',guide_links:[{label:'Arm Bar Finishing Series preview',href:'#season?view=series&series=S51'},{label:'Opposite Half Turn',href:'#move/N95'},{label:'Circle-to-Head Turn',href:'#move/N96'}]},
    'rear-quadpod-control-series': {research_update:'Keep S53 reserved while seeking free demonstrations of several choices from the same rear control. Confirm the starting hand relationship and each complete return before presenting a series; a paid syllabus alone is insufficient.',guide_links:[{label:'Current top-control library',href:'#moves?position=top'}]},
    'tripod-shrug-branches': {research_update:'S54 offers the two supported escape responses now. Add a shrug-single or peek-out only after reviewing its exact grips, side change and reversal endpoint; do not add a third option just to lengthen the series.',guide_links:[{label:'Tripod Escape Decisions preview',href:'#season?view=series&series=S54'},{label:'Waist-and-chop Granby recovery',href:'#move/N111'}]},
    'low-single-finish-options': {research_update:'N115 and N116 are usable individual preview lessons. Keep S55 reserved until another genuine finish is supported; review the free Weber, Smith, Kolat and Purler leads rather than inferring a finish from its name.',guide_links:[{label:'Low-Single Heel-Cup Position',href:'#move/N115'},{label:'Low-Single Lasso Finish',href:'#move/N116'}]},
    'standing-return-options': {research_update:'Continue using N25 as the existing hip-dump return. Keep S52 reserved while the inside-trip contacts and other complete returns are checked; sampled endpoints and course titles do not establish the missing transfers.',guide_links:[{label:'Hip Dump Mat Return',href:'#move/N25'}]}
  };
  const records = [...held, ...clarified].map(item => {
    const key = item.id || item.title;
    if (!questionNumbers[key]) throw new Error('Assign a persistent question reference for ' + key);
    return {...followUps[key], ...item, source_key:key, id:questionNumbers[key]};
  }).sort((a,b) => a.id.localeCompare(b.id));
  const openCount = records.filter(item => item.status !== 'clarified').length;
  window.GRINDSTONE_RESEARCH_QUEUE = {reviewed:'2026-10-28', status:openCount + ' open research items; ' + (records.length - openCount) + ' clarified', items:records};
  const drafts = window.GRINDSTONE_IN_PROGRESS;
  if (!drafts) return;
  drafts.documents.push({
    id:'technique-coach-input', title:'Technique questions — needs coach input', category:'Technique research', kind:'research', status:'Research backlog',
    summary:openCount + ' open research items, with usable preview alternatives linked beside the remaining gaps. Q01 now links the Stieber arm-bar preview while the distinct Mills variation remains pending. Q02, Q03 and Q04 are clarified. Existing question numbers stay the same; Q24-Q30 cover the latest research.',
    why:'A name or course outline can identify a useful move without establishing its exact grips, reaction or finish. Free alternatives are checked for those details before they replace a source. Unresolved instructions are kept out of the usable library.',
    sections:[
      {title:'How to help', paragraphs:['Reply in the coaches’ text group with the question number and the version you teach. A description or short demonstration should identify both wrestlers’ starting grips, the reaction, the moving hand or leg, the finish and the release.'],bullets:['No purchase or subscription is required to keep this work moving.', 'An answer will be checked against the existing move so that a different variant gets its own clear label.', 'These questions are research notes, not instructions to rehearse an unfinished technique.']},
      ...records.map(item => ({id:'research-' + item.id.toLowerCase(),title:item.id + ' · ' + (item.status === 'clarified' ? 'Clarified — ' : '') + item.title, paragraphs:item.status === 'clarified' ? [item.resolution, item.next_step, item.resolution_source] : [item.known || 'A possible lesson is retained for further review.', 'Still missing: ' + (item.missing || item.gap || 'Exact demonstration and coaching review.'), item.research_update ? 'Research update: ' + item.research_update : 'Coach question: ' + (item.coach_question || item.question || 'Which version do you teach, and what is its exact start and finish?')], bullets:[item.status === 'clarified' ? item.evidence_note : (item.attempted_alternatives || 'Free alternatives still need a matching demonstration.')], links:[...(item.guide_links || []), ...(item.sources || []).map((source,index) => typeof source === 'string' ? {label:'Research source ' + (index+1) + ' · ' + new URL(source).hostname.replace(/^www\./,''),href:source} : {label:source.title || 'Research source',href:source.url})]})),
      {title:'What happens next',paragraphs:['Once the missing detail is resolved, check the whole move for overlap, write the guide and verify its video and practice-builder placement. Keep the original source and review limits with the lesson.'],bullets:['No response: keep the item here and continue other verified work.', 'Different variant: name the variant and its starting position explicitly.', 'Ready lesson: prepare a preview; publication follows the normal review process.']}
    ],
    decisions:['Which of these moves can a coach explain or demonstrate?', 'For each answer, which exact starting position and finish should the club teach first?'],
    next_step:'Answer whichever item is familiar. No reply is needed for research, verified additions, testing and other document work to continue.',
    existing:[{label:'Technique series already available',href:'#season?view=series'},{label:'Move library',href:'#moves'},{label:'Existing bar-arm guide (not the held variation)',href:'#move/A23'}]
  });
})();
