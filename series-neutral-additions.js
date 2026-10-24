/* Compact decision series supported by public written instruction. */
window.GRINDSTONE_SERIES_NEUTRAL_ADDITIONS = {
  reviewed: "2026-10-24",
  series: [
    {
      id: "S28",
      title: "Collar-tie pass-by series",
      position: "neutral",
      age_groups: ["11-14"],
      tier: "Advanced",
      minutes: 8,
      summary: "Pass to rear control or change to a knee block when the partner squares up. Two choices from the same collar tie; a different elbow grip is not counted as another branch.",
      foundation: "A balanced mutual collar tie with forward pressure and the free hand on top of the partner's tying elbow. This uses the creator's hand-on-elbow Akin variation.",
      setup: "Review N41 first. Match partners for size and control, mark clear working space and agree on cooperative contact. This series uses Weber's collar-tie start; K08 remains a related reference, not proof of the same grip. Establish the exact starting control before each repetition.",
      members: [
        {move_id: "N41", role: "Foundation", note: "Shared collar-tie entry and open-path option. Rear control is the first stopping point, not a completed takedown."},
        {move_id: "N42", role: "Option", note: "Separate knee-block finish after the defender turns to face the pass."},
        {move_id: "B04", role: "Preparation", note: "Balanced hand-fighting preparation; teach N41's collar tie separately."},
        {move_id: "K08", role: "Reference", note: "Coach Kyle's submitted pass-by reference. Its exact grip and finish are not assumed to match this series."}
      ],
      branches: [
        {
          title: "Follow the open path behind",
          when: "The pass leaves the partner's back available.",
          action: "Use N41 and freeze at rear control. Release and reset; a mat return requires a separately taught lesson.",
          readiness: "Both athletes can keep balance, move their feet and stop at the agreed position without pulling the neck.",
          move_ids: ["N41"]
        },
        {
          title: "Knee block when the partner squares up",
          when: "The partner turns to face the pass and the target knee remains close.",
          action: "Use N42. Begin with a touch-and-freeze check; add the descent only after receiving practice.",
          readiness: "N41 plus a separately learned N42 finish and controlled receiving. No chasing a distant knee.",
          move_ids: ["N42"]
        }
      ],
      steps: [
        "This is an 8-minute review block after N41 and N42 have been taught separately. Minutes 0–2: check the shared tie, rear-control stop and knee-block receiving.",
        "Minutes 2–5: announce one response at a time and alternate two repetitions per attacker. Pause before the knee-block descent if the coach needs to recheck receiving.",
        "Minutes 5–7: receiver chooses either taught response at walking speed. One choice per exchange; reset at the agreed finish, lost opening or 15 seconds, and swap after two attempts.",
        "Minutes 7–8: each athlete names the opening and demonstrates one clean option. Teach an unfamiliar or unreliable component in a separate block before returning to choices.",
        "These timing and choice rules are Grindstone practice design. Increase resistance only after controlled receiving, not because a clock has expired."
      ],
      cues: ["Read the turn.", "Move your feet.", "Freeze, release, reset."],
      move_ids: ["N41", "N42", "B04", "K08"],
      readiness: "Experienced 11–14 athletes with reliable tie release and controlled takedown receiving. Ready 7–10 athletes may practice N41's capture-only lesson separately; this complete two-choice series is not their default. Pups use solo stance and turning activities.",
      boundaries: "No neck wrench, head snap, arm strike, planted-knee twist, lift or unannounced mat return. Receiving control is required before any descent. Reset when contact becomes stretched, either athlete stumbles, or the target is absent.",
      sources: [
        {title: "Daryl Weber — Pass-by / Slide-By Series", url: "https://www.attackstylewrestling.com/pass-by-series/", note: "Public written instruction explains the pressure pass and square-up knee-block response. The Akin elbow-grip variation is not a separate decision branch."},
        {title: "Attack Style Wrestling — Pass-by Series demonstration", url: "https://player.vimeo.com/video/528699047", note: "Original embed identified on the creator's page. Complete footage and audio were not reviewed."}
      ],
      verification: "Creator's written article and original Vimeo embed identity checked on 2026-10-24. Instructions use the written evidence; no complete footage or audio review is claimed. Capture-only pauses, partner assignments, teaching doses, readiness limits and reset rules are Grindstone coaching adaptations."
    }
  ],
  moves: [
    {
      id: "N41",
      name: "Collar-Tie Pass-By to Rear Control",
      category: "attacks",
      tier: "Advanced",
      age_groups: ["7-10", "11-14"],
      purpose: "Gain an angle past a collar tie and stop behind the partner. This capture-only lesson prepares a later finish; it does not teach a mat return.",
      prerequisite: "Balanced stance, controlled collar-tie contact and immediate release. Partners must be able to step and turn without falling. Coach checks individual readiness for 7–10 athletes; Pups use solo movement preparation.",
      steps: [
        "Agree on a slow repetition and a rear-control stopping point. Begin in mutual collar ties, with the other arm free.",
        "Put your free hand on top of their tying elbow. Offer gentle forward pressure. As they return it, guide that elbow past to clear the tie while drawing them by with your collar tie and stepping aside. Keep the contact smooth; do not strike.",
        "If the path stays open, move behind. Release the head and establish light rear-waist contact without squeezing or lifting.",
        "Freeze standing, release both hands and separate. Rear control alone is not a completed takedown. Do not improvise a trip or return.",
        "If the partner turns to face you, stop this repetition. N42 is a separately taught option; until then, reset to stance."
      ],
      cues: ["Feel, pass, step.", "Stop behind.", "Release the head."],
      error: "The attacker keeps pulling while their feet stay planted.",
      fix: "Remove partner contact and rehearse a short side step and balanced turn. Restore light contact only when the feet move reliably.",
      drill: "Pairs take three cooperative capture-and-release repetitions each. Pause briefly at rear control, then release before changing roles. Repeat only while both can remain balanced; there is no scored race or compulsory takedown.",
      boundary: "No elbow strike, neck wrench, head snap, rear lift or forced descent. The collar tie is guiding contact, not a handle for twisting the head. Stop for lost balance, stretched arms or discomfort. A ready younger athlete uses this capture-only version.",
      video: {
        url: "https://player.vimeo.com/video/528699047",
        title: "Pass-by Series",
        format: "video",
        channel: "Attack Style Wrestling / Daryl Weber",
        match: "component",
        note: "Creator's original embedded demonstration accompanies the written pass-by lesson and includes finishes beyond this capture-only card. The embed title was checked; complete footage and audio were not reviewed."
      },
      sources: [
        {title: "Daryl Weber — Pass-by / Slide-By Series", url: "https://www.attackstylewrestling.com/pass-by-series/"}
      ],
      verification: "Written primary lesson and Vimeo embed identity checked on 2026-10-24. Selects the hand-on-elbow Akin variation in Step 2, not the elbow-contact version in Step 1. No complete footage review. Stopping at rear control, receiving, role schedule and age guidance are Grindstone adaptations.",
      series_id: "S28",
      role: "foundation"
    },
    {
      id: "N42",
      name: "Pass-By to Knee-Block Finish",
      category: "attacks",
      tier: "Advanced",
      age_groups: ["11-14"],
      purpose: "Finish after a partner closes the pass-by path. Teach the new finish separately before asking the attacker to choose it during a moving exchange.",
      prerequisite: "N41 and a coach-checked controlled descent for both partners. Athletes can lower their levels, keep knee and foot aligned, release the head and stop before finishing. This advanced lesson is not a Pup activity or a default 7–10 choice.",
      steps: [
        "Begin with N41 at walking speed. For this rehearsal, the receiver deliberately turns to face the attacker and then pauses in a balanced stance.",
        "Keep the collar tie. Lower your level and put the free hand at the knee on that hand's side. Use a broad blocking contact, not a strike. Freeze here for the coach's first check.",
        "After receiving is established, guide the upper body over that blocked leg while the receiver lowers under control. Do not pull the knee sideways.",
        "Release the head as the partner reaches the mat and settle into separate waist-and-arm control behind the hips. Freeze and release before resetting.",
        "If the knee is out of reach, the head control has gone or the foot cannot turn comfortably, abandon the finish and reset. Do not reach farther or increase force."
      ],
      cues: ["Turn seen; target close.", "Touch, check, finish.", "Guide the landing."],
      error: "The attacker reaches for a distant knee and folds over while dragging the head.",
      fix: "Return to the stationary checkpoint. Shorten the distance and rehearse the hand contact without a descent; reset whenever that checkpoint cannot be reached in balance.",
      drill: "Take three touch-and-freeze attempts per athlete. Coach approves contact and receiving before adding two cooperative finishes each. In a later round, alternate an announced open path with an announced square-up. End the exchange at the agreed control, then swap roles after three attempts.",
      boundary: "No sideways knee pressure, neck torque, stiff-arm fall, slam or high-speed finish. The receiver must be ready for the descent and able to move the feet. Reset for a planted or trapped leg, lost posture or discomfort. No surprise counter during the introductory drill.",
      video: {
        url: "https://player.vimeo.com/video/528699047",
        title: "Pass-by Series — knee-block option",
        format: "video",
        channel: "Attack Style Wrestling / Daryl Weber",
        match: "component",
        note: "The creator's article explicitly describes the square-up knee-block finish and embeds this series video. Complete footage and audio were not reviewed; the introductory freeze and receiving progression are coaching adaptations."
      },
      sources: [
        {title: "Daryl Weber — Pass-by / Slide-By Series, knee-block section", url: "https://www.attackstylewrestling.com/pass-by-series/"}
      ],
      verification: "Written knee-block section and original embedded video identity checked on 2026-10-24. No continuous footage or narration review is claimed. Slow checkpoints, receiving limits, covering/reset instructions and age recommendations are Grindstone coaching adaptations.",
      series_id: "S28",
      role: "option"
    }
  ],
  placements: {"older-4": ["S28"], "older-5": ["S28"], "older-6": ["S28"]}
};
