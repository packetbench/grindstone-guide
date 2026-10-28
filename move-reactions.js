/* Teaching connections between existing guides, not new technique instruction.
   A response changes wrestler; a continuation belongs to the original wrestler.
   Conditions come from the written guides. Existing video-review limits still apply. */
(() => {
  "use strict";
  const links = [
    {
      from: "N79", to: "N80", kind: "continuation",
      condition: "Your partner rises with your seatbelt, withdraws the near leg and keeps the head low. Shorten to the separately taught underhook snap only while that opening is present; an upright partner or available leg calls for a different choice.",
      reverse: "Begin as the attacker in N79, with your arm across the back and the partner's whizzer around it. N80 is your response to the announced rise and leg withdrawal, not the whizzer holder's counter."
    },
    {
      from: "N79", to: "N81", kind: "continuation",
      condition: "The partner posts the near foot while keeping the whizzer. From the low seatbelt, use N81's hip connection and controlled pull-back only after both partners have learned its receiving; do not turn it into a standing throw.",
      reverse: "Start beside the partner in N79 with the near-leg post offered. You keep the seatbelt while the partner owns the whizzer. Identify that leg post before using the low suck-back."
    },
    {
      from: "N79", to: "N82", kind: "continuation",
      condition: "The partner remains low and your trapped hand and elbow can move toward your hip. Clear the whizzer completely before circling behind; a fixed arm ends the attempt.",
      reverse: "Use from N79's seatbelt-against-whizzer start. This is the seatbelt wrestler's arm clearance and go-behind. Keep the clear-arm pause before moving the hips around."
    },
    {
      from: "N83", to: "N84", kind: "continuation",
      condition: "The partner's collar-tie arm can be cleared and the near leg is within a balanced outside step. Use the separately taught N84 entry and stop at its low head-inside capture before adding any single-leg finish.",
      reverse: "Establish N83's compact overtie first. N84 changes from head control to the leg only after clearing the collar tie; do not shoot while the head is still being pulled down."
    },
    {
      from: "N83", to: "N85", kind: "continuation",
      condition: "The partner pushes back into your compact overtie and a path past the shoulder opens. Use N85's collar-tie clearance and slide-by, following to rear control only if the partner continues past.",
      reverse: "Begin in N83 and offer the familiar forward-pressure reaction. This slide-by belongs to the overtie wrestler; it is not an instruction for the partner to counter their own collar tie."
    },
    {
      from: "N85", to: "N86", kind: "continuation",
      condition: "Before you reach rear control, the partner turns back close enough to face you. Use N86's level change and release the head tie as you collect both legs. A retreating partner does not create this same entry.",
      reverse: "Build from N85 only on the rehearsed close turn-back. Learn N86's capture and the receiving for any later double-leg finish separately; slide-by order alone does not make the opening."
    },
    {
      from: "N87", to: "A04", kind: "continuation",
      condition: "After clearing the head post, pause at a stable head-outside high-crotch capture. Continue with A04 only when its captured leg, outside-head position, hand placement and ready receiving all match; teach the other side separately instead of guessing a mirror.",
      reverse: "N87 supplies a Russian-tie entry, not an automatic finish. Establish A04's exact high-crotch checkpoint before transferring the inside hand to the far knee for the double. Do not repeat A04's neutral entry while already holding the leg."
    },
    {
      from: "A23", to: "N95", kind: "continuation",
      condition: "Before the far-wrist turn finishes, the wrist withdraws while the short bar stays comfortable and the opposite armpit opens. Use the separately taught N95 bar-and-half option from that checkpoint, not after A23 has released the bar.",
      reverse: "Re-establish A23's comfortable short-bar foundation, then select N95 instead of the far-wrist finish. The original rider changes controls; the receiver is not attempting an escape. Direct coach approval of this two-arm turn remains required."
    },
    {
      from: "A23", to: "N96", kind: "continuation",
      condition: "From the established short bar, neither the far wrist nor the opposite half is available, and N96's checked chin-line contact fits. Select its supported side-turn only after separate instruction; do not force an unavailable head or shoulder path.",
      reverse: "Use A23's short bar as the starting control, not its completed chest-to-chest finish. N96 is an alternative angle for the same rider and ends before the source's additional pinning pressure. Keep its experienced-partner and direct-supervision requirements."
    },
    {
      from: "A18", to: "N111", kind: "continuation",
      condition: "The rider has chopped the elevated base back to hands and knees and continues the rehearsed waist-and-chop pressure. Only after reaching N111's exact grounded start, with wrists and ankles free and K19 shoulder-roll readiness, use that escape. Do not roll directly from the feet-supported tripod.",
      reverse: "This is the bottom wrestler's recovery after A18's rise is broken down. Rebuild the N111 hands-and-knees checkpoint first; its side roll requires the separately learned K19 mechanics and an unloaded head. It is not a new attack by the rider."
    },
    {
      from: "N115", to: "N116", kind: "continuation",
      condition: "The heel cup, inside support palm and temple-above-knee contact remain close, and the receiver stays upright enough for the basic finish. Use N116 only after its whole-leg rotation and side-hip receiving are taught; this is not the answer to every sprawl.",
      reverse: "Begin in N115's checked low-single capture. N116 is the same attacker's lasso finish, with hips and knee moving together. Reset if the head contact or heel cup stretches away rather than wrenching the leg to complete it."
    },
    {
      from: "N65", to: "N73", kind: "response",
      condition: "Bottom can work from the separately taught one-hook defensive hip-sit. Establish N73's start first; this is an answer to an inserted leg, not the Western ankle hook.",
      reverse: "Your opponent has one inserted boot. Identify the trapped leg and keep the upper body free enough for the named seated start before beginning the clearance."
    },
    {
      from: "N65", to: "N76", kind: "response",
      condition: "If the rider crosses their own ankles around the single inserted-leg control, bottom has the distinct N76 counter. This remains one inserted leg; crossed ankles do not automatically mean two boots.",
      reverse: "Start in the checked seated one-leg position with the rider's ankles crossed. Clear that connection before moving the hips into the taught reversal."
    },
    {
      from: "N69", to: "N77", kind: "response",
      condition: "Bottom uses the two-boot recovery lesson when each leg is hooked. Teach the defensive position separately with the rider following; do not insert a surprise escape during a half turn.",
      reverse: "Your opponent has two established hooks, one around each leg. N77 identifies the recovery position for this problem rather than borrowing a one-leg clearance."
    },
    {
      from: "N73", to: "N74", kind: "continuation",
      condition: "From the balanced one-leg hip-sit, use the free foot to hold the rider's hook down while withdrawing the trapped knee. Finish at a usable base before choosing an exit.",
      reverse: "Begin in N73's established seated one-hook position with a free support hand and free leg. This is your clearance, not the rider's counter."
    },
    {
      from: "N77", to: "N78", kind: "continuation",
      condition: "From the taught two-boot seated position, control a reachable boot, clear it past the knee and move the hips across using N78. A hook still attached calls for further clearance, not a forced turn.",
      reverse: "Use after recovering N77's checked position. Keep track of both hooks and the remaining upper-body grip before claiming a reversal or escape."
    },
    {
      from: "N74", to: "B17", kind: "continuation",
      condition: "After the hook is fully clear and you have rebuilt a stable base, use the familiar stand-up and hand-control finish. Leg clearance alone does not score an escape.",
      reverse: "N74 has removed the leg hook. Re-establish B17's base and waist-hand controls before standing; never stand with an inserted leg still attached."
    },
    {
      from: "N76", to: "N61", kind: "continuation",
      condition: "Once the counter puts you on top with the thigh scooped, check N61's exact Navy control before choosing a turn. The reversal and subsequent ride are separate checkpoints.",
      reverse: "N76 can bring you to top control from the crossed-ankle one-leg position. Check the far-thigh scoop and your balance before continuing the Navy series."
    },
    ...[['N65','N66'],['N65','N67'],['N65','N68'],['N69','N70'],['N69','N71'],['N69','N72']].map(([from,to]) => ({
      from, to, kind: 'continuation',
      condition: 'Use this separately taught option only when its named posture or opening is present. Retain the series foundation and check the guide before combining the actions.',
      reverse: 'This is the original rider\'s option from the shared leg-riding foundation. Establish the guide\'s exact start rather than treating every branch as a required sequence.'
    })),
    {
      from: "N61", to: "N62", kind: "continuation",
      condition: "From your Navy far-thigh scoop, bottom lies on the side facing away and the upper shoulder is available. Use the taught shoulder cup to turn the shoulders back with the supported thigh; do not pull the neck.",
      reverse: "Begin beside the hips in N61 with the far thigh held by your back arm. The free hand takes the available top shoulder. This is your turning option, not bottom's escape."
    },
    {
      from: "N61", to: "N63", kind: "continuation",
      condition: "The near wrist can be held by your free front hand while your back arm retains the far thigh. Keep those controls separate and use the separately rehearsed low tabletop support.",
      reverse: "Start with N61's far-thigh control and collect a separate near-wrist one-on-one. The wrist stays in the front hand; do not substitute N64's wrist feed or lift the body by its arm."
    },
    {
      from: "N61", to: "N64", kind: "continuation",
      condition: "The near wrist can reach your far-thigh scooping hand comfortably. Complete that handoff before the front hand moves to the upper arm; turn only after both controls are secure.",
      reverse: "Build N61 first, then feed the near wrist to the hand under the far thigh. The free hand guides above the elbow. This specific Navy variation differs from keeping the wrist and thigh controls separate in N63."
    },
    {
      from: "N58", to: "N59", kind: "continuation",
      condition: "With your Western ankle hook established, the partner stays in a supported base and leaves the under-chest three-quarter nelson route available. Use the separately taught stack; keep the leg aligned and reset if the head or shoulder cannot move freely.",
      reverse: "Begin with your same-side leg holding the partner's ankle in N58. The stack is a turn you choose from that ride, not the definition of the ride. Rehearse the grip and receiving before combining them."
    },
    {
      from: "N58", to: "N60", kind: "continuation",
      condition: "The partner lowers the hooked leg while you retain the Western hook and balanced top contact. Use the deep tight-waist breakdown to follow them belly-down; do not pull the ankle sideways or force the stack opening.",
      reverse: "This is the rider's answer when the partner brings the hooked leg down. Keep the ankle hook and establish the separate waist-and-shoulder controls described in N60. It ends at a breakdown, not a guaranteed pin."
    },
    {
      from: "A19", to: "N55", kind: "response",
      condition: "At the opening spiral position, before you capture the wrist, bottom can use N55's changeover against sustained forward pressure. Re-establish the named spiral start and teach the response separately; this is not a late escape from A19's finished wrist ride.",
      reverse: "Answer the initial armpit-and-far-thigh spiral while the inside hand is free. A captured wrist, inserted leg or half nelson changes the lesson and calls for a reset."
    },
    {
      from: "A19", to: "N56", kind: "response",
      condition: "Before the wrist capture, bottom may reach a balanced hand-and-feet tripod under light following pressure. N56 teaches the knee-dip rise from that exact start. Do not introduce the rise after the wrist is trapped or the rider begins a turn.",
      reverse: "This answers the opening spiral ride after you can balance on hands and feet. The knee-dip guide ends standing; check the waist-hand position separately before adding B21's escape finish."
    },
    {
      from: "A22", to: "A28", kind: "response",
      condition: "Before the hip load and tilt begin, bottom may clear the cross-wrist with A28. Start with the same right-hand-to-left-wrist and left-triceps control. Once the tilt is loaded, stop; this is early clearance, not rolling out of a trapped shoulder.",
      reverse: "Use while both knees are grounded and the cross-wrist tilt has not loaded. Clear and seal the elbow before choosing a separately taught escape."
    },
    {
      from: "N41", to: "N42", kind: "continuation",
      condition: "If the partner squares up before you reach the rear-control stop, N42 supplies a knee-block option. Teach its receiving and freeze point separately first. This full finish is for prepared 11–14 partners; younger athletes keep N41's standing capture-and-release lesson.",
      reverse: "Start with the taught hand-on-elbow collar-tie pass. The partner's turn closes the path behind while leaving a close knee target. Rehearse the knee-block checkpoint before combining the two actions."
    },
    {
      from: "B07", to: "B11", kind: "response",
      condition: "Your partner may sprawl against the low double-leg entry. Teach the response separately: the defender clears both legs before circling behind. This does not make B11 a defense for every kind of shot.",
      reverse: "Use against the low double-leg entry. Stay square until both legs clear the hands, then take the taught go-behind. Do not add a surprise sprawl to the introductory takedown drill."
    },
    {
      from: "B09", to: "A07", kind: "continuation",
      condition: "When your partner sprawls, you may still have an inside head and an arm attached behind the near knee. Establish A07's hand-supported start; take the recovery only while the corner stays available. Reset for a trapped knee or closed corner.",
      reverse: "This is the attacker's recovery from a stopped sweep single, not the defender's counter. Keep the inside-head, attached-knee start and use the side taught in the recovery guide."
    },
    {
      from: "N24", to: "B12", kind: "response",
      condition: "Before you capture the leg, your partner may down block and withdraw it. Teach B12 as a separate slow-entry defense drill after both roles are learned; N24's first entry repetitions remain cooperative. Stop if the leg is caught.",
      reverse: "Answer an early single-leg reach while the leg is still free. The attacker must be able to stop the entry. A captured leg is outside this down-block rehearsal."
    },
    {
      from: "B08", to: "A09", kind: "response",
      condition: "From the low, head-inside single hold, your partner may establish the taught whizzer. Rehearse that held position separately before run-the-pipe: the attacker follows and releases before balance is lost. No high-leg start or automatic throw.",
      reverse: "The partner holds a low head-inside single, with the captured foot between the thighs. Use the whizzer guide's exact start and release; do not introduce it during an unannounced run-the-pipe finish."
    },
    {
      from: "B08", to: "A11", kind: "response",
      condition: "From the same low head-inside hold, your partner may lift your elbows and clear the leg down and back. Teach the kickout as a separate controlled drill. The attacker releases; a closed grip or loss of balance means reset.",
      reverse: "Use from the low head-inside single hold, before the finish starts. This elbow-lift clearance does not cover a leg held high or a knee already twisting."
    },
    {
      from: "N04", to: "A12", kind: "response",
      condition: "The underneath wrestler may seek to clear the controlling arm. Re-establish A12's loose chin-and-arm, kneeling start before teaching the drag-out; do not attempt it after an arm or the head becomes trapped in the go-behind.",
      reverse: "This is the underneath wrestler's answer to the chin-and-arm front-headlock foundation. Start in A12's exact loose control, rather than treating the open-cover peek-out as interchangeable."
    },
    {
      from: "N04", to: "N05", kind: "continuation",
      condition: "If the underneath wrestler circles to face you and takes the near ankle away, stop reaching. Use the separately taught circling shuck while the shoulders are moving. If they stop circling or recover square, release and reset.",
      reverse: "Begin from N04's chin-and-arm control. This is your attacking continuation when the receiver circles to close the original corner; it is not the underneath wrestler's escape."
    },
    {
      from: "B26", to: "B27", kind: "response",
      condition: "Your partner may close the elbow and clear the threading arm while the half is still loose and the neck free. Teach this early recognition before turning pressure develops. If the half is tight, stop and release.",
      reverse: "Answer a loose half as it enters. B27 is early prevention, not an escape from a tight half or a forced turn; the top wrestler releases if the head cannot move freely."
    },
    {
      from: "B26", to: "N21", kind: "continuation",
      condition: "If bottom makes the rehearsed changeover into a sit with their back toward you, release the half and establish N21's separate underarm controls. Teach the supported lowering and return first. Do not pull on the old half or improvise a backward launch.",
      reverse: "This continues a light half-nelson start only after bottom reaches the taught seated position. Release the half before changing controls. Reset if bottom stands, faces you or gets out of reach."
    },
    {
      from: "B29", to: "B30", kind: "response",
      condition: "Before your hands connect, your partner may extend the threatened leg and control the head-arm hand. Use B30's early near-side start. If the cradle locks, freeze and release; this link does not teach locked-cradle recovery.",
      reverse: "Answer the near-side cradle reach while the attacker's hands are still apart. A locked cradle or a far-side cradle requires a different lesson."
    },
    {
      from: "B20", to: "A17", kind: "response",
      condition: "As your switch comes around, the rider may re-switch if their waist arm remains mobile and your thigh is reachable. Teach both actions separately before the exchange; release for a trapped arm or planted knee.",
      reverse: "The rider answers a developing switch by using A17's mobile waist-arm and reachable-thigh start. Do not force the counter after the arm is trapped or the position has changed."
    },
    {
      from: "B20", to: "N57", kind: "response",
      condition: "The wrestler being switched on can use the separately taught step-over counter to move the hips over and remove the switch leverage. This changes the actor: the original rider counters the switch. Use the controlled N57 start and reset if the arm or shoulder cannot move comfortably.",
      reverse: "Answer the switch currently being applied to you. Moving the hips over is the counter; catching the opponent's far arm is not a prerequisite. Keep the motion controlled and stop if the shoulder is trapped."
    },
    {
      from: "A17", to: "N57", kind: "response",
      condition: "When the rider re-switches, the original switcher is now the wrestler being switched on and may use the same step-over counter. Identify the current roles before moving; this is an available answer, not a required third move.",
      reverse: "Use the same step-over principle when a re-switch reverses the roles. The person receiving the switch pressure moves their hips over to remove leverage and regain top."
    },
    {
      from: "B25", to: "A24", kind: "continuation",
      condition: "If bottom rolls the held near wrist free and opens that elbow, let the wrist go and take the taught half-nelson transition. If the elbow stays closed, keep riding; do not force the opening.",
      reverse: "This is the top wrestler's next option from the near-wrist ride after bottom clears the wrist and opens the elbow. It is not a defensive wrist-clearance lesson."
    }
  ].map(link => Object.freeze(link));
  Object.freeze(links);
  function canonicalId(value) {
    const id = String(value || "");
    if (/^[PBAN]\d{2,3}$/.test(id)) return id;
    if (/^(?:kyle:)?K\d{2}$/.test(id)) return "kyle:" + id.replace(/^kyle:/, "");
    if (/^(?:facebook:)?V\d{2}$/.test(id)) return "facebook:" + id.replace(/^facebook:/, "");
    return "";
  }
  function route(value) {
    const id = canonicalId(value);
    if (id.startsWith("kyle:")) return "#moves/kyle/" + id.slice(5);
    if (id.startsWith("facebook:")) return "#moves/videos/" + id.slice(9);
    return id ? "#move/" + id : "";
  }
  function resolve(value) {
    const id = canonicalId(value);
    const result = { responses: [], nextOptions: [], answers: [], buildsFrom: [] };
    if (!id) return result;
    for (const link of links) {
      const from = canonicalId(link.from), to = canonicalId(link.to);
      if (id === from) result[link.kind === "response" ? "responses" : "nextOptions"].push({ id: to, route: route(to), condition: link.condition, kind: link.kind });
      if (id === to) result[link.kind === "response" ? "answers" : "buildsFrom"].push({ id: from, route: route(from), condition: link.reverse, kind: link.kind });
    }
    return result;
  }
  window.GRINDSTONE_REACTIONS = Object.freeze({ links, canonicalId, route, resolve });
})();
