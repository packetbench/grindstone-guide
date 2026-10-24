/* Bottom-position choices. These are coaching frameworks, not a required sequence. */
window.GRINDSTONE_SERIES_ESCAPES = {
  reviewed: '2026-10-24',
  series: [
    {
      id: 'S23',
      title: 'Standing escape and Peterson series',
      position: 'bottom',
      age_groups: ['11-14'],
      tier: 'Advanced',
      minutes: 10,
      summary: 'From a balanced stand-up with the rider still behind, choose the ordinary hand-controlled escape or a separately learned Peterson reversal when the rider moves to the side and supplies its wrist-and-knee connection. Hand fighting supports both choices; it is not another finish.',
      foundation: 'Both wrestlers are on their feet after the stand-up, knees bent and weight supported on their own feet. The rider remains behind with light, separate-hand waist contact. The escaping wrestler keeps elbows close and can work on the hands in front. Neither wrestler lifts, trips or begins a mat return.',
      setup: 'Use B17 to arrive at the shared standing position, then pause. First teach B21 as the normal escape. Teach K18 separately from its low, coach-set grip position before connecting it to the stand-up. For the choice drill, the rider either allows hand-and-hip clearance or follows toward the side used in the already-taught K18 example. Establish each option\'s own hand control; do not mix B21\'s retained right-hand grip with K18\'s left-hand wrist control and right-arm knee wrap.',
      members: [
        { move_id: 'B17', role: 'Entry', note: 'Rise to the shared balanced standing position before reading the rider.' },
        { move_id: 'B21', role: 'Option', note: 'Clear the waist contact and turn to face for an escape.' },
        { move_id: 'A14', role: 'Preparation', note: 'Deny a renewed waist grip while preserving balance. This is hand-control practice for the escape, not a separate scoring branch.' },
        { move_id: 'K18', role: 'Option', note: 'Use the separately taught low Peterson transition only when side position, wrist control and a close knee are all present.' }
      ],
      branches: [
        {
          title: 'Clear the hands and face',
          when: 'The waist hand can be controlled away from the body and the hips can clear the rider\'s arm.',
          action: 'Use B21\'s retained-hand finish: make hip space, move the feet through the turn and face in stance. A14 can help remove one reaching hand before that finish; it does not change the destination.',
          move_ids: ['B21', 'A14'],
          readiness: 'The first choice to teach. Both partners can stay balanced, follow on their feet and release promptly. An athlete who knows only this option should keep practicing it without a roll.'
        },
        {
          title: 'Lower into the Peterson reversal',
          when: 'The rider follows to the taught side and a close knee is available while the defender can establish K18\'s wrist control. Ordinary hand-and-hip clearance has not produced separation.',
          action: 'Re-establish K18\'s exact grips and lower into its rehearsed position. Wrap the nearby knee and make the taught shoulder roll opposite the knee-wrapping arm; recover control with a cooperating receiver. Do not launch from upright or roll merely because the escape was blocked.',
          move_ids: ['K18'],
          readiness: 'Later option for individually ready wrestlers after smooth shoulder rolling, the low wrist-and-knee setup, controlled receiving and the complete K18 lesson. A coach checks the chosen side and both grips before adding movement.'
        }
      ],
      steps: [
        'Review B17 and B21 until the stand-up ends in a controlled, facing escape. Check hand control and foot movement before adding another outcome.',
        'Teach K18 separately from low positions with direct coach supervision. Keep this out of the choice drill until both wrestlers can establish the grips, name the rolling shoulder and finish without a head landing or trapped limb.',
        'Return to the same standing rear-control foundation for every attempt. The rider announces either ordinary hand clearance or the agreed side-follow response. The defender identifies which learned option is actually available.',
        'Pause before the chosen finish: check hip clearance for B21, or the complete low grip position for K18. Complete one controlled outcome, release and swap roles.',
        'Only after both branches are reliable, let the receiver choose between those two rehearsed responses without announcing them. If balance, the expected grip or the close leg is missing, stop and reset. A blocked first option does not guarantee the other one.',
        'Add A14\'s single re-grip attempt as hand-fighting practice when appropriate. Keep the same two outcomes; do not turn extra resistance into an unplanned standing scramble.'
      ],
      cues: ['Stand balanced; read the rider.', 'Free hips: face.', 'Close knee and correct wrist: get low first.', 'Missing the grip: reset.'],
      move_ids: ['B17', 'B21', 'A14', 'K18'],
      readiness: 'Optional later work for ready 11-14 wrestlers; age alone is not permission for the Peterson. Beginners continue the ordinary stand-up and hand-controlled finish. The coach selects partners who can follow the low reversal, release trapped contact and stop before a poor landing.',
      boundaries: 'No lift, mat return, trip, blind standing drop, neck pivot, finger peeling or wrist twisting. The receiver follows without a locked-arm post. Stop if a shoulder is trapped, a captured knee cannot move comfortably, either wrestler loses balance, or the exact roll direction is uncertain. Reset is the stop rule, not a third move in the series.',
      sources: [
        {
          title: 'Cary Kolat - Getting Off the Bottom',
          url: 'https://www.kolat.com/blog/getting-off-the-bottom-by-cary-kolat',
          note: 'Primary coaching explanation supports base, sealing off, elbows close and moving hands outside the hips before adding an escape. It supports the foundation, not the Peterson mechanics.'
        },
        {
          title: 'Ben Askren / Fanatic Wrestling - Counter Standing Peterson',
          url: 'https://fanaticwrestling.com/blogs/news/counter-standing-peterson-with-ben-askren',
          note: 'The publisher\'s written lesson describes rear control moving to the side, the opponent stepping outside an initial leg block, a knee wrap and rolling over the opposite shoulder. K18 is a gradual coaching adaptation; this drill begins from light separate-hand contact and does not reproduce Askren\'s full body-lock exchange.'
        },
        {
          title: 'Cary Kolat - Multi-year bottom progression',
          url: 'https://www.kolat.com/blog/kolatcom-4-6-year-teaching-curriculum-for-new-to-novice-wrestlers-by-cary-kolat',
          note: 'The advanced stand-up progression includes standing Peterson after continuing work on base, hand control and first moves. The title describes years of training, not ages 4-6. It is curriculum evidence, not a substitute for a technique lesson.'
        },
        {
          title: 'USA Wrestling - Folkstyle Level 1 stand-up foundation',
          url: 'https://www.usawmembership.com/usa_wrestling_core_curriculum/1',
          note: 'Related foundation already linked by B17/B21. It does not verify the Peterson branch or the exact handedness of this choice drill.'
        }
      ],
      verification: 'Primary written instruction and the existing B17/B21/A14/K18 guides were reviewed on 2026-10-24. The two-response practice design, separate-hand start and readiness limits are coaching adaptations. K18\'s selected JJ Howland Short remains a reference whose exact grips and finish have not been footage-verified; no claim is made that it demonstrates this complete series.'
    }
  ],
  moves: [],
  placements: {
    'older-4': ['S23'],
    'older-5': ['S23'],
    'older-6': ['S23']
  }
};
