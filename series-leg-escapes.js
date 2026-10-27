/* Established leg-ride defenses. One inserted leg and two boots have separate starts. */
(() => {
  'use strict';
  const groups = ['7-10', '11-14'];
  const footFight = {
    title: 'Cary Kolat - Foot Fight Bottom Leg Escape',
    url: 'https://www.youtube.com/watch?v=6rbKASPVCoQ',
    note: 'Free creator demonstration. Decoded visual checkpoints at 0:31, 0:36, 0:41 and 0:51 show a seated one-hook position, a free-foot block, clearing the trapped knee and return to the knees. That endpoint is a cleared leg and rebuilt base, not yet a scored escape. No full audio or transcript review is claimed.'
  };
  const brunk = {
    title: 'Messiah Wrestling - Established double-boots defense',
    url: 'https://www.youtube.com/watch?v=o2byq_ffGGU',
    note: 'Free Brunk demonstration linked by Mepham Wrestling as both-boots defense. Decoded checkpoints show two boots at 0:02/0:45 and 5:39, the seat at 1:32, knee lift at 1:50, and boot handling at 2:30/3:32-3:57. Later 6:04-6:24 samples show the boot held near the abdomen, knee alongside, then foot removal and another knee clearance. The 6:34-6:44 endpoint is obscured; no complete reversal or Navy finish is claimed from this footage.'
  };
  const taylor = {
    title: 'Hudson Taylor - Defending Legs When the Ankles Are Crossed',
    url: 'https://www.youtube.com/watch?v=LKGjmbqx-_Y',
    note: 'Free publisher demonstration. Decoded 1:02 shows the seated one-boot/crossed-ankle problem; 1:12 shows sole control, a knee lift and the free foot holding the other ankle near the mat; 1:17 shows the hips across and kneeling top control. The initial forceful crossbody-arm release is not included in this youth drill.'
  };
  const taylorWritten = {
    title: 'Fanatic Wrestling - Hudson Taylor: Defend Leg Riders Who Cross Their Ankles',
    url: 'https://fanaticwrestling.com/blogs/news/learn-how-to-defend-leg-riders-who-cross-their-ankles',
    note: 'The public written explanation identifies one inserted left leg with crossed ankles, a leg-assisted separation of the non-riding ankle, a side change, sole lift and a Navy-control finish. This is not a two-boots starting position.'
  };
  const kolatPlan = {
    title: 'Cary Kolat - Training Session: Defending Legs and Live Wrestling Bottom',
    url: 'https://www.kolat.com/blog/training-session-defending-legs-live-wrestling-bottom',
    note: 'The creator distinguishes one-leg and double-boots starts, both on the knees and flat. The written plan specifically includes bringing both knees to one side to clear double boots. It is supporting written evidence, not a full demonstration of every clearance.'
  };
  const parallel = {
    title: 'Seth Ciasulli - Parallel Leg Ride: Two Legs In',
    url: 'https://sethciasulli.com/lessons/parallel-leg-ride-two-legs-in',
    note: 'The public written lesson separates forcing a crab position, moving the feet to one side with a knee lift and cover, and removing the legs before dealing with the crab ride. Paid lesson footage was not accessed.'
  };
  const handbook = {
    title: 'College Park Wrestling - Technique Handbook, printed page 32',
    url: 'https://cdn2.sportngin.com/attachments/document/0e6c-2411143/Advanced_techbible.docx.pdf#page=32',
    note: 'The written seated-crab counter supplies the continuation: remove an instep to the outside, retain the leg from beneath your own leg, move the hips across and turn to Navy control. This written finish supplements the sampled Brunk foot-removal demonstration; it is not claimed to have been watched in that clip.'
  };

  const moves = [
    {
      id: 'N73', name: 'One-Leg Ride Defensive Hip-Sit', category: 'bottom', tier: 'Intermediate',
      age_groups: [...groups], positions: ['bottom'], purposes: ['escape', 'defend'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
      aliases: ['one boot hip sit', 'one-leg defensive seat'],
      purpose: 'Organize a stable seated position before removing an already inserted leg.',
      prerequisite: 'A comfortable sit-out, short supported hip movement and immediate release. Both partners can recognize which leg is trapped without twisting either knee.',
      setup: 'Begin in the seated position shown in the linked clip: bottom on a hip, one leg caught by the rider\'s inserted boot, with the other leg free to move. The rider remains behind. Start without crossed ankles, a second boot or a power half. This foundation card begins at the hip-sit; it is not a universal entry from every flattened leg ride.',
      steps: [
        'Identify your trapped leg and your free leg. Ask the rider to keep a light, recognizable hook rather than squeezing or turning you.',
        'Keep a short support hand on the mat away from the rider, close enough to balance without locking the elbow.',
        'Stay upright enough to keep both shoulders off the mat. Keep the free leg available beside the trapped leg.',
        'Point out the rider\'s hooked foot and rehearse bringing your free foot toward it without twisting the trapped knee.',
        'Pause, have the rider unhook, then reset. Continue to N74 only when this starting position is comfortable.'
      ],
      cues: ['Find the trapped leg.', 'Short support hand.', 'Shoulders stay up.', 'Free foot is ready.'],
      drill: 'Three-minute foundation: 45 seconds demonstration; 90 seconds alternating 15-second position checks and clean releases; 45 seconds naming the trapped leg, free leg and rider\'s boot. Use a brief review before N74 rather than filling a whole teaching slot with sitting.',
      boundary: 'No power-half pressure, crossed-ankle squeeze or second boot in this first drill. Do not force the seat against a fixed knee, post on the head, lean back onto both shoulders or stand with a hook still inserted. The rider releases immediately on a stop signal.',
      error: 'Bottom leans onto the back or mistakes one inserted leg with crossed ankles for the simple open one-hook start.',
      fix: 'Reset at the exact shown seat, check that only one leg is hooked and the ankles are not locked, then restore a short support hand and upright shoulders.',
      video: {url: footFight.url + '&t=31s', title: 'One-leg defensive hip-sit before the foot fight', channel: 'Cary Kolat', format: 'video', match: 'component', note: 'Use the established seated start around 0:31. The actual foot-fight clearance is N74. This is not a second, separate escape.'},
      sources: [footFight],
      verification: 'Reviewed 2026-10-27 from decoded visual checkpoints. The seated one-hook start and support-hand position were inspected. An all-fours-to-seat entry was not verified in this pass. Position checks, timing, receiving and stop conditions are Grindstone coaching design.',
      series_id: 'S47', role: 'foundation'
    },
    {
      id: 'N74', name: 'One-Leg Foot-Fight Clear to Base', category: 'bottom', tier: 'Intermediate',
      age_groups: [...groups], positions: ['bottom'], purposes: ['escape', 'defend'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
      aliases: ['foot fight bottom leg escape', 'one boot foot fight'],
      purpose: 'Use the free foot to stop the rider\'s boot from following while the trapped knee comes out, then rebuild the base.',
      prerequisite: 'N73, a comfortable knee-to-base recovery and the ability to move a trapped leg without turning the knee against a fixed foot.',
      setup: 'Start in N73: one boot already inserted, bottom in a supported hip-sit, rider behind and the other leg free. The rider\'s ankles are not crossed and no power half is applied.',
      steps: [
        'Keep the support hand on the mat away from the rider and the shoulders above the hips.',
        'Bring your free foot across the rider\'s hooked boot and hold that boot near the mat. Use controlled contact, not a stomp.',
        'With that boot blocked, bring the trapped knee across and out of the hook. Move the hip with the knee rather than twisting the knee in place.',
        'Once the hook is off, turn back onto your knees and rebuild a compact base. Keep the cleared leg out of easy reach.',
        'Confirm that both legs are free before continuing. In a separate, already taught finish, use B17 and B21 to rise, clear the remaining hands and face the opponent. Returning to the knees alone is not an escape.'
      ],
      cues: ['Free foot blocks the boot.', 'Knee and hip move together.', 'Hook off, base back.', 'Then clear hands and face.'],
      drill: 'Five-minute introduction: 1 minute demonstration; 1 minute foot placement and knee-clearance checks; 2 minutes alternating one slow clearance per 20-second turn; 1 minute adding an already familiar stand-up after the coach confirms both hooks are free. If the clearance is still new, use the last minute for it and save the stand-up connection for later.',
      boundary: 'No stamping, heel twisting, toe pulling or force against a trapped knee. Do not pull the rider overhead or stand while the boot is attached. The rider follows cooperatively and unhooks if the knee cannot travel comfortably. A second boot, locked ankles or strong upper-body turn changes the problem; reset instead of forcing this answer.',
      error: 'Bottom tries to lift the entire rider, or moves the knee before the free foot prevents the boot from following.',
      fix: 'Return to the seat. Make the boot block visible, use a smaller hip-led knee movement, and check that the hook has actually released before returning to the knees.',
      video: {url: footFight.url, title: 'Foot Fight Bottom Leg Escape', channel: 'Cary Kolat', format: 'video', match: 'direct', note: 'The reviewed section around 0:31-0:51 shows the foot block, knee clearance and return to the knees. B17/B21 are a separately linked Grindstone continuation after the clip\'s reviewed endpoint.'},
      sources: [footFight],
      verification: 'Reviewed 2026-10-27 at decoded 0:31, 0:36, 0:41 and 0:51 checkpoints. Foot placement, knee clearance and a rebuilt kneeling base were inspected. No scored escape or continuous audio/transcript review is claimed. The stand-up connection, teaching time and cooperative progression are Grindstone additions.',
      series_id: 'S47', role: 'option',
      branch: {title: 'Clear an open single hook', when: 'One leg is caught, the other foot is free, and the rider has not crossed the ankles or inserted a second boot.', action: 'Block the boot with the free foot, free the knee and return to base; finish the escape only after all leg hooks are gone.', readiness: 'N73 and a controlled, pain-free knee clearance.'}
    },
    {
      id: 'N76', name: 'Crossed-Ankle One-Leg Clear to Navy Cover', category: 'bottom', tier: 'Intermediate',
      age_groups: [...groups], positions: ['bottom', 'top'], purposes: ['escape', 'reverse', 'defend'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
      aliases: ['one boot with crossed ankles escape', 'Hudson Taylor leg-ride counter'],
      purpose: 'Uncross the rider\'s ankles, remove the inserted hook and turn into top control instead of pulling against both legs at once.',
      prerequisite: 'A controlled defensive hip-sit, careful foot handling and familiar N61 Navy cover. Both partners can distinguish the inserted leg from the other leg that closes the ankle cross.',
      setup: 'Begin in a coach-checked hip-sit with ONE inserted boot and the rider\'s ankles crossed. The rider is behind, with no active crossbody arm pull or power half. The free/non-riding leg closes the ankle cross; it is not a second inserted boot. This drill begins after upper-body pressure has been cleared.',
      steps: [
        'Identify the inserted leg and the non-riding leg crossing over it. Stay supported with the shoulders off the mat.',
        'Use your leg nearest the ankle cross to pry the non-riding leg away until the ankles separate. Move the leg as a unit; do not pull or twist the toes with your hands.',
        'Change your hips to the side opposite the inserted hook. Cup the sole of the hooked foot with the hand nearest it and lift your knee alongside so the hook can clear.',
        'Use your free foot to hold the rider\'s other ankle near the mat while you lift the captured boot. This prevents that other leg immediately becoming a new hook; do not stamp on it.',
        'Bring your hips across the cleared leg and turn onto your knees above the opponent. Settle into the familiar Navy cover, keeping the held leg comfortable, then release for the next repetition.'
      ],
      cues: ['One leg in; the other closes the cross.', 'Uncross before clearing.', 'Lift the sole and your knee.', 'Hips across, then settle on top.'],
      drill: 'Six-minute introduction: 1 minute demonstration; 1 minute identifying and gently uncrossing the ankles; 3 minutes alternating one announced clear-and-cover per 30-second turn; 1 minute checking the top-control endpoint. Keep the first repetitions cooperative and separate the ankle opening from the full turn until both are dependable.',
      boundary: 'Do not recreate the source\'s initial forceful arm pull or drive a partner\'s head into the mat. Start after upper-body pressure is released. No toe twisting, ankle wrenching, stamping, sudden rolls or forcing a fixed knee. The rider allows the ankle cross to open and releases immediately on discomfort.',
      error: 'Bottom treats the crossed ankles as two inserted boots, tries to pull both feet apart with the hands, or turns before the hook is free.',
      fix: 'Pause and name the inserted versus non-riding leg. Open the cross using the leg-assisted action, then rehearse the sole-and-knee clearance before adding the hip turn.',
      video: {url: taylor.url + '&t=62s', title: 'Crossed-ankle leg-ride clear and top-control finish', channel: 'Fanatic Wrestling / Hudson Taylor', format: 'video', match: 'direct', note: 'Use the seated problem around 1:02, foot-and-knee clearance around 1:12 and top-control endpoint around 1:17. The guide starts after the earlier crossbody-arm pressure has been removed.'},
      sources: [taylor, taylorWritten],
      verification: 'Reviewed 2026-10-27 through decoded video checkpoints and the publisher\'s written breakdown. The one-hook/crossed-ankle start and clear-to-top endpoint are distinct from the two-boots lesson. The leg-assisted uncrossing and side-change sequence is supported by the written source. No complete audio/transcript review is claimed. The cooperative start, timing and release guidance are Grindstone coaching design.',
      series_id: 'S47', role: 'option',
      branch: {title: 'The rider has crossed the ankles', when: 'One boot is inserted and the non-riding leg closes an ankle cross, with upper-body pressure already cleared.', action: 'Open the ankle cross with the leg, change sides, lift the hooked sole while blocking the other ankle, then turn into Navy cover.', readiness: 'Controlled hip-sit, reliable ankle opening and a familiar, comfortable Navy cover.'}
    },
    {
      id: 'N77', name: 'Both Boots In: Recover a Hip-Sit', category: 'bottom', tier: 'Intermediate',
      age_groups: [...groups], positions: ['bottom'], purposes: ['escape', 'defend'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
      aliases: ['double boot hip sit', 'double leg ride to crab position'],
      purpose: 'Move from two established leg hooks toward a seated position where an individual boot can be addressed.',
      prerequisite: 'A dependable bottom base, supported hip-sit and coach-supervised recognition of both inserted hooks. First attempts use light leg contact and free-moving arms.',
      setup: 'Bottom begins on the knees with the rider behind and a boot inserted on each side. Use two ordinary hooks with no locked figure-four, crossed-ankle squeeze or power half. The coach checks the exact start before each first repetition. A flattened, tightly stretched double-vine start needs its own recovery work and is not assumed here.',
      steps: [
        'Keep the hands and elbows supporting the chest rather than letting the rider stretch you forward onto the face.',
        'Bring the knees closer and work both knees toward one side as the hips lower toward that side. Move within the hooks\' comfortable slack; do not wrench a fixed knee.',
        'Arrive in a supported hip-sit with the rider behind, rather than lying back onto both shoulders.',
        'Lift the knee on the side whose boot you will address so the instep is accessible. Keep your upper body supported and the other hook in view.',
        'Pause and identify both boots. Continue to N78 to remove the selected hook; sitting up by itself does not end the ride.'
      ],
      cues: ['Two hooks: name both.', 'Knees to one side.', 'Sit supported, not on your back.', 'Find one boot to remove.'],
      drill: 'Four-minute foundation: 1 minute demonstration and start checks; 2 minutes alternating one low-resistance recovery and reset per 30-second turn; 1 minute checking the resulting seat and identifying both hooks. Stop the repetition before boot removal until N78 has been taught.',
      boundary: 'First repetitions exclude power halves, locked ankles and hard stretching. Do not stand, jump, launch the rider forward or use the head as a post. If a hook prevents comfortable hip movement, the rider releases and the pair rebuilds. A strong upper-body turn must be addressed separately; this is not permission to twist through it.',
      error: 'Bottom assumes the one-leg free-foot answer will work unchanged even though both legs are hooked, or treats reaching the seat as an escape.',
      fix: 'Name both hooks, regain a short supported posture and use a smaller knees-to-one-side movement. Once seated, remove hooks deliberately rather than trying to sprint to the feet.',
      video: {url: brunk.url + '&t=45s', title: 'Both-boots start and seated recovery', channel: 'Messiah Wrestling / Brunk demonstration', format: 'video', match: 'component', note: 'Both boots are visible near 0:45, the seated position near 1:32 and knee lift near 1:50. Kolat\'s written training plan supports the knees-to-one-side recovery cue; the complete transition was not continuously reviewed.'},
      sources: [brunk, kolatPlan, parallel],
      verification: 'Reviewed 2026-10-27. Sampled Brunk footage establishes the two-hook start, resulting seat and knee lift. Kolat supplies the written knees-to-one-side cue; Ciasulli describes forcing a crab position. This is combined written and sampled visual evidence, not a claim of continuous video or transcript review. Timing, receiving and limits are Grindstone coaching design.',
      series_id: 'S48', role: 'foundation'
    },
    {
      id: 'N78', name: 'Seated Boot Clear to Navy Cover', category: 'bottom', tier: 'Intermediate',
      age_groups: [...groups], positions: ['bottom', 'top'], purposes: ['escape', 'reverse', 'defend'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
      aliases: ['crab ride instep clear', 'double boots seated leg clear'],
      purpose: 'Remove a boot from the seated ride, move the hips across the retained leg and turn into top control when that leg stays available.',
      prerequisite: 'N77 or an already established supported crab seat, comfortable instep handling and N61 Navy control. Practice the foot removal separately before adding the hip movement and cover.',
      setup: 'Begin seated with the rider behind. One knee is lifted enough to reach that side\'s boot. Both partners identify the foot being removed and any hook still attached. Start without a locked ankle cross or a power half.',
      steps: [
        'Cup the selected boot at its instep with both hands. Lift only enough to guide the whole foot out of the hook and place it on the mat outside your leg; do not turn the toes against the knee.',
        'Reach beneath your own lifted leg to keep control of the rider\'s now-cleared leg. Keep the other hand available for balance rather than pulling the rider by the foot.',
        'Check the other boot. If one open hook remains and your newly freed foot can reach it, return to N74\'s supported one-hook seat: block that boot with the free foot and withdraw the trapped knee. Then re-check the retained leg before choosing a cover. If that start is unavailable, reset with the coach rather than twisting against the second hook.',
        'When the hooks are free and the retained leg remains available, move your hips across that leg and turn toward the rider. Settle on top rather than stopping halfway with your shoulders exposed.',
        'Finish with the familiar high far-thigh scoop of N61, keeping the held knee comfortable. If the rider withdraws the leg and follows behind instead, rebuild base and use the separately taught B17/B21 stand-up finish after all hooks are free.'
      ],
      cues: ['Cup the instep; move the whole foot.', 'Outside, then keep the leg.', 'Check the second hook.', 'Hips across, turn and cover.'],
      drill: 'Six-minute introduction: 1 minute demonstration of the selected start and finish; 1 minute removing one boot and resetting; 3 minutes alternating a cooperative clear-and-cover per 30-second turn; 1 minute checking whether top control or a separate escape finish was actually reached. Teach the alternative stand-up in a later slot if it is unfamiliar.',
      boundary: 'Do not wrench the foot, pull toes, drive sideways through the knee or step across a still-fixed second hook. The rider releases leg tension as each hook is removed and follows the hip movement. No sudden rolls, neck loading or power-half pressure in this drill. If an arm is trapped or a knee cannot move, release and reset.',
      error: 'Bottom removes one boot but turns while the other is still fixed, or stops at foot removal without securing top control or clearing the remaining hands.',
      fix: 'Pause after the first boot comes out and name the second hook. Finish only after the legs can travel freely. Use the already taught Navy cover when the retained leg is available; otherwise rebuild base and complete the familiar escape.',
      video: {url: brunk.url + '&t=364s', title: 'Seated two-hand boot removal', channel: 'Messiah Wrestling / Brunk demonstration', format: 'video', match: 'component', note: 'The reviewed 3:32-3:57 and 6:04-6:24 sections show boot handling, a lifted knee and foot removal. The final turn is obscured in the reviewed frames. The Navy cover is supported by the linked College Park written counter, not verified as this clip\'s endpoint.'},
      sources: [brunk, handbook, parallel],
      verification: 'Reviewed 2026-10-27. The foot-removal component was visually sampled; the under-own-leg retention, hips-across and Navy cover continuation comes from the primary school handbook. The entire clear-to-cover chain has not been continuously reviewed on video. A coach should rehearse the complete written chain with a cooperative partner before introducing it. No paid lesson or full transcript review is claimed.',
      series_id: 'S48', role: 'option',
      branch: {title: 'Clear the boot and turn over the retained leg', when: 'The rider remains behind in the seated position, the selected instep can be reached and the cleared leg stays available.', action: 'Remove the hook, check the second boot, keep the cleared leg and bring the hips across to Navy cover.', readiness: 'N77, controlled instep removal and a familiar N61 finish; rehearse the written complete chain before using resistance.'}
    }
  ];

  const one = {
    id: 'S47', title: 'One-Leg Ride Escape Series', position: 'bottom', positions: ['bottom'], purposes: ['escape', 'defend'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
    age_groups: [...groups], tier: 'Intermediate', minutes: 12,
    summary: 'From an established one-leg ride, use the foot fight when the ankles are open or first uncross them and turn to Navy cover. A familiar stand-up completes the escape when the legs clear but the rider stays behind.',
    foundation: 'N73 starts at a supported seated one-hook position. Identify the trapped leg, the free foot and the rider\'s boot before selecting a clearance. An all-fours or flat entry is not treated as already solved.',
    setup: 'Teach N74 and N76 separately before combining them. Start with one inserted hook and cooperative upper-body contact. The rider announces open or crossed ankles; bottom identifies the configuration before choosing. Strong arm controls are cleared before these seated starts.',
    members: [
      {move_id: 'N73', role: 'Foundation', note: 'Recognize and balance in the supported one-hook seat.', tier: 'Intermediate', age_groups: [...groups]},
      {move_id: 'N74', role: 'Clearance', note: 'Use the free foot to remove the hook and rebuild base.', tier: 'Intermediate', age_groups: [...groups]},
      {move_id: 'N76', role: 'Crossed-ankle option', note: 'Uncross the non-riding leg before clearing the hook and turning into Navy cover.', tier: 'Intermediate', age_groups: [...groups]},
      {move_id: 'B17', role: 'Continuation', note: 'Only after all hooks are off: use the familiar stand-up.', tier: 'Beginner', age_groups: [...groups]},
      {move_id: 'B21', role: 'Finish', note: 'Clear remaining hands and face; a leg clearance alone is not an escape.', tier: 'Beginner', age_groups: [...groups]}
    ],
    branches: [
      {title: 'Open single hook remains', when: 'Only one boot is inserted and the free foot can reach it.', action: 'Use N74 to block the boot, clear the knee and return to base.', move_ids: ['N74'], tier: 'Intermediate', age_groups: [...groups], readiness: 'The seated start and foot-fight clearance have been rehearsed cooperatively.'},
      {title: 'One hook with crossed ankles', when: 'The rider\'s other leg closes an ankle cross and upper-body pressure has already been cleared.', action: 'Use N76 to open the ankle cross, clear the inserted boot and turn into Navy cover.', move_ids: ['N76'], tier: 'Intermediate', age_groups: [...groups], readiness: 'N76 has been taught separately; both partners can uncross and clear without knee or ankle strain.'},
      {title: 'Legs are clear; rider follows with the hands', when: 'Neither leg is hooked, but the opponent still controls from behind.', action: 'Use the already familiar B17 and B21 to stand, clear the hands and face. This is a separate Grindstone continuation.', move_ids: ['B17', 'B21'], tier: 'Intermediate', age_groups: [...groups], readiness: 'A reliable stand-up finish and a positive check that no hook remains.'}
    ],
    steps: [
      'Minutes 0-2: review N73 and name the trapped leg, free leg and rider\'s boot. Alternate supported checks and releases.',
      'Minutes 2-5: review N74, alternating one slow clearance per 30-second turn. Finish each attempt in a compact base.',
      'Minutes 5-8: review the separately taught N76. Announce the crossed-ankle start, uncross, clear and settle in the familiar Navy cover.',
      'Minutes 8-11: alternate the two announced starts. After an open-hook clearance, connect the familiar stand-up only when all hooks are free. Use 15 seconds to work and 15 seconds to release and change roles.',
      'Minutes 11-12: explain which start required uncrossing and the difference between a rebuilt base, top control and a completed escape.'
    ],
    cues: ['One hook or two?', 'Free foot blocks the boot.', 'Clear the leg before standing.', 'Base is a checkpoint; facing free is the finish.'],
    move_ids: ['N73', 'N74', 'N76', 'B17', 'B21'],
    readiness: 'Use prepared 7-10 and 11-14 partners who already sit out, rebuild base and stand up comfortably. This intermediate lesson adds an established leg entanglement; it is not automatically a Pup foundation. Teach each component before adding a short choice drill.',
    boundaries: 'No hard leg stretch, power-half pressure or surprise second boot. Introduce the light ankle cross only for the separately taught N76; do not use it to squeeze or fix a knee. Stop for a trapped posting arm or discomfort. Do not stand until all hooks are free.',
    verification: 'Reviewed 2026-10-27. Kolat supports the open one-hook clearance to knees. Taylor\'s public written explanation and decoded footage support the crossed-ankle option and top-control finish. The stand-up continuation and practice timing are Grindstone design. The one-leg switch remains a separate research item.',
    sources: [footFight, taylor, taylorWritten]
  };
  const two = {
    id: 'S48', title: 'Both-Legs-In Escape Series', position: 'bottom', positions: ['bottom', 'top'], purposes: ['escape', 'reverse', 'defend'], uses: ['teach', 'review', 'reps', 'reaction', 'situational'],
    age_groups: [...groups], tier: 'Intermediate', minutes: 12,
    summary: 'Two established boots need their own recovery: reach a supported seat, remove hooks deliberately, then turn over a retained leg or complete a familiar escape if the rider follows behind.',
    foundation: 'N77 begins with a hook on each side and recovers a supported seat. N78 addresses an accessible boot from that seat. One inserted leg with crossed ankles is not relabeled as two boots.',
    setup: 'Begin with ordinary, lightly applied two-boot control on the knees, without locked ankles or a power half. Teach the hip-sit and selected clearance individually. The complete written Navy-cover continuation needs a cooperative coach rehearsal before athletes use it.',
    members: [
      {move_id: 'N77', role: 'Foundation', note: 'Recover a supported seat from the two-hook start.', tier: 'Intermediate', age_groups: [...groups]},
      {move_id: 'N78', role: 'Clearance and cover', note: 'Remove a boot, check the second hook and turn across a retained leg to Navy cover.', tier: 'Intermediate', age_groups: [...groups]},
      {move_id: 'N74', role: 'Remaining-hook option', note: 'After the first boot clears, use the one-hook foot fight only when its supported seat and free-foot start are available.', tier: 'Intermediate', age_groups: [...groups]},
      {move_id: 'B17', role: 'Conditional continuation', note: 'Use after all hooks are clear if the rider remains behind instead of conceding the cover.', tier: 'Beginner', age_groups: [...groups]},
      {move_id: 'B21', role: 'Conditional finish', note: 'Clear the remaining hands and face the opponent.', tier: 'Beginner', age_groups: [...groups]}
    ],
    branches: [
      {title: 'Retained leg stays available', when: 'The foot is outside, both hooks are free to move and the rider\'s cleared leg remains controlled.', action: 'Use N78\'s written hips-across continuation to turn and settle in Navy cover.', move_ids: ['N78'], tier: 'Intermediate', age_groups: [...groups], readiness: 'Cooperative boot removal and the complete written clear-to-cover route have been rehearsed; N61 is familiar.'},
      {title: 'One open hook remains', when: 'The first boot is clear, the free foot can reach the remaining boot and bottom has the supported one-hook seat.', action: 'Use N74 to block the remaining boot and free the knee. Rebuild base before the familiar escape finish.', move_ids: ['N78', 'N74'], tier: 'Intermediate', age_groups: [...groups], readiness: 'N74 has been learned separately; no crossed ankles or strong upper-body turn is present.'},
      {title: 'Hooks are off; rider withdraws the leg and follows', when: 'The retained leg is no longer available for the cover and the rider remains behind with hand control.', action: 'Rebuild base and use B17/B21 to finish the escape. Do not return to standing with a hook still attached.', move_ids: ['B17', 'B21'], tier: 'Intermediate', age_groups: [...groups], readiness: 'Both hooks are positively clear and the stand-up finish is already dependable.'}
    ],
    steps: [
      'Minutes 0-3: review N77 with light hooks. Pause in the seat and name both boots; alternate one recovery per 30-second turn.',
      'Minutes 3-6: review N78\'s foot removal. Check the other boot before any hip movement across the retained leg.',
      'Minutes 6-9: use the familiar, cooperatively rehearsed Navy cover when the leg stays available. Keep first repetitions announced and slow.',
      'Minutes 9-11: if the hooks are clear and the rider withdraws the leg but keeps the hands behind, complete the familiar stand-up finish instead. Do not invent a new scramble.',
      'Minutes 11-12: each partner names the two-hook start and the actual ending achieved: a seat, cleared hooks, top control or a completed escape.'
    ],
    cues: ['Both boots need attention.', 'Seat first, then clear.', 'Check the second hook.', 'Cover or escape; do not stop halfway.'],
    move_ids: ['N77', 'N78', 'N74', 'B17', 'B21'],
    readiness: 'Intermediate readiness is supported bottom movement, comfortable leg handling and a known finish, not age alone. Use prepared 7-10 and 11-14 pairs under direct coaching. Pups continue their familiar base, stand-up and basic turn defense until ready for established leg entanglements.',
    boundaries: 'No power halves, locked-ankle squeezing, hard double-vine stretching, head posts or sudden throws in the teaching start. Release instead of twisting a knee or shoulder. A tight flat ride or trapped upper body is a separate problem, not permission to force these steps.',
    verification: 'Reviewed 2026-10-27 with public written instruction and decoded Brunk checkpoints. The boot-removal component is visually supported; the full Navy-cover continuation is supported by the written school handbook rather than a continuously reviewed video finish. The conditional N74 connection after one boot clears, stand-up connection, drill timing and stop conditions are Grindstone design.',
    sources: [brunk, kolatPlan, parallel, handbook]
  };

  for (const item of [one, two, ...moves]) for (const source of item.sources || []) source.accessed = '2026-10-27';
  window.GRINDSTONE_SERIES_LEG_ESCAPES = {
    reviewed: '2026-10-27', series: [one, two], moves,
    placements: {'youth-5': ['S47'], 'youth-6': ['S48'], 'older-4': ['S47'], 'older-5': ['S48']},
    research_status: {
      promoted: [{series_id: 'S47', move_ids: ['N73', 'N74', 'N76'], status: 'ready-for-preview', scope: 'Established one-hook seat: open-ankle foot fight or crossed-ankle clear to Navy cover, plus a separately linked familiar stand-up.'}, {series_id: 'S48', move_ids: ['N77', 'N78'], status: 'written-and-component-preview', scope: 'Two-hook seated recovery and foot removal with a written clear-to-Navy-cover continuation; full video finish still needs review.'}],
      held: [
        {id: 'leg-switch-review', title: 'One-leg switch reversal', research_update: 'Keep this distinct switch option in the research queue while the supported foot-fight and crossed-ankle answers are usable.', guide_links: [{label:'One-Leg Ride Escape Series',href:'#season?view=series&series=S47'}], sources: ['https://www.youtube.com/watch?v=bh1VirHg-WQ'], known: 'The creator names a leg-ride switch defense.', missing: 'Decoded complete start, arm control, hip route and reversal endpoint.', attempted_alternatives: 'Primary creator metadata located; footage review is still required before writing a complete guide.', backlog_moves: ['One-leg switch reversal']},
        {id: 'leg-defense-full-video-endpoint', title: 'Complete two-boot clear-to-cover video', research_update: 'Find a complete matching free demonstration to strengthen the current written guide. Flat double-vine and power-half recoveries remain separate move candidates.', guide_links: [{label:'Both-Legs-In Escape Series',href:'#season?view=series&series=S48'}], sources: [brunk.url, handbook.url, 'https://player.vimeo.com/video/178514035', 'https://player.vimeo.com/video/528667156'], known: 'The seated foot-removal component has been sampled and the Navy-cover continuation is available in a primary school handbook.', missing: 'A continuously reviewed complete two-boot clearance and cover, including the remaining hook and final top position.', attempted_alternatives: 'Free Chris Perry and Attack Style demonstrations were located as next visual-review sources; neither was accessed behind a paywall.', backlog_moves: ['Two-boot clear-to-cover visual verification', 'Flat double-vine recovery', 'Established-leg power-half swim defense']}
      ]
    }
  };
})();
