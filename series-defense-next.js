/* Reviewed escape connections and spiral responses; unfinished mechanics stay in research_status. */
window.GRINDSTONE_SERIES_DEFENSE_NEXT = {
  reviewed: '2026-10-24',
  series: [
    {
      id: 'S40', title: 'Cross-wrist clear to escape choices', position: 'bottom',
      positions: ['bottom'], purposes: ['defend', 'escape'], uses: ['review', 'teach', 'reps', 'reaction', 'situational'],
      age_groups: ['11-14'], tier: 'Intermediate', minutes: 10,
      summary: 'Solve one specific cross-wrist ride, then choose a standing exit or a sit-out and hip-heist. Reuse the existing escape guides after the hand is free; this is not a universal answer to every wrist ride.',
      foundation: 'Use A28 exactly: bottom is on knees, rider on the left, rider’s right hand holding bottom’s left wrist across the belly and left hand controlling the left triceps. Bottom stays low, clears the wrist and seals the left elbow before trying to escape.',
      setup: 'Teach A28, B17/B21 and B18/B19 separately. For early linking repetitions, pause after A28. The rider releases the old triceps contact and follows with separate-hand elbow-and-waist contact: left hand at bottom’s left elbow, right hand at the waist. This announced teaching reset establishes the documented start for either escape; it is not an automatic opponent reaction.',
      members: [
        {move_id: 'A28', role: 'Foundation', note: 'Specific cross-wrist clearance; stop before the rider loads a tilt.'},
        {move_id: 'B17', role: 'Standing option', note: 'Rise only after the hand is free and the documented elbow/waist starting contact is restored.'},
        {move_id: 'B21', role: 'Standing finish', note: 'Retain the whole waist hand, clear the hip, then face.'},
        {move_id: 'B18', role: 'Low option', note: 'Use the established left-side start to create a compact seat.'},
        {move_id: 'B19', role: 'Low finish', note: 'Clear the loose waist hand before the heist; sitting alone does not score an escape.'}
      ],
      branches: [
        {title: 'Clear, rise and face', when: 'The wrist is free, base is balanced, and the inside foot can step up under controlled elbow/waist contact.', action: 'Use B17 only through balanced standing with the right hand controlling the rider’s right waist hand; pause before B17’s final turn. From that shared checkpoint, use B21’s hand clearance and face-up finish. If the wrist is recaptured or the rider changes to a turn, stop and re-establish the training start.', move_ids: ['A28', 'B17', 'B21'], readiness: 'Bottom can hold a bent arm close and rise without pitching forward; rider follows on feet without returning them to the mat.'},
        {title: 'Clear, sit and heist', when: 'The wrist is free and there is room for the already-learned sit-out while the rider follows lightly behind.', action: 'Use B18, then B19. Pause in the short sit to check the waist hand, clear it, and finish facing.', move_ids: ['A28', 'B18', 'B19'], readiness: 'Both wrestlers can sit and change hips without trapping a knee or leaning on a rigid posting arm.'}
      ],
      steps: [
        'Minutes 0–2: check the cross-wrist start, low clearance and instant release. Every wrestler names the hand being cleared. If A28 is unfamiliar, teach it separately before this choice block.',
        'Minutes 2–4: alternate clearance plus standing exit. Pause after the clearance and restore the documented contact before B17/B21. Trade roles after each attempt.',
        'Minutes 4–6: alternate clearance plus B18/B19. Check the short sit and waist-hand clearance; do not count the sit-out as the escape.',
        'Minutes 6–9: six 30-second turns per pair. Allow up to 15 seconds to clear and use a chosen familiar exit, then give feedback, release and swap. Top follows only with the agreed contact; no tilt, chop, locked hands or mat return.',
        'Minutes 9–10: each wrestler states one clearance cue and one finish cue. Success means a free hand plus an escape facing the partner. If the ride changes, a controlled reset is the correct response.'
      ],
      cues: ['Clear the wrist first.', 'Seal the elbow; check your base.', 'Choose a familiar exit.', 'Finish facing, then reset.'],
      move_ids: ['A28', 'B17', 'B21', 'B18', 'B19'],
      readiness: 'The Intermediate label describes connecting familiar skills. The A28 starting grip and elbow scrape still require a coach check; initial full-series assignment remains 11–14. Pups use their separate stand-up activity, not this ride-clearance module.',
      boundaries: 'Do not continue after a tilt is loaded, or force an escape while the shoulder is trapped. No finger peeling, wrist twisting, rolling through a locked grip, or unannounced counter. The coach controls any increase in resistance.',
      verification: 'Kolat’s public plan lists wrist and two-on-one clearance feeding heist or stand-up. The exact A28 clearance and both exits are reused from the existing library; this pass adds no new clearance mechanics. Starting-contact reset, choice cues, time limits and constrained partner behavior are Grindstone coaching arrangements. It does not claim that Kolat demonstrates the particular A28 grip in that written plan.',
      sources: [
        {title: 'Kolat — Bottom Clearing Rides to Heist / Stand-Up', url: 'https://www.kolat.com/practice-plans/training-session-bottom-clearing-rides-to-heist-stand-up', note: 'Public written plan, attributed to user KOLAT, reviewed. Supports connecting a clearance to two exits; its adult exercise totals are not adopted.'},
        {title: 'Zain Retherford — Breaking Out of Tilts', url: 'https://www.youtube.com/watch?v=EVHyXbOG3Og', note: 'Existing A28 source; prior library audit sampled its early wrist-clear sequence and transcript. Not rewatched in full for this connection module.'}
      ]
    },
    {
      id: 'S41', title: 'Spiral-ride defense choices', position: 'bottom',
      positions: ['bottom'], purposes: ['defend', 'escape'], uses: ['review', 'teach', 'reps', 'reaction', 'situational'],
      age_groups: ['7-10', '11-14'], tier: 'Intermediate', minutes: 12,
      summary: 'Answer the same spiral ride in two ways: redirect sustained pressure into a changeover, or use a knee-dip stand-up when balanced over your feet. Practice the pressure response before attaching a familiar escape finish.',
      foundation: 'Bottom starts in a stable base with the rider on the left. The rider has left-arm contact under the left armpit and right-hand contact inside the right thigh, as in the opening of A19. Bottom’s hands remain free; no wrist ride, half nelson or inserted leg is present.',
      setup: 'Teach N55 and N56 independently. In this series, the rider announces either sustained controlled forward pressure for N55, or lighter following pressure that lets bottom reach a hand-and-feet tripod for N56. After the response, pause and check the exact B19 or B21 start before joining the exit. Do not invent a finish for a different surviving grip.',
      members: [
        {move_id: 'N55', role: 'Option: changeover', note: 'Redirect controlled driving pressure into a compact short sit.'},
        {move_id: 'B19', role: 'Low finish', note: 'Only after N55’s checkpoint leaves the documented loose waist contact; clear the hand before heisting.'},
        {move_id: 'N56', role: 'Option: knee-dip stand-up', note: 'From a balanced hand-and-feet tripod, dip the inside knee and bring the outside foot forward to rise.'},
        {move_id: 'B21', role: 'Standing finish', note: 'Check right-hand control of the rider’s right waist hand and clear the right hip before turning.'}
      ],
      branches: [
        {title: 'Use the driving pressure', when: 'Forward pressure is sustained, the inside hand is free to cross to a supporting post, and the hips can move into a seat.', action: 'Use N55. Once seated, establish B19’s loose waist-contact start and use its taught hand clearance and hip-heist.', move_ids: ['N55', 'B19'], readiness: 'The wrestler has a controlled sit-out, safe supporting hand and familiar low escape. No turning against a pinned wrist.'},
        {title: 'Rise from a balanced tripod', when: 'Bottom can support on hands and feet, but there is insufficient forward drive for the changeover.', action: 'Use N56. After standing, verify B21’s waist-hand start, then clear and face. If that hand position is unavailable, pause rather than spin.', move_ids: ['N56', 'B21'], readiness: 'The wrestler can lower a knee softly, step the other foot forward, and rise with balance while the rider follows without pulling back.'}
      ],
      steps: [
        'Minutes 0–2: identify the exact spiral start and check both partners’ releases. Demonstrate the two pressure cues. If a response is new, replace this review block with its individual lesson.',
        'Minutes 2–5: alternate N55 plus the checked B19 finish. Use an announced drive and a brief pause in the seat. Swap roles every repetition.',
        'Minutes 5–8: alternate N56 plus the checked B21 finish. Use soft knee contact and a supporting outside foot; stop immediately if the rider prevents a balanced rise.',
        'Minutes 8–11: six 30-second turns per pair. Top announces one pressure cue; bottom chooses its taught response. Stop at a balanced response position, a completed escape or 15 seconds. Use remaining time for feedback and role swap.',
        'Minutes 11–12: wrestlers explain how pressure changed the choice. End with one clean repetition or a verbal recap; do not rush an extra live round into the final minute.'
      ],
      cues: ['Feel the pressure before choosing.', 'Free hand and moving hips.', 'Soft knee, outside foot.', 'Check the hands before finishing.'],
      move_ids: ['N55', 'B19', 'N56', 'B21'],
      readiness: 'Ready 7–10 and 11–14 wrestlers who already control a sit-out, hip-heist and stand-up. Introduce one response at a time. Experience, balance and partner cooperation determine progression; Pups keep their separate beginner escape activity.',
      boundaries: 'Only the named spiral start. No inserted legs, turns, mat returns, finger peeling, head-supported tripod, rigid-arm fall or knee slam. A caught limb or changed ride ends the repetition. First learning uses announced pressure, not an unscripted scramble.',
      verification: 'Bauer’s public lesson transcript and visual checkpoints corroborate the changeover and knee-dip alternatives. The pressure distinction is explicit at 1:26–2:27. Weber’s shorter demonstration also shows the seated and rising relationships. Full continuous audio review was not performed. The finish checkpoints, constrained partner behavior, age suggestions and 12-minute practice structure are Grindstone adaptations.',
      sources: [
        {title: 'Dakota Bauer — Spiral Ride Defense, Colorado School of Mines', url: 'https://coachesinsider.com/wrestling/spiral-ride-defense-with-dakota-bauer-colorado-school-of-mines/', note: 'Free 5:27 publisher-hosted lesson. Transcript reviewed for the first two responses, with visual checkpoints at 0:29/0:37 and 1:36/1:41/1:51/1:56/2:01/2:26. The later arm-trap and finger-control response is outside this series.'},
        {title: 'Daryl Weber — Spiral Ride Defense', url: 'https://www.attackstylewrestling.com/spiral-ride-defense/', note: 'Creator article and embedded demonstration checkpoints at 0:14/0:20/0:25/0:30/0:35 reviewed. Opens the creator page because the standalone Vimeo player is privacy-restricted.'}
      ]
    }
  ],
  moves: [
    {
      id: 'N55', name: 'Spiral Changeover to a Short Sit', category: 'bottom', tier: 'Intermediate',
      age_groups: ['7-10', '11-14'], positions: ['bottom'], purposes: ['defend', 'escape'], uses: ['teach', 'review', 'reps', 'reaction'],
      purpose: 'Redirect a spiral rider’s forward pressure and reach a stable seat from which a familiar escape can begin.',
      prerequisite: 'B18’s controlled sit and B19’s solo hip movement. Coach checks a free inside hand, a movable shoulder and the exact left-side spiral start. Teach the response before adding an exit.',
      steps: [
        'Start in base, rider on your left in A19’s opening spiral: their left arm under your left armpit and right hand inside your right thigh. Your hands are free.',
        'As they drive, carry your left hand across in front to a supporting post. Turn with that pressure onto your right buttock; do not collapse onto a trapped arm.',
        'Bring the legs into a compact seat, chest up and feet close. Keep enough shoulder contact to avoid being stretched forward, with your head off the mat.',
        'Pause balanced. The teaching repetition ends here. For a later linked escape, coach and partners first establish B19’s loose, unlinked waist-contact start; clear that hand and follow B19. If a spiral contact still blocks the hips or shoulder, release and reset instead.',
        'After the response or linked escape, both release fully before returning to base. Reverse sides only after the coach demonstrates the mirrored hand and hip relationship.'
      ],
      cues: ['Free hand crosses.', 'Go with the drive.', 'Sit balanced before escaping.'],
      drill: 'Original 6-minute lesson: 1 minute demonstrate; 1 minute solo hand-and-seat rehearsal; 2 minutes alternating cooperative responses; 1 minute check the B19 starting contact without racing an escape; 1 minute recap. Take one careful attempt per 20-second turn and use the remaining time to release, swap and give feedback.',
      boundary: 'No locked wrist, inserted leg, half nelson, straight-arm fall or shoulder roll. The receiver follows the hip movement and releases for a caught arm or leg. Do not increase the drive to force the sit.',
      error: 'Bottom tries to sit while the inside arm remains caught, or falls backward without a supporting hand.',
      fix: 'Remove the rider. Rehearse the free-hand path and slow supported seat; then restore only light spiral contact.',
      video: {url: 'https://coachesinsider.com/wrestling/spiral-ride-defense-with-dakota-bauer-colorado-school-of-mines/', title: 'Spiral Ride Defense — changeover component', channel: 'Dakota Bauer / Coaches Insider', format: 'video', match: 'component', note: 'Use 0:13–1:25 for the changeover. Transcript and visual checkpoints at 0:29 and 0:37 were reviewed; full continuous audio was not. The paused endpoint, receiving rules and B19 hand-position checkpoint are Grindstone teaching adaptations.'},
      sources: [
        {title: 'Dakota Bauer — Spiral Ride Defense', url: 'https://coachesinsider.com/wrestling/spiral-ride-defense-with-dakota-bauer-colorado-school-of-mines/'},
        {title: 'Daryl Weber — Spiral Ride Defense', url: 'https://www.attackstylewrestling.com/spiral-ride-defense/'}
      ],
      verification: 'Public transcript and visual positions reviewed on 2026-10-24. Fixed left-side start follows the existing A19 contact description. Timed drill, supported-seat endpoint, explicit B19 contact check and receiving boundaries are original coaching design. This guide does not claim a changeover alone is an escape.',
      series_id: 'S41', role: 'option', branch: {title: 'Use the driving pressure', when: 'Sustained forward pressure and a free inside hand let the hips change position.', action: 'Reach a controlled seat, then assess the hands before a known exit.', readiness: 'Controlled B18 and free shoulder/hand.'}
    },
    {
      id: 'N56', name: 'Spiral Knee-Dip Stand-Up', category: 'bottom', tier: 'Intermediate',
      age_groups: ['7-10', '11-14'], positions: ['bottom'], purposes: ['defend', 'escape'], uses: ['teach', 'review', 'reps', 'reaction'],
      purpose: 'Rise from a spiral ride when a balanced tripod is available but the pressure is insufficient for a changeover.',
      prerequisite: 'Balanced hands-and-feet support, pain-free controlled knee contact, B17 standing balance and B21 hand clearance. Coach checks that the rider can follow the rise without lifting or pulling back.',
      steps: [
        'From the same left-side spiral start as N55, move onto hands and feet with hips raised. Keep the head off the mat and hands available; pause if the rider controls a wrist.',
        'Briefly lower your inside left knee while bringing your outside right foot forward beneath you. Use a soft, quick knee touch, not a hard strike into the mat.',
        'Press through that right foot and bring your torso upright onto both feet. Keep elbows close; the rider follows and frees the thigh contact.',
        'Check balance before the finish. For the linked B21 drill, establish your right hand around the rider’s right waist hand, hands separate. Then use B21’s hip clearance and right turn. If the surviving grip differs or the thigh is still caught, pause and reset rather than twist.',
        'Finish the learning repetition at balanced standing or the separately taught escape. Both release, then lower or reset separately; no partner mat return.'
      ],
      cues: ['Hands and feet support you.', 'Soft inside knee; outside foot up.', 'Stand balanced, then clear hands.'],
      drill: 'Original 6-minute lesson: 1 minute demonstration and balance check; 1 minute solo knee-to-foot exchanges; 2 minutes alternating cooperative rises; 1 minute check B21’s standing hand position; 1 minute recap. One attempt per 20-second turn; pause in standing and use the remaining time for feedback and role swap.',
      boundary: 'No head-supported tripod, knee slam, forced rise against a trapped thigh, locked hands, pulling back, lifting or mat return. Reduce rider pressure if the outside foot cannot carry the wrestler’s weight. Stop for knee, wrist or shoulder discomfort.',
      error: 'Bottom drops the knee and stays there, or tries to rise before the outside foot is underneath.',
      fix: 'Rehearse without a rider: soft knee touch, outside foot plants, chest rises. Add only following contact once balance is repeatable.',
      video: {url: 'https://coachesinsider.com/wrestling/spiral-ride-defense-with-dakota-bauer-colorado-school-of-mines/', title: 'Spiral Ride Defense — knee-dip component', channel: 'Dakota Bauer / Coaches Insider', format: 'video', match: 'component', note: 'Use 1:26–2:27 for the knee dip and outside-foot rise. Transcript and checkpoints at 1:36, 1:41, 1:51, 1:56, 2:01 and 2:26 were reviewed. Full continuous audio was not. Soft-contact wording, paused standing endpoint and B21 grip check are youth teaching adaptations.'},
      sources: [{title: 'Dakota Bauer — Spiral Ride Defense', url: 'https://coachesinsider.com/wrestling/spiral-ride-defense-with-dakota-bauer-colorado-school-of-mines/'}],
      verification: 'Public transcript and visual positions reviewed on 2026-10-24. The inside-knee/outside-foot exchange and pressure cue are demonstrated. The controlled endpoint, B21 grip check, practice clock and receiving limits are original Grindstone adaptations; the source’s later finger-peeling arm-trap branch is excluded.',
      series_id: 'S41', role: 'option', branch: {title: 'Rise from a balanced tripod', when: 'Hands and feet support the wrestler, with insufficient drive for the full changeover.', action: 'Dip the inside knee, plant the outside foot and rise; verify hand control before an escape finish.', readiness: 'Pain-free knee contact, stable standing and cooperative rider.'}
    }
  ],
  placements: {'youth-5': ['S41'], 'youth-6': ['S41'], 'older-5': ['S40', 'S41'], 'older-6': ['S40', 'S41']},
  research_status: {
    promoted: [
      {proposal: 29, series_id: 'S40', status: 'partial', scope: 'One specific cross-wrist clearance joined to two existing exits. Other wrist rides and elbow-roll clearances remain unverified.'},
      {proposal: 31, series_id: 'S41', move_ids: ['N55', 'N56'], status: 'ready-for-preview', scope: 'Free Bauer demonstration supplies two distinct responses. The later arm-trap/finger-control branch is not included.'}
    ],
    resolved: [
      {
        id: 'Tight-waist hip-down and clear-to-escape', proposal: 30,
        title: 'Tight-waist hip-down: relieve pressure, then work to escape', status: 'clarified', resolved_on: '2026-10-24',
        resolution: 'Hip down to take pressure off the tight waist, recover a usable base, then continue an escape you already know. The hip-down creates room to work; hand control and finishing come from the chosen escape.',
        resolution_source: 'Coach clarification, October 24, 2026: the purpose is pressure relief so the wrestler can work into the familiar escapes. The earlier request for a special waist-hand clearance was an unnecessary requirement.',
        next_step: 'Use B16 if recovering from belly-down, then B17 for a standing escape or B18 followed by B19 for a sit-out and hip-heist. The pressure relief does not mean the rider’s grip is automatically gone. This clarification resolves Q02; it does not claim a new standalone series is complete.',
        evidence_note: 'The Kolat hip-down clip was inspected at 0:11, 0:23 and 0:30. It supplies the pressure-management component; the linked escape guides supply their own hand control and finish. No further coach answer is needed for this correction.',
        sources: [{title: 'Cary Kolat — hip-down demonstration', url: 'https://www.youtube.com/watch?v=SjpLcAtARqI'}, {title: 'Cary Kolat — clearing rides to escapes', url: 'https://www.kolat.com/practice-plans/training-session-bottom-clearing-rides-to-heist-stand-up'}],
        guide_links: [{label: 'B16 · Recover your base when needed', href: '#move/B16'}, {label: 'B17 · Standing escape', href: '#move/B17'}, {label: 'B18 · Sit-out', href: '#move/B18'}, {label: 'B19 · Hip-heist escape', href: '#move/B19'}]
      },
      {
        id: 'Switch / re-switch step-over continuation', proposal: 32,
        title: 'Step-over counter to a switch or re-switch', status: 'clarified', resolved_on: '2026-10-24',
        resolution: 'The wrestler being switched on moves their hips over the opponent to take away the switch leverage and regain top position. The same counter applies during a re-switch: the roles change, so the original switcher may now be the wrestler who steps over.',
        resolution_source: 'Coach clarification, October 24, 2026: this is a counter by the wrestler whose arm or shoulder is receiving the switch pressure. It does not require the far-arm catch assumed in the earlier question.',
        next_step: 'Use the new N57 step-over guide and S42 Switch and counter choices. Teach the counter from an established switch attempt, then show the same role change during a re-switch. B20 and A17 supply the existing switch and re-switch instructions; this is not a requirement to perform three moves in a fixed order.',
        evidence_note: 'The coach confirmed that the re-switch/hip-over video works for the whole series and clarified who performs the counter. That shared demonstration now supports S42 and N57. The agent previously sampled the clip at 0:24, 0:30, 0:35 and 0:40; continuous full footage/audio review is not claimed. Q03 no longer needs a coach answer.',
        sources: [{title: 'Daryl Weber — step-over counter', url: 'https://attackstylewrestling.com/stepover/'}, {title: 'Daryl Weber — escapes and reversals outline', url: 'https://www.attackstylewrestling.com/wp-content/uploads/2014/04/escapes_and_reversals.pdf'}],
        guide_links: [{label: 'S42 · Switch and counter choices', href: '#season?view=series&series=S42'}, {label: 'N57 · Step-over counter', href: '#move/N57'}, {label: 'B20 · Switch context', href: '#move/B20'}, {label: 'A17 · Re-switch context', href: '#move/A17'}]
      }
    ],
    held: [
      {proposal: 33, title: 'Established leg-ride defense', sources: ['https://www.attackstylewrestling.com/leg-riding-defense/', 'https://www.attackstylewrestling.com/wp-content/uploads/2014/04/escapes_and_reversals.pdf', 'https://www.kolat.com/4-to-6-year-teaching-curriculum.html'], attempted_alternatives: 'Free creator article and outlines reviewed; focused free-source search found named swim/hip-bounce and prevention curricula but no verified complete matching demonstration in this pass. No paid lesson was accessed.', known: 'Prevention, one-leg swim and hip-bounce are distinct subjects. They should not share a universal escape description.', missing: 'Exact inserted-leg configuration, upper-body control, support hand and release during each established-leg answer.', coach_question: 'Which established leg ride should we teach first, and can you show its leg/arm start, first clearance and stop point before any power-half pressure?'},
      {move_id: 'A11', title: 'Two-hand elbow-lift single-leg kickout video', sources: ['https://fanaticwrestling.com/blogs/news/single-leg-defense-with-henry-cejudo', 'https://fanaticwrestling.com/blogs/news/high-up-single-leg-defense-with-hayden-zillmer'], attempted_alternatives: 'Focused free-source search checked elbow-lift candidates. Cejudo uses linked hands over the arms; Zillmer uses a high-leg position. Neither establishes the written A11 separate-hand low-leg start.', known: 'A11’s written guide is preserved; S30 already contains the broader standing-defense family.', missing: 'A free demonstration matching two separate elbow cups, head-inside low capture and downward/backward leg clearance.', coach_question: 'Can you demonstrate A11’s separate elbow grips and low-leg clearance, or identify a free clip with that exact start? Do not substitute the linked-hand Cejudo variant silently.'}
    ]
  }
};
