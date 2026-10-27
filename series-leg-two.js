/* Parallel leg riding: two hooks, position-dependent breakdowns and a half turn. */
(() => {
  'use strict';
  const groups = ['7-10', '11-14'];
  const written = {
    title: 'Seth Ciasulli / Red Hawk - Parallel Leg Ride (Two Legs In)',
    url: 'https://sethciasulli.com/lessons/parallel-leg-ride-two-legs-in',
    note: 'The public written lesson distinguishes one-wrist-forward breakdown from base and inside two-wrist rollback from the elbows. Its linked power-half lessons are not treated as reviewed footage. The prose mentions locked feet without explaining the lock; this guide does not invent that detail.'
  };
  const lackman = {
    title: 'Matt Lackman / Iron Faith Wrestling - Double Boots Power Half',
    url: 'https://www.youtube.com/watch?v=YCxiB45NqSA',
    note: 'Free 37-second demonstration. Decoded checkpoints at 0:08, 0:15, 0:20, 0:25, 0:30 and 0:35 show two-leg control, flattening, half contact, a supporting hand and the turn. The exact foot lock and final hook retention are obscured; neither is asserted here. No continuous audio or transcript review is claimed.'
  };
  const moves = [
    {
      id: 'N69', name: 'Two-Leg Ride', category: 'top', tier: 'Intermediate',
      age_groups: [...groups], positions: ['top'], purposes: ['ride'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
      aliases: ['double boots', 'parallel leg ride', 'two legs in', 'two-hook ride'],
      purpose: 'Stay above the hips with one leg hook on each side, then choose a breakdown or turn. This is traditional parallel leg control, distinct from a Western ankle hook or a Navy arm scoop.',
      prerequisite: 'Reliable basic top control, comfortable single-leg riding, and a coach-checked two-hook position. Both partners can identify a trapped limb and release immediately. Learn the established position before practicing live entries.',
      setup: 'Bottom starts on hands and knees. With the coach checking placement, top starts directly over the hips, facing the same direction, with a hook on each corresponding leg. Each leg wraps from outside toward the inside; the partner\'s knees stay aligned naturally. This lesson begins with the hooks already placed rather than teaching a jump-in entry.',
      steps: [
        'Find the two separate hooks and the partner\'s hip line. Keep your hips above that line and remain close enough to follow the partner\'s small movements.',
        'Keep your hands available for support or wrist control. Balance through body position; do not secure the ride by twisting a foot or spreading the partner\'s knees.',
        'Ask bottom to show a small, announced change from a supported base toward the forearms. Follow while keeping the hips connected. Stop if you slide behind the hips or a hook catches awkwardly.',
        'Name the next task: from hands and knees, remove one wrist post with N70; from the belly supported on elbows, roll the wrist posts back with N71. Turning comes after stable control.',
        'Finish the first lesson by taking the pressure off and releasing each hook before the partner moves to reset. Do not stand or roll with both legs still entangled.'
      ],
      cues: ['One hook each side.', 'Hips stay above their hips.', 'Balance before a wrist or turn.', 'Release the hooks before resetting.'],
      drill: 'Four-minute introduction: 1 minute demonstration and coach placement checks; 2 minutes alternating 20-second turns to identify both hooks, follow one small announced movement and release; 1 minute feedback. If placement is unfamiliar, keep this as a position lesson instead of adding a turn.',
      boundary: 'No jumping into boots, twisting the knees or ankles, forcing the legs apart, standing with entangled legs or riding on the neck. Release if the rider loses a safe position or either partner signals discomfort. Keep weight controlled and match partners who can support the drill.',
      error: 'The rider slides behind the hips and tries to recover by squeezing or twisting the legs.',
      fix: 'Stop and release. Rebuild the supported top position with the coach, then rehearse a smaller movement. Leg strength is not a substitute for staying above the hips.',
      video: {url: lackman.url, title: 'Double Boots Power Half - two-leg control component', channel: 'Matt Lackman / Iron Faith Wrestling', format: 'video', match: 'component', note: 'Early checkpoints show the two-leg foundation and flattening; the later half turn is N72. The exact foot lock is not visible enough to prescribe. This is not a complete entry lesson.'},
      sources: [written, lackman],
      verification: 'Checked 2026-10-27. Public Ciasulli prose supports the parallel two-leg foundation and keeping the hips on top. Lackman decoded footage confirms the two-boot position, not a precise foot-lock configuration or a complete entry. The established-position setup, drill timing, cooperative movement and release checks are Grindstone teaching design.',
      series_id: 'S46', role: 'foundation'
    },
    {
      id: 'N70', name: 'Two-Leg Ride to One-Wrist Breakdown', category: 'top', tier: 'Intermediate',
      age_groups: [...groups], positions: ['top'], purposes: ['ride', 'breakdown'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
      aliases: ['double-boots two-on-one wrist breakdown', 'parallel ride wrist forward'],
      purpose: 'Remove one hand post when the bottom wrestler has rebuilt a hands-and-knees base under a two-leg ride.',
      prerequisite: 'N69, comfortable two-on-one wrist handling and a partner who can lower from base without planting a rigid arm. The coach checks the receiving movement before adding resistance.',
      setup: 'Begin in the established two-leg ride with bottom on hands and knees. Bottom offers one reachable wrist. Keep that wrist neutral, and leave the other hand available for a controlled descent.',
      steps: [
        'Keep your hips above the partner\'s hips and check that both leg hooks are comfortable. Do not reach for the wrist if it pulls your body out of position.',
        'Take the offered wrist with both hands. Hold around the wrist without pulling individual fingers or bending the hand into a lock.',
        'Lift that wrist slightly clear of its post and guide it forward. The purpose is to remove the hand support, not to stretch the arm as far as possible.',
        'Follow with controlled hip pressure as the partner bends the free elbow and lowers to the forearms and belly. Keep the shoulders and hips moving smoothly rather than dropping onto the back.',
        'Stop at a balanced belly-down position. Let go of the wrist, ease the riding pressure and release the hooks for the reset. Teach any subsequent turn in its own lesson.'
      ],
      cues: ['Base is up: one wrist forward.', 'Two hands, neutral wrist.', 'Remove the post; follow the body.', 'Stop at belly-down control.'],
      drill: 'Five-minute lesson: 1 minute demonstration; 1 minute wrist and receiving checks without a breakdown; 2 minutes alternating one slow attempt per 30-second turn; 1 minute feedback. Later review can use a 2-minute slot with the base already established.',
      boundary: 'No finger pulls, wrist bending, shoulder stretching, straight-arm collapse or sudden weight drop. Let the free elbow bend. Stop if either knee is caught or the wrist cannot travel comfortably forward. Keep first repetitions cooperative.',
      error: 'Top yanks the wrist forward while the body stays behind, or bottom braces on a locked free elbow.',
      fix: 'Reset with the wrist offered closer. Rehearse a small lift and a smooth, bent-elbow descent before putting the movements together.',
      video: null,
      sources: [written],
      verification: 'Checked 2026-10-27 against the public written primary lesson: bottom on base, two hands on one wrist, lift forward to break down. A matching free video for this exact wrist action has not been reviewed, so no different breakdown is presented as its demonstration. Receiving, neutral-wrist guidance, timing and resets are Grindstone teaching design.',
      series_id: 'S46', role: 'option',
      branch: {title: 'Bottom is on hands and knees', when: 'Bottom has a hand post available while the rider remains above the hips with two comfortable hooks.', action: 'Use two hands to lift one wrist forward and follow the controlled descent.', readiness: 'N69 plus cooperative wrist handling and a comfortable bent-elbow descent.'}
    },
    {
      id: 'N71', name: 'Two-Leg Ride to Wrist Rollback', category: 'top', tier: 'Intermediate',
      age_groups: [...groups], positions: ['top'], purposes: ['ride', 'breakdown'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
      aliases: ['double-boots rolling the wrists out', 'parallel ride inside wrist breakdown'],
      purpose: 'Remove the forearm supports when bottom is already belly-down but keeps the chest propped on the elbows.',
      prerequisite: 'N69, comfortable separate wrist controls and a coach-checked lowering movement from the elbows to the mat. This is a change in the wrist posts, not a turn or armbar.',
      setup: 'Begin with two leg hooks established and bottom lying on the belly, supported on bent elbows. Top remains above the hips. Both wrists must be reachable without forcing either shoulder behind its comfortable range.',
      steps: [
        'Check the base: bottom is on the belly with weight supported through the forearms, rather than up on hands and knees. Keep your hips connected and your body balanced.',
        'Reach inside the partner\'s arms and take one wrist with each hand. Keep the wrists neutral and the grips separate.',
        'Draw the wrists backward together to roll the supports out from under the chest. Use a short, smooth movement while bottom allows the elbows and chest to lower.',
        'Follow with controlled hip pressure and stop when the chest has settled. Do not continue pulling the hands behind the back or forcing the shoulders farther.',
        'Release the wrists and take the pressure off. Unhook the legs before the partner returns to base. If a wrist becomes tucked under the chest instead of moving freely, release and reset rather than improvising an armbar.'
      ],
      cues: ['Elbows are up: wrists go back.', 'Reach inside; one wrist per hand.', 'Small pull, smooth lowering.', 'Chest down ends this breakdown.'],
      drill: 'Five-minute lesson: 1 minute demonstration; 1 minute inside-grip and short-range checks; 2 minutes alternating one controlled rollback per 30-second turn; 1 minute recap. Contrast the starting posture with N70 before adding a choice drill.',
      boundary: 'No wrist locks, pulling hands high behind the back, sudden shoulder extension, leg spreading or dropping bodyweight. Do not trap an arm beneath the chest and then drive onto it. Release if the wrists cannot move freely or the partner signals discomfort.',
      error: 'Top reaches outside the arms and pulls too far, or starts this action while bottom is still on a hands-and-knees base.',
      fix: 'Return to the specified belly-and-elbows starting position. Check the inside wrist grips and rehearse only enough backward travel to lower the chest comfortably.',
      video: null,
      sources: [written],
      verification: 'Checked 2026-10-27 against the public primary lesson: bottom on stomach propped on elbows, inside wrist grips, pull backward to roll the wrists out. This differs from N70\'s one-wrist-forward action. No matching free video for this exact breakdown has been reviewed; it is presented as a written-source lesson. Drill timing, receiving and stop conditions are Grindstone teaching design.',
      series_id: 'S46', role: 'option',
      branch: {title: 'Bottom is belly-down on the elbows', when: 'Both wrists can move comfortably from the elbow-supported position while top remains above the hips.', action: 'Reach inside, hold the wrists separately and roll the supports backward to flatten.', readiness: 'N69 plus comfortable inside wrist controls and cooperative lowering from the elbows.'}
    },
    {
      id: 'N72', name: 'Double-Boots Half Turn', category: 'top', tier: 'Intermediate',
      age_groups: [...groups], positions: ['top'], purposes: ['ride', 'turn'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
      aliases: ['double boots power half', 'parallel leg ride half nelson'],
      purpose: 'Turn from the two-leg ride with a half nelson while moving your body around the shoulder. End this lesson at controlled back exposure rather than adding an unreviewed pinning finish.',
      prerequisite: 'N69, a familiar half nelson and a cooperative receiver who can turn without loading the neck or twisting a trapped knee. The coach demonstrates the turn and checks both partners before they combine the controls.',
      setup: 'Begin with the two-leg ride already established and bottom controlled low to the mat. Check that the near armpit is accessible without forcing the shoulder and that the receiver can turn smoothly. Teach this separately from the breakdown choices first.',
      steps: [
        'Settle balanced control above the hips before reaching for the half. If bottom is still strongly posted, return to a taught breakdown rather than pulling the head to make space.',
        'Thread the near arm under the armpit and place that hand behind the head for the half nelson. Use controlled contact; do not cover the throat or pull the neck into a fixed bend.',
        'Keep the other hand available to post for balance, as shown in the demonstration. Bring your hips and upper body around together as the half guides the shoulder turn.',
        'Follow the receiver into back exposure only while the shoulders, hips and legs can move comfortably together. Do not try to keep an unspecified foot lock or a trapped knee fixed while turning the upper body.',
        'Pause at controlled exposure, then ease the half and release the leg entanglement before resetting. If the turn stops or a knee or neck takes the pressure, stop and rebuild rather than increasing force.'
      ],
      cues: ['Control low before the half.', 'Under the arm; behind the head.', 'Move your hips with the shoulder.', 'Support, expose, release.'],
      drill: 'Six-minute introduction: 1 minute demonstration; 1 minute checking the half and free-hand support without a turn; 3 minutes alternating one slow, supervised turn per 30-second turn; 1 minute feedback. Stop at exposure. Do not spend the whole turn holding pressure on a partner\'s neck.',
      boundary: 'No neck crank, throat pressure, forced head fold, fixed-knee twisting, sudden roll or bodyweight drop. Do not resist a fully set turn through the neck in the learning drill. Direct coach supervision is required for first attempts; any discomfort ends the repetition.',
      error: 'The rider keeps the hips square and tries to turn the partner with the half arm alone.',
      fix: 'Release, check the starting control and rehearse a small body-led rotation with the support hand available. If the partner cannot turn comfortably, revisit the position rather than applying a harder half.',
      video: {url: lackman.url, title: 'Double Boots Power Half', channel: 'Matt Lackman / Iron Faith Wrestling', format: 'video', match: 'direct', note: 'Two-boot flattening and half setup appear in the early and middle checkpoints; the turn reaches back exposure around 0:35. Exact foot locking and final hook retention are obscured, so this guide does not prescribe them or claim a full pinning settle.'},
      sources: [lackman, written],
      verification: 'Checked 2026-10-27. Root reviewer inspected decoded frames at 0:08, 0:15, 0:20, 0:25, 0:30 and 0:35: two-boot control, half contact, support hand, hip rotation and back exposure are visible. No continuous audio or full transcript review is claimed. The exact foot lock and retained hook at the endpoint are not established. Ciasulli lists a parallel-ride power half, but his paid both-legs-in finish is not treated as identical to this free demonstration. Lesson scope, timing and stop conditions are Grindstone teaching design.',
      series_id: 'S46', role: 'option',
      branch: {title: 'Controlled low position with a half available', when: 'The rider has stable low control and the shoulder route is open without forcing the head, arm or knees.', action: 'Build the half, keep a support hand and turn the body together to controlled back exposure.', readiness: 'N69, a familiar half nelson and a coach-checked cooperative turn.'}
    }
  ];

  const series = {
    id: 'S46', title: 'Two-Leg Ride Series', position: 'top', positions: ['top'],
    purposes: ['ride', 'breakdown', 'turn'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
    age_groups: [...groups], tier: 'Intermediate', minutes: 14,
    summary: 'Build a parallel ride with two leg hooks, choose the wrist breakdown that fits the opponent\'s base, then look for a familiar half turn. The two breakdowns answer different posts; they are not consecutive moves everyone must perform.',
    foundation: 'N69: an established parallel ride, directly above the hips with one hook on each corresponding leg. Learn its balance and release before adding wrist controls. This is different from a Western same-side ankle hook, a Navy far-thigh arm scoop and a cross-body one-leg ride.',
    setup: 'Teach the selected moves separately before using the choice lesson. Bottom offers one of two announced postures: hands-and-knees base for N70, or belly-down supported on elbows for N71. N72 starts only after stable low control with an available half. Begin with hooks already checked; live entry and a particular foot lock are outside this lesson.',
    members: [
      {move_id: 'N69', role: 'Foundation', note: 'Establish two comfortable hooks, stay above the hips and release cleanly.', tier: 'Intermediate', age_groups: [...groups]},
      {move_id: 'N70', role: 'Option', note: 'Two hands guide one wrist forward when bottom is on a hands-and-knees base. Written-source lesson; matching free footage remains to be reviewed.', tier: 'Intermediate', age_groups: [...groups]},
      {move_id: 'N71', role: 'Option', note: 'Separate inside wrist grips roll the supports backward when bottom is belly-down on elbows. Written-source lesson; matching free footage remains to be reviewed.', tier: 'Intermediate', age_groups: [...groups]},
      {move_id: 'N72', role: 'Option', note: 'Half turn from stable low control; stop at the demonstrated back exposure.', tier: 'Intermediate', age_groups: [...groups]}
    ],
    branches: [
      {title: 'Hands-and-knees base', when: 'Bottom has rebuilt a hand post, and top remains above the hips.', action: 'Use N70: two hands lift one wrist forward, then follow the controlled descent.', move_ids: ['N70'], tier: 'Intermediate', age_groups: [...groups], readiness: 'N70 already taught; bottom can lower smoothly with the free elbow bent.'},
      {title: 'Belly-down, elbows still propping', when: 'Bottom stays on the belly but the forearms support the chest.', action: 'Use N71: reach inside to separate wrist grips and roll the supports backward.', move_ids: ['N71'], tier: 'Intermediate', age_groups: [...groups], readiness: 'N71 already taught; both wrists can move without shoulder strain.'},
      {title: 'Low control and a half opening', when: 'Bottom is controlled low, with a comfortable half route and a clear supported turn.', action: 'Use N72: set the half and move the body together to back exposure. Do not force a blocked turn.', move_ids: ['N72'], tier: 'Intermediate', age_groups: [...groups], readiness: 'N72 already taught; the pair can receive the turn without knee or neck pressure.'}
    ],
    steps: [
      'Minutes 0-2: review N69. Each wrestler establishes the checked two-hook position, follows one small announced movement and releases.',
      'Minutes 2-4: review N70 from hands and knees. Alternate one slow breakdown per 30-second turn, including release and role change.',
      'Minutes 4-6: review N71 from the belly and elbows. Name how the wrist direction differs from N70, then alternate controlled attempts.',
      'Minutes 6-8: review N72 from low control. Each turn includes a checked half, one smooth exposure and a complete reset.',
      'Minutes 8-12: eight 30-second turns per pair. Bottom announces base or elbows; top names and uses the matching breakdown. A previously taught half may follow only after a fresh control check. Use the remaining time in each turn to release and swap.',
      'Minutes 12-14: repeat the least reliable choice once per wrestler and explain when to stop and rebuild. Put unfamiliar moves in their own teaching slots rather than rushing them into this review.'
    ],
    cues: ['Two hooks, hips on top.', 'Base: one wrist forward.', 'Elbows: wrists roll back.', 'Control first, then a half.'],
    move_ids: ['N69', 'N70', 'N71', 'N72'],
    readiness: 'Intermediate because the lesson combines a leg ride with wrist control and a turn, not because every top move is advanced. Use prepared 7-10 or 11-14 pairs after basic rides, breakdowns and half nelsons. Teach one breakdown before combining the choices. Pups keep their simpler active wrestling foundations; this complete leg-riding collection is not a default Pups assignment.',
    boundaries: 'Coach-check the starting hooks and receiving movement. No forced foot lock, knee twist, leg spreading, jumping entries, neck cranks, surprise rolls or standing with entangled legs. A lost safe position or stop signal means release. Work toward a breakdown or turn rather than holding a partner motionless. Event rules still apply; no college timing or scoring rule is imported here.',
    verification: 'Reviewed 2026-10-27. N70 and N71 are supported by distinct instructions in the public primary Ciasulli lesson, with no matching reviewed free demonstration yet. N69 and N72 have visually sampled free Lackman footage; the exact foot lock and final hook retention remain unverified and are not prescribed. The half turn ends at visible back exposure. Selection drills, timing and readiness are original Grindstone teaching design.',
    sources: [written, lackman]
  };

  for (const item of [series, ...moves]) {
    for (const source of item.sources || []) source.accessed = '2026-10-27';
  }
  window.GRINDSTONE_SERIES_LEG_TWO = {
    reviewed: '2026-10-27', series: [series], moves,
    placements: {'youth-6': ['S46'], 'older-5': ['S46'], 'older-6': ['S46']},
    research_status: {
      promoted: [{series_id: 'S46', move_ids: ['N69', 'N70', 'N71', 'N72'], status: 'ready-for-preview', scope: 'Established two-leg foundation, two posture-specific written-source breakdowns and a visually sampled half turn. Exact foot-lock instruction is intentionally outside scope.'}],
      held: [
        {id: 'parallel-wrist-videos', title: 'Matching free demonstrations for two-leg wrist breakdowns', research_update: 'The public primary written instructions are sufficient for N70 and N71 as written guides. Find and review a free demonstration of each exact action before adding a video button.', guide_links: [{label: 'Two-Leg Ride Series', href: '#season?view=series&series=S46'}], sources: [written.url, lackman.url], known: 'N70 moves one wrist forward from base; N71 rolls two wrist posts backward from the elbows.', missing: 'Decoded footage of these exact wrist actions, and a clearly demonstrated entry or foot-lock variation if a separate entry lesson is wanted.', attempted_alternatives: 'Lackman\'s free power-half clip was visually sampled; it supports the foundation and turn but not both wrist actions. Ciasulli\'s linked lessons and Chris Perry course outlines were checked as leads, not treated as viewed paid lessons.', backlog_moves: ['Two-leg ride entry and foot configuration']},
        {id: 'parallel-armbar-followups', title: 'Parallel ride armbar and hammerlock continuations', research_update: 'Retain these as separate follow-ups instead of padding the half-turn series with incomplete finishes.', guide_links: [{label: 'Two-Leg Ride Series', href: '#season?view=series&series=S46'}], sources: [written.url], known: 'The public curriculum describes an armbar entry when the wrist stays tucked and names several armbar and hammerlock options.', missing: 'A complete freely reviewed demonstration linking the exact starting control, hand transfer, turn and safe release.', attempted_alternatives: 'Public prose and lesson names were reviewed. Paid lesson titles alone do not establish the complete mechanics.', backlog_moves: ['Two-leg ride wrist-tuck to armbar', 'Parallel ride armbar turn', 'Parallel ride hammerlock tilt']}
      ]
    }
  };
})();
