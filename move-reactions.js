/* Teaching connections between existing guides, not new technique instruction.
   A response changes wrestler; a continuation belongs to the original wrestler.
   Conditions come from the written guides. Existing video-review limits still apply. */
(() => {
  "use strict";
  const links = [
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
      from: "B25", to: "A24", kind: "continuation",
      condition: "If bottom rolls the held near wrist free and opens that elbow, let the wrist go and take the taught half-nelson transition. If the elbow stays closed, keep riding; do not force the opening.",
      reverse: "This is the top wrestler's next option from the near-wrist ride after bottom clears the wrist and opens the elbow. It is not a defensive wrist-clearance lesson."
    }
  ].map(link => Object.freeze(link));
  Object.freeze(links);
  function canonicalId(value) {
    const id = String(value || "");
    if (/^[PBAN]\d{2}$/.test(id)) return id;
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
