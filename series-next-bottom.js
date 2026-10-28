/* Preview additions: taught responses from an elevated base and an established low single. */
(() => {
  'use strict';
  const groups = ['7-10', '11-14'];
  const checked = '2026-10-28';
  const granby = {
    title: 'Hudson Taylor - Granby Roll to Freedom',
    url: 'https://fanaticwrestling.com/blogs/news/granby-roll-to-freedom-with-hudson-taylor',
    note: 'Public written instruction describes a gut-and-chop response, foot redirection, an arm threaded under the torso and a lateral shoulder roll. Sampled frames of its free clip at 1:00, 1:30, 1:50 and 1:55 show a hands-and-knees start, forward waist-and-chop pressure and lateral shoulder roll. This is not footage of a feet-supported tripod start.'
  };
  const handbook = {
    title: 'College Park Wrestling - Technique Handbook, printed pages 31-32',
    url: 'https://cdn2.sportngin.com/attachments/document/0e6c-2411143/Advanced_techbible.docx.pdf#page=31',
    note: 'The tripod section explicitly links an arm chop to Granby and names separate shrug-single and peek-out responses. The terse shrug descriptions are retained for research, not expanded into invented grip instructions.'
  };
  const quad = {
    title: 'Iron Faith Wrestling - Quad Pod',
    url: 'https://www.youtube.com/watch?v=c7QKJ1VBnTA',
    note: 'Existing A18 teaches the head-free rise, hand clearance and turn to face. Its later head-post and chopped-recovery material is outside A18. This preview reuses the existing guide rather than claiming a fresh full video review.'
  };
  const weber = {
    title: 'Daryl Weber - Four Steps to Develop the John Smith Low Single',
    url: 'https://attackstylewrestling.com/low-single-leg/',
    note: 'Free primary written instruction and embedded Vimeo 132346100 cover the low heel-cup position and lasso finish. The named post-and-lift and back-ankle alternatives are not demonstrated by this written page.'
  };
  const outline = {
    title: 'Daryl Weber - Complete Technical Outline, low-single section',
    url: 'https://www.attackstylewrestling.tv/wp-content/uploads/2021/08/Complete-Technical-Outline-All-Areas.pdf#page=5',
    note: 'Names lasso, post-and-lift and back-ankle finishes. These names establish research leads; the outline alone does not establish full mechanics or a video match.'
  };
  const smith = {
    title: 'John Smith - Free Low-Single Finishing Lesson',
    url: 'https://fanaticwrestling.com/blogs/news/learn-how-to-finish-the-low-single-from-the-best-wrestler-in-american-history-right-here-right-now',
    note: 'The publisher supplies a free embedded finishing lesson, separate from its paid course. The clip is a review lead; no unseen branch is represented as verified.'
  };

  const moves = [
    {
      id: 'N111', name: 'Granby Escape Against a Waist-and-Chop', category: 'bottom', tier: 'Intermediate',
      age_groups: [...groups], positions: ['bottom'], purposes: ['escape', 'defend'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
      aliases: ['tripod chop response', 'gut-and-chop Granby escape'],
      purpose: 'Recover from forward waist-and-chop pressure with a familiar sideways shoulder roll, including after a rider has broken down an elevated base.',
      prerequisite: 'K19 shoulder-roll mechanics on both sides, a controlled elevated base and the ability to release a partner immediately. The coach checks that the roll stays across the shoulders with the head unloaded.',
      setup: 'Start on hands and knees, with the rider beside the left hip and using light waist contact. This rehearses the recovery after an elevated base has been broken down; it does not ask the athlete to dive from a standing tripod. Both wrists and both ankles remain free. The rider announces gentle forward waist pressure and a left-arm chop, with no wrist lock or arm bar.',
      steps: [
        'Recognize forward pressure arriving at the hands. Keep the feet active instead of collapsing onto the head.',
        'Redirect the feet and hips toward the left-side rolling lane, away from the rider\'s chance to catch the legs.',
        'Thread the left arm underneath the torso. Roll sideways across the shoulder blades as in K19, carrying the hips through the turn.',
        'Bring the feet underneath and face the rider. If the waist contact has cleared, settle into stance; if it remains, recover a base and work the hands.',
        'Release, reset and reverse roles. Practice the opposite side separately before making the side unpredictable.'
      ],
      cues: ['Forward pressure is the signal.', 'Feet point into the rolling lane.', 'Across the shoulders.', 'Face them; check the hands.'],
      drill: 'Six-minute introduction: 1 minute demonstrating the signal and finish; 1 minute solo K19 review; 3 minutes alternating one announced pressure-and-roll per 30-second turn; 1 minute checking whether the rider actually released. An athlete who cannot roll with the head clear stays with solo work in this block.',
      boundary: 'No head-supported pivot, forced neck bend, surprise chop, locked wrist, arm bar or attached leg hook. The rider follows lightly and releases rather than bracing against the turn. Stop for a caught limb, discomfort or loss of orientation. A roll is not automatically an escape. This is a folkstyle lesson; it does not import freestyle back-exposure scoring.',
      error: 'Bottom dives straight forward, or rolls while a wrist or ankle is still trapped.',
      fix: 'Stop and remove the trapped grip. Recheck the sideways solo path and feet before repeating with only light, announced contact.',
      video: {url: 'https://www.youtube.com/watch?v=vUHx-sIsqYU', title: 'Hudson Taylor - Granby roll against forward waist-and-chop pressure', channel: 'Fanatic Wrestling / Hudson Taylor', format: 'video', match: 'direct', note: 'Decoded frames at 1:00, 1:30, 1:50 and 1:55 show the hands-and-knees start, waist-and-chop pressure and lateral shoulder roll with the head tucked. The public written breakdown supplies the completed face-and-stance outcome. The feet-supported tripod-to-breakdown transition is not demonstrated in this clip.'},
      sources: [granby, handbook],
      verification: 'Checked 2026-10-28 against the public primary written breakdown and sampled video frames at 1:00, 1:30, 1:50 and 1:55. The video starts on hands and knees, so this guide teaches the recovery there. The handbook supplies the earlier tripod/chop decision connection; it is not presented as a filmed transition. K19 supplies the prerequisite roll. No full-video or transcript review is claimed. Receiving, timing and readiness conditions are Grindstone coaching design.',
      series_id: 'S54', role: 'option',
      branch: {title: 'An arm chop breaks down the elevated base', when: 'The rider has broken down the elevated base and continues the rehearsed waist-and-chop pressure from hands and knees, with wrists and ankles free.', action: 'Redirect the feet, perform the taught lateral shoulder roll, then face and confirm separation.', readiness: 'K19 and comfortable controlled receiving; no head-supported roll.'}
    },
    {
      id: 'N115', name: 'Low-Single Heel-Cup Position', category: 'entries', tier: 'Intermediate',
      age_groups: [...groups], positions: ['neutral'], purposes: ['entry'], uses: ['teach', 'review', 'reps'],
      aliases: ['John Smith low-single position', 'low ankle shot position'],
      purpose: 'Find a supported ankle-height attacking position before adding a finish or a faster entry.',
      prerequisite: 'A controlled level change, comfortable kneeling support and a partner who can lower onto a side hip without stiff-arm posting. This is separate from a standing single-leg hold.',
      setup: 'Begin already in on a cooperative partner\'s lead leg. The receiver remains balanced with the knee naturally bent. The attacker is low beside that foot; no shot impact or sprawl is added during the first position checks.',
      steps: [
        'Cup the heel with the attacking hand and lay that forearm along the mat.',
        'Post the other palm between the receiver\'s feet. Keep the hips supported over the folded legs.',
        'Place the temple against the inside of the lower thigh, just above the knee, with the head clear of the floor.',
        'Check that the receiver can turn the entire leg comfortably. Release the heel before either partner stands or changes sides.',
        'Repeat from a slow level change only after the static position is reliable. Keep entry and finish as separate coaching checkpoints.'
      ],
      cues: ['Cup the heel.', 'Post inside.', 'Hips supported.', 'Head beside the leg, off the floor.'],
      drill: 'Three-minute introduction: 45 seconds demonstration; 90 seconds alternating position checks, one every 15 seconds; 45 seconds correcting the least stable point. Do not spend eight minutes holding an ankle. Add N116 in its own teaching slot when the position is dependable.',
      boundary: 'No pulling individual toes, ankle twisting, head-first impact or pushing sideways through a planted knee. Keep the receiver cooperative and the leg free to turn. If the head bears weight or the attacker stretches flat, release and rebuild.',
      error: 'Both hands reach for the ankle and the attacker loses the supporting post.',
      fix: 'Reset with the free palm supporting between the feet, then check the heel cup and hip position before increasing speed.',
      video: {url: 'https://vimeo.com/132346100', title: 'Daryl Weber - Low-single position and lasso finish', channel: 'Attack Style Wrestling / Daryl Weber', format: 'video', match: 'component', note: 'The free creator page describes and embeds the position. This card stops before the lasso; N116 teaches that finish. Fresh decoded footage review is pending.'},
      sources: [weber],
      verification: 'Checked the public written instruction and embedded video URL on 2026-10-28. The technical position is supported by that text; no fresh playback or transcript review is claimed. Partner checks and three-minute teaching design are Grindstone additions.',
      role: 'foundation'
    },
    {
      id: 'N116', name: 'Low-Single Lasso Finish', category: 'attacks', tier: 'Intermediate',
      age_groups: [...groups], positions: ['neutral', 'top'], purposes: ['takedown'], uses: ['teach', 'review', 'reps', 'reaction'],
      aliases: ['low ankle lasso finish', 'John Smith low-single basic finish'],
      purpose: 'Turn a secure low heel catch into a controlled takedown when the receiver can move with the captured leg.',
      prerequisite: 'N115, controlled circling and side-hip receiving. The coach checks that head and hand contact guide the whole leg rather than force the knee sideways.',
      setup: 'Begin in N115 with one heel cupped, the opposite palm posted inside and the temple above the captured knee. The receiver is upright enough for the basic finish and allows the leg and hips to turn together; this is not the answer to every sprawl.',
      steps: [
        'Retain the heel cup and close head contact. Do not reach while stretched away from the leg.',
        'Bring the posted hand up to guide the receiver over the captured leg while the temple directs that leg outward.',
        'Circle away from the attacked side with the receiver\'s hips and knee moving together; guide a controlled side-hip landing.',
        'Follow the hips to top control. Support the collected legs on your thigh only after the receiver is down, then settle behind the hips.',
        'Lower and release the legs, check the partner, and reset. If the position breaks, release rather than wrenching the ankle to finish.'
      ],
      cues: ['Heel stays caught.', 'Hand and head guide together.', 'Circle with the whole leg.', 'Follow the hips; settle on top.'],
      drill: 'Five-minute introduction: 1 minute demonstration; 1 minute slow finish rehearsals from the held position; 2 minutes alternating one finish per 20-second turn; 1 minute adding a slow entry, pausing at N115, then finishing on a second signal. Keep the receiver\'s response predictable.',
      boundary: 'No lateral force against a fixed knee, toe torque, uncontrolled landing, body lift or stiff-arm post. The receiver turns and lowers with the captured leg. Reset if a hard sprawl, trapped head, lost heel grip or fixed foot changes the position.',
      error: 'The attacker pulls the foot sideways while the receiver\'s hips stay still.',
      fix: 'Stop immediately. Use lighter contact, rehearse the receiver\'s whole-leg turn and side landing, then repeat with the attacker circling beside the hips.',
      video: {url: 'https://vimeo.com/132346100', title: 'Daryl Weber - Low-single lasso finish', channel: 'Attack Style Wrestling / Daryl Weber', format: 'video', match: 'written-source', note: 'The free creator page explicitly describes the lasso finish and embeds this demonstration. Additional low-single finishes are not implied by this clip; decoded playback review is pending.'},
      sources: [weber],
      verification: 'Drafted 2026-10-28 from the creator\'s complete public lasso breakdown. The distinct post-and-lift and back-ankle branches remain in research until their mechanics are supported. No fresh footage or transcript review is claimed. Receiving, stopping conditions and timing are Grindstone coaching design.',
      role: 'option'
    }
  ];

  const tripod = {
    id: 'S54', title: 'Tripod Escape Decisions', position: 'bottom', positions: ['bottom'], tier: 'Intermediate',
    age_groups: [...groups], purposes: ['escape', 'defend'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'], minutes: 10,
    summary: 'From a controlled elevated base, clear the hand and rise when that route stays open. If the rider breaks that base down with a chop, use a taught Granby recovery from hands and knees. This preview has two supported responses; the shrug-single and peek-out extensions are still being checked.',
    foundation: 'Use A18\'s head-free elevated base with movable feet and a controlled waist-hand relationship. A tripod names the supporting position, not a promise that one escape works against every grip.',
    setup: 'Review A18 and K19 before introducing the choices. Rehearse A18 from its elevated base. Rehearse N111 from hands and knees, representing the position after the base was broken down. Teach those separate starts before connecting them; the first choice drill resets between positions instead of using a surprise chop.',
    members: [
      {move_id: 'A18', role: 'Foundation', note: 'Supplies the familiar head-free base and also the clear-and-rise option: clear the waist hand and turn to face when that route remains open.', tier: 'Intermediate', age_groups: [...groups]},
      {move_id: 'K19', role: 'Prerequisite', note: 'Review the lateral shoulder-roll foundation separately before introducing the pressure response.', tier: 'Intermediate', age_groups: [...groups]},
      {move_id: 'N111', role: 'Option', note: 'Recover on hands and knees after the elevated base is broken down, using the familiar roll against announced waist-and-chop pressure.', tier: 'Intermediate', age_groups: [...groups]}
    ],
    branches: [
      {title: 'The hand-clear route is open', when: 'The rider follows without locking the waist, trapping a wrist or breaking the support.', action: 'Use A18 to control the waist hand, rise and turn toward the rider until the hold clears.', move_ids: ['A18'], tier: 'Intermediate', age_groups: [...groups], readiness: 'A18 is reliable with cooperative following; do not add a lift or mat return.'},
      {title: 'The elevated base is broken down by a chop', when: 'Bottom is back on hands and knees under the rehearsed waist-and-chop pressure, with both ankles and wrists free.', action: 'Use N111 to redirect the feet, roll across the shoulders and face; check that control has actually ended.', move_ids: ['N111'], tier: 'Intermediate', age_groups: [...groups], readiness: 'K19 and N111 have been taught separately; the head stays unloaded.'}
    ],
    steps: [
      'Minutes 0-2: review the elevated base and A18 finish, alternating one hand-clear escape each.',
      'Minutes 2-4: review N111 from hands and knees under announced light pressure, one roll per wrestler before switching.',
      'Minutes 4-8: use eight 30-second turns. The rider names one familiar response; use the matching starting position, finish, release and change roles. Only connect the elevated base to a gentle breakdown after both starts and finishes are controlled.',
      'Minutes 8-10: repeat the least clear response once each and identify the true endpoint: stance facing the rider with contact cleared, or a rebuilt base needing more hand work.'
    ],
    cues: ['Same base, read the pressure.', 'Clear and rise, or redirect and roll.', 'No caught limbs.', 'Face and check separation.'],
    move_ids: ['A18', 'K19', 'N111'],
    readiness: 'Prepared 7-10 and 11-14 wrestlers who already perform the standing clearance and shoulder roll. The choice block reviews familiar skills; it is not a ten-minute first lesson in all three cards. Pups continue their familiar stand-up and movement progressions.',
    boundaries: 'No head posting, surprise chops, locked arms, inserted boots, lifts or mat returns. A caught limb or lost posture ends the attempt. These responses do not solve every top control; recover a sound base when the taught opening is unavailable.',
    verification: 'Preview prepared 2026-10-28 using existing A18/K19 and a primary chop-to-Granby lesson checked through its written breakdown and sampled video frames. Taylor\'s clip demonstrates the hands-and-knees recovery, while the handbook supplies the tripod/chop connection. The two-response practice and timings are original coaching design. The handbook\'s additional shrug choices remain held rather than filled with inferred mechanics.',
    sources: [quad, granby, handbook]
  };

  for (const item of [...moves, tripod]) for (const source of item.sources || []) source.accessed = checked;
  window.GRINDSTONE_SERIES_NEXT_BOTTOM = {
    reviewed: checked, moves, series: [tripod],
    placements: {'youth-6': ['S54'], 'older-5': ['S54']},
    research_status: {
      promoted: [{series_id: 'S54', move_ids: ['N111'], status: 'preview-reviewed', scope: 'Two-response preview using existing A18 and a waist-and-chop Granby recovery checked through primary written instruction and sampled decoded footage. The filmed recovery begins on hands and knees, after an elevated base has been lost.'}],
      held: [
        {id: 'tripod-shrug-branches', title: 'Tripod near-leg shrug single and peek-out continuations', known: 'The primary handbook names the rider-following and space-opening conditions and the intended reversal outcomes.', missing: 'Matching free footage or fuller primary instructions establishing hand transfer, side relationship and complete finish.', sources: [handbook.url, 'https://www.youtube.com/watch?v=zOehJFXEtQ8', 'https://www.youtube.com/watch?v=vQA8LSy8Pvs'], attempted_alternatives: 'Checked primary handbook, USA Wrestling chain-wrestling material and publicly indexed Granby School clips. Clip mechanics have not been inspected; no third branch is invented.', backlog_moves: ['Tripod near-leg shrug single', 'Tripod peek-out reversal', 'Shrug roll with leg and waist-hand control']},
        {id: 'low-single-finish-options', title: 'Low-Single Finishing Decisions (S55): remaining finish options', known: 'N115 and N116 supply a written-source starting position and lasso finish. Weber lists post-and-lift and back-ankle alternatives; John Smith has a free public finishing lesson.', missing: 'Reviewed mechanics for at least one additional genuine finish before presenting S55 as a choice series. Foundation plus one finish is a progression, not a full series.', sources: [weber.url, outline.url, smith.url, 'https://www.youtube.com/watch?v=CW_0IlqQzLY', 'https://www.youtube.com/watch?v=g-k_o6GKvLQ', 'https://www.youtube.com/watch?v=hFCXheh4xZg'], attempted_alternatives: 'Located free Weber Vimeo 132346100 and the free Smith embedded lesson. Root sampled Smith at 3:13 and 5:22; the later frame shows a standing shelved-leg endpoint but does not establish every transfer needed for a new guide. Kolat\'s Low Single Finish resolves by title; Purler Swim Back and Elbow Trap are additional catalog leads requiring footage inspection. Cejudo\'s article explicitly says its clip does not teach the suggested finishes, so those labels were not turned into full guides.', backlog_moves: ['Low-single post-and-lift finish', 'Low-single back-ankle finish', 'Low-single weighted-leg response', 'Low-single swim-back finish', 'Low-single elbow-trap finish']}
      ]
    }
  };
})();
