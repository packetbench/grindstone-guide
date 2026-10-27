/* One inserted leg: distinct from Western ankle control and the Navy arm scoop. */
(() => {
  'use strict';
  const groups = ['7-10', '11-14'];
  const weber = {
    title: 'Daryl Weber / Attack Style Wrestling - Leg Riding Wrestling Series',
    url: 'https://attackstylewrestling.com/leg-riding-series/',
    note: 'Primary written lesson describes a shallow inserted leg, extension breakdown, figure-four hip-over and responses to a posted arm. Its public embedded demonstration is Vimeo 473939084. Written instruction and decoded checkpoints at 2:14, 3:49, 4:14, 6:14, 8:14 and 10:14 reviewed. These samples supplement the written instructions; they are not a continuous audio review. The coaching schedule and release drills below are original Grindstone teaching design.'
  };
  const weberVideo = {
    title: 'Attack Style Wrestling - Leg Riding Wrestling Series demonstration',
    url: 'https://attackstylewrestling.com/leg-riding-series/',
    note: 'The creator page plays the embedded 25:01 lesson; the direct Vimeo player is restricted by its privacy setting. Decoded foundation, breakdown and hip-over checkpoints were inspected at 2:14, 3:49, 4:14, 6:14 and 8:14. The full lesson was not continuously watched or transcribed.'
  };
  const ciasulli = {
    title: 'Seth Ciasulli - Cross-Body Ride (One Leg In)',
    url: 'https://www.sethciasulli.com/lessons/cross-body-ride-one-leg-in',
    note: 'Primary written foundation distinguishes an inserted same-side leg with weight across the opponent and a far-side arm anchor. Its paid companion lessons are not represented as free demonstrations. This source supplies foundation context, not every branch instruction.'
  };
  const taylor = {
    title: 'Hudson Taylor / Fanatic Wrestling - Ride Legs and Pin with Hudson Taylor',
    url: 'https://fanaticwrestling.com/blogs/news/ride-legs-and-pin-with-hudson-taylor',
    note: 'Primary publisher explanation specifies a left inserted leg, far-armpit anchor, a posting-arm response and a later transition toward a half nelson. The N68 card stops at the one-leg tilt; it does not silently add the later second-hook finish.'
  };
  const taylorVideo = {
    title: 'Hudson Taylor - Cross-body leg-riding demonstration',
    url: 'https://www.youtube.com/watch?v=AC0tVNajmVQ',
    note: 'Direct video recovered from the public publisher embed. The written description was compared with decoded footage at 0:19, 0:49, 1:19 and 1:29: inserted-leg position, arm-post response and tilt exposure. Continuous audio review is not claimed.'
  };

  const moves = [
    {
      id: 'N65', name: 'One-Leg Cross-Body Ride', category: 'top', tier: 'Intermediate',
      age_groups: [...groups], positions: ['top'], purposes: ['ride'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
      aliases: ['one boot in', 'cross-body leg ride', 'single-leg ride'],
      purpose: 'Use one inserted leg and an opposite-side arm anchor to control the hips while keeping the rider balanced above the opponent.',
      prerequisite: 'A familiar breakdown and top ride, controlled hip contact, and the ability to open the leg immediately on a stop signal. The first lesson ends at a balanced position and release.',
      setup: 'Bottom begins on hands and knees with a comfortable gap for the entry. Top is behind and slightly to bottom\'s left. Both face the same head end. The following example uses top\'s left leg around bottom\'s left leg; mirror every limb together when practicing the other side.',
      steps: [
        'Shift the partner\'s weight gently forward to open the space beside the left hip. Insert your left leg between the thighs and hook around the outside of the partner\'s left leg. Do not hop onto a standing partner.',
        'Keep your left knee outside the partner\'s left hip and your own hips above the mat. Set your weight across the partner\'s back rather than hanging off the left side.',
        'Reach your left arm beneath the chest to anchor at the right armpit. Keep the other arm available to support balance or collect a separately taught control. The anchor is at the upper arm, not across the throat.',
        'Check that the inserted leg, hip contact and far-arm anchor work together. Use small, announced weight shifts while bottom keeps a cooperative base. If your hips slip to the mat, stop and rebuild rather than pulling harder with the leg.',
        'For this first lesson, remove the arm anchor, open the boot and return to a basic top position. Add a breakdown or turn only after both partners can identify the leg relationship and release cleanly.'
      ],
      cues: ['Left boot around left leg.', 'Hips stay up; weight goes across.', 'Anchor the far upper arm.', 'Open the boot before resetting.'],
      drill: 'Four-minute introduction: 1 minute demonstration; 2 minutes alternating one cooperative entry, balance check and release per 20-second turn; 1 minute each partner shows the same-side leg relationship. On a later day, a 1-2 minute review is enough before a familiar option. This is not four minutes of holding a partner in a boot.',
      boundary: 'No jumping entry, ankle crank, sideways knee twist or surprise roll. Stop if either wrestler stands, a limb becomes fixed, or the rider loses control of the partner\'s weight. Keep this introduction separate from a power half or other neck-control finish.',
      error: 'The rider hangs outside the inserted-leg side and tries to stay attached by squeezing the ankle.',
      fix: 'Open the boot and return to a supported start. Rebuild the across-body weight and far-arm anchor before adding the leg again. Shorten the balance drill until the rider can stay above the hips.',
      video: {url: taylorVideo.url, title: 'Cross-body ride setup with Hudson Taylor', channel: 'Hudson Taylor / Fanatic Wrestling', format: 'video', match: 'component', note: 'Use the opening one-leg setup. The source later adds a posted-arm tilt and a second-hook finish; those are separate decisions. Foundation and response checkpoints at 0:19, 0:49, 1:19 and 1:29 were visually sampled.'},
      sources: [ciasulli, taylor, taylorVideo],
      verification: 'Written primary sources reviewed 2026-10-27. Ciasulli describes the inserted same-side leg and across-body balance; Taylor\'s publisher specifies the left-leg/far-armpit example used here. Decoded source positions were sampled; continuous audio review is not claimed. Entry timing, cooperative balance checks and reset progression are original Grindstone coaching design. This is not the Western ankle hook or Navy far-thigh arm scoop.',
      series_id: 'S45', role: 'foundation'
    },
    {
      id: 'N66', name: 'One-Leg Ride Extension Breakdown', category: 'top', tier: 'Intermediate',
      age_groups: [...groups], positions: ['top'], purposes: ['ride', 'breakdown'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
      aliases: ['boot-in extension breakdown', 'leg-ride flattening'],
      purpose: 'Use the inserted leg with forward hip pressure to lower a cooperative opponent from base to the belly.',
      prerequisite: 'N65 with stable hips and an immediate boot release. Bottom can lower through bent elbows without posting on locked arms.',
      setup: 'Start with the left boot already inserted as in N65. Bottom remains on hands and knees. Top keeps the upper body connected and checks that the left foot can control the partner\'s lower left leg without twisting the knee.',
      steps: [
        'Set the laces of the inserted foot against the partner\'s ankle. Keep upper-body contact while your free foot or knee supports your balance.',
        'Lengthen the controlled leg backward as you move your own hips forward into the partner\'s hips. Let the body pressure and leg extension act together; do not pull the foot sideways.',
        'Bottom bends the elbows and follows down toward the forearms and belly. Continue only through the range that both wrestlers can control.',
        'Settle above the hips with the partner belly-down. Stop the action here; exposing the back or adding a pin is a separate lesson.',
        'Ease the pressure, open the boot and let bottom rebuild the base. Both partners should be ready for the next repetition before the leg goes back in.'
      ],
      cues: ['Leg lengthens; hips move forward.', 'Keep the knee in line.', 'Follow down, then stop.', 'Belly down is today\'s finish.'],
      drill: 'Four-minute introduction: 1 minute demonstration; 2 minutes alternating one slow lowering and reset per 30-second turn; 1 minute feedback. Use an offered base at first. Later add a small, announced attempt to keep the knees underneath, without standing or scrambling.',
      boundary: 'Do not wrench the knee, stretch the groin, yank the ankle or drive onto a straight posting arm. Use steady following pressure. Release if the partner cannot lower comfortably or the rider must jump or drop weight to finish.',
      error: 'The rider pulls the trapped leg away while leaving the hips behind, separating the two parts of the breakdown.',
      fix: 'Reset without resistance. Rehearse a shorter simultaneous hip movement and leg extension, stopping as soon as bottom lowers. Restore body contact before attempting more range.',
      video: {url: weberVideo.url, title: 'Leg Riding Wrestling Series - basic breakdown', channel: 'Daryl Weber / Attack Style Wrestling', format: 'video', match: 'component', note: 'The creator\'s written Step 2 describes the extension breakdown. Use only that component, not an unspecified later turn. The lowering positions at 3:49 and 4:14 were visually sampled alongside the written instructions.'},
      sources: [weber, weberVideo],
      verification: 'Written primary instruction reviewed 2026-10-27. The creator explicitly connects ankle-level foot contact, leg extension and hip pressure in the basic breakdown. Decoded source positions were sampled; continuous audio review is not claimed. The cooperative descent, timing and belly-down endpoint are Grindstone teaching design.',
      series_id: 'S45', role: 'option',
      branch: {title: 'Extend to a belly-down breakdown', when: 'Bottom stays on a supported base and the rider can lengthen the controlled leg while keeping the hips connected.', action: 'Use N66 to extend and follow forward until bottom settles on the belly, then stop and reset.', readiness: 'N65, comfortable lowering through bent elbows, and controlled pressure with the knee aligned.'}
    },
    {
      id: 'N67', name: 'One-Leg Ride Figure-Four Hip-Over', category: 'top', tier: 'Intermediate',
      age_groups: [...groups], positions: ['top'], purposes: ['ride', 'turn'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
      aliases: ['figure-four leg ride turn', 'leg-ride hip-over'],
      purpose: 'Keep one opponent leg controlled while turning the hips and shoulders together toward back exposure.',
      prerequisite: 'N65 and N66. The coach has checked the exact figure-four placement with both partners and both can receive a slow side-to-back turn.',
      setup: 'Begin in the established one-leg ride with bottom lowered and cooperative. Keep the inserted leg on the same side as N65. Teach the leg configuration without a turn before joining it to upper-body guidance.',
      steps: [
        'Bring the inserted heel higher toward the inner upper thigh. Fold your free leg over the boot foot so its laces rest in the bend of your other knee, forming the demonstrated figure four around the controlled leg.',
        'Keep your hips connected. Move the hips forward and lift your feet together to start turning the partner\'s hips, using only a small cooperative range at first.',
        'Guide the side of the head with an open hand as the whole body turns. The head and shoulders follow the hips; do not hold the head still while rotating the lower body.',
        'Follow to balanced top control with the back exposed. This card ends at the turn, before the source\'s additional pinning grip.',
        'Ease the head contact, open the figure four and remove the inserted leg. Let the partner return to base before changing roles.'
      ],
      cues: ['Check the leg shape first.', 'Hips and shoulders turn together.', 'Follow onto top.', 'Open both legs to reset.'],
      drill: 'Five-minute introduction: 1 minute demonstration; 1 minute leg-position checks without turning; 2 minutes alternating one short turn and release per 30-second turn; 1 minute feedback. Keep the first turns announced. A coach watches the leg configuration and receiving before any resistance is added.',
      boundary: 'No sideways knee loading, forced splits, neck twisting or falling bodyweight. The figure four controls a leg; it is not a joint submission. Stop when the body cannot turn together. The receiver does not try to hold the head or a trapped limb fixed against the mat.',
      error: 'The rider tightens the figure four and tries to turn the hips while the upper body stays stuck.',
      fix: 'Release the leg control, restore a cooperative position and rehearse a smaller whole-body turn. Confirm the receiver can move with it before rebuilding the figure four.',
      video: {url: weberVideo.url, title: 'Leg Riding Wrestling Series - figure-four hip-over', channel: 'Daryl Weber / Attack Style Wrestling', format: 'video', match: 'component', note: 'The matching written section is Step 3, Figure four hip over. This card stops at back exposure instead of adding the subsequent arm-hook pin. The hip-over and turned-control positions at 6:14 and 8:14 were visually sampled alongside the written instructions.'},
      sources: [weber, weberVideo],
      verification: 'Written primary sequence reviewed 2026-10-27: adjust the inserted heel, connect the figure four, turn through the hips and guide the upper body. The hip-over at 6:14 and turned control at 8:14 were visually sampled. The written creator section supplies the figure-four details; the coach must check that leg placement before turning. Coach checks, small-range receiving and timing are original Grindstone teaching design.',
      series_id: 'S45', role: 'option',
      branch: {title: 'Turn the hips from a checked figure four', when: 'The rider has learned the figure-four placement and bottom can turn the hips and shoulders together without a blocking post.', action: 'Use N67 to guide a controlled hip-over to exposure, follow onto top and release.', readiness: 'N65/N66 plus a coach-checked figure four and comfortable cooperative receiving.'}
    },
    {
      id: 'N68', name: 'One-Leg Ride Posted-Arm Tilt', category: 'top', tier: 'Intermediate',
      age_groups: [...groups], positions: ['top'], purposes: ['ride', 'turn'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
      aliases: ['cross-body posting-arm tilt', 'leg-ride post trap'],
      purpose: 'Use the opponent\'s posted arm as the opening for a tilt while retaining the one-leg ride.',
      prerequisite: 'N65, a comfortable wrist grip and a controlled side-to-side turn. Both partners can distinguish an offered post from a trapped, weight-bearing arm.',
      setup: 'Use the left-leg example from N65: top\'s left leg is inserted around bottom\'s left leg and the left hand anchors the right armpit. Bottom announces a sit toward the left hip. Rehearse the response cooperatively before presenting it as a choice.',
      steps: [
        'Keep the boot and far-arm anchor as bottom sits toward the left hip. Guide bottom toward the right side while staying connected at the hips.',
        'If bottom posts the right arm to stop that motion, reach your free right arm underneath and collect the posting wrist. Pause during the first repetitions to check the hand assignment.',
        'Bring your hips back in and redirect toward the left, carrying the captured arm with the body. The boot and wrist control guide one connected turn instead of pulling the arm away from the shoulder.',
        'Follow to a brief, controlled back exposure. Keep the leg and wrist supported; this card stops before the source changes to a second hook and half-nelson finish.',
        'Ease the turn, release the wrist and open the boot. Return to a supported starting position before changing roles.'
      ],
      cues: ['Feel the post.', 'Free hand catches the wrist.', 'Hips return; body turns together.', 'Exposure first, then reset.'],
      drill: 'Six-minute introduction: 1 minute demonstration; 1 minute checking the offered post and right-hand wrist catch without a turn; 3 minutes alternating one slow directional change and reset per 30-second turn; 1 minute feedback. Initially announce left hip, right post, then return. Remove the announcement only when each partner reliably follows the turn.',
      boundary: 'Do not wrench a straight elbow or pull a trapped wrist against the mat. If the post cannot be gathered comfortably, release and reset. No sudden roll onto the head or shoulder, ankle twist or surprise resistance through the captured arm.',
      error: 'The rider pulls the wrist by itself or changes directions before the post has been collected.',
      fix: 'Return to the offered-post drill. Check the right-hand wrist catch, bring the hips in, and rehearse a smaller connected direction change with a cooperative partner.',
      video: {url: taylorVideo.url, title: 'Hudson Taylor - posting-arm response from cross-body ride', channel: 'Hudson Taylor / Fanatic Wrestling', format: 'video', match: 'component', note: 'The primary publisher describes the hip-sit, posted-arm catch and redirected tilt. The later second-hook/half finish is outside this card. The post-and-arm control at 1:19 and tilt exposure at 1:29 were visually sampled.'},
      sources: [taylor, taylorVideo],
      verification: 'Written primary publisher sequence reviewed 2026-10-27. The described left-leg example supports the left-hip/right-post/redirected tilt relationship. The post control at 1:19 and exposure at 1:29 were visually sampled. No uninterrupted viewing or transcript review is claimed. The offered-post learning drill and release sequence are Grindstone coaching design.',
      series_id: 'S45', role: 'option',
      branch: {title: 'Collect the posting arm and redirect', when: 'Bottom sits toward the inserted-leg side and posts the far arm when guided the other way; that wrist can be collected comfortably.', action: 'Use N68 to retain the boot, collect the post with the free hand and redirect with the hips toward controlled exposure.', readiness: 'N65 plus a dependable offered-post catch and cooperative side-to-side receiving.'}
    }
  ];

  const series = {
    id: 'S45', title: 'One-Leg Riding Series', position: 'top', positions: ['top'],
    purposes: ['ride', 'breakdown', 'turn'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
    age_groups: [...groups], tier: 'Intermediate', minutes: 14,
    summary: 'Start with one actual boot inserted and the hips balanced across the opponent. Lower a supported base, turn from a checked figure four, or collect a posting arm and redirect. Each option has a separate lesson; the series is a choice practice after those lessons are familiar.',
    foundation: 'N65: one leg passes between the opponent\'s thighs and hooks the same-side leg. Weight and a far-arm anchor keep the rider across the back with the hips above the mat. This differs from Western ride\'s ankle control beside the hips and Navy ride\'s arm around a thigh.',
    setup: 'Use prepared, well-matched partners. Teach N65 and one option first; add the other options on later days. Begin choice practice already in the established boot, with the lower wrestler offering an announced base, turn or post. A change to two boots is a new position, not an invisible part of every answer.',
    members: [
      {move_id: 'N65', role: 'Foundation', note: 'Establish the inserted boot, across-body balance and clean release.', tier: 'Intermediate', age_groups: [...groups]},
      {move_id: 'N66', role: 'Option', note: 'Lower a supported base using coordinated extension and hip pressure.', tier: 'Intermediate', age_groups: [...groups]},
      {move_id: 'N67', role: 'Option', note: 'Use a separately checked figure four to turn the hips and shoulders together.', tier: 'Intermediate', age_groups: [...groups]},
      {move_id: 'N68', role: 'Option', note: 'Collect the offered posting wrist and redirect while retaining the boot.', tier: 'Intermediate', age_groups: [...groups]}
    ],
    branches: moves.filter(move => move.branch).map(move => ({...move.branch, move_ids: [move.id], tier: move.tier, age_groups: [...groups]})),
    steps: [
      'Minutes 0-2: review N65. Each partner shows the inserted leg, across-body balance and release. Use the individual foundation lesson instead if this is new.',
      'Minutes 2-4: review N66. Alternate one slow base-to-belly breakdown and reset per 30-second turn.',
      'Minutes 4-6: review the previously taught N67. Check the figure four before each small turn, then open it for the reset.',
      'Minutes 6-8: review N68 with an announced hip sit and offered post. Confirm which hand collects the wrist before redirecting.',
      'Minutes 8-12: eight 30-second turns per pair. Bottom offers one familiar situation; top names and uses one answer. Allow up to 15 seconds for an attempt and the rest for release, feedback and changing roles.',
      'Minutes 12-14: each partner repeats one useful choice and names its starting cue. Omit an untaught option rather than rushing it into the series. Use another builder slot for new teaching or an established-leg escape lesson.'
    ],
    cues: ['One boot; hips stay up.', 'Base, turning hips, or posted arm?', 'Choose one taught answer.', 'Open the leg for the reset.'],
    move_ids: ['N65', 'N66', 'N67', 'N68'],
    readiness: 'Intermediate because the rider must manage leg control, balance and a moving partner together. Suitable for prepared 7-10 and 11-14 wrestlers who already use basic rides and breakdowns; age alone does not establish readiness. No default Pups assignment. An older novice can still learn the foundation before taking on the turns. The optional figure four and posted-arm turn each need their own receiving rehearsal.',
    boundaries: 'Use cooperative, announced first repetitions and direct coach observation of new leg configurations. No forced joint motion, jumping entries, uncontrolled rolls or standing with a trapped leg. Release when control or comfort is lost. These folkstyle lessons are attempts to break down or expose the back, not an instruction to hold an unchanged leg ride indefinitely.',
    verification: 'Researched 2026-10-27 from primary written coaching material and sampled decoded demonstrations. Weber checkpoints cover the foundation, breakdown and hip-over; Taylor checkpoints cover the one-leg setup, posted-arm response and tilt exposure. Continuous audio review is not claimed. The practice choices, timing, receiving and reset drills are original Grindstone design.',
    sources: [ciasulli, weber, weberVideo, taylor, taylorVideo]
  };

  for (const item of [series, ...moves]) {
    for (const source of item.sources || []) source.accessed = '2026-10-27';
  }

  window.GRINDSTONE_SERIES_LEG_ONE = {
    reviewed: '2026-10-27', series: [series], moves,
    placements: {'youth-5': ['S45'], 'youth-6': ['S45'], 'older-4': ['S45'], 'older-5': ['S45']},
    research_status: {
      promoted: [{series_id: 'S45', move_ids: ['N65', 'N66', 'N67', 'N68'], status: 'ready-for-preview', scope: 'One-leg foundation with extension, figure-four hip-over and posted-arm options. Primary written instruction compared with decoded demonstration checkpoints.'}],
      held: [{id: 'one-leg-power-half-finish', title: 'One-leg ride to power half or second-boot finish', research_update: 'The first one-leg options are available. Review the later changes of leg configuration before adding separate finish guides.', guide_links: [{label:'One-Leg Riding Series',href:'#season?view=series&series=S45'}], sources: [weber.url, weberVideo.url, taylor.url, taylorVideo.url], known: 'Primary lessons describe later half-nelson finishes and configuration changes after the earlier leg-riding turns.', missing: 'A complete reviewed grip, leg-change and finish showing exactly when the second boot is inserted or the initial leg is released.', attempted_alternatives: 'Free Attack Style and Hudson Taylor sources located; paid Kolat and Redhawk lessons were not accessed. Keep a distinct finish card rather than silently adding an unchecked position change to every option.', backlog_moves: ['One-leg ride to power-half finish', 'One-leg tilt to second-boot half-nelson finish']}]
    }
  };
})();
