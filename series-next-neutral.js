/* Preview: connected neutral attacks. Existing Russian series is extended in place. */
(() => {
  'use strict';
  const reviewed = '2026-10-28';
  const groups = ['7-10', '11-14'];
  const uses = ['teach', 'review', 'reps', 'reaction', 'situational'];
  const src = (title, url, note) => ({title, url, note, accessed: reviewed});
  const seat = src('Fanatic Wrestling / Ben Askren - Seatbelt options', 'https://fanaticwrestling.com/blogs/news/dominate-your-opponent-in-the-seatbelt-position-four-moves-with-ben-askren', 'Detailed free written instruction with separate demonstrations of the snap, suck-back and limp-arm. The deliberate-pain rib-crusher option is excluded.');
  const over1 = src('Fanatic Wrestling / Ben Askren - Overtie Overhaul', 'https://fanaticwrestling.com/blogs/news/overtie-overhaul-with-ben-askren', 'Free primary text and separate demonstrations of the single-leg entry and slide-by.');
  const over2 = src('Fanatic Wrestling / Ben Askren - Overtie Overhaul, Part 2', 'https://fanaticwrestling.com/blogs/news/overtie-overhaul-pt-2-with-ben-askren', 'Free primary text describes the slide-by-to-double reaction and a separate foot-sweep option. The sweep remains in research.');
  const overSetup = src('Fanatic Wrestling - Four Takedowns from an Overtie', 'https://fanaticwrestling.com/blogs/news/four-takedowns-from-an-overtie', 'Supports the overtie starting position and Askren outside-single entry. Other instructors on this page use different grip and finish variations; those are not silently mixed into this series.');
  const overSlide = src('Fanatic Wrestling - Overtie slide-by teaching notes', 'https://fanaticwrestling.com/blogs/news/five-great-takedowns-for-bigger-wrestlers', 'The overtie section explains compact head position, incoming pressure and clearing the collar-tie arm with the free hand.');
  const russian = src('Fanatic Wrestling / Adam Wheeler - Two-on-one lunge step', 'https://fanaticwrestling.com/blogs/news/learn-the-2-on-1-lunge-step-with-adam-wheeler', 'Free primary written explanation and demonstration distinguish the back-take, high-crotch and outside-single endpoints. This draft adds only the head-post-to-high-crotch entry.');
  const russianPost = src('Fanatic Wrestling - Two-on-one reactions', 'https://fanaticwrestling.com/blogs/news/dominate-your-opponent-with-these-two-on-one-takedowns', 'The Wheeler section describes clearing the posting elbow while retaining the captured arm through the lunge. Other named throws on this page are not part of this guide.');
  const curriculum = src('Seth Ciasulli - Two-On-One (Russian Tie)', 'https://www.sethciasulli.com/lessons/two-on-one-russian-tie', 'Written curriculum identifies further wrist, head and elbow reactions. Those listings alone do not establish complete move instructions.');
  const clips = {
    snap: src('Ben Askren - Seatbelt to Snap', 'https://www.youtube.com/watch?v=7Mln8z2FPXc', 'Direct free demonstration linked by the primary publisher.'),
    suck: src('Ben Askren - Seatbelt Suck-Back', 'https://www.youtube.com/watch?v=JlDVr342EzU', 'Direct free demonstration linked by the primary publisher.'),
    limp: src('Ben Askren - Seatbelt Limp Arm', 'https://www.youtube.com/watch?v=VWKsHNKhYvk', 'Direct free demonstration linked by the primary publisher.'),
    single: src('Ben Askren - Overtie to Single Leg', 'https://www.youtube.com/watch?v=otIPYWITxxc', 'Direct free demonstration linked by the primary publisher.'),
    slide: src('Ben Askren - Overtie Slide-By', 'https://www.youtube.com/watch?v=alE89qZVS5s', 'Direct free demonstration linked by the primary publisher.'),
    double: src('Ben Askren - Overtie Slide-By to Double', 'https://www.youtube.com/watch?v=Ta0fhG-JLGA', 'Direct free demonstration linked by the primary publisher.'),
    lunge: src('Adam Wheeler - Two-on-one Lunge Step', 'https://www.youtube.com/watch?v=Y2HGMCFpMcM', 'The full clip contains several endpoints; this card covers only the head-outside leg-capture branch.')
  };
  const vid = (source, match, note) => ({url:source.url, title:source.title, channel:source === clips.lunge ? 'Adam Wheeler / Fanatic Wrestling' : 'Ben Askren', format:'video', match, note});
  const base = (id, name, series_id, role) => ({id, name, category:'attacks', tier:'Intermediate', age_groups:[...groups], positions:['neutral'], purposes:['takedown'], uses:[...uses], series_id, role});
  const verification = 'Checked 2026-10-28 using detailed free primary instruction and sampled video demonstrations. This was not a continuous full-audio review. Each guide records the relevant viewing limits. Cooperative receiving, timing, capture-and-release endpoints and readiness checks are Grindstone teaching design.';
  const moves = [
    {
      ...base('N79', 'Seatbelt Control Against a Whizzer', 'S49', 'foundation'),
      aliases:['seatbelt versus whizzer', 'side seatbelt wrestling control'],
      purpose:'Recognize and stabilize the side position from which the snap, suck-back and limp-arm choices begin.',
      prerequisite:'A familiar single-leg attempt, balance on a knee and the ability to recognize an overhook without forcing the shoulder.',
      setup:'Start on the mat beside a cooperative partner after a stopped shot. The partner overhooks one of your upper arms: that is their whizzer. Your overhooked arm reaches across their back: that is your seatbelt. You are alongside each other, not behind them in a locked-hands body hold.',
      steps:[
        'Name the two roles before moving: the attacker owns the seatbelt; the partner owns the whizzer.',
        'Keep the seatbelt arm across the back and stay close enough that the trapped shoulder is comfortable. Use your legs and free hand to maintain your own balance.',
        'Have the partner ease the whizzer while you make a small change of height. Stay connected without hanging all your weight from the trapped arm.',
        'Return to the starting height, release the overhook together and reset. Add one separately taught option after both partners can identify the position.'
      ],
      cues:['Seatbelt across the back.', 'They have the whizzer.', 'Keep your own balance.', 'Name the opening before moving.'],
      drill:'Three-minute introduction: 45 seconds demonstration; 90 seconds alternating position checks and release every 15 seconds; 45 seconds identifying who owns each control. Later, a 30-60 second reminder is enough before a familiar branch. This is a starting-position lesson, not a prolonged whizzer squeeze.',
      boundary:'Use a relaxed whizzer for first repetitions. Stop when the trapped shoulder cannot move comfortably. No pulling fingers, squeezing ribs or throwing the partner from an unfamiliar position.',
      error:'The wrestler calls any hold around the body a seatbelt and begins from behind the partner, or leans away on a trapped arm.',
      fix:'Rebuild the side-by-side position. Check the partner has an overhook and the attacker has an arm across the back; then lighten pressure and regain independent balance.',
      video:vid(clips.snap, 'component', 'Use the starting seatbelt/whizzer position. The later standing snap is the separate N80 option.'),
      sources:[seat, clips.snap], verification
    },
    {
      ...base('N80', 'Seatbelt to Underhook Snap', 'S49', 'option'),
      aliases:['seatbelt snap-down', 'whizzer position to underhook snap'],
      purpose:'Change the seatbelt into a snap when the partner rises with the near leg back and the head low.',
      prerequisite:'N79, a controlled snap and a separately taught front-headlock or go-behind. The partners can rise together without twisting the trapped shoulder.',
      setup:'Begin in N79. For the learning repetition, the partner follows the attacker upward, withdraws the leg nearest the attacker and keeps the head lowered. Near refers to the side beside the attacker.',
      steps:[
        'Rise from the kneeling seatbelt with your feet under you, bringing the partner up with the connection. Keep the trapped arm comfortable.',
        'When the partner takes the near leg back, shorten the arm across the back into an underhook beneath that same armpit.',
        'Use the underhook connection to guide the upper body down as you move your own weight back and make room in front of you. The partner follows to a supported base.',
        'Pause once the head and shoulders are down. Establish your familiar front-headlock or go-behind separately; do not treat a falling partner as a neck handle.',
        'Release, return to the original seatbelt and change roles. If the partner remains upright or the leg stays available, reset rather than forcing this opening.'
      ],
      cues:['Rise together.', 'Leg back, head low.', 'Shorten to the underhook.', 'Snap to a base, then choose control.'],
      drill:'Five-minute introduction: 1 minute demonstration; 1 minute rising and shortening the hook without a snap; 2 minutes alternating one controlled snap per 30-second turn; 1 minute review. End at a supported base until the next control has been taught.',
      boundary:'The receiver keeps a soft, supported landing. No head-first pull, sharp neck bend or forced overhook throw. Release when the shoulder gets stuck or the partner cannot follow the height change.',
      error:'The attacker pulls from a long seatbelt while the partner remains tall.',
      fix:'Reset and separate the checks: balanced rise, near leg withdrawn, head low, then the shorter underhook. Rehearse the offered reaction without a finish.',
      video:vid(clips.snap, 'direct', 'Seatbelt rise and transition to an underhook snap. This card stops before an unlearned front-headlock finish.'),
      sources:[clips.snap, seat], verification,
      branch:{title:'Rise into the underhook snap', when:'The partner rises with the near leg withdrawn and head low.', action:'Shorten the seatbelt to an underhook and snap to a supported base.', readiness:'N79 plus a controlled snap and safe receiving.'}
    },
    {
      ...base('N81', 'Seatbelt Suck-Back', 'S49', 'option'),
      aliases:['whizzer suck-back', 'seatbelt spiral pull-back'],
      purpose:'Use the partner\'s near-leg post and occupied whizzer arm to bring them backward into controlled mat contact.',
      prerequisite:'N79 and a cooperative side/back landing. Both partners must recognize the near-leg post before adding speed.',
      setup:'Start low beside the partner in N79. The partner posts the leg nearest the attacker while keeping the whizzer; offer this reaction slowly rather than starting with a standing throw.',
      steps:[
        'Keep the seatbelt connection while the partner steps the near foot up.',
        'Bring your head alongside theirs, with light contact rather than a head strike. The seatbelt hand reaches across the lower back to cup the far edge of the hip.',
        'Draw that hip toward your seatbelt elbow while lowering and turning with the partner. Keep the descent low and continuous rather than lifting them.',
        'Follow over the partner as they settle on the side or seat, ending on top with a supported base. Ease the whizzer and seatbelt, then let the partner reset.',
        'Return to the low starting position before changing roles; do not repeat the pull after the partner has lost the intended leg post.'
      ],
      cues:['Wait for the near foot.', 'Hip, not ribs.', 'Turn together and stay low.', 'Follow the landing.'],
      drill:'Five-minute introduction: 1 minute demonstration; 1 minute checking the posted-leg opening without a turn; 2 minutes alternating one slow pull-back per 30-second turn; 1 minute feedback. Keep the first repetitions low and cooperative. Add height only in a separate coach-led progression.',
      boundary:'No head impact, rib squeeze, standing arch or uncontrolled drop. The partner does not brace with a locked landing arm. Reset if the whizzer traps the shoulder or the attacker cannot support the descent.',
      error:'The wrestler pulls straight backward from too far away, leaving the partner to fall without body contact.',
      fix:'Start lower and closer. Offer the near-leg post, check hip contact and rehearse a short turn before attempting the full descent.',
      video:vid(clips.suck, 'direct', 'The demonstrated branch starts when the whizzer-side wrestler posts the near leg. Begin with the low cooperative version.'),
      sources:[clips.suck, seat], verification:'Checked 2026-10-28. The coordinating reviewer read the complete source transcript and sampled decoded footage at 0:45, 0:59 and 1:04. These show the near-leg post, seatbelt hand at the far hip edge, lowering spiral pull and side/seated landing followed to top control. Continuous playback is not claimed. Timing, cooperative receiving and the low-introduction progression are Grindstone teaching design.',
      branch:{title:'Pull back from the near-leg post', when:'The partner posts the near foot with that same-side arm occupied by the whizzer.', action:'Connect at the hip and guide a low spiral pull-back.', readiness:'N79 plus controlled side/back receiving and an attacker who can follow the descent.'}
    },
    {
      ...base('N82', 'Seatbelt Limp-Arm Go-Behind', 'S49', 'option'),
      aliases:['Askren limp arm', 'seatbelt arm clear to go-behind'],
      purpose:'Free the seatbelt arm from the whizzer before moving around to rear control.',
      prerequisite:'N79, recognition of an arm that is truly free and a familiar go-behind. Both partners release immediately when an arm is stuck.',
      setup:'Start low in N79. The partner supplies a light whizzer and stays on a supported base. The attacker\'s route around the back must be clear of other pairs.',
      steps:[
        'Bring the trapped hand across the partner\'s seat toward your own hip, letting the elbow and hand move instead of trying to wrench the shoulder out.',
        'Check the arm has cleared the whizzer. Pause here during the first repetitions; the partner can visibly open the overhook to confirm the release.',
        'Once free, move your hips around the partner\'s back and follow to rear control. Keep your body supported rather than jumping over them.',
        'Settle behind the hips with a familiar controlled cover, then release and reset. Rebuild the seatbelt before practicing another attempt.'
      ],
      cues:['Hand toward your own hip.', 'Arm free first.', 'Move around second.', 'Settle behind, then reset.'],
      drill:'Four-minute introduction: 1 minute demonstration; 1 minute clearing only; 90 seconds alternating one clear-and-go-behind every 15 seconds; 30 seconds feedback. The coach checks that the arm is free before allowing the circling portion.',
      boundary:'Never cross the back with the arm still trapped. Stop instead of forcing a shoulder rotation. No jumping, landing on the spine or pulling the partner by the elbow after it catches.',
      error:'The wrestler moves the hips first and tries to drag a trapped shoulder through the whizzer.',
      fix:'Return to clear-only repetitions. Have the attacker show a free elbow and hand before taking any step around the back.',
      video:vid(clips.limp, 'direct', 'Askren\'s seatbelt limp-arm clears the arm before moving around the back. It is not an instruction to step over a loaded whizzer.'),
      sources:[clips.limp, seat], verification:'Checked 2026-10-28 against the detailed primary written explanation. The coordinating reviewer sampled decoded footage at 0:50 and 1:05: the formerly wrapped arm is clear before the attacker circles around the back on a supported base. A full transcript or continuous playback was not reviewed. Timing and the arm-free pause are Grindstone teaching design.',
      branch:{title:'Clear the arm and go behind', when:'The trapped hand and elbow can move toward the attacker\'s hip while the partner stays low.', action:'Limp the arm free before circling to the back.', readiness:'N79, a reliable arm-clear pause and controlled go-behind.'}
    },
    {
      ...base('N83', 'Overtie Control', 'S50', 'foundation'),
      aliases:['over-tie', 'collar overtie', 'Askren overtie pocket'],
      purpose:'Build one compact response to an opponent\'s collar tie before choosing a single, slide-by or returning double.',
      prerequisite:'A balanced stance, gentle collar-tie contact and the ability to move feet while releasing head control on request.',
      setup:'Both wrestlers stand in stance. The partner collar ties with one arm. Bring your arm over the top of that collar-tie arm to reach the back/side of their head. Your other arm remains free to help clear their tie.',
      steps:[
        'Take the overtie over the partner\'s collar-tie arm; keep the hand on the back/side of the head, away from the throat.',
        'Bring their head close toward their collar-tie-side upper arm instead of holding them at arm\'s length. Keep your own head higher and your feet under you.',
        'Use small push, pull and circling steps to feel their response without twisting the neck.',
        'Freeze in balance and release. The next choice depends on whether a leg is available, the partner pushes in, or they turn back after a slide-by.'
      ],
      cues:['Tie over their tie.', 'Close the space.', 'Feet under you.', 'Feel the response, then choose.'],
      drill:'Three-minute introduction: 45 seconds demonstration; 90 seconds taking, moving and releasing the tie in 15-second turns; 45 seconds feedback. For review, use a 30-60 second check before a branch rather than filling a long slot with static head control.',
      boundary:'Gentle head contact only. No jaw pressure, neck crank or hanging bodyweight from the head. If the partner becomes stretched or loses balance, release and rebuild.',
      error:'The wrestler reaches long and leaves the head and hips far apart, exposing the near leg.',
      fix:'Shorten the space, recover stance and rehearse small foot movement before trying to attack. The free hand should remain available rather than locking both hands behind the head.',
      video:vid(clips.single, 'component', 'Use the initial overtie setup and compact posture. N84 teaches the separate single-leg entry.'),
      sources:[overSetup, clips.single], verification
    },
    {
      ...base('N84', 'Overtie to Outside-Single Entry', 'S50', 'option'),
      aliases:['overtie single', 'overtie collar-tie clear to single'],
      purpose:'Clear the collar tie and collect a head-inside single from the overtie.',
      prerequisite:'N83 and a familiar low, head-inside single-leg hold. Add B08 only after that finish has been taught separately.',
      setup:'Begin in N83 with a cooperative partner in stance. Offer the nearest leg within a normal step, rather than reaching after a retreating leg.',
      steps:[
        'Keep the partner\'s head in the compact overtie position and your own head higher.',
        'Use the free arm to lift and clear their collar-tie arm as you change level. Keep the head free rather than shooting through a tie still pulling it down.',
        'Step outside toward the available leg and transfer from the head control to a two-hand leg capture.',
        'Pause low with the leg secure, head inside and hips underneath you. During the first drill, release here; use a familiar B08 finish only after checking the position.',
        'If the partner sprawls before a stable capture, reset. The clip\'s separate cutback is not taught by this entry card.'
      ],
      cues:['Compact tie.', 'Clear the head.', 'Step to the leg.', 'Capture first; finish second.'],
      drill:'Four-minute introduction: 1 minute demonstration; 1 minute clearing the tie without a shot; 90 seconds alternating one capture-and-release every 15 seconds; 30 seconds feedback. A separately selected finish gets its own time if it is new.',
      boundary:'No dive onto the head, forced neck bend or twisting a planted knee. The receiver offers a cooperative leg and steps with the entry. Stop at capture until both wrestlers know the finish.',
      error:'The attacker drops while the collar tie still controls the head, or reaches at a distant foot.',
      fix:'Rebuild N83, rehearse the free-hand clear and start closer. Check an upright neck and balanced capture before joining the steps.',
      video:vid(clips.single, 'direct', 'Overtie setup, collar-tie clear and single-leg entry. This card ends at a balanced low capture; the later cutback needs its own guide.'),
      sources:[clips.single, over1, overSetup], verification,
      branch:{title:'Clear the tie and take the single', when:'The collar tie can be cleared and the near leg remains within a balanced entry.', action:'Use N84 to capture the head-inside single; add B08 only from its taught starting position.', readiness:'N83 plus a reliable low, head-inside single-leg hold and separately learned receiving.'}
    },
    {
      ...base('N85', 'Overtie Slide-By', 'S50', 'option'),
      aliases:['overtie pass-by', 'Askren overtie slide by'],
      purpose:'Use incoming pressure to pass the partner by and reach rear control.',
      prerequisite:'N83, a familiar step-and-circle go-behind and cooperative pressure that can be stopped immediately.',
      setup:'Start in N83. The partner gives a small forward push after the attacker moves them. Teach that announced push before asking for live reaction reading.',
      steps:[
        'Keep the overtie compact while you move the partner enough to invite a push back.',
        'As that pressure arrives, shrug your shoulder clear of the collar tie and help clear the tying arm with the free hand.',
        'Step out of their forward path and guide the head past your shoulder with the overtie. Move your feet with the pass rather than reaching long.',
        'Follow behind the hips as the partner passes. Release head control as you collect a familiar rear cover.',
        'If the partner turns back before you get behind, stop the first drill there. N86 is the separately taught double-leg continuation.'
      ],
      cues:['Compact tie; feel the push.', 'Clear their collar tie.', 'Step out of the path.', 'Follow the hips.'],
      drill:'Four-minute introduction: 1 minute demonstration; 1 minute announced-pressure footwork; 90 seconds alternating one slide-by to rear cover every 15 seconds; 30 seconds feedback. Keep the partner\'s initial push small enough that both can stop in balance.',
      boundary:'Guide the head with the turning body; do not torque the neck while the feet stay planted. No arm wrench or high-speed collision. Release and reset when the path is blocked.',
      error:'The attacker tries to pull a stationary partner past them with a long arm.',
      fix:'Return to the compact overtie. Use a light announced push and rehearse stepping out of its path before adding rear control.',
      video:vid(clips.slide, 'direct', 'Overtie slide-by with posture control, incoming pressure and collar-tie clearance. It begins from an overtie, unlike the collar-tie elbow pass-by already in the library.'),
      sources:[clips.slide, overSlide], verification,
      branch:{title:'Pass incoming pressure', when:'The partner pushes toward the compact overtie and the path behind them opens.', action:'Clear their collar tie, slide the body past and follow to rear control.', readiness:'N83, announced-pressure footwork and a controlled go-behind.'}
    },
    {
      ...base('N86', 'Overtie Slide-By to Double-Leg Entry', 'S50', 'option'),
      aliases:['overtie slide-by blast double', 'overtie turn-back double'],
      purpose:'Attack both legs when the partner turns back toward the attacker after the overtie slide-by.',
      prerequisite:'N83, N85 and a reliable double-leg entry with a separately taught controlled finish.',
      setup:'Begin with the familiar overtie slide-by. The partner deliberately turns to face the attacker before rear control is established. Begin at walking speed.',
      steps:[
        'Use N85\'s compact slide-by and stay close as the partner turns back toward you.',
        'Keep contact during their turn so the legs remain within range. Change level with the knees as the partner squares toward you.',
        'Release the head tie and collect both legs while your head and chest stay up. Do not remain attached to the head while driving into the legs.',
        'Pause at a balanced double-leg entry during learning repetitions. Add the already-taught finish only when the starting position matches it and the receiver is ready.',
        'Reset if the partner backs away instead of turning close. The offered reaction, not the move order alone, creates this opening.'
      ],
      cues:['Slide by; stay close.', 'They turn back: change level.', 'Head tie becomes leg control.', 'Capture before the finish.'],
      drill:'Five-minute introduction: 1 minute demonstration; 1 minute slide-by and turn-back without a shot; 2 minutes alternating one capture-and-release every 30 seconds; 1 minute feedback. Review the finish in its own slot if it is not already familiar.',
      boundary:'No head-first collision, extended neck or uncontrolled driving finish. The partner offers a predictable turn and keeps the feet able to move. Stop if the head remains trapped in the tie.',
      error:'The attacker lets the partner move out of range, then dives after the double.',
      fix:'Rehearse the slide-by and close turn-back without a shot. If contact and balance are lost, reset instead of chasing the legs.',
      video:vid(clips.double, 'direct', 'The demonstrated continuation is a double after the defender turns back from the overtie slide-by. This beginner teaching dose pauses at capture before adding the demonstrated finish.'),
      sources:[clips.double, over2], verification,
      branch:{title:'Attack the turn-back with a double', when:'The partner turns back close enough to square up after the slide-by.', action:'Keep contact, change level and collect both legs, then use the familiar controlled finish.', readiness:'N85 plus a dependable double-leg entry and receiving.'}
    },
    {
      ...base('N87', 'Russian Head-Post Clear to High-Crotch Entry', 'S19', 'option'),
      aliases:['two-on-one lunge high crotch', 'Russian head-post lunge', 'Wheeler Russian high crotch'],
      purpose:'Use the opponent\'s free-hand head post as an opening for a high-crotch entry from the Russian tie.',
      prerequisite:'A01\'s wrist-and-upper-arm Russian control, a balanced lunge step and a familiar head-outside high-crotch capture. A04 is a separate finish.',
      setup:'Start outside the captured arm in the Russian tie. The partner uses the opposite, free hand to post lightly on the attacker\'s head. Begin before adding A01\'s ankle block; this reaction has its own footwork.',
      steps:[
        'Keep the captured arm close with the upper-arm control while the partner offers the free-hand head post.',
        'Move the wrist-control hand to the posting elbow and lift just enough to clear the head. Retain the captured-arm connection with the other arm through this change.',
        'Lunge into the opened space with your feet and hips moving together. Keep the captured arm against the body until you have entered, rather than releasing both contacts early.',
        'Capture the leg beneath the posting arm, opposite the arm you originally controlled. For example, controlling their right arm opens their left leg: use A04\'s left-arm-inside, right-hand-outside capture with your head outside their left hip. Mirror the whole position when starting on the other side. Pause without lifting.',
        'Release and reset, or add the familiar A04 finish in a later repetition. Do not change this into the clip\'s back trip or head-inside outside-single branch without teaching that variation separately.'
      ],
      cues:['Keep one arm connected.', 'Clear the posting elbow.', 'Step into the opening.', 'Head outside; stop at capture.'],
      drill:'Five-minute introduction: 1 minute demonstration; 1 minute head-post clear with no shot; 2 minutes alternating one slow entry and release per 30-second turn; 1 minute feedback. The partner always announces the post during learning. A new finish needs its own block.',
      boundary:'Lift the posting elbow only enough to clear; do not twist the wrist or wrench the shoulder. No high lift, back arch or dive onto the head. Stop if the captured arm is trapped against a planted foot or the partner cannot step with the entry.',
      error:'The wrestler lets go of the entire Russian tie before clearing the post, or combines the old ankle block with the new lunge.',
      fix:'Rebuild the two-on-one without a foot block. Practice the one-hand transfer and clear, then add one balanced entry while retaining the other connection.',
      video:vid(clips.lunge, 'component', 'Wheeler demonstrates several lunge finishes. Use the head-post setup and head-outside high-crotch capture; the back trip and pivoted head-inside single are different branches.'),
      sources:[clips.lunge, russian, russianPost], verification,
      branch:{title:'Clear a free-hand head post', when:'The partner posts the free hand on the head while the Russian arm remains controlled.', action:'Clear the posting elbow, lunge into the opening and capture the head-outside high crotch; add A04 separately.', readiness:'A01 control plus a dependable high-crotch entry and cooperative posting reaction.'}
    }
  ];

  const visualNotes = {
    N79:'The snap clip shows the side seatbelt/whizzer relationship. This position card uses only that component; its low cooperative setup is a teaching adaptation.',
    N80:'Sampled 0:25-0:35 and 1:05-1:10: standing seatbelt against the withdrawn near leg and lowered head, followed by the receiver on hands and knees. The free-hand contact during the snap is not clearly established by these samples; no additional free-hand grip is specified here.',
    N81:'The auto-generated transcript and samples near 0:45, 0:59 and 1:04 show a low side-by-side suck-back with the near foot posted and a follow to top. This is not a standing arch throw.',
    N82:'Samples near 0:50 and 1:05 show the trapped arm clearing toward the attacker before the go-behind. The full spoken explanation was not available as a transcript.',
    N83:'Samples from the overtie single and slide-by clips show an arm over the collar tie with the opponent head held close. Forceful neck-cranking language from source titles is not used as a coaching cue.',
    N84:'Samples near 0:25-0:35 show compact overtie control and a low head-inside leg capture. The detailed primary text supports the collar-tie clearance; the first hand-transfer instant was not isolated in the sampled footage.',
    N85:'The complete auto-generated transcript and a sample near 0:29 support compact posture, incoming pressure, the free hand outside the shoulder and the slide-by. Receiving and the rear-control pause are club teaching design.',
    N86:'The free RUDIS clip plays. Samples near 0:25 and 0:30, together with the detailed primary explanation, show the turn-back and double-leg entry. This card deliberately pauses before the driving finish.',
    N87:'Samples at 1:50-2:00 show the wrist-control hand lifting under the posting elbow while the other arm keeps the captured arm close, then the lunge to a head-outside entry. The publisher separately describes the high-crotch finish. This guide stops at capture; the other demonstrated endpoints remain separate.'
  };
  moves.forEach(move => { move.verification += ' ' + visualNotes[move.id]; });

  const member = (id, role, note) => ({move_id:id, role, note, tier:'Intermediate', age_groups:[...groups]});
  const branch = (id, extra = []) => {
    const move = moves.find(item => item.id === id);
    return {...move.branch, move_ids:[id, ...extra], tier:move.tier, age_groups:[...groups]};
  };
  const seatbelt = {
    id:'S49', title:'Seatbelt vs Whizzer Series', position:'neutral', positions:['neutral'], purposes:['takedown'], uses:[...uses], age_groups:[...groups], tier:'Intermediate', minutes:12,
    summary:'One side seatbelt against a whizzer, three different openings: rise into a snap, pull back from a near-leg post, or clear the arm and go behind. These are choices from the same control, not three compulsory finishes.',
    foundation:'N79: the attacker has an arm across the opponent\'s back; the opponent overhooks that arm. Both begin low and alongside each other after a stopped shot.',
    setup:'Teach each selected option separately. For this choice block, partners begin in N79 and announce one familiar reaction. Keep the whizzer light until control and receiving are dependable. Use the branch matching the actual response rather than trying every move in order.',
    members:[member('N79','Foundation','Recognize the side seatbelt and whizzer, and establish a comfortable balanced start.'), member('N80','Option','Rise together, then use the leg-back/head-low snap opening.'), member('N81','Option','Use the near-leg post for a low controlled suck-back.'), member('N82','Option','Clear the trapped arm before moving behind.')],
    branches:[branch('N80'), branch('N81'), branch('N82')],
    steps:[
      'Minutes 0-1: check N79 and name each wrestler\'s control. This is a brief foundation review, not a new-move lecture.',
      'Minutes 1-3: review the already-taught N80 rise and snap with an announced opening, alternating one attempt per 30-second turn.',
      'Minutes 3-5: review N81 from a low, offered near-leg post. Alternate controlled attempts and complete resets.',
      'Minutes 5-7: review N82 with a visible arm-free pause before every go-behind.',
      'Minutes 7-11: eight 30-second turns per pair. The receiver announces one familiar opening; the attacker names and attempts the matching choice. Use at most 15 seconds for the exchange and the rest for release and role change.',
      'Minutes 11-12: repeat one unclear opening once per wrestler. If an option is new, remove it from this review block and schedule its own teaching slot.'
    ],
    cues:['Same seatbelt, different reaction.', 'Leg back, foot posted, or arm free?', 'Choose one opening.', 'Release and rebuild between attempts.'],
    move_ids:['N79','N80','N81','N82'],
    readiness:'Intermediate 7-10 or 11-14 partners who recognize the whizzer and can receive the selected finish comfortably. Begin with the foundation and one option; the complete collection is not a default Pups assignment.',
    boundaries:'Keep the trapped shoulder comfortable and the first turns low. No deliberate rib pressure, forced overhook throws, surprise rolls or crossing the back with the arm trapped. A lost opening means reset, not increased force.',
    sources:[seat, clips.snap, clips.suck, clips.limp], verification
  };
  const overtie = {
    id:'S50', title:'Overtie Attack Series', position:'neutral', positions:['neutral'], purposes:['takedown'], uses:[...uses], age_groups:[...groups], tier:'Intermediate', minutes:12,
    summary:'From one compact overtie, clear into a single, slide by incoming pressure, or attack a close turn-back with a double. The turn-back double extends the slide-by; it is not an unrelated shot added to the list.',
    foundation:'N83: tie over the opponent\'s collar-tie arm, keep their head close and retain balance with the other hand free to clear their tie.',
    setup:'Begin from a familiar N83 overtie. The receiving partner offers an available leg, a small forward push, or a turn-back after the taught slide-by. Each branch must be learned on its own before adding a reaction choice.',
    members:[member('N83','Foundation','Compact overtie, foot movement and release.'), member('N84','Option','Clear the collar tie and capture a head-inside single.'), member('B08','Finish','Use only after N84 reaches the familiar low, head-inside single-leg hold.'), member('N85','Option','Pass incoming pressure and follow to rear control.'), member('N86','Option','When the partner turns back close, change level to a double-leg capture.')],
    branches:[branch('N84',['B08']), branch('N85'), {...branch('N86'), move_ids:['N85','N86']}],
    steps:[
      'Minutes 0-1: review N83 and check the free hand can clear the collar tie without stretching the stance.',
      'Minutes 1-3: review N84 capture-and-release. Add B08 only if the finish is already familiar and the captured position matches.',
      'Minutes 3-5: review N85 against a small announced push. End at controlled rear position.',
      'Minutes 5-7: review N86 after an offered turn-back. Pause at the double-leg capture before any finish.',
      'Minutes 7-11: eight 30-second turns per pair. Offer one familiar reaction and make one attempt; use remaining time to release and change roles.',
      'Minutes 11-12: identify the reaction that called for the double rather than a forced go-behind. Schedule any new finish separately instead of squeezing it into this recap.'
    ],
    cues:['Compact overtie first.', 'Leg open: single.', 'Push in: slide by.', 'Turn back close: double.'],
    move_ids:['N83','N84','B08','N85','N86'],
    readiness:'Intermediate partners with a controlled collar tie, basic shot entries and go-behind experience. The tie itself is simple; combining pressure and reaction timing requires separately rehearsed branches. Use prepared 7-10 and 11-14 athletes, not a blanket advanced label.',
    boundaries:'Keep head control gentle and move feet with the partner. No neck torque, arm wrench or head-first shot. Pause at the entry until the chosen finish and receiving have been taught. Foot sweeps and sprawled-single cutbacks are outside this draft.',
    sources:[over1, over2, overSetup, overSlide, clips.single, clips.slide, clips.double], verification
  };

  // This script loads after series-neutral.js and before series-expansion.js.
  // Extend S19 itself: never publish a second Russian series with a competing ID.
  const existing = window.GRINDSTONE_SERIES_NEUTRAL?.series?.find(item => item.id === 'S19');
  if (!existing) throw new Error('Load series-neutral.js before series-next-neutral.js');
  if (!existing.move_ids.includes('N87')) {
    existing.tier = 'Intermediate';
    existing.minutes = 10;
    existing.summary = 'One Russian arm control with three reactions: take the near leg when it stays, pick the far ankle when the near foot retreats, or clear a free-hand head post into a high-crotch entry.';
    existing.foundation = 'A wrist-and-upper-arm Russian tie with an outside angle, the controlled arm close and a balanced stance. Establish this arm control before choosing a reaction; a foot block is specific to the near-single/far-ankle choices, not compulsory for every Russian attack.';
    existing.setup = 'Begin with A01\'s familiar wrist-and-upper-arm control outside the partner\'s captured arm. Add A01/N03\'s brief ankle-block footwork only for those branches. N87 begins before that block and uses its own head-post clear and lunge. A13 remains the defender\'s clear, with different roles.';
    existing.members.push(member('N87','Option','Clear the free-hand head post and stop at a head-outside high-crotch capture.'), member('A04','Finish','Separately taught finish after N87 reaches its familiar high-crotch starting position.'));
    existing.branches.push(branch('N87',['A04']));
    existing.move_ids.push('N87','A04');
    existing.steps = [
      'Minutes 0-1: establish the Russian control and release. Keep the common arm control separate from each branch\'s footwork.',
      'Minutes 1-3: review A01\'s available-near-leg entry. Add B08 only from a stable familiar capture.',
      'Minutes 3-5: review N03 against the offered near-foot retreat. Rehearse its own ankle-block footwork and receiving.',
      'Minutes 5-7: review N87 against a light free-hand head post. Begin without an ankle block and end at the head-outside capture; A04 gets separate time if new.',
      'Minutes 7-9: four 30-second turns per pair. The receiver offers one learned reaction, the attacker chooses one taught branch, then both reset.',
      'Minutes 9-10: each wrestler identifies one difference between the footwork for the ankle choice and the lunge. A13 remains a separately taught defensive role, not a required attacker continuation.'
    ];
    existing.cues.push('Head post: clear, then lunge.');
    existing.readiness = 'Intermediate athletes who can control the Russian, collect the selected shot and receive its finish. Start with one familiar option and add reactions as control improves. Ages 7-10 and 11-14 both use readiness checks; this complete reaction set is not assigned to Pups by default.';
    existing.sources.push(russian, russianPost, clips.lunge);
    existing.verification += ' Extension checked 2026-10-28: detailed Wheeler sources and sampled footage support a head-post/lunge/high-crotch branch. The old two choices and defender clear are preserved. The new card stops at capture; other lunge finishes and wrist-response variants remain separate research. Viewing limits are stated on N87.';
  }
  window.GRINDSTONE_SERIES_NEXT_NEUTRAL = {
    reviewed, moves, series:[seatbelt, overtie],
    placements:{'youth-5':['S49','S50'], 'youth-6':['S49','S50'], 'older-3':['S49','S50'], 'older-4':['S49','S50']},
    research_status:{
      promoted:[
        {series_id:'S49', move_ids:['N79','N80','N81','N82'], status:'ready-for-preview', scope:'Side seatbelt against a whizzer with snap, low suck-back and arm-clear go-behind choices; deliberate-pain rib crusher excluded.'},
        {series_id:'S50', move_ids:['N83','N84','N85','N86'], status:'ready-for-preview', scope:'Compact overtie with single entry, slide-by and turn-back double entry; finishes remain separately taught.'},
        {series_id:'S19', move_ids:['N87'], status:'ready-for-preview', scope:'Existing Russian series gains a head-post clear into a high-crotch capture; its original branches remain intact.'}
      ],
      held:[
        {id:'overtie-foot-sweep', title:'Overtie foot sweep and sprawled-single cutback', sources:[over1.url, over2.url, 'https://www.youtube.com/watch?v=rUoexTEi3Kg', clips.single.url], known:'Free primary sources identify the foot sweep after a slide-by and a cutback after the single meets a sprawl.', missing:'Reviewed foot/hand contacts, reaction timing, controlled receiving and final position for each distinct continuation.', attempted_alternatives:'The unified Askren overtie collection supplies usable entries now. Sweeps and cutbacks remain separate moves to develop, rather than being implied by the three current guides.', backlog_moves:['Overtie slide-by to timed near-foot sweep','Overtie outside-single cutback against a sprawl'], guide_links:[{label:'Overtie Attack Series',href:'#season?view=series&series=S50'}]},
        {id:'russian-wrist-reaction-options', title:'More Russian-tie reactions and lunge finishes', sources:[curriculum.url, russian.url, clips.lunge.url], known:'The curriculum lists high-crotch, fireman, elbow-pull and duck-under responses to different wrist, head and elbow reactions. Wheeler\'s free lesson also demonstrates more than one lunge endpoint.', missing:'Exact matching demonstrations and complete hand transfers for the wrist-grab, wrist-peel, head-hook and elbow-grab branches; separate review of the lunge-to-back and pivoted outside-single finishes.', attempted_alternatives:'A detailed free Wheeler source supports the head-post/high-crotch entry added as N87. Curriculum names alone are retained here without being turned into assumed move steps.', backlog_moves:['Russian wrist-grab to far high crotch','Russian wrist-peel to fireman','Russian head-hook elbow pull','Russian elbow-grab duck-under','Russian lunge to rear control','Russian lunge pivot to outside single'], guide_links:[{label:'Russian two-on-one series',href:'#season?view=series&series=S19'}]}
      ]
    }
  };
})();
