window.GRINDSTONE_PATHWAY = {
  reviewed: '2026-10-23',
  intro: 'Build the season around what wrestlers can do: movement skills, reliable techniques, connected series, then choices against a partner. Strength and endurance grow alongside those skills.',
  coaching_principles: [
    'Use these as flexible stages, not deadlines or a weekly schedule. Age groups suggest a starting point; experience, attention, movement control and partner readiness decide the next step.',
    'The suggested doses are coaching starting points created for this guide, not official USA Wrestling prescriptions. Adjust them to the athletes in front of you.',
    'Teach new skills while athletes are fresh. Start with a dynamic warm-up, allow water and recovery, and shorten a block when technique or attention fades.',
    'Strength blocks complement wrestling and other sports; they are not a complete strength program. Plan structured strength work on nonconsecutive days and account for the athlete’s other activity.'
  ],
  guidance: {
    repeat: 'Repeat a stage as long as it helps. Keep one familiar skill, revisit one sticking point and change the game, partner or starting position to keep practice interesting. Reduce resistance or break a series into individual actions when a wrestler cannot stop, stay balanced or protect a partner. More exhausted repetitions are not better repetitions.',
    advance: 'Advance after the wrestler shows the listed readiness behaviors on more than one practice day, with both partners comfortable. First add a second movement, then a predictable partner response, then a choice. Increase only one challenge at a time: resistance, duration, repetitions or complexity. Leave enough recovery to repeat the movement well; never use conditioning as punishment.',
    catch_up: 'A missed week does not require cramming. Ask the wrestler to show the prerequisite movement, teach the missing link in a short coach-led station, and rejoin a familiar block. Let partners rehearse at cooperative speed before adding resistance. An athlete may be further ahead in neutral technique than in bottom skills or conditioning.',
    late_joiner: 'Start with stance, stopping on command, personal space, base and a comfortable rise from the mat. Give an older beginner the same foundations with age-respectful explanations. Pair with a reliable, appropriately matched partner; offer a simpler version of the group’s task. Add controlled contact only after the coach sees the prerequisites, rather than trying to catch up to a calendar.'
  },
  sources: [
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
      summary: 'Make movement, confidence and play the season’s foundation. Use demonstrations, one short cue and frequent successful turns. The sequences here are solo movements or noncontact partner games; they do not require live takedowns, forced holds or match conditioning.',
      phases: [
        {
          id: 'pups-1', title: 'Feel at home on the mat',
          overview: 'Learn the space, the stop signal and a few comfortable positions before asking for speed or partners.',
          skills: ['Freeze and listen on the stop signal.', 'Find a balanced stance and move without crossing feet.', 'Travel, stop and keep space around other children.'],
          move_ids: ['P01', 'P02'], series_ids: [],
          strength: { goal: 'Explore body control through play.', activities: ['Squat to touch a floor spot, then stand tall.', 'Walk a short bear-crawl lane, hands and feet on the mat.'], dose: 'One playful round: 3–5 squats and two 5–8-second crawls, with 20–30 seconds to reset between turns.', progress: 'First improve balance and control. Add a new direction before adding more repetitions.' },
          endurance: { goal: 'Enjoy moving and recovering.', activities: ['Walk, skip or shuffle between colored markers.'], dose: 'Four 15–20-second turns with at least 30 seconds of walking, explanation or rest between turns.', progress: 'Repeat a favorite game if children stay engaged. Shorten the turn if movement becomes rushed or they stop following cues.' },
          ready: ['Stops promptly without colliding.', 'Can show a stance and take a few balanced steps.', 'Willingly joins another turn after resting.'],
          regress: 'Use a smaller space, one direction and a coach to copy. Let children watch a turn and rejoin.'
        },
        {
          id: 'pups-2', title: 'Change levels and find a base',
          overview: 'Connect standing, lowering and stable hands-and-knees positions without a partner on top.',
          skills: ['Lower through knees and hips while looking forward.', 'Place hands and knees deliberately.', 'Move from belly to a steady base.'],
          move_ids: ['P03', 'P04', 'P05', 'P06'], series_ids: ['S01'],
          strength: { goal: 'Support body weight with control.', activities: ['Slow squat-and-reach.', 'Brief hands-and-knees balance with one hand lifted.'], dose: 'Two rounds of 3–5 squats and 2–3 hand lifts per side; rest about 30 seconds between rounds.', progress: 'Pause briefly in a balanced position before adding another repetition.' },
          endurance: { goal: 'Keep easy movement playful.', activities: ['Follow-the-leader travel with a base or stance freeze.'], dose: 'Four 20-second turns with 30–40 seconds to rest and change leaders.', progress: 'Add a new movement cue, not a longer race.' },
          ready: ['Lowers without diving onto hands or knees.', 'Holds a comfortable base briefly.', 'Returns from belly to base without being pulled up.'],
          regress: 'Teach the floor movement separately from the standing movement, using a floor marker for each child.'
        },
        {
          id: 'pups-3', title: 'Move down and get back up',
          overview: 'Make rising from the mat and recovering stance feel familiar. Keep every rep unopposed.',
          skills: ['Rebuild base from belly.', 'Bring a foot forward and rise with balance.', 'Show a soft, controlled solo sprawl and recover.'],
          move_ids: ['P05', 'P06', 'P07', 'P08'], series_ids: ['S02'],
          strength: { goal: 'Use legs and trunk to change levels.', activities: ['Base-to-stand movement.', 'Short bear crawl followed by a complete stand-up reset.'], dose: 'Two rounds of 3 rises and one 5–8-second crawl; allow 30–45 seconds between rounds.', progress: 'Use less prompting while preserving balance. Do not turn getting up into a race.' },
          endurance: { goal: 'Repeat small efforts without losing control.', activities: ['Travel to a spot, make one base-to-stand sequence, then walk back.'], dose: 'Four turns of roughly 20 seconds, with 30–40 seconds between turns.', progress: 'Add a fifth turn only when children are still moving comfortably and want another.' },
          ready: ['Rises without crashing into a neighbor.', 'Shows the same sequence twice with one cue.', 'Can reset calmly after a mistake.'],
          regress: 'Separate belly-to-base and base-to-stand. Use the solo sprawl only when landing and recovery remain controlled.'
        },
        {
          id: 'pups-4', title: 'Follow, mirror and change direction',
          overview: 'Introduce a partner as someone to cooperate with. The job is to copy and keep space, not to win a collision.',
          skills: ['Mirror a partner’s stance steps without touching.', 'Circle a floor marker with short steps.', 'Change direction on a simple visual cue.'],
          move_ids: ['P01', 'P02', 'P07', 'P11'], series_ids: ['S01', 'S03'],
          strength: { goal: 'Control weight shifts.', activities: ['Step sideways to a floor spot and freeze.', 'Small squat, stand and balance on one foot with a toe available for support.'], dose: 'Two rounds of 3–4 steps each way and 3 balances per side; rest 30 seconds.', progress: 'Make the pause steadier before making the step quicker.' },
          endurance: { goal: 'Stay active in short partner turns.', activities: ['Noncontact mirror-and-freeze.'], dose: 'Four 20–25-second turns; change leaders and rest for 30–40 seconds after each.', progress: 'Keep the follower successful. Add a direction only when both partners stay in their space.' },
          ready: ['Keeps a comfortable gap while mirroring.', 'Changes direction without crossing or tripping.', 'Takes turns as leader and follower.'],
          regress: 'Have the whole group mirror the coach before using pairs.'
        },
        {
          id: 'pups-5', title: 'Put two or three movements together',
          overview: 'Use short movement stories: lower and step, belly to base to stand, or sprawl and circle a marker.',
          skills: ['Remember two actions in order.', 'Finish every sequence balanced.', 'Choose the correct solo sequence from a picture or coach cue.'],
          move_ids: ['P03', 'P04', 'P05', 'P06', 'P07', 'P08', 'P11'], series_ids: ['S01', 'S02', 'S03'],
          strength: { goal: 'Repeat familiar body-weight movements well.', activities: ['Squat-and-reach, short crawl and base-to-stand stations.'], dose: 'One or two rounds: 4 squats, 5–8 seconds crawling and 3 rises. Allow 30–45 seconds between stations.', progress: 'Add a second round only if the last movement is as controlled as the first.' },
          endurance: { goal: 'Move through a short activity circuit.', activities: ['Three short stations with a water or walking break.'], dose: '20–25 seconds of activity, then 35–45 seconds to recover and move stations; one or two rounds.', progress: 'Change the task to sustain interest; do not shrink recovery to make it harder.' },
          ready: ['Links two movements without rushing.', 'Recovers stance before the next turn.', 'Can show a favorite sequence to a coach.'],
          regress: 'Return to one action at a time or let the child follow a coach through the sequence.'
        },
        {
          id: 'pups-6', title: 'Keep favorites and celebrate progress',
          overview: 'Finish the season by revisiting skills children enjoy and showing what has become easier. Progress is confidence, control and wanting to return.',
          skills: ['Lead a familiar movement for the group.', 'Choose and explain a simple cue.', 'Combine movement, balance and turn-taking in a game.'],
          move_ids: ['P01', 'P02', 'P05', 'P06', 'P08', 'P11'], series_ids: ['S01', 'S02', 'S03'],
          strength: { goal: 'Keep movement varied and successful.', activities: ['Children select two familiar body-control activities.'], dose: 'Two easy rounds of 3–5 repetitions or 5–10 seconds per activity, with 30–45 seconds between turns.', progress: 'Show better balance or independence rather than seeking a maximum score.' },
          endurance: { goal: 'Enjoy repeated play with recovery.', activities: ['Favorite noncontact movement game with rotating roles.'], dose: 'Four to six 20–30-second turns with 30–45 seconds of recovery; stop while the game remains successful.', progress: 'Maintain the dose when enthusiasm and control are good. More minutes are not a required graduation step.' },
          ready: ['Can show a stance, base and rise with little prompting.', 'Stops and shares space consistently.', 'Can name something learned and something enjoyed.'],
          regress: 'Return to the child’s favorite simpler version and finish with a successful turn.'
        }
      ]
    },
    {
      age_group: '7-10',
      summary: 'Build sound positions before speed, then give a familiar technique a useful next action. Begin with cooperative partners and add a limited, coach-defined response. Strength starts with body-weight movement; endurance comes from repeatable games and purposeful short rounds, not exhausting beginners.',
      phases: [
        {
          id: 'youth-1', title: 'Own the basic positions',
          overview: 'Establish stance, level change, base, the stop signal and how partners receive a movement. New wrestlers may stay here while experienced wrestlers sharpen details.',
          skills: ['Move in stance and change levels without folding at the waist.', 'Enter and recover a penetration step with control.', 'Build a stable base and rise without resistance.'],
          move_ids: ['B01', 'B02', 'B03', 'P05', 'P06', 'P08'], series_ids: ['S01', 'S02'],
          strength: { goal: 'Learn squat, push and trunk-control patterns.', activities: ['Body-weight squat.', 'Wall push-up.', 'Hands-and-knees reach.'], dose: 'One set of 6–8 easy squats and wall push-ups, plus 3 reaches per side; rest 45–60 seconds between exercises.', progress: 'Add clean repetitions toward 8–10 before choosing a harder version. Keep several comfortable repetitions in reserve.' },
          endurance: { goal: 'Find a repeatable pace.', activities: ['Noncontact mirror footwork or marker loops.'], dose: 'Four 20-second turns with 40 seconds of walking or rest.', progress: 'Keep the same pace across all turns before adding a fifth.' },
          ready: ['Stops and releases immediately.', 'Can enter and reset under control.', 'Maintains space and supports their own weight.'],
          regress: 'Use solo movements and a shorter range. Re-teach receiving before adding any finish.'
        },
        {
          id: 'youth-2', title: 'Make one attack and one escape reliable',
          overview: 'Choose a small number of techniques and help wrestlers succeed from a clear starting position. A partner cooperates with the taught entry and landing.',
          skills: ['Clear a hand or arm before entering.', 'Complete one coach-selected takedown with controlled receiving.', 'Stand from bottom with hand control and finish facing.'],
          move_ids: ['B04', 'B05', 'B07', 'B14', 'B15', 'B17', 'B21'], series_ids: ['S05', 'S08'],
          strength: { goal: 'Repeat simple whole-body exercises.', activities: ['Squat-and-reach.', 'Wall or coach-approved incline push-up.', 'Hands-and-knees reach.'], dose: 'One or two sets of 6–10 repetitions for squat and push-up; 3–4 reaches per side. Rest 45–60 seconds between sets.', progress: 'Add a second set only if the first stays easy to control. Keep the exercise version unchanged that day.' },
          endurance: { goal: 'Repeat technique without rushing.', activities: ['Take turns on an entry-and-reset drill; walk while the partner works.'], dose: 'Four 25–30-second work turns with at least 30–45 seconds to recover and receive feedback.', progress: 'Improve consistent setup and finish before increasing the number of turns.' },
          ready: ['Entry and landing are predictable and controlled.', 'Finishes an escape facing the partner.', 'Can explain one useful cue for each chosen technique.'],
          regress: 'Stop the attack at a balanced capture, or practice the escape without a rider.'
        },
        {
          id: 'youth-3', title: 'Defend and keep working from the mat',
          overview: 'Add a defensive response and a basic top-to-bottom task. Let wrestlers learn both roles before asking for a contest.',
          skills: ['Down block an early reach and recover stance.', 'Sprawl on a controlled deeper entry, then circle behind.', 'Rebuild base from belly; top follows without yanking.'],
          move_ids: ['B11', 'B12', 'B16', 'B22', 'B27', 'B30'], series_ids: ['S07', 'S08'],
          strength: { goal: 'Keep trunk and limbs coordinated.', activities: ['Squat, wall push-up and short bear crawl.', 'Optional light band row only with a coach-checked anchor and instruction.'], dose: 'Two sets of 6–10 controlled repetitions for familiar exercises; crawl 8–10 seconds. Rest about 60 seconds between sets.', progress: 'Use a steadier trunk and full control as the target. Do not race a circuit or work to failure.' },
          endurance: { goal: 'Recover between purposeful efforts.', activities: ['A 20–30-second base-rebuild or defense task, followed by a complete reset.'], dose: 'Four or five turns; rest 40–60 seconds after each active turn.', progress: 'First keep the same quality in the final turn. Add time or a turn later, not both together.' },
          ready: ['Distinguishes an early block from a needed sprawl.', 'Can recover base without reaching wildly.', 'Follows the agreed resistance level and stop signal.'],
          regress: 'Give the partner only one slow action and freeze after the defensive response.'
        },
        {
          id: 'youth-4', title: 'Connect setup, technique and finish',
          overview: 'Link actions that naturally belong together. Start with pauses between links; remove the pauses only when positions remain correct.',
          skills: ['Connect an elbow pop to a double-leg entry and finish.', 'Connect base to stand-up to separation.', 'Connect a breakdown to a coach-supervised half nelson turn.'],
          move_ids: ['B06', 'B07', 'B17', 'B21', 'B22', 'B26', 'B28'], series_ids: ['S04', 'S08', 'S09'],
          strength: { goal: 'Sustain good body-weight technique.', activities: ['Squat or supported split squat.', 'Wall/incline push-up.', 'Hands-and-knees reach.'], dose: 'Two sets of 6–10 repetitions; for split squats use 4–6 each side. Rest 60 seconds, longer if technique is not ready to repeat.', progress: 'Choose one small change, such as a second set or a slightly harder push-up angle. Keep all repetitions controlled.' },
          endurance: { goal: 'Maintain a linked task for a short round.', activities: ['Alternate a cooperative series with partner feedback.'], dose: 'Four 30–40-second rounds, with 45–60 seconds recovery; each pair chooses one familiar series.', progress: 'Make the final sequence as orderly as the first before extending a round.' },
          ready: ['Keeps balance through each link.', 'Does not force a turn when the opening is closed.', 'Can receive the full series and release on command.'],
          regress: 'Freeze at each link or use two movements instead of the whole series. Return turns to a coach-led station.'
        },
        {
          id: 'youth-5', title: 'Read one response and choose',
          overview: 'The partner gives one of two taught responses. The wrestler recognizes it and uses an already-learned action; this is not permission to improvise a forceful finish.',
          skills: ['Choose block-and-reset or sprawl-and-circle from the depth of an entry.', 'Use a taught arm drag when the arm is available.', 'Recover base before trying to stand again.'],
          move_ids: ['B05', 'B08', 'B11', 'B12', 'B16', 'B17', 'B21'], series_ids: ['S05', 'S06', 'S07', 'S08'],
          strength: { goal: 'Keep a familiar foundation while decisions get harder.', activities: ['Repeat two or three established strength exercises.'], dose: 'Two sets of 8–10 easy-to-moderate repetitions, with about 60 seconds rest; use fewer repetitions for single-leg work.', progress: 'Hold the strength dose steady while adding decision-making in wrestling.' },
          endurance: { goal: 'Stay composed in short situational work.', activities: ['Start from a known position with one objective and reset after success.'], dose: 'Four 30–45-second rounds with 45–60 seconds recovery; change roles between rounds.', progress: 'Add a fifth round only if partners still make safe choices and recover well.' },
          ready: ['Chooses based on the partner rather than guessing every time.', 'Accepts a reset when the position is lost.', 'Maintains the same technical cue late in a round.'],
          regress: 'Tell the defender which response is coming and return to a cooperative rep.'
        },
        {
          id: 'youth-6', title: 'Use a small personal toolkit',
          overview: 'Help each wrestler name a reliable attack, defense, escape and top action. Revisit gaps and keep enjoyable movement in every session.',
          skills: ['Choose a familiar setup and attack.', 'Move from defense back to a balanced stance or safe control.', 'Recover on bottom and recognize when to stop a turn on top.'],
          move_ids: ['B05', 'B07', 'B08', 'B11', 'B17', 'B21', 'B22', 'B26'], series_ids: ['S04', 'S05', 'S06', 'S07', 'S08', 'S09'],
          strength: { goal: 'Maintain technique and confidence.', activities: ['A familiar squat, push and trunk-control combination.'], dose: 'One or two sets of 6–10 clean repetitions, with 60 seconds rest. Choose the lower amount on demanding wrestling days.', progress: 'Review improvements in control; avoid testing maximum repetitions.' },
          endurance: { goal: 'Repeat quality efforts and finish able to learn.', activities: ['Short situational rounds followed by an enjoyable movement game.'], dose: 'Three or four 40–60-second rounds with at least 60 seconds recovery, only for wrestlers already handling shorter rounds well.', progress: 'Maintain or reduce the dose near meets or when athletes need more recovery. Longer rounds are optional, not a season requirement.' },
          ready: ['Can name and demonstrate a small toolkit.', 'Works with more than one appropriate partner.', 'Can reflect on one improvement without focusing only on wins.'],
          regress: 'Return to a successful series and shorten the situation. Keep a simple task for new or returning wrestlers.'
        }
      ]
    },
    {
      age_group: '11-14',
      summary: 'Use training experience, not age alone, to set difficulty. Beginners start with the same sound positions as younger wrestlers. Experienced athletes build connected attacks, escapes and rides, then solve limited situations. Strength is supervised, repeatable movement; endurance supports good wrestling instead of rewarding sloppy effort.',
      phases: [
        {
          id: 'older-1', title: 'Check foundations and establish a baseline',
          overview: 'Observe stance, entry, receiving, bottom base and a stand-up. Use the results to choose individual starting points without a public ranking or exhaustion test.',
          skills: ['Maintain posture while moving and changing level.', 'Enter and receive a controlled takedown.', 'Show hand-controlled separation after a stand-up.'],
          move_ids: ['B01', 'B02', 'B03', 'B07', 'B14', 'B17', 'B21'], series_ids: ['S01', 'S02', 'S08'],
          strength: { goal: 'Find controlled versions of basic exercises.', activities: ['Body-weight squat or supported split squat.', 'Wall/incline push-up.', 'Hands-and-knees reach; optional supervised light band row.'], dose: 'One or two sets of 6–10 repetitions, with 60–90 seconds rest. Use 4–6 repetitions per side for split squats and reaches.', progress: 'Record the version and quality, not a maximum. An older beginner may need the easiest version.' },
          endurance: { goal: 'Choose a pace that can be repeated.', activities: ['Stance movement or cooperative entry-and-reset turns.'], dose: 'Four 30-second turns with 60 seconds recovery.', progress: 'Repeat with stable pace and posture before adding work.' },
          ready: ['Demonstrates controlled entries and receiving.', 'Can explain the purpose of hand control and stance recovery.', 'Finishes the final turn with usable technique.'],
          regress: 'Use solo entries, supported exercise variations and a longer recovery.'
        },
        {
          id: 'older-2', title: 'Develop reliable scoring and recovery',
          overview: 'Choose an attack that suits the wrestler and establish a dependable escape and defensive response. Master the positions before collecting more moves.',
          skills: ['Set up a double or single with hands and feet.', 'Defend the legs without collapsing onto the knees.', 'Rebuild base and stand with hand control.'],
          move_ids: ['B04', 'B06', 'B07', 'B08', 'B11', 'B12', 'B16', 'B17', 'B21'], series_ids: ['S04', 'S06', 'S07', 'S08'],
          strength: { goal: 'Build a consistent supervised routine.', activities: ['Squat, push-up variation, trunk reach and optional light band row.'], dose: 'Two sets of 8–12 controlled repetitions for familiar exercises; 4–6 reaches per side. Rest 60–90 seconds between sets.', progress: 'When the whole range is controlled on repeated sessions, change one exercise version or add a small coach-selected resistance. Do not add load and repetitions together.' },
          endurance: { goal: 'Repeat clean technical work.', activities: ['Alternate 30–40-second technique turns and partner feedback.'], dose: 'Four or five rounds with 60 seconds recovery.', progress: 'Keep the same movement quality in the last round before increasing duration.' },
          ready: ['Produces a dependable entry without diving.', 'Controls a low finish and releases promptly.', 'Recovers position after an unsuccessful first attempt.'],
          regress: 'Return to a known starting position and stop before the finish until receiving is reliable.'
        },
        {
          id: 'older-3', title: 'Connect attacks, escapes and rides',
          overview: 'Build one series in each position. Teach the exact hand and body transitions, including when to stop and reset.',
          skills: ['Change from single to double when the taught opening appears.', 'Connect a short sit to a stand-up and hand-controlled finish.', 'Move from spiral breakdown to near wrist, then half when the elbow opens.'],
          move_ids: ['B08', 'A05', 'B18', 'A15', 'A14', 'B24', 'A19', 'A24', 'B28'], series_ids: ['S10', 'S11', 'S12'],
          strength: { goal: 'Build control through a larger range.', activities: ['Supported split squat or controlled body-weight squat.', 'Push-up variation and supervised light row.', 'Hands-and-knees reach.'], dose: 'Two sets of 6–10 repetitions, or 5–6 each side, with 60–90 seconds rest. Begin new variations with fewer easy repetitions.', progress: 'Improve range and alignment before increasing resistance. Finish with capacity for another clean repetition.' },
          endurance: { goal: 'Keep a series organized through repeat efforts.', activities: ['Cooperative series rounds with planned partner responses.'], dose: 'Four 40–45-second rounds with 60–75 seconds recovery.', progress: 'Reduce pauses within the series before shortening recovery.' },
          ready: ['Makes the grip transition without losing balance.', 'Recognizes the opening for the second action.', 'Can stop a turn or finish without forcing the partner.'],
          regress: 'Split the series into two-action segments and identify the missing prerequisite.'
        },
        {
          id: 'older-4', title: 'Choose between taught options',
          overview: 'Introduce limited resistance and a real decision. The partner may choose one of two agreed responses; athletes use only trained options.',
          skills: ['Choose single-leg finish or single-to-double transition.', 'Defend an entry and recover to the next useful position.', 'Read whether a near-wrist opening supports a half nelson.'],
          move_ids: ['B08', 'A05', 'B11', 'B12', 'A08', 'B25', 'A24'], series_ids: ['S07', 'S11', 'S12'],
          strength: { goal: 'Maintain strength work while decision load increases.', activities: ['Two or three familiar exercises with excellent supervision and technique.'], dose: 'Two sets of 8–12 repetitions, with 60–90 seconds rest; retain the current exercise difficulty.', progress: 'Keep the dose steady on days with harder wrestling. Add no strength challenge solely because the calendar advanced.' },
          endurance: { goal: 'Make good choices under manageable fatigue.', activities: ['Constrained neutral or mat-position rounds with one objective.'], dose: 'Four 45–60-second rounds with 60–90 seconds recovery.', progress: 'Add a round or modestly extend a round only if decision quality and partner care remain consistent.' },
          ready: ['Uses the partner’s response as information.', 'Can recover when the first option fails.', 'Maintains agreed intensity and respects a reset.'],
          regress: 'Announce the response before the rep, lower resistance and restore a pause between actions.'
        },
        {
          id: 'older-5', title: 'Link positions and sustain useful work',
          overview: 'Carry a successful takedown into top control, or an escape into a safe neutral reset. Build endurance through purposeful wrestling rather than adding unrelated fatigue.',
          skills: ['Finish a double, cover, and follow a base rebuild into a breakdown.', 'Escape and immediately recover stance.', 'Use familiar series in short, scored situations.'],
          move_ids: ['A29', 'B07', 'B22', 'B16', 'A14', 'B21', 'A19', 'A24'], series_ids: ['S08', 'S09', 'S10', 'S12'],
          strength: { goal: 'Keep strength while wrestling becomes more demanding.', activities: ['Familiar squat or split squat, push and row patterns.'], dose: 'One or two sets of 6–10 controlled repetitions with 60–90 seconds rest; choose less on hard wrestling days.', progress: 'Maintain the quality already built. Extra soreness or missed technique is a reason to reduce the session, not prove effort.' },
          endurance: { goal: 'Sustain position and recover between bouts of work.', activities: ['Position-to-position rounds; reset safely after a score.'], dose: 'Three 60–90-second rounds with 90 seconds recovery, only after shorter rounds are consistently sound.', progress: 'Choose the shorter end for newer wrestlers. Extend duration on a later day rather than removing recovery.' },
          ready: ['Changes control after the takedown without hanging onto the legs.', 'Maintains posture and release habits late in the round.', 'Can describe which position broke down and why.'],
          regress: 'Use a takedown-to-cover freeze or one mat-position task, with a shorter round and full recovery.'
        },
        {
          id: 'older-6', title: 'Refine a personal system and stay fresh',
          overview: 'Choose a primary attack and response, one reliable escape chain and one top series. Review decisions, keep skills sharp and adjust workload around competition and recovery.',
          skills: ['Explain a preferred setup, attack and second option.', 'Demonstrate a bottom recovery and top-control plan.', 'Identify one specific improvement from a short round.'],
          move_ids: ['B07', 'B08', 'A05', 'B11', 'A14', 'A15', 'A19', 'A24', 'A29'], series_ids: ['S04', 'S06', 'S07', 'S08', 'S10', 'S11', 'S12'],
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
      instructions: 'Use one already-taught entry. The attacker enters against a cooperative partner and freezes at balanced capture; both release and reset before the next repetition. Alternate 20–30-second turns with 30–45 seconds for recovery and feedback. Complete four turns per pair, then review one cue.',
      cues: ['Set up first.', 'Pause in balance.', 'Reset every rep.'], boundary: 'No finish unless the coach has taught and authorized it. Match partners appropriately and stop on any loss of receiving control.'
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
    }
  ]
};
