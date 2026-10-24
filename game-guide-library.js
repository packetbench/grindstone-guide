/* Current game instructions; archived source collections remain intact. */
(() => {
  'use strict';
  const data = window.GRINDSTONE;
  if (!data) return;
  const seen = new Set();
  for (const group of [window.GRINDSTONE_GAME_GUIDES_A, window.GRINDSTONE_GAME_GUIDES_B, window.GRINDSTONE_GAME_GUIDES_C]) {
    for (const entry of group?.entries || []) {
      const game = data.games.find(item => item.id === entry.id);
      if (!game || seen.has(entry.id)) throw new Error('Invalid game review ID: ' + entry.id);
      Object.assign(game, entry, {rules_reviewed: group.reviewed});
      seen.add(entry.id);
    }
  }
  if (data.videos.G12?.video) data.videos.G12.video.note = 'Related knee-tag activity. Grindstone alternates one attacker, awards the defender a point after eight balanced seconds, then allows two seconds to reset centrally. No grabbing, diving, pushing, or head contact. The video’s exact scoring and contact rules were not inspected.';
  if (data.videos.G19?.video) data.videos.G19.video.note = 'Tight-waist-and-chop breakdown reference. In this Grindstone game the top wrestler fully releases and moves clear before the bottom wrestler rebuilds the base. Count each controlled down-and-up cycle. Keep the taught receiving mechanics, separate hands, and gradual pressure; no elbow strikes or pressure through the head.';
  const kyle = window.GRINDSTONE_KYLE?.entries.find(item => item.id === 'K01');
  const instruction = window.GRINDSTONE_KYLE_INSTRUCTION?.entries?.K01;
  if (kyle && instruction) {
    kyle.minutes = 5;
    kyle.age_groups = ['4-6', '7-10', '11-14'];
    kyle.description = 'One partner reaches once for a knee; the other moves that leg back, softly blocks the reach and recovers a balanced stance.';
    kyle.equipment = 'Clear mat space; existing mat lines; coach’s timer.';
    kyle.quick = {
      players: 'Matched pairs. For an odd group, a coach or assistant joins the unmatched athlete; do not leave a child waiting out.',
      space: 'Separate working areas, about an arm’s reach between partners and room to withdraw a foot.',
      start: 'Both in stance. Name the attacker. Both say READY before each single reach.',
      goal: 'Attacker: a light knee touch. Defender: move the leg back, block softly and finish balanced. One point maximum per attempt.',
      reset: 'Freeze after each attempt, return to starting distance and both say READY. Swap after each 30-second round.',
      adaptation: 'Pups: a coach calls every slow attempt; celebrate good resets together instead of keeping competitive scores. Older ready pairs may self-start on READY.'
    };
    instruction.setup += ' With an odd group, a coach or assistant partners the unmatched athlete. Both partners say READY before each attempt; Pups also wait for the coach’s GO.';
    instruction.steps[1] = 'Once both partners say READY, the attacker gets one controlled level change and reach. Pups wait for the coach’s GO each time. No diving, grabbing, or driving through the defender.';
    instruction.steps[5] = 'After every attempt, both freeze, return to the starting distance, and say READY before the next attempt. A collision, uncontrolled reach, or step outside the working area ends the attempt without a point.';
    kyle.note = 'The complete rules below are a Grindstone touch-only adaptation. The submitted video is a related reaction activity; its exact rules and scoring have not been verified.';
    instruction.steps[4] = 'A clean knee touch scores one practice point for the attacker, even if the defender also touches the reaching arm. If there is no knee touch and the defender blocks and recovers balanced, the defender scores one. A missed reach without a controlled block and recovery scores nothing. These are game points, not match scoring.';
    instruction.steps[6] = 'After 30 seconds, stop and swap roles. Play four rounds so each athlete attacks twice. Reset after every attempt; nobody is eliminated.';
    instruction.drill.rounds = 'Suggested 5 minutes: 1 minute to demonstrate, four rounds of 30 seconds play plus 15 seconds rest/swap (3 minutes), then 1 minute to review and reset. At most one point per attempt.';
    instruction.drill.goal = 'Both partners complete controlled attempts and finish balanced. Keep individual practice points if helpful; no elimination or extra work for the lower score.';
  }
  const circle = window.GRINDSTONE_VIDEO_ADDITIONS?.entries.find(item => item.id === 'V03');
  if (circle) {
    circle.minutes = 5;
    circle.age_groups = ['4-6', '7-10', '11-14'];
    circle.description = 'A defender protects a loose flag inside a small circle while a partner walks around the outside trying to pull the flag without crossing the line.';
    circle.equipment = 'One loose fabric flag per pair; flat mat line or tape circle; coach’s timer.';
    circle.quick = {
      players: 'Matched pairs. A coach or assistant can partner an unmatched athlete.',
      space: 'One small flat circle per pair, with clear space around it. Size it using the reach test below, not a fixed diameter.',
      start: 'Defender inside with a loose waistband flag; attacker outside. Both stand and walk in the default version.',
      goal: 'One point for a clean flag pull; otherwise one defense point after a fault-free 20-second turn. A boundary or contact fault ends that turn without a point.',
      reset: 'After an early finish, wait until that 20-second slot ends; then use 10 seconds to reset and swap. Six turns give each partner three attacks.',
      adaptation: 'Pups use standing, walking play only. The source clip shows a low hands-and-feet variation; reserve that separately taught version for ready athletes.'
    };
    circle.steps = [
      'Give each matched pair a small flat circle with clear space around it. A coach or assistant partners an unmatched athlete. Place one loose fabric flag at the back of the defender’s waistband so it pulls free easily; never tie it on or attach it to an ankle strap. Test the circle before play: with the defender at its centre, an attacker facing the flag from outside must be able to touch its end with both feet planted and without lunging. Shrink the circle if the flag is unreachable; give both athletes room to turn.',
      'Start both athletes standing at walking speed: defender inside, attacker outside. The attacker may reach across the line but keeps both feet outside; the defender keeps both feet inside. Either athlete touching the line stops the attempt.',
      'On “go”, the defender turns or walks within the circle to protect the flag. The attacker walks around the outside and reaches only for the exposed flag. No blocking with the hands or body contact.',
      'One clean flag pull earns one attacker point. If the flag is still attached when the 20-second turn ends and no boundary or contact rule was broken, the defender earns one. A boundary mistake, fall, clothing pull or body contact ends the turn with no point.',
      'After a flag pull or stopped turn, freeze and wait until the current 20-second play slot ends; no second attempt in that slot. On the coach’s RESET signal, return the flag and swap roles during the 10-second rest. The winner does not stay on. Nobody is eliminated.',
      'Suggested 5 minutes: 1 minute for setup/demo; six turns of 20 seconds play and 10 seconds reset/swap (3 minutes); 1 minute to finish and pack away. Each athlete attacks three times. Coach-set shorter turns are fine.',
      'For a separately taught low variation, the defender uses hands and feet with every support inside the circle; the attacker still stays outside. Stop as soon as support is lost. Pups use only the standing version.'
    ];
    circle.timing = circle.steps[5];
    circle.cues = ['Flag only.', 'Defender in; attacker out.', 'One turn, then swap.'];
    circle.boundaries = 'Use a loose flag and flat boundary. No body contact, clothing pulls, diving, tripping, limb grabs or wrapping fabric around a person. No ankle straps as grab targets. Stop for a fall, lost hand support or a boundary mistake; restore space before restarting.';
    circle.verification += ' The complete five-minute format, standing rules, scoring and resets were clarified on October 24, 2026 as Grindstone coaching adaptations, not verified rules of the source clip.';
  }
})();
