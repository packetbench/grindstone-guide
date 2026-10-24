window.GRINDSTONE_PATHWAY = {
  reviewed: '2026-10-23',
  intro: 'Build the season around sound positions, reliable techniques and series: several options from the same foundation, such as a sit-out, captured single leg or wrist ride. Linked drills rehearse a chosen sequence; series teach wrestlers which option fits the partner’s response. Strength and endurance grow alongside those skills.',
  coaching_principles: [
    'Use these as flexible stages, not deadlines or a weekly schedule. Age groups suggest a starting point; experience, attention, movement control and partner readiness decide the next step.',
    'Plan around a shared two-session core: establish a foundation and one option, then retrieve it and respond. An optional third session extends or repairs the same work. These are planning roles, not fixed daily plans or promises about the club schedule.',
    'Teach the shared position first, then one option at a time. A series is a family of choices, not a checklist of moves to perform in order. Its teaching steps describe how to introduce those choices; linked drills below rehearse a particular route.',
    'The suggested doses are coaching starting points created for this guide, not official USA Wrestling prescriptions. Adjust them to the athletes in front of you.',
    'Teach new skills while athletes are fresh. Start with a dynamic warm-up, allow water and recovery, and shorten a block when technique or attention fades.',
    'Strength blocks complement wrestling and other sports; they are not a complete strength program. Plan structured strength work on nonconsecutive days and account for the athlete’s other activity.'
  ],
  guidance: {
    repeat: 'Repeat a stage as long as it helps. Keep one familiar skill, revisit one sticking point and change the game, partner or starting position to keep practice interesting. Reduce resistance or break a series into individual actions when a wrestler cannot stop, stay balanced or protect a partner. More exhausted repetitions are not better repetitions.',
    advance: 'Advance after the wrestler shows the listed readiness behaviors on more than one practice day, with both partners comfortable. For a series, establish the common position and one dependable option, teach a second option separately, then let the partner provide either practiced response. Increase only one challenge at a time: resistance, duration, repetitions or complexity. Leave enough recovery to repeat the movement well; never use conditioning as punishment.',
    catch_up: 'A missed week does not require cramming. Ask the wrestler to show the prerequisite movement, teach the missing link in a short coach-led station, and rejoin a familiar block. Let partners rehearse at cooperative speed before adding resistance. An athlete may be further ahead in neutral technique than in bottom skills or conditioning.',
    late_joiner: 'Start with stance, stopping on command, personal space, base and a comfortable rise from the mat. Give an older beginner the same foundations with age-respectful explanations. Pair with a reliable, appropriately matched partner; offer a simpler version of the group’s task. Add controlled contact only after the coach sees the prerequisites, rather than trying to catch up to a calendar.'
  },
  sources: [
    { id: 'kolat-bottom', title: 'Cary Kolat — Bottom position, hand control and first moves', url: 'https://www.kolat.com/blog/getting-off-the-bottom-by-cary-kolat' },
    { id: 'kolat-curriculum', title: 'Cary Kolat — Teach individual skills before connecting options', url: 'https://www.kolat.com/blog/kolatcom-4-6-year-teaching-curriculum-for-new-to-novice-wrestlers-by-cary-kolat' },
    { id: 'usaw-folkstyle-2', title: 'USA Wrestling — Folkstyle Level 2 technique families', url: 'https://www.usawmembership.com/usa_wrestling_core_curriculum/2' },
    { id: 'usaw-adm', title: 'USA Wrestling — Athlete Development Model', url: 'https://content.themat.com/CoachesCorner/LTADPoster.pdf' },
    { id: 'usaw-age', title: 'USA Wrestling — Age Appropriate', url: 'https://www.themat.com/news/2018/october/12/age-appropriate' },
    { id: 'usopc-adm', title: 'USOPC — American Development Model stages', url: 'https://www.usopc.org/coaching-education/adm/american-development-model-stages' },
    { id: 'aap-strength', title: 'American Academy of Pediatrics — Guidance on resistance training for children', url: 'https://www.healthychildren.org/English/news/Pages/Guidance-on-Resistance-Training-for-Children.aspx' },
    { id: 'aossm-strength', title: 'AOSSM — Youth Strength Training, reviewed October 2025', url: 'https://www.sportsmed.org/youth-strength-training' },
    { id: 'nsca-ltad', title: 'NSCA — Youth Training and Long-Term Athletic Development', url: 'https://www.nsca.com/about-us/position-statements/youth-training-and-long-term-athletic-development/' }
  ],
  groups: [
    {
      age_group: '4-6',
      schedule_note: "Use Core A on one Tuesday and Core B on the next Tuesday, repeating as needed. The extension is another later Tuesday, not an extra practice requirement. Use the confirmed TeamSnap schedule for dates and times; each readiness stage may take several meetings.",
      summary: 'Make movement, confidence and play the season’s foundation. Use demonstrations, one short cue and frequent successful turns. The sequences here are solo movements or noncontact partner games; they do not require live takedowns, forced holds or match conditioning.',
      phases: [
        {
          id: 'pups-1', title: 'Feel at home on the mat',
          overview: "Build comfort with the mat, stop signal and stance. Revisit the same cues on successive Tuesdays until children can remember and use them; progress follows confidence and control.",
          practice_cycle: {"label":"Across successive Tuesdays","core_a":{"title":"Tuesday A — learn and play","focus":"Introduce the stop signal, personal space and one balanced stance. Let children copy a short step and freeze, then revisit it through a familiar movement game."},"core_b":{"title":"Next Tuesday — remember and use","focus":"On the next Tuesday, ask children to show the stop signal and stance before demonstrating again. Add one new direction only when the familiar steps stay balanced."},"extension":{"title":"Later Tuesday — reinforce","focus":"At a later Tuesday practice, repeat the same movement with a different leader or game. Keep body-control play short and finish with a successful turn."}},
          skills: ['Freeze and listen on the stop signal.', 'Find a balanced stance and move without crossing feet.', 'Travel, stop and keep space around other children.'],
          move_ids: ['P01', 'P02'], sequence_ids: [], series_ids: [],
          strength: { goal: 'Explore body control through play.', activities: ['Squat to touch a floor spot, then stand tall.', 'Walk a short bear-crawl lane, hands and feet on the mat.'], dose: 'One playful round: 3–5 squats and two 5–8-second crawls, with 20–30 seconds to reset between turns.', progress: 'First improve balance and control. Add a new direction before adding more repetitions.' },
          endurance: { goal: 'Enjoy moving and recovering.', activities: ['Walk, skip or shuffle between colored markers.'], dose: 'Four 15–20-second turns with at least 30 seconds of walking, explanation or rest between turns.', progress: 'Repeat a favorite game if children stay engaged. Shorten the turn if movement becomes rushed or they stop following cues.' },
          ready: ['Stops promptly without colliding.', 'Can show a stance and take a few balanced steps.', 'Willingly joins another turn after resting.'],
          regress: 'Use a smaller space, one direction and a coach to copy. Let children watch a turn and rejoin.'
        },
        {
          id: 'pups-2', title: 'Change levels and find a base',
          overview: "Use standing level changes and floor base as separate foundations. Teach a small action, revisit it next Tuesday and link movements only after each one is comfortable.",
          practice_cycle: {"label":"Across successive Tuesdays","core_a":{"title":"Tuesday A — learn and play","focus":"Choose level change or bottom base. Demonstrate one cue, give short successful turns and use the same movement in a playful activity."},"core_b":{"title":"Next Tuesday — remember and use","focus":"At the next Tuesday practice, ask for the chosen position without an immediate demonstration. Add a small step or one belly-to-base recovery if the foundation is steady."},"extension":{"title":"Later Tuesday — reinforce","focus":"Use another Tuesday to alternate the two familiar positions with a visual cue. Repeat balance and easy travel activities; avoid adding speed and complexity together."}},
          skills: ['Lower through knees and hips while looking forward.', 'Place hands and knees deliberately.', 'Move from belly to a steady base.'],
          move_ids: ['P03', 'P04', 'P05', 'P06'], sequence_ids: ['S01'], series_ids: [],
          strength: { goal: 'Support body weight with control.', activities: ['Slow squat-and-reach.', 'Brief hands-and-knees balance with one hand lifted.'], dose: 'Two rounds of 3–5 squats and 2–3 hand lifts per side; rest about 30 seconds between rounds.', progress: 'Pause briefly in a balanced position before adding another repetition.' },
          endurance: { goal: 'Keep easy movement playful.', activities: ['Follow-the-leader travel with a base or stance freeze.'], dose: 'Four 20-second turns with 30–40 seconds to rest and change leaders.', progress: 'Add a new movement cue, not a longer race.' },
          ready: ['Lowers without diving onto hands or knees.', 'Holds a comfortable base briefly.', 'Returns from belly to base without being pulled up.'],
          regress: 'Teach the floor movement separately from the standing movement, using a floor marker for each child.'
        },
        {
          id: 'pups-3', title: 'Move down and get back up',
          overview: "Build confidence in getting down and rising without a rider. Repeat the selected solo movement over successive Tuesdays; controlled recovery matters more than completing a longer sequence.",
          practice_cycle: {"label":"Across successive Tuesdays","core_a":{"title":"Tuesday A — learn and play","focus":"Choose belly-to-base or base-to-stand. Teach the start and finish with pauses, a short movement game and plenty of resets."},"core_b":{"title":"Next Tuesday — remember and use","focus":"Next Tuesday, ask children to recall the movement first. Link belly, base and stand only when all three positions are comfortable; otherwise keep practicing one transition."},"extension":{"title":"Later Tuesday — reinforce","focus":"At a later practice, change the marker or cue and revisit the same recovery. Introduce solo sprawl separately only after hand support and landing are controlled."}},
          skills: ['Rebuild base from belly.', 'Bring a foot forward and rise with balance.', 'Show a soft, controlled solo sprawl and recover.'],
          move_ids: ['P05', 'P06', 'P07', 'P08'], sequence_ids: ['S02'], series_ids: [],
          strength: { goal: 'Use legs and trunk to change levels.', activities: ['Base-to-stand movement.', 'Short bear crawl followed by a complete stand-up reset.'], dose: 'Two rounds of 3 rises and one 5–8-second crawl; allow 30–45 seconds between rounds.', progress: 'Use less prompting while preserving balance. Do not turn getting up into a race.' },
          endurance: { goal: 'Repeat small efforts without losing control.', activities: ['Travel to a spot, make one base-to-stand sequence, then walk back.'], dose: 'Four turns of roughly 20 seconds, with 30–40 seconds between turns.', progress: 'Add a fifth turn only when children are still moving comfortably and want another.' },
          ready: ['Rises without crashing into a neighbor.', 'Shows the same sequence twice with one cue.', 'Can reset calmly after a mistake.'],
          regress: 'Separate belly-to-base and base-to-stand. Use the solo sprawl only when landing and recovery remain controlled.'
        },
        {
          id: 'pups-4', title: 'Follow, mirror and change direction',
          overview: "Use a partner for copying, turn-taking and shared space. Carry the same noncontact movement theme across Tuesdays before introducing another direction or response.",
          practice_cycle: {"label":"Across successive Tuesdays","core_a":{"title":"Tuesday A — learn and play","focus":"Have children mirror the coach in stance with one direction and a freeze. Then try short partner turns with a clear gap and an obvious leader."},"core_b":{"title":"Next Tuesday — remember and use","focus":"On the next Tuesday, retrieve the stop and spacing cues. Switch leaders and offer one simple change of direction that both partners can follow."},"extension":{"title":"Later Tuesday — reinforce","focus":"On a later Tuesday, circle a marker or use a familiar mirror game. Keep the task cooperative and vary the story rather than making the turns longer."}},
          skills: ['Mirror a partner’s stance steps without touching.', 'Circle a floor marker with short steps.', 'Change direction on a simple visual cue.'],
          move_ids: ['P01', 'P02', 'P07', 'P11'], sequence_ids: ['S01', 'S03'], series_ids: [],
          strength: { goal: 'Control weight shifts.', activities: ['Step sideways to a floor spot and freeze.', 'Small squat, stand and balance on one foot with a toe available for support.'], dose: 'Two rounds of 3–4 steps each way and 3 balances per side; rest 30 seconds.', progress: 'Make the pause steadier before making the step quicker.' },
          endurance: { goal: 'Stay active in short partner turns.', activities: ['Noncontact mirror-and-freeze.'], dose: 'Four 20–25-second turns; change leaders and rest for 30–40 seconds after each.', progress: 'Keep the follower successful. Add a direction only when both partners stay in their space.' },
          ready: ['Keeps a comfortable gap while mirroring.', 'Changes direction without crossing or tripping.', 'Takes turns as leader and follower.'],
          regress: 'Have the whole group mirror the coach before using pairs.'
        },
        {
          id: 'pups-5', title: 'Put two or three movements together',
          overview: "Link two or three familiar solo movements after each one is dependable. This is movement sequencing rather than a partner wrestling series; repeat the same sequence before adding a cue-based choice.",
          practice_cycle: {"label":"Across successive Tuesdays","core_a":{"title":"Tuesday A — learn and play","focus":"Choose one short movement sequence, such as belly to base to stand. Pause at the positions, repeat it and use those movements in a game."},"core_b":{"title":"Next Tuesday — remember and use","focus":"Next Tuesday, let children recall the sequence. Offer a picture or coach cue to choose between two already-learned solo sequences; return to one if attention or balance fades."},"extension":{"title":"Later Tuesday — reinforce","focus":"Use a later practice for a small movement circuit with the same skills. Keep recovery generous and let children demonstrate a favorite successful action."}},
          skills: ['Remember two actions in order.', 'Finish every sequence balanced.', 'Choose the correct solo sequence from a picture or coach cue.'],
          move_ids: ['P03', 'P04', 'P05', 'P06', 'P07', 'P08', 'P11'], sequence_ids: ['S01', 'S02', 'S03'], series_ids: [],
          strength: { goal: 'Repeat familiar body-weight movements well.', activities: ['Squat-and-reach, short crawl and base-to-stand stations.'], dose: 'One or two rounds: 4 squats, 5–8 seconds crawling and 3 rises. Allow 30–45 seconds between stations.', progress: 'Add a second round only if the last movement is as controlled as the first.' },
          endurance: { goal: 'Move through a short activity circuit.', activities: ['Three short stations with a water or walking break.'], dose: '20–25 seconds of activity, then 35–45 seconds to recover and move stations; one or two rounds.', progress: 'Change the task to sustain interest; do not shrink recovery to make it harder.' },
          ready: ['Links two movements without rushing.', 'Recovers stance before the next turn.', 'Can show a favorite sequence to a coach.'],
          regress: 'Return to one action at a time or let the child follow a coach through the sequence.'
        },
        {
          id: 'pups-6', title: 'Keep favorites and celebrate progress',
          overview: "Consolidate familiar skills whenever the group is ready. Children can revisit this stage throughout the season; progress is confidence, control, turn-taking and wanting another practice.",
          practice_cycle: {"label":"Across successive Tuesdays","core_a":{"title":"Tuesday A — learn and play","focus":"Let each child choose a familiar stance, base or rising movement to show. Revisit one useful cue and use favorite body-control activities."},"core_b":{"title":"Next Tuesday — remember and use","focus":"At the next Tuesday practice, repeat the choices with a different leader or game. Notice what needs less prompting and celebrate a specific improvement."},"extension":{"title":"Later Tuesday — reinforce","focus":"Use another Tuesday to reconnect any skill that became uncertain or welcome returning children. Keep the same successful tasks available rather than requiring a new technique."}},
          skills: ['Lead a familiar movement for the group.', 'Choose and explain a simple cue.', 'Combine movement, balance and turn-taking in a game.'],
          move_ids: ['P01', 'P02', 'P05', 'P06', 'P08', 'P11'], sequence_ids: ['S01', 'S02', 'S03'], series_ids: [],
          strength: { goal: 'Keep movement varied and successful.', activities: ['Children select two familiar body-control activities.'], dose: 'Two easy rounds of 3–5 repetitions or 5–10 seconds per activity, with 30–45 seconds between turns.', progress: 'Show better balance or independence rather than seeking a maximum score.' },
          endurance: { goal: 'Enjoy repeated play with recovery.', activities: ['Favorite noncontact movement game with rotating roles.'], dose: 'Four to six 20–30-second turns with 30–45 seconds of recovery; stop while the game remains successful.', progress: 'Maintain the dose when enthusiasm and control are good. More minutes are not a required graduation step.' },
          ready: ['Can show a stance, base and rise with little prompting.', 'Stops and shares space consistently.', 'Can name something learned and something enjoyed.'],
          regress: 'Return to the child’s favorite simpler version and finish with a successful turn.'
        }
      ]
    },
    {
      age_group: '7-10',
      schedule_note: "Share one focus across a two-session core: Core A establishes the foundation and an option; Core B retrieves it and responds to a partner. A third session extends or repairs the same work. Repeat the cycle as needed and use TeamSnap for actual dates; this age band does not determine club team placement.",
      summary: 'Build sound positions before speed. A beginner can learn the sit-out position and hip-heist escape early; add other options only after their prerequisites are reliable. Linked drills connect familiar actions, while a series groups different answers from one foundation. Strength starts with body-weight movement; endurance comes from repeatable games and purposeful short rounds.',
      phases: [
        {
          id: 'youth-1', title: 'Own the basic positions',
          overview: "Check stance, level change, base, stopping and receiving. Use a shared two-session core to learn and recall these foundations; repeat it until each pair can work predictably.",
          practice_cycle: {"label":"Repeatable two-session core","core_a":{"title":"Core A — foundation and one option","focus":"Choose one foundation, demonstrate its key position and teach one controlled action from it. Include a familiar movement warm-up and simple body-weight control."},"core_b":{"title":"Core B — retrieve and respond","focus":"Ask wrestlers to show the same position before reteaching. Repeat the action with one named cue or starting signal; introduce partner contact only after receiving is dependable."},"extension":{"title":"Optional third session — extend and repair","focus":"Use an optional third session for extra reps, a catch-up station and a familiar game. Do not put required new skills only in this session."}},
          skills: ['Move in stance and change levels without folding at the waist.', 'Enter and recover a penetration step with control.', 'Build a stable base and rise without resistance.'],
          move_ids: ['B01', 'B02', 'B03', 'P05', 'P06', 'P08'], sequence_ids: ['S01', 'S02'], series_ids: [],
          strength: { goal: 'Learn squat, push and trunk-control patterns.', activities: ['Body-weight squat.', 'Wall push-up.', 'Hands-and-knees reach.'], dose: 'One set of 6–8 easy squats and wall push-ups, plus 3 reaches per side; rest 45–60 seconds between exercises.', progress: 'Add clean repetitions toward 8–10 before choosing a harder version. Keep several comfortable repetitions in reserve.' },
          endurance: { goal: 'Find a repeatable pace.', activities: ['Noncontact mirror footwork or marker loops.'], dose: 'Four 20-second turns with 40 seconds of walking or rest.', progress: 'Keep the same pace across all turns before adding a fifth.' },
          ready: ['Stops and releases immediately.', 'Can enter and reset under control.', 'Maintains space and supports their own weight.'],
          regress: 'Use solo movements and a shorter range. Re-teach receiving before adding any finish.'
        },
        {
          id: 'youth-2', title: 'Make one attack and one escape reliable',
          overview: "Build one dependable attack or escape at a time. Core A introduces its foundation and one result; Core B recalls that work and adds a simple, announced partner response. A short sit and hip-heist are optional early bottom work after the solo prerequisites.",
          practice_cycle: {"label":"Repeatable two-session core","core_a":{"title":"Core A — foundation and one option","focus":"Choose an attack capture or bottom position. Teach one controlled finish or escape. For a sit-out focus, establish the short sit and hand-clear-to-hip-heist without adding rolls."},"core_b":{"title":"Core B — retrieve and respond","focus":"Retrieve the same start and result. Have the receiver follow as taught or give one announced, manageable response; if the option is not ready, repeat it cooperatively."},"extension":{"title":"Optional third session — extend and repair","focus":"Use a third session to reinforce the same option with different suitable partners, repair prerequisites and play a related game. Another series branch is optional only after its separate lesson."}},
          skills: ['Clear a hand or arm before entering.', 'Complete one coach-selected takedown with controlled receiving.', 'Stand from bottom with hand control and finish facing.', 'Optional: show a compact sit-out, clear a loose waist hand and hip-heist to face after the solo prerequisites are comfortable.'],
          move_ids: ['B04', 'B05', 'B07', 'B14', 'B15', 'B17', 'B21', 'P09', 'P10', 'B18', 'B19'], sequence_ids: ['S05', 'S08'], series_ids: ['S13'],
          strength: { goal: 'Repeat simple whole-body exercises.', activities: ['Squat-and-reach.', 'Wall or coach-approved incline push-up.', 'Hands-and-knees reach.'], dose: 'One or two sets of 6–10 repetitions for squat and push-up; 3–4 reaches per side. Rest 45–60 seconds between sets.', progress: 'Add a second set only if the first stays easy to control. Keep the exercise version unchanged that day.' },
          endurance: { goal: 'Repeat technique without rushing.', activities: ['Take turns on an entry-and-reset drill; walk while the partner works.'], dose: 'Four 25–30-second work turns with at least 30–45 seconds to recover and receive feedback.', progress: 'Improve consistent setup and finish before increasing the number of turns.' },
          ready: ['Entry and landing are predictable and controlled.', 'Finishes an escape facing the partner.', 'Can explain one useful cue for each chosen technique.'],
          regress: 'Stop the attack at a balanced capture, or practice the escape without a rider.'
        },
        {
          id: 'youth-3', title: 'Defend and keep working from the mat',
          overview: "Keep the chosen defense or mat recovery as the common focus across two sessions. Teach both partners their roles before adding a limited choice or resistance; repeat the core whenever the response is uncertain.",
          practice_cycle: {"label":"Repeatable two-session core","core_a":{"title":"Core A — foundation and one option","focus":"Choose one situation: an early leg reach, a deeper entry or bottom rebuilding base. Teach the relevant defense or recovery with a predictable partner and a clear reset."},"core_b":{"title":"Core B — retrieve and respond","focus":"Recall the same situation and action. If the first response is reliable, show one contrasting, already-taught response—such as early block versus deeper sprawl—and have wrestlers name the difference."},"extension":{"title":"Optional third session — extend and repair","focus":"Use a third session for a focused repair station, light positional rounds and familiar strength tasks. Keep the taught start, objective and reset unchanged."}},
          skills: ['Down block an early reach and recover stance.', 'Sprawl on a controlled deeper entry, then circle behind.', 'Rebuild base from belly; top follows without yanking.'],
          move_ids: ['B11', 'B12', 'B16', 'B22', 'B27', 'B30'], sequence_ids: ['S07', 'S08'], series_ids: ['S13'],
          strength: { goal: 'Keep trunk and limbs coordinated.', activities: ['Squat, wall push-up and short bear crawl.', 'Optional light band row only with a coach-checked anchor and instruction.'], dose: 'Two sets of 6–10 controlled repetitions for familiar exercises; crawl 8–10 seconds. Rest about 60 seconds between sets.', progress: 'Use a steadier trunk and full control as the target. Do not race a circuit or work to failure.' },
          endurance: { goal: 'Recover between purposeful efforts.', activities: ['A 20–30-second base-rebuild or defense task, followed by a complete reset.'], dose: 'Four or five turns; rest 40–60 seconds after each active turn.', progress: 'First keep the same quality in the final turn. Add time or a turn later, not both together.' },
          ready: ['Distinguishes an early block from a needed sprawl.', 'Can recover base without reaching wildly.', 'Follows the agreed resistance level and stop signal.'],
          regress: 'Give the partner only one slow action and freeze after the defensive response.'
        },
        {
          id: 'youth-4', title: 'Connect setup, technique and finish',
          overview: "Connect a reliable entry to its result before increasing the number of options. Use pauses in linked drills, then connect the same route smoothly; a series branch remains a separate choice from its foundation.",
          practice_cycle: {"label":"Repeatable two-session core","core_a":{"title":"Core A — foundation and one option","focus":"Choose one familiar route: setup to takedown and cover, base to stand-up and face, or breakdown to a supervised turn. Check each transition and receiving position."},"core_b":{"title":"Core B — retrieve and respond","focus":"Ask pairs to recall the route and show where to reset if it closes. Remove a training pause only when control stays consistent; use the same foundation for any separately taught option."},"extension":{"title":"Optional third session — extend and repair","focus":"Use a third session to revisit the difficult transition, maintain familiar strength work and finish with a related game. Avoid adding a required new finish."}},
          skills: ['Connect an elbow pop to a double-leg entry and finish.', 'Connect base to stand-up to separation.', 'Connect a breakdown to a coach-supervised half nelson turn.'],
          move_ids: ['B06', 'B07', 'B17', 'B21', 'B22', 'B26', 'B28'], sequence_ids: ['S04', 'S08', 'S09'], series_ids: ['S13', 'S17'],
          strength: { goal: 'Sustain good body-weight technique.', activities: ['Squat or supported split squat.', 'Wall/incline push-up.', 'Hands-and-knees reach.'], dose: 'Two sets of 6–10 repetitions; for split squats use 4–6 each side. Rest 60 seconds, longer if technique is not ready to repeat.', progress: 'Choose one small change, such as a second set or a slightly harder push-up angle. Keep all repetitions controlled.' },
          endurance: { goal: 'Maintain a linked task for a short round.', activities: ['Alternate a cooperative linked drill with partner feedback.'], dose: 'Four 30–40-second rounds, with 45–60 seconds recovery; each pair chooses one familiar sequence.', progress: 'Make the final sequence as orderly as the first before extending a round.' },
          ready: ['Keeps balance through each link.', 'Does not force a turn when the opening is closed.', 'Can receive the selected drill and release on command.'],
          regress: 'Freeze at each link or use two movements instead of the whole drill. Return turns to a coach-led station.'
        },
        {
          id: 'youth-5', title: 'Read one response and choose',
          overview: "Use a familiar series foundation and two options that have already been taught separately. The two-session core moves from an announced response to a real but limited choice; do not require the entire series for every pair.",
          practice_cycle: {"label":"Repeatable two-session core","core_a":{"title":"Core A — foundation and one option","focus":"Choose short sit, captured single or arm drag. Review the common position and one dependable option, then rehearse a second ready option with an announced partner response."},"core_b":{"title":"Core B — retrieve and respond","focus":"Retrieve both options and their triggers. Let the partner choose only those two responses at agreed light pressure; reset to the shared foundation after each attempt."},"extension":{"title":"Optional third session — extend and repair","focus":"Use a third session to vary partners or start timing, revisit missed cues and use short positional rounds. Keep the strength dose familiar while decisions become harder."}},
          skills: ['Choose block-and-reset or sprawl-and-circle from the depth of an entry.', 'From an arm drag, recognize the open back or a square-up response.', 'From a short sit, clear and hip-heist; add the stand-up option only after its separate lesson is reliable.'],
          move_ids: ['B05', 'B08', 'B11', 'B12', 'B16', 'B17', 'B21'], sequence_ids: ['S05', 'S06', 'S07', 'S08'], series_ids: ['S13', 'S14', 'S17'],
          strength: { goal: 'Keep a familiar foundation while decisions get harder.', activities: ['Repeat two or three established strength exercises.'], dose: 'Two sets of 8–10 easy-to-moderate repetitions, with about 60 seconds rest; use fewer repetitions for single-leg work.', progress: 'Hold the strength dose steady while adding decision-making in wrestling.' },
          endurance: { goal: 'Stay composed in short situational work.', activities: ['Start from a known position with one objective and reset after success.'], dose: 'Four 30–45-second rounds with 45–60 seconds recovery; change roles between rounds.', progress: 'Add a fifth round only if partners still make safe choices and recover well.' },
          ready: ['Chooses based on the partner rather than guessing every time.', 'Accepts a reset when the position is lost.', 'Maintains the same technical cue late in a round.'],
          regress: 'Tell the defender which response is coming and return to a cooperative rep.'
        },
        {
          id: 'youth-6', title: 'Use a small personal toolkit',
          overview: "Maintain a small personal toolkit and review gaps. Repeat the two-session core around one chosen foundation, with other positions kept in brief review; progress does not require a new move every week. Experienced pairs may choose the underhook series after both attacks and receiving lessons are reliable; other pairs keep their familiar foundation.",
          practice_cycle: {"label":"Repeatable two-session core","core_a":{"title":"Core A — foundation and one option","focus":"Each wrestler selects a familiar foundation and explains one reliable option. Review the setup, controlled result and a recovery or reset."},"core_b":{"title":"Core B — retrieve and respond","focus":"Recall the same toolkit and add one already-learned contrasting response. Use short situations to see whether the wrestler recognizes the opening and maintains partner control."},"extension":{"title":"Optional third session — extend and repair","focus":"Use a third session for individual help, favorite movement games and comfortable maintenance work. Near a meet or after absence, reduce work and retain the same useful skills."}},
          skills: ['Choose a familiar setup and attack.', 'Move from defense back to a balanced stance or safe control.', 'Recover on bottom and recognize when to stop a turn on top.'],
          move_ids: ['B05', 'B07', 'B08', 'B11', 'B17', 'B21', 'B22', 'B26'], sequence_ids: ['S04', 'S05', 'S06', 'S07', 'S08', 'S09'], series_ids: ['S13', 'S14', 'S17', 'S18'],
          strength: { goal: 'Maintain technique and confidence.', activities: ['A familiar squat, push and trunk-control combination.'], dose: 'One or two sets of 6–10 clean repetitions, with 60 seconds rest. Choose the lower amount on demanding wrestling days.', progress: 'Review improvements in control; avoid testing maximum repetitions.' },
          endurance: { goal: 'Repeat quality efforts and finish able to learn.', activities: ['Short situational rounds followed by an enjoyable movement game.'], dose: 'Three or four 40–60-second rounds with at least 60 seconds recovery, only for wrestlers already handling shorter rounds well.', progress: 'Maintain or reduce the dose near meets or when athletes need more recovery. Longer rounds are optional, not a season requirement.' },
          ready: ['Can name and demonstrate a small toolkit.', 'Works with more than one appropriate partner.', 'Can reflect on one improvement without focusing only on wins.'],
          regress: 'Return to a successful series and shorten the situation. Keep a simple task for new or returning wrestlers.'
        }
      ]
    },
    {
      age_group: '11-14',
      schedule_note: "Use the same two-session core across the coaching staff, with an optional third session for extra application, individual help or recovery. Experience and demonstrated readiness determine the options. Repeat cycles within a stage and use the confirmed TeamSnap schedule; age alone does not assign a club team.",
      summary: 'Use training experience, not age alone, to set difficulty. Beginners start with sound positions. Experienced athletes build options from a familiar sit-out, single leg, arm drag or near-wrist ride, then choose according to the partner. Linked drills help rehearse one route through those options. Strength and endurance support repeatable, controlled wrestling.',
      phases: [
        {
          id: 'older-1', title: 'Check foundations and establish a baseline',
          overview: "Observe stance, entries, receiving, base and hand-controlled escapes without ranking athletes or testing exhaustion. Use two sessions to establish and recall the starting foundation; experienced and new wrestlers may need different tasks.",
          practice_cycle: {"label":"Repeatable two-session core","core_a":{"title":"Core A — foundation and one option","focus":"Choose one position to check and refine. Teach or review one result, with each pair using an appropriate version and receiving standard."},"core_b":{"title":"Core B — retrieve and respond","focus":"Ask for the same position and result before prompting. Add one familiar response only if the prerequisite is reliable; otherwise repeat the first task with better feedback."},"extension":{"title":"Optional third session — extend and repair","focus":"Use an optional third session for prerequisite repair, individual coaching and familiar conditioning. Required new content belongs in the shared core."}},
          skills: ['Maintain posture while moving and changing level.', 'Enter and receive a controlled takedown.', 'Show hand-controlled separation after a stand-up.'],
          move_ids: ['B01', 'B02', 'B03', 'B07', 'B14', 'B17', 'B21'], sequence_ids: ['S01', 'S02', 'S08'], series_ids: [],
          strength: { goal: 'Find controlled versions of basic exercises.', activities: ['Body-weight squat or supported split squat.', 'Wall/incline push-up.', 'Hands-and-knees reach; optional supervised light band row.'], dose: 'One or two sets of 6–10 repetitions, with 60–90 seconds rest. Use 4–6 repetitions per side for split squats and reaches.', progress: 'Record the version and quality, not a maximum. An older beginner may need the easiest version.' },
          endurance: { goal: 'Choose a pace that can be repeated.', activities: ['Stance movement or cooperative entry-and-reset turns.'], dose: 'Four 30-second turns with 60 seconds recovery.', progress: 'Repeat with stable pace and posture before adding work.' },
          ready: ['Demonstrates controlled entries and receiving.', 'Can explain the purpose of hand control and stance recovery.', 'Finishes the final turn with usable technique.'],
          regress: 'Use solo entries, supported exercise variations and a longer recovery.'
        },
        {
          id: 'older-2', title: 'Develop reliable scoring and recovery',
          overview: "Develop dependable scoring and recovery from a chosen foundation. Repeat a two-session core until the position and finish hold up, then add a second option in a later cycle.",
          practice_cycle: {"label":"Repeatable two-session core","core_a":{"title":"Core A — foundation and one option","focus":"Choose a captured single, short sit or another established position. Teach one reliable result and the receiver’s role; preserve a balanced reset after each attempt."},"core_b":{"title":"Core B — retrieve and respond","focus":"Retrieve the same start and finish. Give one predictable reaction and check whether the wrestler keeps posture, hand control and receiving quality before increasing resistance."},"extension":{"title":"Optional third session — extend and repair","focus":"Use a third session for additional reps, a focused catch-up station and familiar strength work. Keep other positions in short review instead of replacing the shared focus."}},
          skills: ['Set up a double or single with hands and feet.', 'Defend the legs without collapsing onto the knees.', 'Rebuild base and stand with hand control.'],
          move_ids: ['B04', 'B06', 'B07', 'B08', 'B11', 'B12', 'B16', 'B17', 'B21'], sequence_ids: ['S04', 'S06', 'S07', 'S08'], series_ids: ['S13', 'S14'],
          strength: { goal: 'Build a consistent supervised routine.', activities: ['Squat, push-up variation, trunk reach and optional light band row.'], dose: 'Two sets of 8–12 controlled repetitions for familiar exercises; 4–6 reaches per side. Rest 60–90 seconds between sets.', progress: 'When the whole range is controlled on repeated sessions, change one exercise version or add a small coach-selected resistance. Do not add load and repetitions together.' },
          endurance: { goal: 'Repeat clean technical work.', activities: ['Alternate 30–40-second technique turns and partner feedback.'], dose: 'Four or five rounds with 60 seconds recovery.', progress: 'Keep the same movement quality in the last round before increasing duration.' },
          ready: ['Produces a dependable entry without diving.', 'Controls a low finish and releases promptly.', 'Recovers position after an unsuccessful first attempt.'],
          regress: 'Return to a known starting position and stop before the finish until receiving is reliable.'
        },
        {
          id: 'older-3', title: 'Build options from a shared position',
          overview: "Build a genuine series around one shared position at a time. Teach its options separately, then identify their different triggers; keep other positions in brief review rather than introducing several complete series at once.",
          practice_cycle: {"label":"Repeatable two-session core","core_a":{"title":"Core A — foundation and one option","focus":"Choose the short sit, head-inside single or near-wrist ride. Revisit the foundation and first option, then teach a second option separately if its prerequisites are sound."},"core_b":{"title":"Core B — retrieve and respond","focus":"Retrieve the common position and each selected option. Begin with announced reactions, then allow the partner to choose between them; reset after one result."},"extension":{"title":"Optional third session — extend and repair","focus":"Use a third session for the weak transition, alternative entries already taught or a related positional round. Keep essential branch instruction in Core A or Core B."}},
          skills: ['From a head-inside single, use the leg position to choose run-the-pipe or the taught change to double.', 'From a short sit, distinguish hand clearance, forward pressure and an available switch grip.', 'From near wrist, recognize a tilt opening, a wrist-roll opening for the half, or a reason to keep riding.'],
          move_ids: ['B08', 'A05', 'B18', 'B19', 'B20', 'A15', 'A16', 'B24', 'B25', 'A19', 'A21', 'A24', 'A30', 'B28'], sequence_ids: ['S10', 'S11', 'S12'], series_ids: ['S13', 'S14', 'S16'],
          strength: { goal: 'Build control through a larger range.', activities: ['Supported split squat or controlled body-weight squat.', 'Push-up variation and supervised light row.', 'Hands-and-knees reach.'], dose: 'Two sets of 6–10 repetitions, or 5–6 each side, with 60–90 seconds rest. Begin new variations with fewer easy repetitions.', progress: 'Improve range and alignment before increasing resistance. Finish with capacity for another clean repetition.' },
          endurance: { goal: 'Keep the shared position sound through repeated choices.', activities: ['Start each attempt at the series foundation and use one announced partner response.'], dose: 'Four 40–45-second rounds with 60–75 seconds recovery; reset to the foundation after each attempt.', progress: 'Recognize the response without a coaching prompt before increasing the work.' },
          ready: ['Can demonstrate the shared foundation and each selected option.', 'Recognizes which response makes an option available.', 'Can stop a turn or finish without forcing the partner.'],
          regress: 'Return to the common position and one announced branch. Rehearse that option separately before restoring a choice.'
        },
        {
          id: 'older-4', title: 'Choose between taught options',
          overview: "Use limited resistance and a real decision from a familiar series foundation. Core A sharpens the cues; Core B tests retrieval and choosing between trained responses. The underhook near-single/far-knee pair is optional after its two lessons; the over-under duck-under stays a separate setup.",
          practice_cycle: {"label":"Repeatable two-session core","core_a":{"title":"Core A — foundation and one option","focus":"Choose two established branches from sit-out, single-leg, near-wrist, arm-drag or underhook control. Have the wrestler identify the grip, pressure, target leg or angle that separates the choices."},"core_b":{"title":"Core B — retrieve and respond","focus":"Return to the same foundation with the receiver selecting one agreed response. Score the practice task only when the choice and controlled result fit; reset a lost position."},"extension":{"title":"Optional third session — extend and repair","focus":"Use an optional third session to adjust timing or partners, not to add an untrained counter. Keep strength work steady while the decision task is harder."}},
          skills: ['Choose a single-leg finish or single-to-double transition from the same captured-leg position.', 'Choose a taught go-behind, knee pick or single-leg pickup from an arm drag.', 'Read whether near-wrist control supports a tilt, half nelson or continued ride.', 'For prepared pairs, distinguish the underhook near-leg pickup from the far-knee-pick angle.'],
          move_ids: ['B08', 'A05', 'B11', 'B12', 'A08', 'A02', 'A03', 'B05', 'K14', 'B25', 'A21', 'A24'], sequence_ids: ['S07', 'S11', 'S12'], series_ids: ['S13', 'S14', 'S16', 'S17', 'S18'],
          strength: { goal: 'Maintain strength work while decision load increases.', activities: ['Two or three familiar exercises with excellent supervision and technique.'], dose: 'Two sets of 8–12 repetitions, with 60–90 seconds rest; retain the current exercise difficulty.', progress: 'Keep the dose steady on days with harder wrestling. Add no strength challenge solely because the calendar advanced.' },
          endurance: { goal: 'Make good choices under manageable fatigue.', activities: ['Constrained neutral or mat-position rounds with one objective.'], dose: 'Four 45–60-second rounds with 60–90 seconds recovery.', progress: 'Add a round or modestly extend a round only if decision quality and partner care remain consistent.' },
          ready: ['Uses the partner’s response as information.', 'Can recover when the first option fails.', 'Maintains agreed intensity and respects a reset.'],
          regress: 'Announce the response before the rep, lower resistance and restore a pause between actions.'
        },
        {
          id: 'older-5', title: 'Link positions and sustain useful work',
          overview: "Link a series result to the next position, such as a takedown to top control or an escape to stance. Keep the same connection in both core sessions so conditioning comes from purposeful, repeatable work.",
          practice_cycle: {"label":"Repeatable two-session core","core_a":{"title":"Core A — foundation and one option","focus":"Choose a familiar series option and one taught follow-on position. Rehearse the control change with a pause—for example, release the legs into a top ride after a finish."},"core_b":{"title":"Core B — retrieve and respond","focus":"Retrieve the same option and transition, then use a short situation with a named objective and reset. Sustain the technical cue across rounds before increasing work."},"extension":{"title":"Optional third session — extend and repair","focus":"Use a third session to repair the control change or review another familiar position. Adjust the amount of strength and endurance work to the rest of the athlete’s week."}},
          skills: ['Finish a double, cover, and follow a base rebuild into a breakdown.', 'Escape and immediately recover stance.', 'Use familiar series in short, scored situations.'],
          move_ids: ['A29', 'B07', 'B22', 'B16', 'A14', 'B21', 'A19', 'A24'], sequence_ids: ['S08', 'S09', 'S10', 'S12'], series_ids: ['S13', 'S14', 'S16', 'S17', 'S18'],
          strength: { goal: 'Keep strength while wrestling becomes more demanding.', activities: ['Familiar squat or split squat, push and row patterns.'], dose: 'One or two sets of 6–10 controlled repetitions with 60–90 seconds rest; choose less on hard wrestling days.', progress: 'Maintain the quality already built. Extra soreness or missed technique is a reason to reduce the session, not prove effort.' },
          endurance: { goal: 'Sustain position and recover between bouts of work.', activities: ['Position-to-position rounds; reset safely after a score.'], dose: 'Three 60–90-second rounds with 90 seconds recovery, only after shorter rounds are consistently sound.', progress: 'Choose the shorter end for newer wrestlers. Extend duration on a later day rather than removing recovery.' },
          ready: ['Changes control after the takedown without hanging onto the legs.', 'Maintains posture and release habits late in the round.', 'Can describe which position broke down and why.'],
          regress: 'Use a takedown-to-cover freeze or one mat-position task, with a shorter round and full recovery.'
        },
        {
          id: 'older-6', title: 'Refine a personal system and stay fresh',
          overview: "Refine a personal system around a few dependable foundations. Repeat the shared two-session core to review decisions and repair gaps; maintain freshness rather than collecting new branches near competition.",
          practice_cycle: {"label":"Repeatable two-session core","core_a":{"title":"Core A — foundation and one option","focus":"Select a primary series and explain the foundation, preferred option and useful alternative. Rehearse the response that has caused the most difficulty."},"core_b":{"title":"Core B — retrieve and respond","focus":"Retrieve those choices in brief positional work, then review one specific adjustment. Include familiar escapes and top control without turning the session into an exhaustion test."},"extension":{"title":"Optional third session — extend and repair","focus":"Use a third session for individual feedback, light technical rehearsal and recovery. Returning wrestlers can repeat the same core; new complexity is optional, not a graduation requirement."}},
          skills: ['Explain a preferred setup, attack and second option.', 'Demonstrate a bottom recovery and top-control plan.', 'Identify one specific improvement from a short round.'],
          move_ids: ['B07', 'B08', 'A05', 'B11', 'A14', 'A15', 'A19', 'A24', 'A29'], sequence_ids: ['S04', 'S06', 'S07', 'S08', 'S10', 'S11', 'S12'], series_ids: ['S13', 'S14', 'S16', 'S17', 'S18'],
          strength: { goal: 'Maintain established movement without chasing fatigue.', activities: ['A small selection of familiar strength exercises.'], dose: 'One or two sets of 6–8 comfortable repetitions with 60–90 seconds rest; lower volume when wrestling demand is high.', progress: 'Track cleaner movement and consistency. Save new resistance challenges for a suitable training period.' },
          endurance: { goal: 'Be ready to wrestle well, not merely tired.', activities: ['Two or three purposeful situational rounds, plus easy movement and recovery.'], dose: '60–90 seconds per round with 90 seconds or more recovery; use shorter rounds near competition or when quality drops.', progress: 'Maintain, shorten or reduce rounds as needed. A season does not require a final conditioning test.' },
          ready: ['Has a small connected system they can demonstrate.', 'Can adapt one coached detail without abandoning sound position.', 'Recognizes when recovery or a simpler task helps learning.'],
          regress: 'Return to cooperative rehearsals of the personal system and finish with a clear, successful technical goal.'
        }
      ]
    }
  ],
  series: [
    {
      id: 'S13', title: 'Sit-out series', age_groups: ['7-10', '11-14'], tier: 'Beginner', minutes: 10,
      summary: 'Use one compact sit-out position to create an escape or reversal. Clear and hip-heist, choose a learned rise through the feet or posting-side knee, or switch when the waist-and-thigh connection is available.',
      foundation: 'A balanced short sit: feet close enough to push, chest over the hips, elbows protecting the sides and the waist hand controlled in front. Sitting is the foundation, not the completed escape.',
      setup: 'Start with B18’s short sit and a cooperative rider behind-left. Review the solo sit-out and hip-heist first. For each attempt, the coach selects which already-taught options are available; top gives only those responses.',
      members: [
        {"move_id":"P09","role":"Preparation","note":"Rehearse the solo entry before adding the rider."},
        {"move_id":"P10","role":"Preparation","note":"Learn the low leg-through turn without partner pressure."},
        {"move_id":"B18","role":"Foundation","note":"The shared short-sit position; sitting alone is not an escape."},
        {"move_id":"B19","role":"Option","note":"Clear the waist hand and hip-heist to face."},
        {"move_id":"B20","role":"Preparation","note":"Teach switch mechanics before connecting the short-sit entry."},
        {"move_id":"A15","role":"Option","note":"A direct rise from the short sit when the taught forward-pressure response is present."},
        {"move_id":"N11","role":"Option","note":"Use the posting-side knee-under rise while retaining waist-hand control; a separate route from A15’s direct rise."},
        {"move_id":"A16","role":"Option","note":"Switch when the waist arm remains and the thigh grip is available."},
        {"move_id":"B21","role":"Finish","note":"Complete hand and hip clearance after the rise."}
      ],
      branches: [
        { title: 'Clear the hand and hip-heist', when: 'The waist hand can be cleared and the hips have space to turn.', action: 'Use B19: clear the whole waist hand, make the low leg-through hip turn, face the partner and separate. If top follows and keeps control, rebuild base and reset.', move_ids: ['B18', 'B19', 'P10'], readiness: 'First partner option for beginners after a controlled solo sit-out, hip-heist and hand-clear lesson. No shoulder roll or head post.' },
        { title: 'Rise to a stand-up', when: 'The rider follows with light forward pressure while the feet are planted close and hand control remains secure.', action: 'Use A15 to rise through the squat, retain the controlled hand, clear the hips and turn to face. Use the direct-rise version taught in that card.', move_ids: ['A15', 'B21'], readiness: 'Add after a balanced short sit, painless squat-to-stand and reliable hand-controlled stand-up finish. Teach separately before offering a choice.' },
        {"title":"Bring the knee under and stand","when":"Hand control is secure, the free hand can post beside the hip and the posting-side knee has room to slide underneath without a trapped leg.","action":"Use N11: place the knee under the hips on the posting-hand side, rise with a following rider, then use the already-taught hand-controlled stand-up finish. This is a separate rise option from A15’s direct squat rise.","readiness":"Teach the solo post-to-knee transition, half-kneeling rise and B21 finish first. Add only after a balanced short sit and reliable partner following; it is not the first beginner escape lesson.","move_ids":["N11","B21"]},
        { title: 'Switch behind', when: 'The rider keeps the waist arm in place and the inside thigh is within reach while both shoulders remain free to turn.', action: 'Use A16’s wrist transfer and thigh grip, lift and turn the hips, then scissor behind into control. This is a reversal option from the sit, not something to perform after the escape options.', move_ids: ['B20', 'A16'], readiness: 'Later option after B20’s switch, hip scissor and controlled receiving are reliable. Omit for beginners who are still learning the seat or hand clear.' }
      ],
      steps: ['Establish the short sit with controlled entry and a brief position check. Begin with P09 and P10 alone if hand support or leg clearance is uncertain.', 'Teach the hip-heist branch and its hand-clear requirement. Reset to the same sit-out foundation after every attempt.', 'Teach a rise option in its own lesson: A15 goes directly through the feet; N11 brings the posting-side knee underneath first. Add the switch only after its prerequisites. Identify the usable control and opening for each.', 'With two options learned, announce the rider’s response for a few attempts. Then let the rider choose between those two responses at agreed light pressure.', 'Use one branch per attempt. If the position is lost, rebuild base or reset; do not force the next move in a memorized order.'],
      cues: ['Own the short sit.', 'Read the hands and pressure.', 'Choose the opening.'],
      move_ids: ['P09', 'P10', 'B18', 'B19', 'B20', 'A15', 'N11', 'A16', 'B21'],
      readiness: 'Ages are starting points. For 7–10 beginners, begin with the foundation and hip-heist branch; introduce the rise or switch only when its listed prerequisite skills are dependable.',
      boundaries: 'No pullbacks, head-supported turns, shoulder rolls, finger peeling or mat returns. Keep the rider’s following pressure predictable; release for trapped limbs or loss of balance.',
      sources: [
        { title: 'Daryl Weber — Sit-out series', url: 'https://www.attackstylewrestling.com/sit-series/', note: 'Coach-authored lesson supports the compact foundation, hip-heist and N11 knee-under rise. N11 keeps its posting-side knee movement separate from A15’s direct rise. Gizoni options are not included.' },
        { title: 'USA Wrestling — Short-sit options', url: 'https://www.usawmembership.com/usa_wrestling_core_curriculum/2', note: 'Official Level 2 groups stand-up and switch under short sit. The linked A15 and A16 cards provide the selected instruction.' },
        { title: 'Cary Kolat — Sit-out hip-heist reference', url: 'https://www.youtube.com/shorts/ktNBmoBlTIA', note: 'Existing library reference for B19; its breakdown entry differs from this short-sit starting drill. Full instruction and verification notes are on B19.' }
      ]
    },
    {
      "id": "S14",
      "title": "Single-leg finish series",
      "age_groups": [
        "7-10",
        "11-14"
      ],
      "tier": "Beginner",
      "minutes": 10,
      "summary": "Start with the same captured head-inside single. Finish by running the pipe while the leg stays inside, or change to the taught double when the defender moves that leg outside.",
      "foundation": "A supported head-inside single with hips underneath, head up, elbows close and the captured leg held low. Establish this position before asking the wrestler to choose a finish.",
      "setup": "Start in B08’s captured-leg position. The receiver either keeps the leg between the attacker’s thighs or gives A05’s taught outside-leg response, turning the whole leg together. Rehearse both receiving positions separately. N01 and N02 are optional entries into this hold; teach them apart from the finish choice and establish the same captured-leg position first.",
      "members": [
        {
          "move_id": "B08",
          "role": "Foundation",
          "note": "Establish the head-inside capture; this card also teaches the run-the-pipe option."
        },
        {
          "move_id": "A05",
          "role": "Option",
          "note": "Change to a double when the captured leg moves outside."
        },
        {
          "move_id": "B07",
          "role": "Preparation",
          "note": "Teach controlled double-leg receiving before the conversion."
        },
        {
          "move_id": "N01",
          "role": "Entry",
          "note": "Enter the head-inside single after an arm-drag recovery; establish the hold before choosing a finish."
        },
        {
          "move_id": "N02",
          "role": "Entry",
          "note": "Enter from an established underhook and transfer both hands to the leg before the finish decision."
        }
      ],
      "branches": [
        {
          "title": "Run the pipe",
          "when": "The captured leg remains between the thighs and the receiver can turn and lower with the finish.",
          "action": "Use B08’s outside-foot backstep with the hips lowering and turning together. Guide the receiver onto the taught side, lower the leg and cover.",
          "move_ids": [
            "B08"
          ],
          "readiness": "First finish after a reliable leg capture and cooperative side landing."
        },
        {
          "title": "Change to a double",
          "when": "The defender moves the captured foot outside the attacker’s thigh and the far knee is reachable without losing posture.",
          "action": "Use A05: support the captured thigh, change the free hand to the far knee, step through and guide the receiver to the taught side. The outside-leg response changes the finish.",
          "move_ids": [
            "A05",
            "B07"
          ],
          "readiness": "Add only after the low double-leg finish, leg support and A05’s receiving are taught. Younger beginners can keep practicing the first finish until ready."
        },
        {
          "title": "Release and reset",
          "when": "The leg is trapped, the head drops, the foot cannot turn freely or neither finish has a controlled opening.",
          "action": "Support and lower the leg, release together and recover stance. Reset the foundation rather than wrenching the knee or inventing a lift.",
          "move_ids": [
            "B08",
            "A05"
          ],
          "readiness": "Practice this stop-and-release response before either partner chooses a finish."
        }
      ],
      "steps": [
        "Check the common leg capture and receiving on both sides without a finish.",
        "Teach run-the-pipe and its low landing first. Teach the outside-leg conversion as a separate option after the prerequisites.",
        "Have the receiver announce inside or outside before each attempt; the attacker names the matching finish.",
        "Remove the verbal cue only after both options are controlled. Reset after one finish or a lost position, then alternate roles."
      ],
      "cues": [
        "Head inside, hips under.",
        "Read where the leg goes.",
        "Support, finish, cover."
      ],
      "move_ids": [
        "B08",
        "A05",
        "B07",
        "N01",
        "N02"
      ],
      "readiness": "Dependable head-inside leg capture and low receiving. The second branch requires the single-to-double lesson; knowing a single entry alone does not establish readiness for every finish.",
      "boundaries": "No high leg lifts, unsupported dumps, twisting a planted foot or pulling through a trapped knee. Keep the starting position distinct from a head-outside high crotch.",
      "sources": [
        {
          "title": "Michael Trasso — Run-the-pipe lesson",
          "url": "https://www.themergeonline.com/episodes/ep-10-single-leg-run-the-pipe-finish",
          "note": "Creator’s lesson page identifies the position and finish. The B08 card supplies this guide’s controlled receiving and reset."
        },
        {
          "title": "Michael Trasso / FUJI — Barzegar finish",
          "url": "https://www.fujisports.co.uk/blogs/blog/the-merge-single-leg-barzegar-finish-to-side-control",
          "note": "Publisher explanation explicitly places this finish after the captured leg moves outside. A05 selects the reactive outside-leg version."
        },
        {
          "title": "Cary Kolat — Teaching curriculum",
          "url": "https://www.kolat.com/blog/kolatcom-4-6-year-teaching-curriculum-for-new-to-novice-wrestlers-by-cary-kolat",
          "note": "Organizes multiple finishes under single leg, including running the pipe and a later change to double. The title describes a multi-year curriculum, not ages 4–6."
        }
      ]
    },
    {
      id: 'S16', title: 'Near-wrist series', age_groups: ['11-14'], tier: 'Advanced', minutes: 10,
      summary: 'Keep the same near-wrist ride as the starting point, then choose a tilt, a half nelson or continued control according to the bottom wrestler’s response.',
      foundation: 'B25’s near-wrist ride: same-side hand controls the wrist beneath the body, the other arm controls the waist, hands stay separate and the top wrestler follows with a balanced base.',
      setup: 'Start from B25 on the left side. A30 supplies the existing decision drill. Bottom either rebuilds onto the knees with a load available, rolls the held wrist free while opening that elbow, or keeps a closed base without a turn opening.',
      members: [
        {"move_id":"B25","role":"Foundation","note":"Establish near-wrist control and follow the hips."},
        {"move_id":"A21","role":"Option","note":"Tilt when the retained wrist and supported hip load are available."},
        {"move_id":"A24","role":"Option","note":"Catch the half as the held wrist clears and the same elbow opens."},
        {"move_id":"A30","role":"Drill","note":"Practice choosing tilt, half or continued ride from the same starting control."},
        {"move_id":"B26","role":"Preparation","note":"Teach the half-nelson position before using its transition branch."},
        {"move_id":"B28","role":"Finish","note":"Settle the half-nelson turn into controlled chest-to-chest position."}
      ],
      branches: [
        { title: 'Tilt from the retained wrist', when: 'The near wrist is still controlled, bottom rebuilds onto the knees and the taught hip load is available.', action: 'Use A21’s supported hip load and near-leg lift. Expose the back, return the receiver through the side to belly-down, then unload the arm before release.', move_ids: ['A21', 'A30'], readiness: 'The tilt and supported side receiving have been taught separately. A blocked load is a reset, not a stronger wrist pull.' },
        { title: 'Catch the half as the wrist clears', when: 'The held wrist rolls free and that same elbow opens.', action: 'Release the old wrist grip and use A24 to follow the upper arm into the half. Move the feet into the taught turning angle and settle with B28.', move_ids: ['A24', 'B26', 'B28', 'A30'], readiness: 'A dependable half-nelson lesson and controlled turn receiving. An open elbow is required; widened knees alone do not create this option.' },
        { title: 'Keep the ride', when: 'The wrist remains controlled but the hip load is blocked and no half-nelson opening is present.', action: 'Use B25’s small following steps and chest connection to keep position. If the wrist escapes without the half opening or bottom stands, release and reset this drill.', move_ids: ['B25', 'A30'], readiness: 'Start here before either turning branch. The rider must keep the wrist aligned and recognize when to release.' }
      ],
      steps: ['Rehearse the near-wrist ride and following before teaching a turn.', 'Teach the tilt and wrist-roll-to-half as separate branches, each beginning from the same ride.', 'Have bottom announce rebuild, wrist roll or no opening; top names the choice and performs one option.', 'Let bottom select among those three rehearsed responses. Reset after a controlled turn, lost wrist or standing; do not perform tilt then half as a required chain.'],
      cues: ['Wrist held: check the load.', 'Wrist clears: read that elbow.', 'No opening: keep control.'], move_ids: ['B25', 'A21', 'A24', 'A30', 'B26', 'B28'],
      readiness: 'Controlled wrist riding, hip loading, tilt receiving and half-nelson receiving taught separately. Choose only the branches the pair has demonstrated reliably.',
      boundaries: 'No wrist bending, arm pulled behind the back, forced elbow opening, knee twisting or neck stacking. Release immediately if a trapped shoulder cannot follow the body.',
      sources: [
        { title: 'USA Wrestling — Near-wrist cheap tilt', url: 'https://www.usawmembership.com/usa_wrestling_core_curriculum/2', note: 'Official Level 2 links the near-wrist cheap tilt. A21 begins after wrist capture; the official video also includes its breakdown entry.' },
        { title: 'Daryl Weber — Near-wrist roll to half', url: 'https://www.attackstylewrestling.com/half-nelson-series/', note: 'Step 10 explains using the wrist-roll escape to catch the elbow and enter a same-side half. Other half-nelson variations on the page are separate options.' }
      ]
    },
    {
      "id": "S17",
      "title": "Arm-drag series",
      "age_groups": [
        "7-10",
        "11-14"
      ],
      "tier": "Beginner",
      "minutes": 9,
      "summary": "Use the same wrist-and-upper-arm drag to circle behind an open back, pick an available knee or collect a head-inside single after the partner recovers to face. Teach each selected option before mixing responses.",
      "foundation": "Wrist control feeding a grip above that same arm’s elbow, with an outside step and the feet following the cleared shoulder. Keep the arms close and remain balanced enough to change the finish.",
      "setup": "Use B05’s right-arm example: left hand on the partner’s right wrist, right hand behind that upper arm. The receiver permits the route to the back or retracts the elbow and steps to face. Agree which leg option has been taught and which leg is available; do not demand a knee pick and a single in the same attempt.",
      "members": [
        {
          "move_id": "B04",
          "role": "Preparation",
          "note": "Develop controlled wrist contact, inside position and moving feet."
        },
        {
          "move_id": "B05",
          "role": "Foundation",
          "note": "Establish the wrist-and-upper-arm drag; the first option ends standing behind."
        },
        {
          "move_id": "K12",
          "role": "Entry",
          "note": "Coach Kyle collection lesson on the same standing drag and rear position."
        },
        {
          "move_id": "K13",
          "role": "Drill",
          "note": "Rehearse alternating drags and outside footwork before adding a choice."
        },
        {
          "move_id": "K14",
          "role": "Option",
          "note": "Use the cross-knee pick when the receiver squares within range."
        },
        {
          "move_id": "N01",
          "role": "Option",
          "note": "Collect an available leg into a head-inside single when the defender closes the back."
        },
        {
          "move_id": "B08",
          "role": "Finish",
          "note": "Add the already-taught single-leg finish after N01 has established the low capture."
        }
      ],
      "branches": [
        {
          "title": "Circle to the back",
          "when": "The drag clears the shoulder and the route behind the hips stays open.",
          "action": "Use B05 to follow the shoulder, transfer the wrist hand to the far hip and circle behind. Freeze balanced with both wrestlers standing.",
          "move_ids": [
            "B05"
          ],
          "readiness": "First option after controlled wrist-and-upper-arm contact and cooperative footwork. Standing rear position is the endpoint of this drill."
        },
        {
          "title": "Cross-knee pick on the square-up",
          "when": "The partner retracts the elbow and steps to face, bringing the opposite knee within balanced reach.",
          "action": "Use K14: retain upper-arm contact, release the wrist, lower with the legs and collect the opposite knee while moving the torso over it. Guide the landing and follow the hips.",
          "move_ids": [
            "K14"
          ],
          "readiness": "For 7–10 beginners, first use a controlled knee touch and reset. Add the finish only after a separate knee-pick and receiving lesson; older beginners use the same progression."
        },
        {
          "title": "Collect the single when the back closes",
          "when": "The partner squares up after the drag and leaves a leg close enough to collect while you stay balanced.",
          "action": "Keep upper-arm contact while the first hand finds the leg, then transfer both hands to a head-inside single. Pause at the low hold; use the taught finish only when ready.",
          "readiness": "Controlled arm drag, balanced pickup and reliable release. Learn the pickup before asking the receiver to choose a response.",
          "move_ids": [
            "N01",
            "B08"
          ]
        },
        {
          "title": "Keep stance and restart",
          "when": "The arm cannot clear safely or the partner squares outside knee-pick range.",
          "action": "Release the stretched grip, recover the feet and start again. A failed drag does not require diving after the leg.",
          "move_ids": [
            "B05",
            "K14"
          ],
          "readiness": "Both partners can release promptly without yanking the shoulder."
        }
      ],
      "steps": [
        "Teach the common drag and standing go-behind with a predictable partner.",
        "Teach one leg option separately: K14 begins with an opposite-knee touch, while N01 ends first at a balanced single-leg capture. Add only the option whose prerequisites are ready.",
        "Offer open back or the rehearsed square-up by agreement; the attacker names the corresponding option. A knee-pick and a single-leg pickup are alternate choices, not compulsory steps.",
        "When two selected outcomes are reliable, let the receiver choose the practiced response. Teach any third option in a later lesson. Reset after one result or a closed opening."
      ],
      "cues": [
        "Drag and move together.",
        "Back open: circle.",
        "Square-up: find the taught leg option."
      ],
      "move_ids": [
        "B04",
        "B05",
        "K12",
        "K13",
        "K14",
        "N01",
        "B08"
      ],
      "readiness": "Controlled arm drag and release. Teach knee-pick receiving and single-leg capture separately; neither follows automatically from knowing the drag. Beginners start with the standing go-behind and a touch-only response. N01 first stops at a low capture and release.",
      "boundaries": "No wrist twisting, arm pulled behind the back, uncontrolled knee torque, dives, high lifts or mat returns. Support and lower a captured leg. If the knee is out of reach, restart instead of stretching across a planted leg.",
      "sources": [
        {
          "title": "Daryl Weber — Arm-drag foundation",
          "url": "https://www.attackstylewrestling.com/arm-drag/",
          "note": "Coach-authored instruction supports coordinated outside footwork, upper-arm control and the transition toward the hip. B05 deliberately stops standing."
        },
        {
          "title": "David Avellan — Knee pick after arm-drag defense",
          "url": "https://davidavellan.com/arm-drag-defense-to-knee-pick/",
          "note": "Creator explicitly describes knee-pick and snatch-single options when the defender retracts the elbow and steps away. K14 and N01 provide this guide’s selected teaching versions; the source is not a claim that every square-up offers both."
        }
      ]
    },
    {
      "id": "S18",
      "title": "Underhook attack series",
      "age_groups": [
        "7-10",
        "11-14"
      ],
      "tier": "Advanced",
      "minutes": 10,
      "summary": "Keep an established underhook and inside head position, then use the near-leg pickup or the far-knee pick when its leg and angle are available. A blocked first attempt does not automatically create the other attack.",
      "foundation": "Right underhook beneath the partner’s left arm, hand over the shoulder from behind; head inside beside the left temple; left hand lightly controlling the far right elbow. Both wrestlers stay balanced with free shoulders and knees. Reverse sides only after the coach has taught the mirrored setup.",
      "setup": "Start already in the shared tie. Teach N02’s near-leg capture and A02’s far-knee angle in separate lessons. Agree which leg the receiver will make available and have both partners identify it before contact. A13 is an optional way to gain an underhook: pause afterward and establish this exact hand, head and foot position before attacking.",
      "members": [
        {
          "move_id": "N02",
          "role": "Option",
          "note": "Pick up the near leg from the underhook and transfer both hands to a low head-inside single."
        },
        {
          "move_id": "A02",
          "role": "Option",
          "note": "Block the far knee from its taught angle and move the torso past it."
        },
        {
          "move_id": "A13",
          "role": "Entry",
          "note": "Optional Russian-tie clearance into an underhook; re-establish the series head position, shoulder grip and far-elbow control before choosing an attack."
        },
        {
          "move_id": "B08",
          "role": "Finish",
          "note": "A separately taught finish after N02 has established the supported single-leg hold."
        }
      ],
      "branches": [
        {
          "title": "Collect the near single",
          "when": "The underhook-side leg is within reach while the attacker keeps inside head position and a balanced stance.",
          "action": "Use N02: the free hand collects the near knee, the underhook hand joins the thigh and the feet recover underneath. First stop at a supported low single and release; add B08 only after its finish is learned.",
          "move_ids": [
            "N02",
            "B08"
          ],
          "readiness": "A secure underhook, controlled grip transfer and low single-leg receiving. Learn capture-and-release before a finish or reaction choice."
        },
        {
          "title": "Pick the far knee",
          "when": "The far knee is forward, weighted and reachable from the angle taught in A02. This may develop after the near leg withdraws, but the attacker must recover the tie and angle before changing targets.",
          "action": "Use A02: release the far-elbow hand to block that knee, keep the underhook and move the body across with short steps. Guide the taught side landing, release the knee and cover. Do not reach across from square or from a failed, stretched pickup.",
          "move_ids": [
            "A02"
          ],
          "readiness": "Teach the far-knee angle, knee block and cooperative side receiving separately. Begin with an announced target; no forced finish against a planted or twisted leg."
        },
        {
          "title": "Keep balance and reset the tie",
          "when": "Neither leg is within a taught angle, the underhook is trapped, head position is lost or the receiver cannot follow safely.",
          "action": "Stop the attempt. Support and lower any captured leg, release the strained control and return to stance. Rebuild the starting tie before another choice; do not improvise a throw or switch targets mid-fall.",
          "move_ids": [
            "N02",
            "A02"
          ],
          "readiness": "Both partners stop and release promptly. Practice resetting before the receiver chooses a response."
        }
      ],
      "steps": [
        "Check the shared underhook, inside head position and far-elbow contact with no takedown. Both partners should be able to release without shoulder strain.",
        "Teach the near-leg capture and far-knee pick as separate lessons. First use a low hold and release for the single, and a cooperative side landing for the knee pick.",
        "Re-establish the same tie for each attempt. The receiver announces the available leg; the attacker checks the target and angle before choosing one learned option.",
        "After both options are dependable, allow the receiver to withdraw the near leg or present it. A withdrawal is only a possible far-knee opening: recover the required tie and angle, or reset.",
        "Add an already-learned entry such as A13 or a single-leg finish such as B08 later. Stop at the foundation between stages until the connection is controlled."
      ],
      "cues": [
        "Own the hook and head position.",
        "Near leg: collect. Far knee: find the angle.",
        "No opening: rebuild."
      ],
      "move_ids": [
        "N02",
        "A02",
        "A13",
        "B08"
      ],
      "readiness": "For experienced 7–10 wrestlers and ready 11–14 wrestlers after both individual attacks and receiving skills are reliable. Age alone does not establish readiness. Beginners can keep developing stance, ties and one controlled attack; this is optional later work, not a group-wide requirement.",
      "boundaries": "No forced shoulder stretch, neck pull, strong whizzer, trapped-foot knee twist, high lift or unsupported landing. Keep the two grips and targets distinct. A03’s over-under duck-under is a separate setup and is not an automatic branch here.",
      "sources": [
        {
          "title": "Askren Wrestling Academy / Fanatic Wrestling — Underhook near single and far-knee choices",
          "url": "https://fanaticwrestling.com/blogs/news/learn-dominate-your-opponent-with-underhooks",
          "note": "The publisher’s technique explanation explicitly pairs the high single with a far-knee pick after near-leg withdrawal and requires the correct weighted leg and angle. Its wrist-control example is adapted to the shared far-elbow start in N02."
        },
        {
          "title": "Dan Henderson / CrossFit Journal — Deep-underhook knee pick",
          "url": "https://library.crossfit.com/free/pdf/60_07_Simple_Takedown.pdf",
          "note": "Firsthand illustrated lesson verifies A02’s deep right underhook, far-elbow start, knee block and body movement. This youth guide does not use its added leg trap or cage finish."
        },
        {
          "title": "USA Wrestling — Folkstyle Level 2 single-leg finishes",
          "url": "https://www.usawmembership.com/usa_wrestling_core_curriculum/2",
          "note": "Supports treating the captured single and its finishes as a separate stage after the underhook entry. B08 supplies this guide’s selected finish."
        }
      ]
    }
  ],
  sequences: [
    {
      id: 'S01', title: 'Stance → level change → step', age_groups: ['4-6', '7-10', '11-14'], tier: 'Pup', minutes: 5,
      summary: 'A solo foundation for entering under control. The finish is a balanced step and reset, not a takedown.',
      setup: 'Give each wrestler a clear lane and floor spot. Demonstrate all three positions before linking them.',
      steps: ['Find stance and take two short steps.', 'Lower through hips and knees while keeping eyes forward.', 'Take the taught level-change step, pause balanced, and recover stance.', 'Repeat three times, give one cue, then try the other lead if ready.'],
      cues: ['Lower, then step.', 'Eyes forward.', 'Finish balanced.'], move_ids: ['P01', 'P02', 'P03', 'P04'],
      readiness: 'Can stop and hold stance without falling or crossing feet.', boundaries: 'Solo and unopposed. Use a smaller range if the knee drops hard or the wrestler pitches forward.'
    },
    {
      id: 'S02', title: 'Belly → base → stand', age_groups: ['4-6', '7-10', '11-14'], tier: 'Pup', minutes: 5,
      summary: 'A solo recovery sequence that prepares athletes for bottom work.',
      setup: 'Space athletes apart on the mat. Begin on the belly, with no rider.',
      steps: ['Bring elbows and knees underneath using Solo Belly to Base.', 'Pause in a stable hands-and-knees base.', 'Plant the taught foot and rise with the Solo Stand-Up.', 'Recover stance and walk back to the start; make three controlled repetitions before coaching feedback.'],
      cues: ['Build your base.', 'Foot, then rise.', 'Own your balance.'], move_ids: ['P06', 'P05', 'P08'],
      readiness: 'Can support body weight on hands and knees and rise without assistance.', boundaries: 'No partner pressure or mat return. Separate the movements if rising becomes rushed.'
    },
    {
      id: 'S03', title: 'Solo sprawl → circle → stance', age_groups: ['4-6', '7-10', '11-14'], tier: 'Pup', minutes: 5,
      summary: 'Connect leg recovery and go-behind footwork around a floor marker before adding a partner.',
      setup: 'Use a flat floor marker with room to circle. Demonstrate the solo sprawl and recovery from its move guide.',
      steps: ['Start in stance behind the marker.', 'Make one controlled solo sprawl and recover feet underneath.', 'Circle the marker with short steps using Go-Behind Footwork.', 'Finish in stance and freeze. Alternate directions after a successful rep.'],
      cues: ['Legs back.', 'Recover your feet.', 'Short steps around.'], move_ids: ['P07', 'P11', 'P01'],
      readiness: 'Can sprawl and recover with control, then circle without crossing feet.', boundaries: 'No child acts as the obstacle. This solo sequence does not teach dropping the knees onto an attacker.'
    },
    {
      id: 'S04', title: 'Elbow pop → double leg → cover', age_groups: ['7-10', '11-14'], tier: 'Beginner', minutes: 8,
      summary: 'Use returning arm pressure to open a lane, enter the double and follow to controlled top position.',
      setup: 'Use the right-lead setup in B06 and B07. Start with cooperative partners who have practiced low side receiving.',
      steps: ['Make the small push and elbow pop from B06; release the arms as the lane opens.', 'Enter and pause in the taught double-leg capture with head up and hips underneath.', 'On the coach’s cue, use B07’s diagonal finish while the receiver lowers to the taught side.', 'Follow over the hips, settle without dropping weight, release and switch roles. Remove the capture pause only after both partners are comfortable.'],
      cues: ['Open the lane.', 'Head up, hips in.', 'Finish across and follow.'], move_ids: ['B04', 'B06', 'B07'],
      readiness: 'Controlled penetration step, balanced leg capture and reliable side receiving on both sides of the drill.', boundaries: 'No lifting, slamming or straight-arm posting. If the lane closes, reset rather than driving through closed arms.'
    },
    {
      id: 'S05', title: 'Wrist control → arm drag → go behind', age_groups: ['7-10', '11-14'], tier: 'Beginner', minutes: 7,
      summary: 'Create an angle with the arm and follow with the feet to reach the rear safely.',
      setup: 'Begin in stance with the wrist-and-inside-tie skills from B04. Follow B05’s demonstrated side and grips.',
      steps: ['Control the whole wrist with it aligned, then catch the upper arm above the elbow.', 'Draw the elbow across while stepping outside the partner’s foot.', 'Follow the shoulder with your feet and transfer control to the waist as you circle behind.', 'Freeze balanced behind the hips with light contact, release, and reset.'],
      cues: ['Arm across.', 'Feet follow.', 'Reach the back, then stop.'], move_ids: ['B04', 'B05'],
      readiness: 'Can follow a pull with the feet and let go immediately.', boundaries: 'Do not yank the shoulder, bend the wrist or add a rear lift. This sequence ends at controlled rear position.'
    },
    {
      id: 'S06', title: 'Single-leg entry → run the pipe → cover', age_groups: ['7-10', '11-14'], tier: 'Beginner', minutes: 8,
      summary: 'Connect a coach-taught single-leg pickup to a low, controlled finish and useful top position.',
      setup: 'First rehearse the pickup separately. Then begin in B08’s captured-leg position with the head inside and the foot held low.',
      steps: ['Enter only after the coach has taught and checked the single-leg pickup; pause with hips underneath.', 'Keep the head inside and arms close while taking the outside-foot step back.', 'Lower hips and turn the body together using B08, allowing the receiver’s hip and leg to turn as one.', 'Follow beside the hip, lower the held leg and transfer to the taught top control before resetting.'],
      cues: ['Head inside.', 'Turn your feet and hips.', 'Lower and cover.'], move_ids: ['B03', 'B08'],
      readiness: 'Can hold the single-leg position without wrenching the knee; receiver can lower to the side safely.', boundaries: 'Do not twist a trapped foot or knee, lift the leg high, or force the finish when the receiver cannot turn.'
    },
    {
      id: 'S07', title: 'Block or sprawl → recover or go behind', age_groups: ['7-10', '11-14'], tier: 'Beginner', minutes: 8,
      summary: 'Read the depth of the entry: an early block can recover stance; a deeper attack may need a sprawl and go-behind.',
      setup: 'Agree on two slow entries before starting. Teach each response alone; the attacker must be able to stop and hold a stable receiving base.',
      steps: ['For an early reaching entry, use B12’s down block and withdraw the leg.', 'When the leg clears, circle to face and recover stance; no sprawl is required after a successful block.', 'For the agreed deeper entry, use B11’s sprawl, clear the legs, and take short steps around the shoulder.', 'Finish behind the hips with taught control, release and reset. Only later let the attacker choose between the two entries.'],
      cues: ['Read the reach.', 'Clear your legs.', 'Face or circle behind.'], move_ids: ['B12', 'B11'],
      readiness: 'Each response works cooperatively before the attacker chooses which entry to show.', boundaries: 'No striking the head, neck pressure or dropping knees onto the attacker. Stop when receiving position or control is lost.'
    },
    {
      id: 'S08', title: 'Rebuild base → stand up → face', age_groups: ['7-10', '11-14'], tier: 'Beginner', minutes: 8,
      summary: 'Recover the platform for an escape, then retain hand control until rear contact is gone.',
      setup: 'Begin belly-down with a cooperative rider following from the taught side. Rehearse the rise and finish separately first.',
      steps: ['Use B16 to bring knees and elbows underneath and rebuild a stable base.', 'Plant the inside foot and control the rider’s whole hand near the wrist as in B17.', 'Rise onto your own feet with knees bent and move hips away from the rider.', 'Clear the arm, turn with the feet using B21, and finish low and facing before releasing.'],
      cues: ['Base first.', 'Take a hand with you.', 'Turn and face.'], move_ids: ['B16', 'B17', 'B21'],
      readiness: 'Stable base, balanced solo rise and a rider who follows and releases promptly.', boundaries: 'No individual-finger pulling or mat returns. If a rider secures a new hold the pair has not practiced, reset.'
    },
    {
      id: 'S09', title: 'Tight waist chop → half nelson → settle', age_groups: ['7-10', '11-14'], tier: 'Beginner', minutes: 9,
      summary: 'Establish a breakdown before teaching a controlled turn and stable chest-to-chest finish.',
      setup: 'Coach-led station with partners who have learned bottom lowering and slow shoulder-turn receiving. Begin from the legal top start.',
      steps: ['Use B22’s short elbow-folding action with forward body movement; bottom lowers to forearms and belly.', 'Pause and establish B26’s half-nelson position with the arm included and the far arm controlled.', 'Walk toward a perpendicular angle and turn the shoulder and torso together.', 'Use B28’s stable chest-to-chest finish, then ease pressure and release on the coach’s cue.'],
      cues: ['Break down first.', 'Move your feet.', 'Turn the body together.'], move_ids: ['B22', 'B26', 'B28'],
      readiness: 'Reliable receiving, immediate release and coach approval of the half-nelson position.', boundaries: 'Never force the neck or a blocked shoulder. Release if the arm slips out, the neck twists or the body cannot turn. No timed pin-pressure contest.'
    },
    {
      id: 'S10', title: 'Short sit → stand-up → clear the hands', age_groups: ['11-14'], tier: 'Advanced', minutes: 9,
      summary: 'Turn a compact sit-out into a rise, then deal with one taught attempt to regain waist control.',
      setup: 'Start in the short sit from B18. Teach A15 without a new hand reach before adding A14’s specific response.',
      steps: ['Keep shoulders over hips and feet close; control the waist hand.', 'As the cooperative rider follows forward, use A15 to rise through a squat onto balanced feet.', 'The rider offers the one free-hand reach taught in A14; guide that hand outside while retaining the original hand control.', 'Clear the hip and turn to face using B21. Reset if a different grip becomes established.'],
      cues: ['Compact sit.', 'Feet under you.', 'Clear, then face.'], move_ids: ['B18', 'A15', 'A14', 'B21'],
      readiness: 'Comfortable short sit, balanced stand-up and a reliable hand-controlled finish before combining them.', boundaries: 'No mat return, wrist wrench or improvised roll. The rider follows on their own feet and gives only the agreed response.'
    },
    {
      id: 'S11', title: 'Single leg → double leg when the foot clears', age_groups: ['11-14'], tier: 'Advanced', minutes: 9,
      summary: 'Use the receiver’s taught foot-clear response to change from the single to the double instead of forcing a blocked single-leg finish.',
      setup: 'Start in B08’s captured right-leg position. Review A05’s grips and B07’s receiving before adding the response.',
      steps: ['Hold the single with head inside, hips underneath and the captured leg supported.', 'Receiver moves the captured foot outside the thigh as taught, turning the whole leg together.', 'Support the thigh, lower through the knees and reach the free hand to block the far knee using A05.', 'Step across the stance, guide the receiver to the taught side, lower the leg and cover. Initially pause after the grip change.'],
      cues: ['Feel the foot clear.', 'Support the leg.', 'Find the far knee.'], move_ids: ['B08', 'A05', 'B07'],
      readiness: 'Dependable single-leg position and low double-leg finish; both partners know the response and receiving side.', boundaries: 'No twisting a planted knee, dumping an unsupported partner or changing direction against a trapped foot.'
    },
    {
      id: 'S12', title: 'Spiral → near wrist → half nelson opening', age_groups: ['11-14'], tier: 'Advanced', minutes: 10,
      summary: 'Use the breakdown to gain wrist control, then take the half only when the partner frees the wrist and opens the elbow.',
      setup: 'Review B24 and B25 first. A19 supplies the spiral-to-wrist transition; A24 supplies the specific wrist-release-to-half opening.',
      steps: ['Use the taught spiral breakdown while staying behind the shoulders.', 'When the near elbow lowers, secure the wrist and move the other arm to the waist as in A19.', 'Follow the hips in the near-wrist ride. If the elbow stays closed, maintain the ride rather than forcing a half.', 'On the agreed wrist-release and elbow-opening response, use A24 to catch the upper arm, insert the half, turn and settle as taught in B28.'],
      cues: ['Break down to the wrist.', 'Follow the hips.', 'Take the opening; do not force it.'], move_ids: ['B24', 'A19', 'B25', 'A24', 'B28'],
      readiness: 'Controlled spiral, wrist ride, half-nelson turn and receiving already taught separately.', boundaries: 'Keep the wrist below the chest and in front of the body. Do not pull the arm behind the back or force neck rotation; release immediately on stop.'
    }
  ],
  activities: [
    {
      id: 'C01', title: 'Move and freeze', type: 'warmup', age_groups: ['4-6', '7-10', '11-14'], minutes: 5,
      instructions: 'In clear lanes, alternate walking, skipping, side steps and easy stance motion. Work for 20 seconds, then take 20–30 seconds to walk and show a balanced freeze. Complete four to six turns. For Pups use one movement per turn and demonstrate it first.',
      cues: ['Find your space.', 'Soft steps.', 'Freeze balanced.'], boundary: 'No elimination, collisions or sudden full-speed direction changes into another lane.'
    },
    {
      id: 'C02', title: 'Squat, hinge and reach warm-up', type: 'warmup', age_groups: ['7-10', '11-14'], minutes: 5,
      instructions: 'After easy traveling, demonstrate four slow squats, four hip hinges with hands on hips, and four alternating overhead reaches. Repeat once, then add short stance steps. Keep the range comfortable and use the pause to coach positions.',
      cues: ['Hips back for the hinge.', 'Knees follow toes.', 'Move smoothly.'], boundary: 'No bouncing into a forced stretch or adding weight to an unfamiliar movement.'
    },
    {
      id: 'C03', title: 'Mirror stance and motion', type: 'drill', age_groups: ['4-6', '7-10', '11-14'], minutes: 5,
      instructions: 'Partners face each other without touching. One takes short stance steps and occasional level changes; the other mirrors. Use four 20-second turns with 30–40 seconds to rest and switch leaders. Pups can first copy a coach. Older wrestlers may use 30-second turns once their feet stay controlled.',
      cues: ['Stay facing.', 'Do not cross your feet.', 'Match, do not chase.'], boundary: 'No grabbing or contact. Slow down when the follower loses balance or the gap closes.'
    },
    {
      id: 'C04', title: 'Squat and stand tall', type: 'strength', age_groups: ['4-6', '7-10', '11-14'], minutes: 4,
      instructions: 'Stand with a comfortable foot width, bend hips and knees into a controlled squat, then stand tall. Pups make 3–5 playful repetitions. Older beginners use one or two sets of 6–10, resting 45–60 seconds between sets. Use a shallower squat if balance is lost.',
      cues: ['Whole foot on the floor.', 'Knees follow toes.', 'Stand under control.'], boundary: 'No weight, bouncing, forced depth or race to finish repetitions.'
    },
    {
      id: 'C05', title: 'Wall push-ups', type: 'strength', age_groups: ['7-10', '11-14'], minutes: 4,
      instructions: 'Place hands on a clear, stable wall around chest height. Step back slightly, keep the body aligned, bend the elbows to bring the chest toward the wall, then press away. Complete one or two sets of 6–10 controlled repetitions with 45–60 seconds rest. A coach may select a secure incline or floor variation only when alignment stays consistent.',
      cues: ['Move as one piece.', 'Breathe as you press.', 'Stop before your shape changes.'], boundary: 'Do not use unstable benches, stacked equipment or a partner as the support.'
    },
    {
      id: 'C06', title: 'Hands-and-knees reaches', type: 'strength', age_groups: ['4-6', '7-10', '11-14'], minutes: 4,
      instructions: 'From hands and knees, slowly lift one hand, set it down, then switch sides. Ready athletes can extend the opposite leg with the reaching arm while keeping the trunk level. Use 2–3 reaches per side for Pups or 3–6 for older groups; repeat once after 30–45 seconds rest.',
      cues: ['Keep your back quiet.', 'Reach long, not high.', 'Set down softly.'], boundary: 'Use the single-hand version when the body twists or the back sags. No partner balancing on the athlete.'
    },
    {
      id: 'C07', title: 'Short bear-crawl lanes', type: 'strength', age_groups: ['4-6', '7-10', '11-14'], minutes: 4,
      instructions: 'Mark a short, clear lane. Crawl slowly on hands and feet, taking small steps with knees just off the mat, then stand and walk back. Pups use 5–8 seconds per turn; older groups use 8–15 seconds. Complete three or four turns with 30–45 seconds rest.',
      cues: ['Small steps.', 'Quiet hips.', 'Stand and reset.'], boundary: 'No racing, piggyback loads or continuing when wrist, shoulder or trunk control is lost.'
    },
    {
      id: 'C08', title: 'Supported split squats', type: 'strength', age_groups: ['7-10', '11-14'], minutes: 5,
      instructions: 'Use a split stance beside a stable wall with light fingertip support. Bend both knees into a comfortable small range, then stand without moving the feet. Complete 4–6 repetitions per side, rest 45–60 seconds and repeat if technique stays sound. A coach can increase the range before removing support.',
      cues: ['Feet on two tracks.', 'Lower straight down.', 'Front knee follows toes.'], boundary: 'No added load, deep forced positions or loss of balance. Switch to a regular squat if needed.'
    },
    {
      id: 'C09', title: 'Coach-supervised light band rows', type: 'strength', age_groups: ['7-10', '11-14'], minutes: 5,
      instructions: 'Use a light resistance band attached to a purpose-made, coach-checked low anchor. Face it in a stable stance, draw elbows toward the ribs, then return slowly. Do one or two sets of 8–12 easy repetitions with 60 seconds rest. If suitable equipment or qualified instruction is unavailable, choose another body-control activity.',
      cues: ['Stand tall.', 'Elbows toward ribs.', 'Return slowly.'], boundary: 'Inspect band and anchor before use. Do not use a partner, door handle or improvised anchor, and never stretch a band toward someone’s face.'
    },
    {
      id: 'C10', title: 'Step, balance and hold', type: 'warmup', age_groups: ['4-6', '7-10', '11-14'], minutes: 4,
      instructions: 'Step onto a floor spot and hold balance briefly with the other toe available as a support. Alternate forward and sideways steps. Use 3–4 steps each direction, then reset for 20–30 seconds; repeat once. Ready older athletes may hold on one foot for two or three seconds.',
      cues: ['Soft knee.', 'Eyes forward.', 'Own the landing.'], boundary: 'Use steps rather than jumps when balance is uncertain. No pushing or partner contact.'
    },
    {
      id: 'C11', title: 'Easy marker loops', type: 'endurance', age_groups: ['4-6', '7-10', '11-14'], minutes: 6,
      instructions: 'Make a loop with flat markers and one direction of travel. Alternate easy jogging, skipping and side steps. Pups use four 15–20-second turns with 30–40 seconds walking; older groups can use four 30-second turns with 45–60 seconds recovery. Choose a pace that can be repeated comfortably.',
      cues: ['Keep your space.', 'Use the same easy pace.', 'Walk and recover.'], boundary: 'No passing through crowded lanes, punishment laps or compulsory sprint finish.'
    },
    {
      id: 'C12', title: 'Short stance intervals', type: 'endurance', age_groups: ['7-10', '11-14'], minutes: 6,
      instructions: 'In individual spaces, use short stance steps and occasional level changes for 20–30 seconds. Walk and recover for 40–60 seconds. Complete four rounds. Add a fifth round on a later day only if the final round keeps the same posture and footwork.',
      cues: ['Small, useful steps.', 'Hands ready.', 'Recover before repeating.'], boundary: 'Do not turn this into nonstop sprawls or demand low posture after control is gone.'
    },
    {
      id: 'C13', title: 'Entry, pause and reset', type: 'drill', age_groups: ['7-10', '11-14'], minutes: 6,
      instructions: 'Use one already-taught entry and its existing move guide. Spend one minute naming the starting stance, one coaching cue and the exact stop position. Solo option: rehearse the taught level change and entry step in an empty lane, pause in balance and return to stance; P03 and P04 provide the foundations. Partner option: enter against a cooperative, appropriately matched partner and pause at the taught balanced capture; both release and reset every repetition. Use four one-minute turns: up to 30 seconds for one or two controlled attempts, then 30 seconds for recovery, feedback and a role swap. Partners get two attacking turns each. Finish with one minute to show a good stop position and name what to repeat. Success is a controlled start, stop and reset, not the number of shots.',
      cues: ['Set up first.', 'Pause in balance.', 'Reset every rep.'], boundary: 'Use clear floor space rather than a bar, PVC frame or another athlete as an overhead target. Stop if knees, hands or head strike an obstacle, the lane becomes occupied, or balance is lost. No finish unless separately taught and authorized; no surprise sprawl or resistance.',
      sourceNote: 'Grindstone coaching adaptation: the six-minute format and target-free solo option are written for this card. Kolat supports recurring stance and entry practice; the selected existing move guide supplies the technique. This is not an exact video transcript or approval of fabricated obstacles.',
      sources: [{ title: 'Cary Kolat — teaching curriculum: stance, motion and penetration drills', url: 'https://www.kolat.com/blog/kolatcom-4-6-year-teaching-curriculum-for-new-to-novice-wrestlers-by-cary-kolat' }]
    },
    {
      id: 'C14', title: 'One-position rounds', type: 'endurance', age_groups: ['7-10', '11-14'], minutes: 8,
      instructions: 'Choose one taught situation, such as bottom rebuilding base while top follows with agreed light pressure. Name the objective, allowed actions and reset before starting. Begin with four 30-second rounds and 45–60 seconds recovery. Ready older wrestlers may later use 45–60-second rounds with 60–90 seconds recovery.',
      cues: ['Know the job.', 'Make one good choice.', 'Reset after success.'], boundary: 'Only use established techniques and agreed resistance. No surprise returns, forced turns or adding actions to win the drill.'
    },
    {
      id: 'C15', title: 'Movement station loop', type: 'endurance', age_groups: ['4-6', '7-10', '11-14'], minutes: 6,
      instructions: 'Set three stations: easy stance steps, a short controlled crawl, and a base-to-stand movement. Pups use 15–20-second stations followed by 35–45 seconds recovery; older athletes use 20–30-second stations with 30–45 seconds recovery. At the crawl station, crawl for only 5–8 seconds for Pups or 8–15 seconds for older athletes, then stand, walk and reset for the rest of the station. One round is enough to start; add a second only when movement and attention remain good.',
      cues: ['Quality at every station.', 'Walk between stations.', 'Ask for a reset when needed.'], boundary: 'Choose familiar versions and preserve personal space. This is a movement game, not a maximum-repetition test.'
    },
    {
      id: 'C16', title: 'Flat-ladder footwork', type: 'warmup', age_groups: ['4-6', '7-10', '11-14'], minutes: 6,
      instructions: 'Set three or four large floor boxes with coach-approved flat tape, or use a flat ladder that stays secure on the surface. Keep the exit, walking return and waiting point clear. Pair athletes at each lane; only one is in the lane at a time. Spend one minute demonstrating the chosen pattern. Pups walk with one foot in each box, then step completely out and freeze. Older athletes may step one foot then the other into each box before moving to the next; change the leading foot on their next turn. After forward stepping is controlled, ready older athletes can face sideways and step both feet into each box without crossing their feet. Use four one-minute turns: one slow pass lasting no more than 15 seconds, then walk back and recover for the rest of the minute; swap the active athlete at the next cue. Each partner gets two passes. Finish with one minute to demonstrate a balanced exit. Success means following the selected pattern and stopping under control; speed is optional.',
      cues: ['Step inside the box.', 'One pattern at a time.', 'Step out, then stop.'],
      boundary: 'No elevated rungs, hops, crawling through rungs, medicine balls or other added load in this card. Keep waiting athletes and return traffic outside the lane. Stop for a shifted rung, tangled strap, trip, pain or loss of balance; clear and reset before the next pass. Use flat spots or ordinary walking if a ladder is unsuitable.',
      sourceNote: 'Grindstone written adaptation, not an exact clip. Kolat lists speed-ladder and line footwork in a warm-up; the slow patterns, six-minute timing and Pup option here are our coaching choices. Existing V10 adds a medicine ball and V11 uses hops, so neither is presented as a matching demonstration of this unloaded stepping card.',
      sources: [{ title: 'Cary Kolat — Freestyle General Drill Session: ladder and line footwork', url: 'https://www.kolat.com/practice-plans/training-session-freestyle-general-drill-session' }]
    },
    {
      id: 'C17', title: 'Familiar-skill review', type: 'drill', age_groups: ['4-6', '7-10', '11-14'], minutes: 6,
      instructions: 'Choose one familiar move that this group has already learned. Keep its existing guide available and name the start position, one useful cue and the point where each attempt ends. Pups use a solo foundation such as P01 stance, P03 level change or P04 level change and step; they do not add a partner takedown or turn. For older groups, select one established staple such as an entry, stand-up or controlled half-nelson lesson only when both the movement and receiving have already been taught. Spend one minute demonstrating the selected version. Use four one-minute turns: up to 30 seconds for a few careful attempts, then 30 seconds to recover, give one correction and change roles. Pups make one or two attempts in 10–15 seconds and rest for the remaining time. Partner versions give each wrestler two active turns. Reset to the same foundation after every attempt. Use the last minute to ask athletes for the cue and record whether to repeat or simplify it next practice. Success is two controlled attempts with the agreed stop, not winning or adding a new option.',
      cues: ['Show the familiar start.', 'Use our one cue.', 'Stop, reset, repeat.'],
      boundary: 'This card organizes review; it does not replace the selected move instructions. Keep that guide’s prerequisites, permitted contact and receiving limits. Use no contact for Pups. Stop and simplify when an athlete cannot recall the start or maintain the agreed stop; no surprise resistance, unannounced finish or forced turn.',
      sourceNote: 'Grindstone written review format based on the meeting’s request for recurring staples. Kolat describes revisiting stance, motion and foundational techniques throughout training and teaching individual skills before combining them. This source does not prescribe our six-minute dose or approve every move for every age; the curriculum title describes years of learning, not ages 4–6.',
      sources: [{ title: 'Cary Kolat — teaching curriculum: repeated foundations before combinations', url: 'https://www.kolat.com/blog/kolatcom-4-6-year-teaching-curriculum-for-new-to-novice-wrestlers-by-cary-kolat' }]
    }
  ]
};
