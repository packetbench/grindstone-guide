/* Unresolved technique questions stay separate from usable move instructions. */
(() => {
  'use strict';
  const modules = [window.GRINDSTONE_SERIES_NEUTRAL_NEXT, window.GRINDSTONE_SERIES_TOP_NEXT, window.GRINDSTONE_SERIES_DEFENSE_NEXT, window.GRINDSTONE_SERIES_WESTERN, window.GRINDSTONE_SERIES_NAVY, window.GRINDSTONE_SERIES_LEG_ONE, window.GRINDSTONE_SERIES_LEG_TWO, window.GRINDSTONE_SERIES_LEG_ESCAPES].filter(Boolean);
  const held = modules.flatMap(module => module.research_status?.held || []);
  const clarified = modules.flatMap(module => module.research_status?.resolved || []);
  held.unshift({
    id: 'Short bar to opposite half: side change and release', proposal: 21,
    title: 'Half-and-bar guide: free alternative found', status: 'source-found',
    sources: [{title:'Gene Mills — Half Nelson Arm Bar',url:'https://www.youtube.com/watch?v=kOQjp1wKuec'},{title:'Gene Mills — The Crusher (separate finish candidate)',url:'https://www.youtube.com/watch?v=j9WcFhkT9qw'}, 'https://www.attackstylewrestling.com/chicken-wing-series/'],
    attempted_alternatives: 'Both user-supplied videos were checked through their auto-generated transcripts and sampled demonstration frames, not continuous full playback. The half-and-bar lesson is the preferred replacement candidate. The Crusher uses half-nelson/far-wrist control and different finishing pressure; retain it as a separate candidate.',
    known: 'A free half-first alternative is available: Mills establishes the half, adds the bar, and demonstrates an angled finish plus a response when the defender clamps down. This supports rewriting around that version. It does not confirm the old draft’s bar-first walk-around and early release.',
    missing: 'A complete written guide aligned with the demonstrated entry, turn, finish and release, plus an overlap check against A23 and the existing half-nelson series. N34 and S26 remain outside the usable library until that work is complete.',
    research_update: 'No further coach reply is needed to develop this alternative. Retire the unsupported mechanics from the working draft, preserve the original research record, and write the demonstrated half-first version. Keep the later straight-over variation and the Crusher separate.'
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
    'one-leg-power-half-finish': 'Q23'
  };
  const records = [...held, ...clarified].map(item => {
    const key = item.id || item.title;
    if (!questionNumbers[key]) throw new Error('Assign a persistent question reference for ' + key);
    return {...item, source_key:key, id:questionNumbers[key]};
  }).sort((a,b) => a.id.localeCompare(b.id));
  const openCount = records.filter(item => item.status !== 'clarified').length;
  window.GRINDSTONE_RESEARCH_QUEUE = {reviewed:'2026-10-27', status:openCount + ' open research items; ' + (records.length - openCount) + ' clarified', items:records};
  const drafts = window.GRINDSTONE_IN_PROGRESS;
  if (!drafts) return;
  drafts.documents.push({
    id:'technique-coach-input', title:'Technique questions — needs coach input', category:'Technique research', kind:'research', status:'Research backlog',
    summary:openCount + ' open research items. Q01 has a free alternative ready for a guide rewrite; Q02, Q03 and Q04 are clarified. Question numbers stay the same. Help with any remaining question you know while other work continues.',
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
