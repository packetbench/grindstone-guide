/* Preview additions: source-matched top choices, with unfinished lessons held separately. */
(() => {
  'use strict';
  const older = ['11-14'];
  const uses = ['teach', 'review', 'reps', 'reaction', 'situational'];
  const barHalf = {
    title: 'Logan Stieber / RUDIS - Arm Bar Series, Part 3: Arm Bar Half',
    url: 'https://www.youtube.com/watch?v=sMvoi7E5lZg',
    note: 'Free primary lesson. Auto-generated transcript reviewed; decoded frames at 3:24, 3:29 and 5:11 support the opposite-half side change and retained short bar. This guide uses the ground turn before the later leg-in roll. Pain-based cues and forehead pressure are excluded.'
  };
  const circle = {
    title: 'Logan Stieber / RUDIS - Arm Bar Series, Part 4: Circle to the Head',
    url: 'https://www.youtube.com/watch?v=APFl5zg3WRM',
    note: 'Free primary lesson. Auto-generated transcript and decoded frames at 1:20, 1:53 and 2:09 reviewed. Scope: 1:04-2:16. The free forearm crosses the chin line; the later pin uses the top wrestler\'s chin against the shoulder. This youth drill stops at a supported side-turn before that finishing pressure. The later sit-in/high-post response remains held.'
  };
  const wrist = {
    title: 'Logan Stieber / RUDIS - Arm Bar Series, Part 2: Arm Bar Wrist',
    url: 'https://www.youtube.com/watch?v=WmthqKA7RJs',
    note: 'Primary source for the wider short-bar family. Metadata checked in this pass, not newly audited footage. The far-wrist choice reuses the existing A23 written guide and its previously recorded sources; it is not republished as a new move.'
  };
  const kolatPlan = {
    title: 'Cary Kolat - Fundamental Bottom Drills, Arm Bar Half',
    url: 'https://www.kolat.com/practice-plans/training-session-fundamental-bottom-drills-arm-bar-half',
    note: 'Public primary practice outline supports short-bar control with wrist/shoulder blocks and an opponent-counter response to the half. It supports the family, not the exact mechanics of the Stieber variants.'
  };
  const rules = {
    title: 'NFHS - Wrestling Points of Emphasis: Dangerous Maneuvers and Holds',
    url: 'https://www.nfhs.org/resources/sports/wrestling-points-of-emphasis-2024-25',
    note: 'Risk-minimization guidance against injurious joint and neck pressure. Club practice limits below are teaching choices; this older reference is not a substitute for current event rules.'
  };
  const returnsCourse = {
    title: 'Kyle Cerminara / Fanatic Wrestling - Single Leg Seat Belt Series and Mat Returns',
    url: 'https://fanaticwrestling.com/products/single-leg-seat-belt-series-and-mat-returns-by-kyle-ceminara',
    note: 'The public course menu identifies connected rear-control and quadpod options. The full course is paid. A menu item alone is not treated as a reviewed lesson.'
  };
  const quadCourse = {
    title: 'Hudson Taylor / Fanatic Wrestling - Complete Wrestling Riding System, Volume 1',
    url: 'https://fanaticwrestling.com/products/the-complete-wrestling-riding-system-volume-1-by-hudson-taylor',
    note: 'Paid course with a public syllabus. Its rear-quadpod section names backside single, redirect, backside chop and backside trip; full demonstrations were not reviewed.'
  };

  const moves = [
    {
      id: 'N95', name: 'Arm Bar and Opposite Half Turn', category: 'top', tier: 'Advanced',
      age_groups: [...older], positions: ['top'], purposes: ['ride', 'turn'], uses: [...uses],
      aliases: ['bar and half', 'short bar to far half', 'Stieber arm bar half'],
      purpose: 'Keep the short bar and turn from the opposite half when the far wrist is unavailable.',
      prerequisite: 'A23 and a comfortable half nelson. Both wrestlers can receive a supported turn and immediately release. A coach checks this two-arm combination before partner repetitions.',
      setup: 'Start belly-down with the short bar already comfortable. The bar fist rests at mid-back and the other arm is free. Rehearse a far wrist that withdraws without resistance; do not force the wrist behind the back.',
      steps: [
        'Keep the bar short. With the free hand, cup the opposite shoulder palm-up, then thread that arm beneath its armpit and place the hand behind the head for the half.',
        'Set your base beside the bar, then move across to the half side while keeping chest contact. Walk the side change in this learning drill.',
        'Guide the half-side shoulder toward the mat. Keep the bar fist at mid-back; do not let it climb toward the head.',
        'Step your body around with the turn, carrying the bent barred arm with the torso. Follow into supported side/back exposure rather than pulling either arm independently.',
        'Pause, ease both controls and reset under the coach\'s direction. A blocked shoulder or rising bar hand ends the attempt immediately.'
      ],
      cues: ['Wrist unavailable: check the half.', 'Short bar, fist stays low.', 'Move to the half side.', 'Body and shoulder travel together.'],
      drill: 'Six-minute introduction: 1 minute demonstration; 1 minute checking both controls without turning; 3 minutes alternating one slow supervised attempt in each 30-second turn; 1 minute feedback. The receiver follows the announced rotation with no rigid arm post. This is a first lesson, not an unscripted scramble.',
      boundary: 'No pain compliance, lifted bar hand, arm wrench, neck fold, throat pressure, leg-in roll or standing with both arms controlled. Stop for discomfort, a caught arm or an unexpected response. Do not use a harder half to overcome a fixed shoulder.',
      error: 'The rider stays on the bar side and tries to pull the opponent over using the arms alone.',
      fix: 'Release and rehearse the side change without a turn. Rebuild the short bar and half only when the rider can move the body while keeping the partner comfortable.',
      video: {url: barHalf.url + '&t=139s', title: 'Arm Bar Half - opposite-half turn', channel: 'RUDIS / Logan Stieber', format: 'video', match: 'direct', note: 'Use the ground turn around 2:19-5:20. The later leg-in roll is outside this lesson. The source retains the bar through the turn; the written pause/reset is a club drill boundary.'},
      sources: [barHalf, kolatPlan, rules],
      verification: 'Reviewed 2026-10-28 through the automatic transcript and sampled decoded frames, not continuous audio/video review. A bar-first opposite-half variant is supported. This does not validate the retired N34 draft or an unobserved early release. Cooperative receiving, timing and stop conditions are Grindstone adaptations.',
      series_id: 'S51', role: 'option',
      branch: {title: 'Far wrist withdraws; opposite half opens', when: 'The short bar remains comfortable but bottom removes the far wrist, leaving an accessible opposite armpit.', action: 'Set the half, change to its side and move the whole body through a controlled turn.', readiness: 'A23, a reliable half and direct coach approval of both partners\' receiving and release.'}
    },
    {
      id: 'N96', name: 'Arm Bar Circle-to-Head Turn', category: 'top', tier: 'Advanced',
      age_groups: [...older], positions: ['top'], purposes: ['ride', 'turn'], uses: [...uses],
      aliases: ['Stieber circle to the head', 'short bar crossface turn'],
      purpose: 'Use a different angle when the short bar remains but neither the far wrist nor the opposite half is available.',
      prerequisite: 'A23 plus coach-taught, comfortable crossface positioning. Use experienced partners who can turn head, shoulders and hips together without neck strain.',
      setup: 'Start belly-down with the short bar set. Bottom keeps the free elbow close so the ordinary wrist/half routes are absent. The coach first checks the front-arm contact without any turning pressure.',
      steps: [
        'Keep the short bar close. Pass the free arm over bottom\'s free arm and across the front at the chin line, palm facing down. Do not press on the throat.',
        'Walk your feet back while circling toward the head. Move from your base instead of yanking the bar arm backward.',
        'Let the torso turn as a unit while your chest follows across the shoulders. Keep the head traveling with the body; stop if it becomes fixed or twisted.',
        'For this lesson, stop at the supported side-turn. Do not add the source\'s top-chin-to-shoulder pinning pressure or its later sit-in counter.',
        'Ease the front-arm contact, release the bar without tugging the shoulder and let bottom reset. The coach supervises the complete release before roles change.'
      ],
      cues: ['No wrist or half: change the angle.', 'Walk the feet, do not yank the bar.', 'Head moves with the body.', 'Side-turn, pause, reset.'],
      drill: 'Six-minute introduction: 1 minute demonstration; 1 minute coach-checking the chin-line contact and feet without turning; 3 minutes alternating one slow partial turn per 30-second turn; 1 minute feedback. Receiving starts cooperative, with a clear stop signal. Do not use resistance to test a partner\'s neck flexibility.',
      boundary: 'No throat pressure, face grinding, isolated chin twist, neck crank, lifted bar hand, shoulder wrench, sudden backward pull or bodyweight drop. Do not continue against a fixed head or shoulder. This guide stops before a full pinning settle.',
      error: 'Top pulls the arm backward while the feet remain fixed, or turns the head without the shoulders.',
      fix: 'Open the controls. Rehearse the circling footwork without a partner, then repeat a smaller coach-supervised side-turn. If the front contact cannot stay comfortable, choose the familiar A23 option instead.',
      video: {url: circle.url + '&t=64s', title: 'Circle to the Head - short-bar alternative', channel: 'RUDIS / Logan Stieber', format: 'video', match: 'component', note: 'The guide uses the setup and side-turn in 1:04-2:16. The demonstration continues to a pin using the rider\'s chin against the shoulder; that finishing pressure and the later sit-in variation are not included.'},
      sources: [circle, rules],
      verification: 'Reviewed 2026-10-28: automatic transcript plus decoded frames at 1:20, 1:53 and 2:09. The free forearm is at the defender\'s chin line; the finishing chin cue refers to the rider\'s chin. This bounded youth drill deliberately stops earlier and does not claim a complete pin or an observed bar-release sequence.',
      series_id: 'S51', role: 'option',
      branch: {title: 'Wrist and half are unavailable', when: 'Bottom remains low with a comfortable short bar, but the free arm blocks the familiar wrist and half paths.', action: 'Use the checked front-arm contact and circling/back-stepping footwork to a supported side-turn.', readiness: 'Experienced 11-14 partners, A23, comfortable crossface positioning and direct coach supervision.'}
    }
  ];

  const series = [
    {
      id: 'S51', title: 'Arm Bar Finishing Series', position: 'top', positions: ['top'],
      purposes: ['ride', 'turn', 'pin'], uses: [...uses], age_groups: [...older], tier: 'Intermediate', minutes: 12,
      summary: 'One short bar, three choices: the familiar far-wrist turn, an opposite half, or a circle-to-head angle. Keep A23 as the core finish and add only the option the pair is ready to receive.',
      foundation: 'Use the short-bar checkpoint already taught in A23: bottom low, barred elbow bent and close, rider\'s fist at mid-back. The other hand selects a control. Do not push the hand higher to manufacture a turn.',
      setup: 'Teach N95 and N96 in separate introductory slots before combining choices. At each reset, bottom offers one rehearsed opening. Top names the matching option before moving. This is a choice drill, not a demand to apply every hold in one continuous exchange.',
      members: [
        {move_id: 'A23', role: 'Foundation', note: 'Canonical short bar and far-wrist turn. Reuse this guide rather than create another version of the same finish.', tier: 'Intermediate', age_groups: [...older]},
        {move_id: 'N95', role: 'Option', note: 'Change to the opposite half side when the far wrist withdraws. Requires a separately checked two-arm turn.', tier: 'Advanced', age_groups: [...older]},
        {move_id: 'N96', role: 'Option', note: 'Circle toward the head when neither wrist nor half fits; this practice version ends at a supported side-turn.', tier: 'Advanced', age_groups: [...older]}
      ],
      branches: [
        {title: 'Far wrist is available', when: 'The wrist can be held comfortably under the chest from the familiar A23 start.', action: 'Use A23, including its deliberate side pause, bar release and chest-to-chest completion.', move_ids: ['A23'], tier: 'Intermediate', age_groups: [...older], readiness: 'The pair has already learned A23\'s control, turn and release.'},
        {title: 'Opposite half is available', when: 'The far wrist withdraws and the opposite armpit opens without forcing the elbow.', action: 'Use N95 with a coach-checked half-side turn.', move_ids: ['N95'], tier: 'Advanced', age_groups: [...older], readiness: 'N95 was taught separately; both partners can receive its combined controls.'},
        {title: 'Change the circling angle', when: 'The short bar is comfortable but neither wrist nor half is accessible, and the checked chin-line contact is available.', action: 'Use N96 to a supported side-turn, then release and reset.', move_ids: ['N96'], tier: 'Advanced', age_groups: [...older], readiness: 'N96 was taught separately with a coach; no resistance through a fixed head or shoulder.'}
      ],
      steps: [
        'Minutes 0-2: review the short-bar checkpoint and immediate release. Identify the familiar A23 wrist choice.',
        'Minutes 2-4: alternate one A23 turn and reset per 30-second turn.',
        'Minutes 4-6: review the separately learned N95 option. Use announced openings and a full reset.',
        'Minutes 6-8: review N96 only for pairs cleared for that contact and side-turn. Other pairs repeat their familiar option.',
        'Minutes 8-11: six 30-second turns per pair. Bottom offers one learned opening; top names one choice and makes one controlled attempt. Use the remaining time to release and change roles.',
        'Minutes 11-12: each wrestler names the preferred first option and one reason to stop. Add unfamiliar instruction in a new slot rather than rushing it into this review.'
      ],
      cues: ['Same short bar, different opening.', 'Wrist first; add only a taught option.', 'Do not lift the bar hand.', 'No comfortable route: reset.'],
      move_ids: ['A23', 'N95', 'N96'],
      readiness: 'Intermediate describes the existing short-bar foundation. The optional combined-arm and chin-line turns are advanced branches for prepared 11-14 partners under direct coaching, not automatic additions for every wrestler. This collection is not a default Pups assignment. A younger athlete can continue ordinary breakdowns and half nelsons without needing this combination.',
      boundaries: 'Preserve each guide\'s endpoint. A23 releases the bar before its chest-to-chest finish; N95 retains it through the demonstrated turn; N96 stops at a supported side-turn. Do not mix these details. No forced joints, neck pressure, standing double-arm control, surprise roll or pain-based compliance.',
      verification: 'Reviewed 2026-10-28. Existing A23 is reused. The two new variants follow free RUDIS instruction reviewed through automatic transcripts and selected decoded frames; no continuous playback claim is made. Drill timing, readiness and reduced endpoints are club adaptations. The later leg-in roll and high-post counter remain outside the teaching collection.',
      sources: [barHalf, circle, wrist, kolatPlan, rules]
    }
  ];

  const held = [
    {
      id: 'armbar-high-post-continuation', title: 'Armbar sit-in counter and leg-in roll follow-ups',
      sources: [circle.url, barHalf.url],
      known: 'Part 4 later teaches a high-post response when bottom sits into the bar. Part 3 later adds a leg-in roll. These differ from the bounded N95/N96 turns.',
      missing: 'Complete hand, hip and leg transitions with a verified receiving endpoint for each variant. A transcript alone does not resolve every occluded contact.',
      attempted_alternatives: 'RUDIS Parts 3 and 4 were read through their automatic transcripts and sampled visually. The earlier ground turns were developed; later transitions were not treated as identical.',
      research_update: 'Keep these individual moves for a later review rather than add them to the current armbar lesson.',
      guide_links: [{label: 'Arm Bar Finishing Series', href: '#season?view=series&series=S51'}],
      backlog_moves: ['Armbar high-post counter to sit-in', 'Armbar-and-half leg-in roll']
    },
    {
      id: 'standing-return-options', title: 'Standing Mat Returns Series - reserved S52',
      sources: [returnsCourse.url, 'https://www.youtube.com/watch?v=oJLTT0R4-iU', 'https://www.youtube.com/watch?v=o-DnvsPcNX8', 'https://www.kolat.com/returning-opponent-from-stand-up', 'https://www.hudsonwrestling.com/foundational-skills'],
      known: 'N25 already supplies a usable hip-dump return. Cerminara\'s free inside-trip excerpt was sampled at 0:15, 0:20, 0:25, 0:30, 1:08 and 1:20: close standing rear-waist control, a same-side foot threaded between the feet, an inside near-leg hook and forward descent to hands and knees are visible. The waist clasp opens as top settles.',
      missing: 'The exact foot-hook angle is occluded and no transcript loaded. The Stieber Elite Mat Return Options clip has verified title/publisher metadata but has not had a complete mechanics review in this batch. Neither gap should be filled with an assumed heel trip or a new lifting instruction.',
      attempted_alternatives: 'Checked the public Cerminara course and its freely embedded inside-trip video, Stieber Elite\'s public return collection linked by Hudson Youth Wrestling, and Kolat\'s return index. The Kolat YouTube excerpt returned unavailable metadata and its named lesson is a whizzer-to-Navy variation, not a generic replacement return.',
      research_update: 'Keep using N25 while completing the low-return alternatives. S52 is reserved, not offered as a completed builder series. Before promotion, verify the leg relationship, receiving route, control through descent and grounded hand release for each distinct option.',
      guide_links: [{label: 'Hip Dump Mat Return', href: '#move/N25'}],
      backlog_moves: ['Rear inside-trip mat return', 'Front-trip mat return', 'Long-arm/short-arm return when the lift is blocked', 'Standing return to double-knee drop']
    },
    {
      id: 'rear-quadpod-control-series', title: 'Rear Quadpod Control Series - reserved S53',
      sources: [quadCourse.url, returnsCourse.url, 'https://fanaticwrestling.com/products/mastering-control-from-the-top-position-by-trent-hidlay', 'https://fanaticwrestling.com/products/mastering-mat-returns-by-mike-malinconico', 'https://www.coachmackenzie.com/claw-series.html'],
      known: 'Primary course menus support a real family of rear-quadpod responses: backside single, redirect, backside chop and backside trip. Cerminara also lists spiral, pull-back and split-leg options. MacKenzie publishes a claw-specific foot-block outline, which is a different starting control.',
      missing: 'Freely reviewed demonstrations establishing the exact separate-hand rear control, response triggers, foot/hand changes and controlled return for at least three connected choices. Paid chapter names do not establish those mechanics.',
      attempted_alternatives: 'Checked Taylor, Cerminara, Hidlay and Malinconico public course pages, Kolat\'s public riding outline and MacKenzie\'s written claw material. Free publisher samples did not establish the full rear-quadpod family in this review.',
      research_update: 'S53 remains reserved and is not inserted into the practice builder. Develop one verified branch at a time; do not convert a claw lesson or a standing body-lock return into an unverified quadpod guide.',
      backlog_moves: ['Rear-quadpod backside single', 'Rear-quadpod redirect', 'Rear-quadpod backside chop', 'Rear-quadpod backside trip', 'Quadpod spiral breakdown', 'Quadpod pull-back', 'Quadpod split-leg dump']
    }
  ];

  for (const item of [...series, ...moves]) {
    for (const source of item.sources || []) source.accessed = '2026-10-28';
  }
  window.GRINDSTONE_SERIES_NEXT_TOP = {
    reviewed: '2026-10-28', moves, series,
    placements: {'older-5': ['S51'], 'older-6': ['S51']},
    research_status: {
      promoted: [{series_id: 'S51', move_ids: ['N95', 'N96'], status: 'ready-for-preview', scope: 'Reuses A23 and adds two bounded, source-matched alternatives from the same short bar.'}],
      held
    }
  };
})();
