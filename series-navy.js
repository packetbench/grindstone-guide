/* Navy ride: far-thigh arm control with three separately taught turning choices. */
(() => {
  'use strict';
  const groups = ['7-10', '11-14'];
  const shoulder = {
    title: 'Redhawk Wrestling - Navy Ride: Top Shoulder Tilt',
    url: 'https://www.youtube.com/watch?v=3mtm64Sj350',
    note: 'Free demonstration publicly embedded in Redhawk lesson 22. Decoded footage was visually sampled at 0:05, 0:10, 0:20, 0:25, 0:30, 0:35, 0:40, 0:55 and 1:05. It shows the far-thigh anchor and a shoulder-controlled turn; audio and a complete transcript were not reviewed.'
  };
  const table = {
    title: 'Redhawk Wrestling - Navy Ride: Table Top Tilt',
    url: 'https://www.youtube.com/watch?v=hgHyc3Bfr_c',
    note: 'Free demonstration publicly embedded in Redhawk lesson 22. Reviewers sampled the setup, separate near-wrist control and supported tabletop finish, including 0:48, 0:53, 0:58, 1:03 and 1:08. The one-on-one hand stays separate from the arm scooping the far thigh. Audio and a complete transcript were not reviewed.'
  };
  const chain = {
    title: 'Redhawk Wrestling - Navy Ride: Modified Ball and Chain',
    url: 'https://www.youtube.com/watch?v=KAVZK2Lx16w',
    note: 'Free demonstration publicly embedded in Redhawk lesson 22. Decoded footage was sampled at 0:12, 0:17, 0:22, 0:27, 0:32, 0:42, 0:47, 0:52, 0:57 and 1:02. A second review confirmed the wrist held by the far-thigh scooping hand and free-hand upper-arm control at 0:17-0:21. Audio and a complete transcript were not reviewed.'
  };
  const ciasulli = {
    title: 'Seth Ciasulli - Low Leg Cradle and Navy Ride',
    url: 'https://www.sethciasulli.com/lessons/low-leg-cradle-and-navy-ride',
    note: 'Written instruction emphasizes the high inner-thigh arm position, elbow kept close to the mat and hip connection. It lists near one-on-one/tabletop and modified ball-and-chain as Navy options. This is supporting written evidence; the Redhawk clips supply the actual demonstrations used here.'
  };
  const curriculum = {
    title: 'Red Hawk Wrestling - Lesson 22: Low Leg Cradle and Navy Ride',
    url: 'https://www.redhawkwrestling.com/video-lessons-16-22',
    note: 'The public lesson groups the three Navy demonstrations together. They remain viewable through their linked YouTube videos even though other lessons on this page require a subscription.'
  };

  const moves = [
    {
      id: 'N61', name: 'Navy Ride', category: 'top', tier: 'Beginner',
      age_groups: [...groups], positions: ['top'], purposes: ['ride'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
      aliases: ['Navy far-leg ride', 'far-thigh scoop ride'],
      purpose: 'Keep top control with an arm around the far upper thigh, leaving the other hand available for a turning choice.',
      prerequisite: 'A familiar top ride and breakdown, comfortable hip contact and immediate release. Begin with the partner already lowered rather than adding an unfamiliar takedown or breakdown.',
      setup: 'Bottom lies on the belly or a comfortable side. Top kneels beside the hips, facing toward the same head end. Near means the rider\'s side; far means the opposite side. This arm control of the far thigh is different from the same-side ankle hook in Western ride.',
      steps: [
        'Settle beside the hips with a supported base and light chest contact. Let the partner keep the head and elbows movable.',
        'Send the back arm between the legs and scoop the far upper thigh. Keep the arm high near the hip crease, rather than reaching down to twist the foot or knee.',
        'Keep that elbow close to the mat and pelvis so the held thigh cannot easily slip out. Stay connected at the hips while leaving the free hand available.',
        'Place the free hand at the near shoulder or rehearse a separately taught near-wrist control. Check the far thigh remains supported without pulling the knee sideways.',
        'Pause at this control, then open the arm and let the partner reset. Add one taught turning option only after both wrestlers recognize this foundation.'
      ],
      cues: ['Arm around the far thigh.', 'High at the hip; elbow close.', 'Stay connected at the hips.', 'Control first, choose second.'],
      drill: 'Four-minute introduction: 1 minute demonstration; 2 minutes alternating supported scoop-and-release attempts, one attempt per 20-second turn; 1 minute each wrestler identifies the far leg and checks a clean reset. A later review can take 1-2 minutes before an option. The goal is a reliable starting position, not several minutes of squeezing the leg.',
      boundary: 'Do not twist the knee, crank the ankle, squeeze the groin, lock the hands around the torso or drag a trapped arm. Release before an unfamiliar roll or standing escape. Stop for discomfort, a fixed limb or any stop signal.',
      error: 'The rider reaches low toward the foot, lets the elbow drift away, or confuses Navy control with a Western ankle hook.',
      fix: 'Reset beside the hips. Rebuild the arm scoop high around the opposite thigh with the elbow close, then show that the other hand is free. Use the linked setup before adding a finish.',
      video: {url: 'https://www.youtube.com/watch?v=hgHyc3Bfr_c&t=25s', title: 'Navy ride foundation within Table Top Tilt', channel: 'Redhawk Wrestling Charitable Foundation', format: 'video', match: 'component', note: 'The far-thigh scoop and elbow position are shown before the tabletop finish. Use the setup around 0:25 and 0:48; the separate turn is N63.'},
      sources: [ciasulli, table, curriculum],
      verification: 'Checked 2026-10-27. The written Ciasulli explanation and sampled Redhawk footage support the high far-thigh arm control. This foundation card deliberately ends at control and release. It does not claim that a particular takedown, breakdown or ankle hook is required. Timing, cooperative receiving and stop conditions are Grindstone coaching design.',
      series_id: 'S44', role: 'foundation'
    },
    {
      id: 'N62', name: 'Navy Ride to Top-Shoulder Tilt', category: 'top', tier: 'Intermediate',
      age_groups: [...groups], positions: ['top'], purposes: ['ride', 'turn'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
      aliases: ['Navy shoulder tilt', 'top shoulder tilt'],
      purpose: 'Turn the shoulders toward the mat while the Navy arm supports the far thigh.',
      prerequisite: 'N61 and a comfortable, controlled turn onto the side and back. Both partners can release immediately without posting on a stiff arm or resisting with the neck.',
      setup: 'Begin in Navy control beside the hips, with bottom on the side facing away. The upper shoulder is accessible to the rider\'s free hand.',
      steps: [
        'Keep the far-thigh scoop high and stay connected at the hips. Support yourself beside the partner rather than leaning on the neck.',
        'Cup the top shoulder with the free hand, curling the fingers beneath the upper arm near the armpit. The hand controls the shoulder; it does not cross the throat.',
        'Guide that shoulder back toward the mat while lifting the supported thigh. Move your body with the turn so the hips and shoulders travel together.',
        'Follow to balanced control alongside the exposed back. Keep the leg supported and the shoulder comfortable; do not turn the arm into a lever against its joint.',
        'Pause briefly, ease the shoulder contact and lower the thigh. Open the scoop and let bottom return to the starting position.'
      ],
      cues: ['Thigh stays supported.', 'Cup the shoulder, not the neck.', 'Turn hips and shoulders together.', 'Follow, settle, release.'],
      drill: 'Six-minute introduction: 1 minute demonstration; 1 minute checking shoulder and thigh contacts without turning; 3 minutes alternating one slow turn and reset per 30-second turn; 1 minute feedback. Add gentle, announced resistance only after both partners can complete and receive the movement comfortably.',
      boundary: 'No neck pull, throat contact, sudden bodyweight drop, sideways knee pressure or upper-arm wrench. The receiver turns with the body rather than planting a stiff arm. If either contact becomes uncomfortable or the shoulder cannot move freely, release and rebuild instead of forcing it.',
      error: 'The rider pulls only the shoulder while the hips remain fixed, or lets the thigh slip out during the turn.',
      fix: 'Return to N61, check the high scoop and rehearse a smaller cooperative turn. Move the supported leg and body together; the shoulder hand guides rather than jerks.',
      video: {url: shoulder.url, title: 'Navy Ride - Top Shoulder Tilt', channel: 'Redhawk Wrestling Charitable Foundation', format: 'video', match: 'direct', note: 'Shoulder contact around 0:20-0:30; turn and exposure around 0:35-0:40; another angle around 0:55-1:05. Uses shoulder control, not the tabletop\'s separate wrist control.'},
      sources: [shoulder],
      verification: 'Checked 2026-10-27 through decoded visual checkpoints, including the shoulder cup, retained far-thigh scoop and exposed-back endpoint. No continuous audio or complete transcript review is claimed. Readiness, timing, receiving and reset guidance are Grindstone coaching design.',
      series_id: 'S44', role: 'option',
      branch: {title: 'Turn from the top shoulder', when: 'Bottom is on the side facing away and the top shoulder is available while the far thigh remains controlled.', action: 'Cup the shoulder and turn it back as the supported thigh rises.', readiness: 'N61 plus comfortable cooperative side-to-back turning and immediate release.'}
    },
    {
      id: 'N63', name: 'Navy Ride to Tabletop Tilt', category: 'top', tier: 'Intermediate',
      age_groups: [...groups], positions: ['top'], purposes: ['ride', 'turn'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
      aliases: ['Navy table top tilt', 'Navy near one-on-one table'],
      purpose: 'Use separate near-wrist and far-thigh controls to bring the opponent\'s hips onto a supported tabletop position and expose the back.',
      prerequisite: 'N61, comfortable near-wrist one-on-one control and a coach-checked supported turn. The rider can balance without dropping the partner or using the held wrist to lift the body.',
      setup: 'Start beside a cooperative, belly-down partner in Navy control. The free front arm can collect the near wrist in a one-on-one while the back arm retains the far thigh.',
      steps: [
        'Keep the high far-thigh scoop and hip contact. Thread the free arm beneath the near upper arm to collect the near wrist, keeping it close to the waist.',
        'Keep these controls separate: one hand holds the wrist and the other arm supports the thigh. Keep the captured elbow comfortably bent rather than lifting the wrist up the back.',
        'Plant the foot nearest the partner\'s head and keep that knee bent to make a low thigh platform. Keep the other leg in kneeling support behind you. Bring the held leg and hips across the bent thigh while guiding the upper body backward.',
        'Settle the opponent\'s hips on the thigh platform with the shoulders turning toward the mat. Support the weight throughout; this is not a standing lift or a drop.',
        'After a brief controlled pause, lower the hips and leg. Ease the wrist grip, free both controls and reset.'
      ],
      cues: ['One hand: wrist. One arm: thigh.', 'Wrist stays close, not high.', 'Build a low table.', 'Support the hips all the way down.'],
      drill: 'Six-minute introduction: 1 minute demonstration; 1 minute separate-control checks without lifting; 3 minutes alternating one low supported turn and reset per 30-second turn; 1 minute feedback. The first turns need direct coach observation. Spend extra time on balance in another slot if the rider cannot support a smooth descent.',
      boundary: 'No wrist twisting, forced hammerlock, lifting the arm up the back, jumping, standing lift or dropping onto the head or shoulder. A trapped posting arm ends the repetition. Keep the far knee aligned and release on discomfort. Pair wrestlers who can control each other\'s weight.',
      error: 'The wrestler pulls the wrist to hoist the partner or rises before the thigh support is stable.',
      fix: 'Reset low. Check each hand\'s separate job, then rehearse the leg-and-hip support with a coach before returning to the whole turn. Reduce the range rather than increasing force.',
      video: {url: table.url, title: 'Navy Ride - Table Top Tilt', channel: 'Redhawk Wrestling Charitable Foundation', format: 'video', match: 'direct', note: 'High far-thigh scoop and near-wrist control around 0:48-0:58; supported turn and tabletop endpoint around 1:03-1:12. The wrist stays in the front hand, unlike N64\'s wrist feed into the scooping hand.'},
      sources: [table, ciasulli],
      verification: 'Checked 2026-10-27. Two reviewers examined decoded footage showing the separate one-on-one wrist grip, far-thigh scoop and supported bent-thigh endpoint. The written Ciasulli lesson independently lists near one-on-one, leg lift and table as a Navy option. No continuous audio or complete transcript review is claimed. Teaching time, readiness and reset progression are Grindstone coaching design.',
      series_id: 'S44', role: 'option',
      branch: {title: 'Use a separate wrist control to table the hips', when: 'The near wrist can be collected separately while the far-thigh scoop stays secure, and the rider can build a stable low support.', action: 'Keep wrist and thigh controls separate, support the hips across the bent thigh and guide the shoulders toward the mat.', readiness: 'N61, comfortable one-on-one control and a supervised supported tabletop rehearsal.'}
    },
    {
      id: 'N64', name: 'Navy Ride to Modified Ball-and-Chain Tilt', category: 'top', tier: 'Intermediate',
      age_groups: [...groups], positions: ['top'], purposes: ['ride', 'turn'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
      aliases: ['Navy modified ball and chain', 'Navy wrist-feed tilt'],
      purpose: 'Connect the near wrist to the far-thigh scooping hand, then use the free hand at the upper arm to guide the turn.',
      prerequisite: 'N61, controlled wrist handling and a comfortable side-to-back turn. Rehearse the hand transfer without turning before using it with a partner\'s weight.',
      setup: 'Begin in Navy control beside bottom\'s hips. The near wrist is reachable without forcing the elbow or shoulder behind its comfortable range.',
      steps: [
        'Keep the back arm scooped beneath the far upper thigh. Collect the near wrist with the free front hand and bring it toward the hip.',
        'Feed that wrist into the hand already supporting the far thigh. Confirm the wrist is secure and comfortable before letting the front hand go.',
        'Place the now-free front hand on the near upper arm just above the elbow. Keep the elbow naturally bent; do not straighten or wrench the captured arm.',
        'Lift the supported thigh and guide the upper arm as you turn the partner\'s shoulders toward the mat. Move with the hips so the arm is carried with the body.',
        'Pause briefly in controlled exposure, then ease the upper-arm contact and lower the thigh. Release the wrist before opening the scoop and resetting.'
      ],
      cues: ['Feed the wrist to the scoop hand.', 'Free hand guides above the elbow.', 'Carry the arm with the body.', 'Turn together; release in order.'],
      drill: 'Six-minute introduction: 1 minute demonstration; 1 minute wrist-transfer practice without a turn; 3 minutes alternating one slow turn and reset per 30-second turn; 1 minute feedback. Begin with an offered wrist. Only add a choice between this and N62 or N63 after each control has been taught separately.',
      boundary: 'No finger pulling, bent-wrist lock, arm jerk, forced shoulder rotation or twisting through the held knee. Never pull a trapped arm against the mat. The receiver does not brace with the captured arm. If the handoff needs force or the elbow cannot move comfortably, return to Navy control and choose another option.',
      error: 'The rider lets go before the scooping hand has the wrist, or tries to turn by pulling the trapped arm alone.',
      fix: 'Rehearse a visible hand-to-hand transfer without turning. Once secure, place the free hand above the elbow and make a small body-led turn with the thigh supported. Keep the wrist neutral.',
      video: {url: chain.url, title: 'Navy Ride - Modified Ball and Chain', channel: 'Redhawk Wrestling Charitable Foundation', format: 'video', match: 'direct', note: 'Wrist transfer and upper-arm control around 0:17; exposure around 0:21-0:22; repeated collection and hand position around 0:47-0:52. This is the demonstrated Navy variation, not every move called ball-and-chain.'},
      sources: [chain, ciasulli],
      verification: 'Checked 2026-10-27. Two reviewers independently confirmed the scooping hand holding the near wrist and the free hand controlling the near upper arm in decoded video frames. The written Ciasulli lesson lists this as a distinct Navy option. No continuous audio or complete transcript review is claimed. Drill timing, readiness and controlled receiving are Grindstone coaching design.',
      series_id: 'S44', role: 'option',
      branch: {title: 'Feed the wrist for a modified ball-and-chain', when: 'The near wrist can be passed comfortably to the far-thigh scooping hand without losing hip contact or straining the arm.', action: 'Complete the wrist transfer, control above the elbow with the free hand and turn with the supported thigh.', readiness: 'N61, a reliable wrist handoff and comfortable controlled turning with the captured arm.'}
    }
  ];

  const series = {
    id: 'S44', title: 'Navy Ride Series', position: 'top', positions: ['top'],
    purposes: ['ride', 'turn'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
    age_groups: [...groups], tier: 'Beginner', minutes: 14,
    summary: 'One far-thigh arm control, three turning choices: a top-shoulder tilt, a tabletop with separate wrist control, or a modified ball-and-chain wrist feed. Choose the control that is available; these are alternatives, not a required three-move chain.',
    foundation: 'N61: stay beside the hips with the back arm threaded between the legs around the opposite upper thigh. Keep the elbow close and maintain hip contact. The free front hand selects the shoulder or wrist control. Navy uses an arm around the far thigh; Western ride uses the same-side leg to hold an ankle.',
    setup: 'Teach the selected options individually before this choice block. Start in the established Navy position with cooperative partners. For early repetitions, bottom offers the rehearsed shoulder or wrist opening and the rider names the choice. Do not manufacture a grip by forcing the shoulder or knee. An unfamiliar roll or standing escape ends the repetition.',
    members: [
      {move_id: 'N61', role: 'Foundation', note: 'Establish and release the high far-thigh arm control before turning.', tier: 'Beginner', age_groups: [...groups]},
      {move_id: 'N62', role: 'Option', note: 'Cup the available top shoulder and turn with the supported thigh.', tier: 'Intermediate', age_groups: [...groups]},
      {move_id: 'N63', role: 'Option', note: 'Keep near-wrist and far-thigh controls separate, then support the hips on a low tabletop.', tier: 'Intermediate', age_groups: [...groups]},
      {move_id: 'N64', role: 'Option', note: 'Feed the near wrist to the far-thigh scooping hand; the free hand guides the upper arm.', tier: 'Intermediate', age_groups: [...groups]}
    ],
    branches: [
      {title: 'Available top shoulder', when: 'Bottom is on the side facing away and the upper shoulder is accessible with the far thigh controlled.', action: 'Use N62 to cup the shoulder and guide it back while lifting the supported thigh.', move_ids: ['N62'], tier: 'Intermediate', age_groups: [...groups], readiness: 'N62 has been taught separately; both wrestlers can receive a smooth side-to-back turn.'},
      {title: 'Separate near-wrist control', when: 'The front hand can hold the near wrist independently and the rider has a stable, low thigh support.', action: 'Use N63 to keep both controls separate, table the hips and guide the shoulders toward the mat.', move_ids: ['N63'], tier: 'Intermediate', age_groups: [...groups], readiness: 'N63 has been taught separately; the rider supports the partner throughout the turn and descent.'},
      {title: 'Comfortable wrist feed', when: 'The near wrist can reach the scooping hand without arm strain, leaving the front hand free.', action: 'Use N64 to complete the wrist handoff, control above the elbow and turn the body with the supported thigh.', move_ids: ['N64'], tier: 'Intermediate', age_groups: [...groups], readiness: 'N64 has been taught separately; the wrist handoff and controlled receiving are dependable.'}
    ],
    steps: [
      'Minutes 0-2: review N61. Each partner shows the far-thigh arm control and releases it. Identify near versus far from the rider\'s position.',
      'Minutes 2-4: review N62 with an announced shoulder opening. Alternate one controlled turn and reset per 30-second turn.',
      'Minutes 4-6: review N63. Check the separate wrist grip and low support before each tabletop; alternate one attempt per 30-second turn.',
      'Minutes 6-8: review N64. Say who holds the wrist after the handoff, then turn. Alternate one attempt per 30-second turn.',
      'Minutes 8-12: eight 30-second turns per pair. Bottom offers one familiar opening; top names the matching control and makes one attempt. Use up to 15 seconds for the exchange and the remaining time for release and role change. Keep the choices announced until each option is dependable.',
      'Minutes 12-14: repeat the least familiar choice once per wrestler. Explain how the wrist hand differs between tabletop and modified ball-and-chain. Put extra teaching in another slot instead of rushing a new grip into the recap.'
    ],
    cues: ['Far-thigh control stays the same.', 'Shoulder, separate wrist, or wrist feed?', 'Choose an opening; do not force one.', 'Support the partner, then reset.'],
    move_ids: ['N61', 'N62', 'N63', 'N64'],
    readiness: 'The series tier describes N61, its beginner starting control after basic top positioning. The optional turns have their own intermediate readiness checks; selecting this series does not mean teaching all of them immediately. Use prepared 7-10 and 11-14 pairs, checking control rather than age alone. Teach one option first, then add another when it is reliable. Pups can continue with familiar breakdowns and half nelsons rather than this complete tilt collection.',
    boundaries: 'Use cooperative, supervised first turns. Protect the wrist, elbow, shoulder and knee by keeping the body moving together. No arm locks, forced joint rotation, neck pulling, bodyweight drops or surprise rolls. Any blocked limb, discomfort or stop signal means release and reset. Event rules still apply; this youth folkstyle lesson does not import college stalling counts or freestyle scoring.',
    verification: 'Reviewed 2026-10-27. Redhawk lesson 22 publicly groups three free Navy demonstrations; decoded footage and second reviews distinguish their shoulder, separate-wrist and fed-wrist controls. Ciasulli supplies supporting written foundation and option names. Audio and complete transcripts were not reviewed. The series selection exercise, timing, readiness and stop conditions are original Grindstone coaching design, not claims about the source\'s exact practice prescription.',
    sources: [curriculum, shoulder, table, chain, ciasulli]
  };

  for (const item of [series, ...moves]) {
    for (const source of item.sources || []) source.accessed = '2026-10-27';
  }

  window.GRINDSTONE_SERIES_NAVY = {
    reviewed: '2026-10-27', series: [series], moves,
    placements: {'youth-5': ['S44'], 'youth-6': ['S44'], 'older-4': ['S44'], 'older-5': ['S44']},
    research_status: {
      promoted: [{series_id: 'S44', move_ids: ['N61', 'N62', 'N63', 'N64'], status: 'ready-for-preview', scope: 'High far-thigh arm control with three separately taught turning options: top shoulder, separate-wrist tabletop and modified ball-and-chain wrist feed.'}],
      held: [{id: 'navy-low-leg-transition', research_update: 'Review the low-leg clip and the side-change before developing this transition. The three Navy turns already have their own guides; the cradle connection remains a separate research task.', guide_links: [{label: 'Navy Ride Series', href: '#season?view=series&series=S44'}], title: 'Navy ride to low-leg cradle transition', sources: [curriculum.url, ciasulli.url, 'https://www.youtube.com/watch?v=q3HOguf1Cjk'], known: 'The primary curriculum groups low-leg cradle with Navy, and the written lesson describes grip changes as the opponent rolls.', missing: 'A complete reviewed transition showing exactly when and how to change sides and grips. The low-leg cradle clip has not been visually reviewed in this pass.', attempted_alternatives: 'Public creator curriculum and written lesson checked. The low-leg cradle video is retained for the next research pass rather than treated as identical to the Navy control.', backlog_moves: ['Navy ride to low-leg cradle transition']}]
    }
  };
})();
