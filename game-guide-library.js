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
  const kyle = window.GRINDSTONE_KYLE?.entries.find(item => item.id === 'K01');
  const instruction = window.GRINDSTONE_KYLE_INSTRUCTION?.entries?.K01;
  if (kyle && instruction) {
    kyle.note = 'The complete rules below are a Grindstone touch-only adaptation. The submitted video is a related reaction activity; its exact rules and scoring have not been verified.';
    instruction.steps[4] = 'A clean knee touch scores one practice point for the attacker, even if the defender also touches the reaching arm. If there is no knee touch and the defender blocks and recovers balanced, the defender scores one. A missed reach without a controlled block and recovery scores nothing. These are game points, not match scoring.';
    instruction.steps[6] = 'After 30 seconds, stop and swap roles. Play four rounds so each athlete attacks twice. Reset after every attempt; nobody is eliminated.';
    instruction.drill.rounds = 'Suggested 5 minutes: 1 minute to demonstrate, four rounds of 30 seconds play plus 15 seconds rest/swap (3 minutes), then 1 minute to review and reset. At most one point per attempt.';
    instruction.drill.goal = 'Both partners complete controlled attempts and finish balanced. Keep individual practice points if helpful; no elimination or extra work for the lower score.';
  }
  const circle = window.GRINDSTONE_VIDEO_ADDITIONS?.entries.find(item => item.id === 'V03');
  if (circle) {
    circle.steps = [
      'Use a flat circle about 2 metres across for each matched pair, with clear space between pairs. Place one loose fabric flag at the back of the defender’s waistband so it pulls free easily; never tie it on or attach it to an ankle strap.',
      'Start both athletes standing at walking speed: defender inside, attacker outside. The attacker may reach across the line but keeps both feet outside; the defender keeps both feet inside. Either athlete touching the line stops the attempt.',
      'On “go”, the defender turns or walks within the circle to protect the flag. The attacker walks around the outside and reaches only for the exposed flag. No blocking with the hands or body contact.',
      'One clean flag pull earns one attacker point. If the flag is still attached when the 20-second turn ends and no boundary or contact rule was broken, the defender earns one. A boundary mistake, fall, clothing pull or body contact ends the turn with no point.',
      'After a flag pull or stopped turn, freeze, return the flag and swap roles during the rest. The winner does not stay on. Nobody is eliminated.',
      'Suggested 5 minutes: 1 minute for setup/demo; six turns of 20 seconds play and 10 seconds reset/swap (3 minutes); 1 minute to finish and pack away. Each athlete attacks three times. Coach-set shorter turns are fine.',
      'For a separately taught low variation, the defender uses hands and feet with every support inside the circle; the attacker still stays outside. Stop as soon as support is lost. Pups use only the standing version.'
    ];
    circle.cues = ['Flag only.', 'Defender in; attacker out.', 'One turn, then swap.'];
    circle.boundaries = 'Use a loose flag and flat boundary. No body contact, clothing pulls, diving, tripping, limb grabs or wrapping fabric around a person. No ankle straps as grab targets. Stop for a fall, lost hand support or a boundary mistake; restore space before restarting.';
    circle.verification += ' The complete five-minute format, standing rules, scoring and resets were clarified on October 24, 2026 as Grindstone coaching adaptations, not verified rules of the source clip.';
  }
})();
