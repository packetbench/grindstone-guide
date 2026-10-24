/* Unresolved technique questions stay separate from usable move instructions. */
(() => {
  'use strict';
  const modules = [window.GRINDSTONE_SERIES_NEUTRAL_NEXT, window.GRINDSTONE_SERIES_TOP_NEXT, window.GRINDSTONE_SERIES_DEFENSE_NEXT].filter(Boolean);
  const held = modules.flatMap(module => module.research_status?.held || []);
  held.unshift({
    proposal: 21, title: 'Short bar to opposite half: side change and release',
    sources: ['https://www.attackstylewrestling.com/chicken-wing-series/', 'https://www.kolat.com/blog/critique-of-the-week-110309', 'https://www.sethciasulli.com/lessons/arm-lever-and-arm-bar'],
    attempted_alternatives: 'The public Kolat critique and Ciasulli outline confirm an opposite-half option. They do not establish the held draft’s combination of a short bar, walk around the head and early release. A published bar-and-half stack is a different finish and was not substituted.',
    known: 'The ordinary bar guide A23 is already available. The proposed N34 and S26 remain research only. Weber’s demonstration moves the hips across the partner’s back around 10:10–10:23, unlike the held written draft.',
    missing: 'The intended short-bar side change, chest position and precise point at which the barred arm is released.',
    coach_question: 'Starting on the left with a short left bar and a right-arm half, how do you change sides, where does your chest finish, and when do you release the bar? A slow demonstration of that transition would resolve the mismatch.'
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
    'top-far-side-tilt': 'Q16'
  };
  const records = held.map(item => {
    const key = item.id || item.title;
    if (!questionNumbers[key]) throw new Error('Assign a persistent question reference for ' + key);
    return {...item, source_key:key, id:questionNumbers[key]};
  }).sort((a,b) => a.id.localeCompare(b.id));
  window.GRINDSTONE_RESEARCH_QUEUE = {reviewed:'2026-10-24', status:'Needs coach input; other work continues', items:records};
  const drafts = window.GRINDSTONE_IN_PROGRESS;
  if (!drafts) return;
  drafts.documents.push({
    id:'technique-coach-input', title:'Technique questions — needs coach input', category:'Technique research', kind:'research', status:'Research backlog',
    summary:'Specific gaps from unavailable, paid or incomplete demonstrations. Answer any item you know; the rest stay queued while other work continues.',
    why:'A name or course outline can identify a useful move without establishing its exact grips, reaction or finish. Free alternatives are checked for those details before they replace a source. Unresolved instructions are kept out of the usable library.',
    sections:[
      {title:'How to help', paragraphs:['Reply in the coaches’ text group with the question number and the version you teach. A description or short demonstration should identify both wrestlers’ starting grips, the reaction, the moving hand or leg, the finish and the release.'],bullets:['No purchase or subscription is required to keep this work moving.', 'An answer will be checked against the existing move so that a different variant gets its own clear label.', 'These questions are research notes, not instructions to rehearse an unfinished technique.']},
      ...records.map(item => ({id:'research-' + item.id.toLowerCase(),title:item.id + ' · ' + item.title, paragraphs:[item.known || 'A possible lesson is retained for further review.', 'Still missing: ' + (item.missing || item.gap || 'Exact demonstration and coaching review.'), 'Coach question: ' + (item.coach_question || item.question || 'Which version do you teach, and what is its exact start and finish?')], bullets:[item.attempted_alternatives || 'Free alternatives still need a matching demonstration.'], links:(item.sources || []).map((source,index) => typeof source === 'string' ? {label:'Research source ' + (index+1) + ' · ' + new URL(source).hostname.replace(/^www\./,''),href:source} : {label:source.title || 'Research source',href:source.url})})),
      {title:'What happens next',paragraphs:['Once the missing detail is resolved, check the whole move for overlap, write the guide and verify its video and practice-builder placement. Keep the original source and review limits with the lesson.'],bullets:['No response: keep the item here and continue other verified work.', 'Different variant: name the variant and its starting position explicitly.', 'Ready lesson: prepare a preview; publication follows the normal review process.']}
    ],
    decisions:['Which of these moves can a coach explain or demonstrate?', 'For each answer, which exact starting position and finish should the club teach first?'],
    next_step:'Answer whichever item is familiar. No reply is needed for research, verified additions, testing and other document work to continue.',
    existing:[{label:'Technique series already available',href:'#season?view=series'},{label:'Move library',href:'#moves'},{label:'Existing bar-arm guide (not the held variation)',href:'#move/A23'}]
  });
})();
