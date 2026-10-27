/* Western ride: the ankle hook is the foundation; the stack is one option. */
(() => {
  'use strict';
  const groups = ['7-10', '11-14'];
  const daly = {
    title: 'Jeff Daly - Three Quarter Nelson Wrestling Move',
    url: 'https://www.youtube.com/watch?v=8_H2V9wa1as',
    note: 'The Western ankle-hook setup at about 0:20-0:35 is the foundation the coach confirmed. The later three-quarter nelson is a separate turn from it. Setup and turning checkpoints were visually inspected; continuous audio review is not claimed.'
  };
  const rules = {
    title: 'USA Wrestling - current rulebook',
    url: 'https://www.usawmembership.com/usa_wrestling_rule_book',
    note: 'Folkstyle section 25.5 permits a three-quarter nelson with a leg hook; section 25.6 requires stopping undue pressure on the head, neck or joints. Apply the actual event rules and modifications.'
  };
  const reality = {
    title: 'Reality Sports - Wrestling Technique of the Week: Extended Iowa Ride',
    url: 'https://www.youtube.com/watch?v=OREDeBsXK7U',
    note: 'Matt Sencenbaugh demonstrates an extended ankle-hook ride. The publisher explicitly identifies a deep tight-waist answer when bottom counters down with the trapped leg. Positions around 2:07-2:27 and 4:17-4:44 were visually inspected; continuous audio/transcript review is not claimed. This guide uses the waist-breakdown component, not the separate Turk finish.'
  };
  const moves = [
    {
      id: 'N58', name: 'Western Ride', category: 'top', tier: 'Beginner',
      age_groups: [...groups], positions: ['top'], purposes: ['ride'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
      aliases: ['Western hook', 'ankle-hook ride', 'Iowa ride', 'overleg'],
      purpose: 'Control the opponent\'s ankle with your same-side leg while staying connected on top. This is the common starting control for the Western Ride Series, not a pin by itself.',
      prerequisite: 'A controlled top ride, comfortable hands-and-knees support, and immediate release. The coach checks that the ankle can be hooked without sideways pressure through the partner\'s knee.',
      setup: 'Bottom starts on hands and knees. Top kneels beside the hips, both facing the same direction. Near means the side beside the rider. Use the rider\'s same-side leg to hold that near ankle, as shown in the linked setup; do not insert a deep boot around the thigh.',
      steps: [
        'Stay beside the hips with light chest contact over the back and a hand supporting control at the waist or upper arm. Bottom keeps the elbows soft and the head clear of the mat.',
        'Lift the near ankle just enough with your free hand to make space for the same-side leg. Keep the partner\'s knee pointing in its natural direction rather than pulling the foot sideways.',
        'Place that leg over and around the lower leg so your bent leg catches the ankle. Transfer the ankle from your hand to the leg hook; the foot is held, not squeezed into a joint lock.',
        'Settle your weight beside and over the hips while maintaining upper-body contact. Check that the ankle is held and your hands are available for the next move. Keep enough support in your free knee or foot to move with the partner.',
        'For this first lesson, pause at the hook and release it. Once the control is familiar, choose a separately taught breakdown or turn from the series. Unhook before either wrestler stands or changes to an unplanned position.'
      ],
      cues: ['Same-side leg holds the ankle.', 'Stay connected above the hips.', 'Hook is the start, not the finish.', 'Unhook before the reset.'],
      drill: 'Four-minute first lesson: 1 minute demonstration and knee-alignment check; 2 minutes alternating ankle-to-hook transfers, one controlled attempt per 20-second turn; 1 minute each wrestler names the hooked ankle and shows a clean release. Later review can take 1-2 minutes before a branch; do not spend the block merely holding a partner down.',
      boundary: 'No sideways knee twist, ankle submission, high leg yank, standing while the ankle stays trapped, or surprise roll. Release for discomfort or a caught limb. The rider must work toward a breakdown or turn in wrestling; simply keeping the hook is not the lesson\'s scoring objective.',
      error: 'Top confuses the hook with a deep leg ride, or tries to secure it by twisting the partner\'s foot sideways.',
      fix: 'Remove the hook. Return to the supported ankle-to-leg transfer shown around 0:20-0:35, check the knee direction, and use only enough contact to retain the ankle.',
      video: {url: 'https://www.youtube.com/watch?v=8_H2V9wa1as&t=20s', title: 'Western ride setup within Three Quarter Nelson Wrestling Move', channel: 'Jeff Daly', format: 'video', match: 'component', note: 'Watch the ankle control at about 0:20-0:35. The coach confirmed this same-side leg/ankle relationship is the intended Western ride. The later stack has its own N59 card.'},
      sources: [daly, {title: 'Bo Nickal - Ankle Ride With Bo Nickal', url: 'https://fanaticwrestling.com/blogs/news/ankle-ride-with-bo-nickal', note: 'Supplementary publisher explanation of forward pressure and trapping the ankle in the bent leg. Its knee-block entry is not substituted for the manually established Daly setup taught here.'}],
      verification: 'Checked 2026-10-27. Daly\'s ankle-hook setup was visually inspected, and the coach explicitly confirmed that Western ride means holding the ankle with the same-side leg. The stack is not the definition of the ride. Iowa ride and overleg are search aliases used by some teaching sources for related ankle-hook variations; they are not a claim that every technique carrying those names uses identical grips. The supported entry practice, timing and stop conditions are Grindstone coaching design.',
      series_id: 'S43', role: 'foundation'
    },
    {
      id: 'N59', name: 'Three-Quarter Nelson Stack from Western Ride', category: 'top', tier: 'Intermediate',
      age_groups: [...groups], positions: ['top'], purposes: ['ride', 'turn', 'pin'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
      aliases: ['3/4 nelson stack', 'Western hook stack', 'three quarter nelson'],
      purpose: 'Use the Western ankle hook to limit the bottom wrestler\'s leg movement while a three-quarter nelson turns them onto their shoulders.',
      prerequisite: 'N58 Western ankle control, a familiar half nelson and controlled pinning pressure. Both wrestlers can follow a slow turn, identify uncomfortable neck or knee pressure, and release immediately. Teach the grip and receiving separately before joining them.',
      setup: 'Start beside a cooperative partner on hands and knees with the N58 Western ankle hook already established. Keep the hooked knee comfortably aligned. The coach demonstrates the under-chest hand route before anyone turns.',
      steps: [
        'Keep the Western hook while settling beside the partner. Apply a near-side half nelson: thread under the near armpit and place the hand behind the head.',
        'Send the free arm beneath the chest and out under the far armpit, then join the hands behind the head. This crosses beneath the chest; it is not an arm laid across the throat and it is not a full nelson from behind.',
        'Stay close to the shoulder and move your body as you guide the turn. Walk the free knee and foot forward toward the head while the hook limits the leg. Do not jerk the head or wrench the hooked knee.',
        'Continue only as the partner can roll smoothly onto the shoulders. Follow with balanced chest pressure and a wide base. Stop the repetition if the head becomes a fixed weight-bearing post or the neck folds under pressure.',
        'Pause briefly at the controlled stack. Ease the head-and-arm grip, unhook the ankle without twisting it, and let the partner return to base. Reset rather than forcing a blocked turn.'
      ],
      cues: ['Hook first; turn second.', 'Under the chest, then behind the head.', 'Walk your body; no neck pull.', 'Shoulders settle; release and reset.'],
      drill: 'Six-minute introduction: 1 minute demonstration; 1 minute hook-and-grip checks without turning; 3 minutes alternating slow turns, one controlled attempt and reset per 30-second turn; 1 minute feedback. Progress to an announced N58-to-N59 choice only after both partners can complete and receive the movement comfortably. This is not six minutes of holding a stack.',
      boundary: 'Direct coach supervision for the first turns. No throat pressure, forearm choke, full nelson, forced neck bend, head-first drive, knee twist or jumping bodyweight. A stop signal ends the repetition immediately. Do not resist a fully set stack with the neck during learning. Pups retain their simpler familiar breakdown and half-nelson lessons rather than this default stack assignment.',
      error: 'The wrestler tries to manufacture the turn by pulling the head downward while the body and hooked leg stay fixed.',
      fix: 'Release, rebuild the Western control and check the under-chest route. Rehearse the walking movement with a cooperative receiver; if the shoulders cannot turn freely, choose another taught option.',
      video: {url: daly.url, title: 'Three Quarter Nelson Wrestling Move', channel: 'Jeff Daly', format: 'video', match: 'direct', note: 'Western ankle setup around 0:20-0:35; three-quarter grip around 0:45-0:55; walking stack around 1:20-1:35. These portions were visually sampled; continuous audio/transcript review is not claimed.'},
      sources: [daly, rules, {title: 'NFHS illustrated warning - illegal side three-quarter nelson choke', url: 'https://www.wiaawi.org/Portals/0/PDF/Sports/Wrestling/NFHS-Assassin-KOLAT-B.pdf', note: 'Distinguishes the under-chest wrestling turn from a forearm vise around the neck. Do not substitute a front-headlock choke video for this stack.'}],
      verification: 'Checked 2026-10-27. Primary demonstration visually sampled at 0:20, 0:25, 0:35, 0:45, 0:50, 0:55, 1:10, 1:20, 1:25, 1:30 and 1:35. It connects Western ankle control to the stack. USA Wrestling folkstyle section 25.5 permits this combination; section 25.6 requires stopping undue head, neck or joint pressure. Event modifications still apply. Readiness, drill timing, receiving and reset guidance are Grindstone teaching design.',
      series_id: 'S43', role: 'option',
      branch: {title: 'Three-quarter nelson stack', when: 'The Western hook is established and the checked under-chest grip is available while bottom stays on a controlled base.', action: 'Connect the three-quarter nelson, walk the turn and settle the shoulders.', readiness: 'Familiar Western hook and half nelson; controlled turning and immediate release.'}
    },
    {
      id: 'N60', name: 'Western Ride to Tight-Waist Breakdown', category: 'top', tier: 'Intermediate',
      age_groups: [...groups], positions: ['top'], purposes: ['ride', 'breakdown'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
      aliases: ['Iowa ride deep tight waist', 'ankle hook breakdown'],
      purpose: 'Use the waist to break the opponent back down when they press the hooked leg toward the mat. Keep the Western control useful without trying to force a stack.',
      prerequisite: 'N58, a comfortable separate-hand tight waist, and the ability to lower from base to the forearms and belly under following pressure. The coach first shows how the waist and body pressure work together.',
      setup: 'Begin beside bottom\'s hips with the same-side Western ankle hook. Move your weight forward over the back just enough to raise the hooked ankle slightly; bottom stays supported on both hands and the other knee, with movable elbows. This small lift sets up the leg-down reaction and does not redefine the basic ride. Top has one hand at the near shoulder or upper arm and the other available for the waist. Bottom announces a gentle lowering of the hooked leg; no hard kick or scramble.',
      steps: [
        'Feel the partner bring the hooked leg back down. Follow it with your leg instead of trying to win a lifting contest through the knee. Stay connected over the hips.',
        'Reach your waist arm deeply around the belly toward the far side of the waist. Draw that elbow close to your ribs. Keep the other hand at the near shoulder or upper arm so the shoulders travel with the hips; the hands stay separate.',
        'Bring your chest forward over the back while drawing the waist toward you. Move your body with that pull to take the hips out of their square base. Use steady pressure rather than a jerk on the waist or trapped ankle.',
        'Bottom follows by bending the elbows and lowering to the forearms, then the belly. Follow the shoulders and hips into balanced top control, using the free knee or foot as support. Keep the hooked knee comfortable as the bodies settle.',
        'Pause when bottom is controlled on the belly. This card ends at the breakdown. Ease the waist pressure, free the ankle and reset; add a familiar pin in another block after the breakdown is dependable.'
      ],
      cues: ['Leg comes down: go to the waist.', 'Elbow in; chest stays connected.', 'Move the hips and shoulders together.', 'Belly down, then choose the next move.'],
      drill: 'Six-minute lesson: 1 minute demonstration; 1 minute waist-and-shoulder position checks with no breakdown; 3 minutes alternating announced leg-down reactions, one controlled breakdown and reset per 30-second turn; 1 minute recap. When reviewing, start at the hook and make only the leg-down response. Do not add a pin or a live stand-up during this introduction.',
      boundary: 'Keep the hands separate and throat clear. No sideways knee pressure, forced ankle lift, straight-arm collapse or sudden drop onto the partner. Stop and unhook if the partner stands, a limb becomes trapped or either wrestler feels discomfort.',
      error: 'Top keeps pulling the ankle higher after bottom presses the leg down, or pulls the waist while the chest drifts away.',
      fix: 'Reset with a lighter hook. Rehearse the waist reach and close chest position first, then let bottom lower under steady body pressure. The ankle anchors the control; the waist-and-body action creates the breakdown.',
      video: {url: 'https://www.youtube.com/watch?v=OREDeBsXK7U&t=240s', title: 'Extended Iowa Ride - deep tight-waist breakdown', channel: 'Matt Sencenbaugh / Reality Sports', format: 'video', match: 'component', note: 'Use the deep tight-waist response beginning around 4:00. The publisher names the leg-down reaction, and sampled positions show the hook retained, waist reach, turning body pressure and controlled top endpoint. The earlier Turk is a different option, not the instruction on this card.'},
      sources: [reality],
      verification: 'Checked 2026-10-27. The publisher description explicitly identifies the deep tight-waist response to the trapped leg being pressed down. Decoded visual checkpoints at 4:17, 4:22, 4:24, 4:34 and 4:44 support the hook, waist/shoulder contact and breakdown endpoint; a second review checked 4:19, 4:29 and 4:34. Continuous audio and a complete transcript were not reviewed. The text does not add a hidden far-side wrist lock, a pin or the separate Turk. Announced receiving, timing and resets are Grindstone coaching design.',
      series_id: 'S43', role: 'option',
      branch: {title: 'Tight-waist breakdown when the leg comes down', when: 'Bottom presses the hooked leg down while the rider remains beside the hips with a clear waist reach.', action: 'Follow the leg down, control the waist and shoulders, and bring bottom to a controlled belly-down position.', readiness: 'Comfortable Western hook, separate-hand tight waist and cooperative lowering from base.'}
    }
  ];

  const series = {
    id: 'S43', title: 'Western Ride Series', position: 'top', positions: ['top'],
    purposes: ['ride', 'breakdown', 'turn', 'pin'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
    age_groups: [...groups], tier: 'Beginner', minutes: 12,
    summary: 'One ankle control, two choices: build the three-quarter nelson stack when the arm route is open, or use a tight-waist breakdown when the opponent presses the hooked leg down. The Western ride is the same-side leg holding the ankle; the stack is one move from that foundation.',
    foundation: 'N58: begin beside the hips and hold the opponent\'s near ankle with the same-side leg, as shown in Daly\'s setup. Keep upper-body contact, a movable supporting knee or foot, and a comfortable knee line. Neither a three-quarter nelson nor a deep boot is required to establish this ride.',
    setup: 'Teach N58, N59 and N60 individually before using the full choice lesson. Begin the first repetitions already at the Western hook. For the stack, bottom keeps a cooperative base with the checked under-chest grip available. For the breakdown, first establish N60\'s lightly raised ankle with forward riding pressure; bottom then announces a gentle leg-down response while top has a clear waist reach. These are two alternative problems to solve, not a mandatory stack-then-breakdown chain.',
    members: [
      {move_id: 'N58', role: 'Foundation', note: 'Establish the same-side ankle hook and controlled release. The ride itself is the shared control, not the stack.', tier: 'Beginner', age_groups: [...groups]},
      {move_id: 'N59', role: 'Option', note: 'Three-quarter nelson stack when the checked arm route and receiving position are available.', tier: 'Intermediate', age_groups: [...groups]},
      {move_id: 'N60', role: 'Option', note: 'Tight-waist breakdown when bottom presses the hooked leg down; stop at controlled belly-down top.', tier: 'Intermediate', age_groups: [...groups]}
    ],
    branches: [
      {title: 'Stack from a stable base', when: 'The hook is secure, bottom remains on a controlled base and the under-chest route for N59 is available.', action: 'Build the checked three-quarter nelson, walk the turn and settle the shoulders. Release before resetting.', move_ids: ['N59'], tier: 'Intermediate', age_groups: [...groups], readiness: 'N59 was taught separately; both wrestlers can follow the turn and release without neck or knee strain.'},
      {title: 'Break down the leg-down response', when: 'Bottom presses the hooked leg down and the rider can reach the waist while staying connected over the hips.', action: 'Use N60\'s deep tight waist and following body pressure to regain belly-down control. End there; a pin is a later decision.', move_ids: ['N60'], tier: 'Intermediate', age_groups: [...groups], readiness: 'N60 was taught separately; bottom can bend the elbows and lower smoothly while the knee stays comfortable.'}
    ],
    steps: [
      'Minutes 0-2: review N58. Each wrestler establishes the hook, names the controlled ankle and releases it. If the hook is unfamiliar, use the individual N58 lesson before this choice block.',
      'Minutes 2-4: review the announced N59 stack. One slow attempt per 30-second turn, including release, feedback and swapping roles. Begin from the checked grip, not a race to force it.',
      'Minutes 4-6: review N60. Bottom announces leg down; top follows to the waist and controlled breakdown. Alternate one attempt per 30-second turn and stop at belly-down control.',
      'Minutes 6-10: eight 30-second turns per pair. Bottom announces one of the two rehearsed openings; top names and uses the matching option. Allow up to 15 seconds for the exchange and use the rest for release and role change. Move to unannounced choices only after both answers are dependable.',
      'Minutes 10-12: each wrestler repeats the less familiar choice once, then explains the shared ankle control and one reason to reset. Put extra teaching or a linked pin in another builder slot rather than rushing it into the recap.'
    ],
    cues: ['Same hook; choose the opening.', 'Open arm route: stack.', 'Leg down: waist breakdown.', 'Finish one answer, release, reset.'],
    move_ids: ['N58', 'N59', 'N60'],
    readiness: 'Beginner foundation: learn the Western ankle hook and release first. The stack and leg-down breakdown are separately taught Intermediate options for prepared 7-10 and 11-14 pairs. Add the choice drill after both answers and partner receiving are dependable; coaches can select just one option today. Pups continue with their familiar basic rides, breakdowns and halves.',
    boundaries: 'Keep the hooked knee comfortable and release on any stop signal. Do not drive through a blocked shoulder, fixed head or twisted knee. The first practice choices are cooperative and announced. A standing escape, scramble or unfamiliar grip ends the repetition so both wrestlers can unhook and reset.',
    verification: 'Reviewed 2026-10-27. The coach confirmed the Western ride as same-side leg control of the ankle, explicitly separate from the stack. Daly supplies the hook-to-stack branch; Reality Sports explicitly names and visually shows the deep tight-waist answer from the related extended ankle-hook position. Review used visual checkpoints and publisher text, not complete continuous audio. This two-choice practice, timing and readiness guidance are original Grindstone coaching design.',
    sources: [daly, reality, rules]
  };

  for (const item of [series, ...moves]) {
    for (const source of item.sources || []) source.accessed = '2026-10-27';
  }

  window.GRINDSTONE_SERIES_WESTERN = {
    reviewed: '2026-10-27',
    series: [series],
    moves,
    placements: {'youth-5': ['S43'], 'youth-6': ['S43'], 'older-4': ['S43'], 'older-5': ['S43']},
    research_status: {
      promoted: [{series_id: 'S43', move_ids: ['N58', 'N59', 'N60'], status: 'ready-for-preview', scope: 'Coach-confirmed Western ankle hook with two separately taught outcomes: three-quarter nelson stack and a tight-waist breakdown to the leg-down response.'}],
      held: [{id: 'western-extended-turk', research_update: 'Continue reviewing the hand transfer and finish before writing the Turk guide. The existing Western ride, stack and leg-down breakdown are separate usable lessons; no coach reply is needed for research to continue.', guide_links: [{label: 'Western Ride Series', href: '#season?view=series&series=S43'}], title: 'Extended Western hook to a Turk turn', sources: [reality.url], known: 'The publisher names the Turk option and sampled footage shows an elevated ankle hook with crossface/shoulder contact.', missing: 'A fully resolved hand-transfer and finishing sequence for a standalone written guide. The basic Western hook and deep tight-waist response do not establish every Turk detail.', attempted_alternatives: 'Reality Sports extended Iowa ride was visually sampled. This branch is retained as a research lead rather than silently discarded or added as an unverified full move.', backlog_moves: ['Western ride to extended-hook Turk']}]
    }
  };
})();
