/* Coach-confirmed switch family. The active switch determines the actors. */
(() => {
  'use strict';
  const module = window.GRINDSTONE_SERIES_DEFENSE_NEXT;
  if (!module) throw new Error('Load series-defense-next.js before series-switch-next.js');
  if (module.series.some(item => item.id === 'S42') || module.moves.some(item => item.id === 'N57')) throw new Error('Duplicate switch-series IDs');
  const groups = ['7-10', '11-14'];
  const source = {
    title: 'Daryl Weber - Switch / Re-Switch to a Step Over Chain Wrestling',
    url: 'https://attackstylewrestling.com/stepover/',
    note: 'The creator page names the complete switch/re-switch/step-over family and hosts the Step Over video. The coach confirmed that this shared clip works for the whole series. Its public embed is Vimeo 526241877. This addition does not claim a continuous agent review of the footage or audio.'
  };
  const series = {
    id: 'S42', title: 'Switch and counter choices', position: 'bottom',
    positions: ['bottom', 'top'], purposes: ['reverse', 'defend', 'ride'], uses: ['review', 'teach', 'reps', 'reaction', 'situational'],
    age_groups: [...groups], tier: 'Intermediate', minutes: 10,
    summary: 'Build from the switch into two counters: re-switch or step over. Identify who is applying the switch each time; the other wrestler chooses a familiar answer. A re-switch changes those roles, so either original wrestler may use the step-over.',
    foundation: 'Begin with B20: bottom in base, rider on the left with separate elbow-and-waist contact. Bottom starts the taught right-side switch. That creates the shared problem: one wrestler is applying switch pressure to the other wrestler\'s arm and shoulder. Name those current roles before every counter; original top and bottom labels no longer determine who acts.',
    setup: 'Teach B20, A17 and N57 individually before using the complete choice block. For first counter repetitions, pause the switch early while the pressured arm can still move and both wrestlers are balanced. Announce the chosen counter. To rehearse a step-over during a re-switch, establish the already-taught A17 exchange slowly and identify the new wrestler receiving switch pressure. This is a separate announced start, not a compulsory three-move sequence.',
    members: [
      {move_id: 'B20', role: 'Foundation', note: 'The original switch and its controlled top finish. Establish the switch relationship before choosing a counter.', tier: 'Beginner', age_groups: [...groups]},
      {move_id: 'A17', role: 'Counter option', note: 'The wrestler receiving the switch re-switches while the waist arm remains mobile and the thigh is reachable. The actors then change.', tier: 'Intermediate', age_groups: [...groups]},
      {move_id: 'N57', role: 'Counter option', note: 'Whoever is currently being switched on moves the hips over to remove leverage and regain top. No far-arm catch is required.', tier: 'Intermediate', age_groups: [...groups]}
    ],
    branches: [
      {
        title: 'Finish the switch when the route stays open',
        when: 'The wrestler applying B20 can turn behind without a counter or a trapped limb.',
        action: 'Complete B20 to balanced top control. The partner follows and frees the waist arm. Release and reset at that endpoint; the next counter is not required.',
        move_ids: ['B20'], tier: 'Beginner', age_groups: [...groups],
        readiness: 'Both partners can sit, scissor the hips, receive the turn and stop without a locked-arm post.'
      },
      {
        title: 'Re-switch while the arm and thigh are available',
        when: 'The wrestler being switched on still has the mobile waist arm and reachable thigh required by A17.',
        action: 'That wrestler uses A17\'s existing thigh reach, supporting hand and hip turn. Stop after its controlled top finish. Do not pull harder if the arm is pinned or the thigh is out of reach.',
        move_ids: ['A17'], tier: 'Intermediate', age_groups: [...groups],
        readiness: 'A17 has been taught separately. Partners can support, change hips and free the turning arm without fixing the shoulder or knee.'
      },
      {
        title: 'Step over when you are being switched on',
        when: 'The opponent is applying a switch and you can move your hips over while your pressured arm and shoulder remain mobile. This can occur against the initial switch or during a re-switch.',
        action: 'Use N57 to remove the switch leverage and regain balanced top control. The wrestler applying the current switch cooperates with the movement and frees the turning arm. A far-arm catch is not a prerequisite. Stop after the counter, then reset.',
        move_ids: ['N57'], tier: 'Intermediate', age_groups: [...groups],
        readiness: 'The coach has demonstrated N57, both partners can identify the pressured arm, and they can travel and release without shoulder strain. Use the initial-switch start first; add the re-switch context after A17 is familiar.'
      }
    ],
    steps: [
      'Minutes 0-2: review B20 and name the wrestler applying the switch and the wrestler receiving it. Trade roles after each controlled finish. If the switch is unfamiliar, use its individual lesson instead.',
      'Minutes 2-4: review the announced A17 counter. Begin early enough for its existing arm-and-thigh position. Stop at controlled top, release and alternate roles.',
      'Minutes 4-6: review N57 against an announced switch. The countering wrestler names their own pressured arm, moves the hips over and settles on top. Release and swap after each attempt.',
      'Minutes 6-9: six 30-second turns per pair. Agree on an open switch, re-switch or step-over response before starting. Allow up to 15 seconds for the exchange; use the rest to release, give feedback and swap. Pairs already comfortable with A17 may begin one announced turn in its re-switch context so the original switcher practices the step-over. Each turn ends after its one selected answer.',
      'Minutes 9-10: each wrestler identifies who would counter the current switch and shows one controlled endpoint. Do not rush another exchange into the recap. Progress to unannounced choices only in a later block after every selected response is dependable.'
    ],
    cues: ['Who is switching now?', 'Counter before the arm is fixed.', 'Move the hips; do not wrench the shoulder.', 'Regain top, release, reset.'],
    move_ids: ['B20', 'A17', 'N57'],
    readiness: 'Ready 7-10 and 11-14 pairs with a familiar switch, controlled hip changes and immediate release. Intermediate describes choosing between known counters; each counter needs its own lesson first. A pair may work only B20 and N57 until A17 is ready. This complete counter block is not a default Pups assignment.',
    boundaries: 'No forcing a pinned shoulder, pulling a fixed wrist, straight-arm fall, planted-knee twist, jump onto the partner or surprise counter. Stop for a caught arm or leg, lost balance, pain or any stop signal. Regaining top ends the repetition; no extra turn, throw or mat return is added.',
    verification: 'Reviewed 2026-10-24. The creator\'s written page identifies the full switch/re-switch/step-over family. The coach confirmed the shared video covers the entire series and clarified that the wrestler currently being switched on steps the hips over, without needing a far-arm catch. B20 and A17 are the existing canonical guides. No full continuous agent footage/audio review is claimed. Announced choices, role labels, age suggestions, receiving pauses and the ten-minute practice block are Grindstone coaching design.',
    sources: [source]
  };
  const move = {
    id: 'N57', name: 'Step-Over Counter to a Switch', category: 'counters', tier: 'Intermediate',
    age_groups: [...groups], positions: ['top', 'bottom'], purposes: ['defend', 'reverse', 'ride'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
    purpose: 'Remove an opponent\'s switch leverage by moving your hips over them and regaining top control. The counter belongs to whoever is currently being switched on, including the original switcher during a re-switch.',
    prerequisite: 'B20\'s switch, controlled hip movement and immediate partner release. The coach demonstrates the hip-over route with a cooperative partner before repetitions. Add the re-switch starting context only after A17 is familiar; it is not required for learning the initial counter.',
    setup: 'Begin with the familiar B20 switch attempt: the original rider is on the left, and the original bottom wrestler starts the taught right-side switch. Pause before the rider\'s right arm or shoulder becomes fixed. The rider is the countering wrestler in this first example. No extra far-arm catch is added.',
    steps: [
      'Identify the active switch. You perform the counter when the opponent is applying switch pressure to your arm and shoulder; do not assign the counter automatically to the original top wrestler.',
      'Start moving while that arm and shoulder can still follow the action. Follow the opponent\'s turn with your body rather than staying planted and pulling the pressured arm backward. A fixed shoulder is a stop and reset.',
      'Step and move your hips over the opponent along the coach-demonstrated hip-over route. Let your torso and pressured shoulder travel with your hips so the opponent loses the switch leverage. Keep the movement controlled; do not jump or use a far-arm catch to force it.',
      'As the leverage comes off, settle into balanced top control. The partner follows the movement and allows the turning arm to clear. Rebuild the familiar separate-hand waist-and-arm ride only after both are stable; no extra pinning turn is added.',
      'Pause at top, release and reset. Later, repeat from an announced re-switch: whoever is now receiving switch pressure uses the same counter, even if they began the exchange on bottom. Do not force a switch, re-switch and step-over into every repetition.'
    ],
    cues: ['Your shoulder feels the switch.', 'Hips over; shoulder moves with you.', 'No far-arm catch needed.', 'Top control, then reset.'],
    drill: 'Six-minute first lesson: 1 minute coach demonstration and role check; 1 minute slow supported travel without switch pressure; 3 minutes alternating announced switch-to-step-over repetitions, one attempt per 30-second turn with a pause at top; 1 minute recap. Use the remainder of each turn for release, feedback and swapping. Review the re-switch context in a later block after both partners know A17.',
    boundary: 'No fixed-shoulder rotation, wrist twisting, straight-arm collapse, jumping onto the partner or turning against a trapped knee. The wrestler applying the switch must follow and release rather than keep levering the arm during a stopped repetition. Stop for discomfort, a trapped limb or lost control.',
    error: 'The countering wrestler stays planted and tries to pull the pressured arm free, or waits for an unnecessary far-arm catch.',
    fix: 'Reset earlier with light contact. Identify the wrestler receiving the switch, then rehearse moving that wrestler\'s hips and shoulder together through the demonstrated route before restoring the switch attempt.',
    video: {
      url: source.url, title: 'Switch / Re-Switch to a Step Over - shared series demonstration',
      channel: 'Daryl Weber / Attack Style Wrestling', format: 'video', match: 'component',
      note: 'The creator page hosts the Step Over clip (Vimeo 526241877) and names the switch/re-switch/step-over series. The coach confirmed this video is suitable for all three actions. This card covers the step-over; B20 and A17 retain their own written guides. No full continuous agent footage or audio review is claimed.'
    },
    sources: [source],
    verification: 'Written creator page checked 2026-10-24; shared-video suitability and the counter\'s changing actor, hip-over purpose and lack of a required far-arm catch were confirmed by the coach. The written guide uses that explanation with B20/A17 context. It does not invent a fixed lead leg, new grip or forced three-move chain. Practice timing, gradual pressure and controlled resets are Grindstone teaching design.',
    series_id: 'S42', role: 'option',
    branch: {title: 'Step over when you are being switched on', when: 'The opponent applies switch pressure and your arm, shoulder and hip route remain mobile.', action: 'Move your hips over to remove the leverage and regain controlled top.', readiness: 'Familiar switch, coach-demonstrated hip-over and cooperative receiving.'}
  };
  module.series.push(series);
  module.moves.push(move);
  for (const phase of ['youth-5', 'youth-6', 'older-5', 'older-6']) {
    const list = module.placements[phase] || (module.placements[phase] = []);
    if (!list.includes(series.id)) list.push(series.id);
  }
  module.research_status.promoted.push({proposal: 32, series_id: 'S42', move_ids: ['N57'], status: 'ready-for-preview', scope: 'Coach-confirmed switch/re-switch/step-over family. Existing B20/A17 plus N57; changing actors and optional choices replace the earlier assumed fixed sequence and far-arm requirement.'});
})();
