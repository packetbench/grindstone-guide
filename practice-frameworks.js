window.GRINDSTONE_FRAMEWORKS = {
  reviewed: '2026-10-24',
  warmupIdeas: [
    'Easy jogging or walking around the mat',
    'Gentle stretches and mobility: arm circles, reaches and leg swings',
    'Light exercises: squats, wall push-ups or jumping jacks',
    'Familiar movement: skips, side shuffles or short animal walks',
    'Easy stance and motion or a familiar stop-and-go game'
  ],
  programNote: 'Times and entrances come from the club’s printed 2026–27 handout. Check TeamSnap for changes. Program names do not assign an athlete to an age or ability tier.',
  timingNote: 'These editable coaching frameworks are proposed allocations within the scheduled window. Every block includes demonstration, partner turns, feedback, recovery and transitions. Water remains available throughout. A longer window allows more useful practice and individual help; it does not require more new moves or continuous hard work.',
  programs: [
    {
      id: 'black', name: 'Mat Rats — Black', days: ['Monday', 'Wednesday', 'Friday'], start: '18:00', minutes: 120,
      location: 'Westminster High School', entrance: 'Main entrance or concert entrance', defaultFramework: 'two-hour'
    },
    {
      id: 'blue', name: 'Mat Rats — Blue', days: ['Tuesday', 'Thursday'], start: '18:00', minutes: 120,
      location: 'Westminster High School', entrance: 'Main entrance or concert entrance', defaultFramework: 'two-hour'
    },
    {
      id: 'pups', name: 'Pups', days: ['Tuesday'], start: '18:00', minutes: 60,
      location: 'Winters Mill High School', entrance: 'At the back of the wrestling room by the baseball fields', defaultFramework: 'hour'
    },
    {
      id: 'valkyries', name: 'Valkyries', days: ['Monday', 'Wednesday', 'Friday'], start: '18:30', minutes: 90,
      location: 'Winters Mill High School', entrance: 'At the back of the wrestling room by the baseball fields', defaultFramework: 'ninety'
    }
  ],
  frameworks: [
    {
      id: 'hour', title: '60-minute play and foundation practice', minutes: 60,
      summary: 'A familiar opening, one chosen wrestling technique, short cooperative attempts and a positive game finish. For Pups, choose a ready stage from the double leg, sprawl/go-behind, stand-up, breakdown or half-nelson cards C18–C22; revisit it across practices. Teach both partner roles and allow a controlled finish when ready. Games complement the technique; solo preparation stays available.',
      blocks: [
        {
          section: 'prepare', type: 'warmup', name: 'Welcome and movement', minutes: 8,
          instructions: 'Greet the group, show the activity area and rehearse the stop signal. Choose a familiar movement game that prepares children for today’s task. Alternate brief turns with resets and check that everyone has space.',
          cues: 'Look, move, freeze. Keep the opening familiar and give one cue at a time.'
        },
        {
          section: 'staples', type: 'drill', name: 'Familiar foundations', minutes: 8,
          instructions: 'Choose two familiar skills or positions from the library. Use short demonstrations and several successful attempts. A child who needs help can copy a coach or use a simpler version. Review the foundation needed for today’s selected option.',
          cues: 'Show me the start. Finish balanced. Take turns.'
        },
        {
          section: 'teach', type: 'series', name: 'Teach one wrestling skill', minutes: 10,
          instructions: 'Choose one actual technique and its ready stage, such as C18 double-leg entry to low finish or C20 stand-up, clear and face. Teach the receiver or following partner first. Demonstrate briefly, give short attempts and one useful correction, then swap roles. Ready pairs complete the controlled finish; others rehearse the solo or coach-assisted stage. Include rest and resets rather than ten minutes of continuous drilling.',
          cues: 'Find our starting position. Try one action. Stop and reset.'
        },
        {
          section: 'reset', type: 'water', name: 'Water and reset', minutes: 4,
          instructions: 'Allow water and a supervised pause while coaches prepare the next space and partner arrangements. Check comfort and attention. Children can take additional water or rest whenever needed.',
          cues: 'Water, breathe, then find your space.'
        },
        {
          section: 'choices', type: 'drill', name: 'Play with today’s skill', minutes: 10,
          instructions: 'Revisit today’s chosen wrestling technique in short cooperative turns with an announced start and finish. Repeat the taught sprawl and go-behind or breakdown to belly; pause, release and swap. Once familiar, use a simple related game. Keep the same ready stage for each child; no surprise resistance or new finish.',
          cues: 'What is your job? Try, stop, swap.'
        },
        {
          section: 'physical', type: 'drill', name: 'Balance and body-control stations', minutes: 6,
          instructions: 'Choose familiar movement activities that build balance, coordination or supporting body weight. Keep turns short, allow recovery and offer an easier version. This may be part of a playful circuit; it is not an exhaustion test or a required loaded exercise block.',
          cues: 'Move comfortably. Stay in control. Rest and try again.'
        },
        {
          section: 'game', type: 'game', name: 'Finish with a favorite game', minutes: 10,
          instructions: 'Choose a game that complements the wrestling skill already practiced and fits the space, supervision and children’s readiness. Explain the start, score or shared goal, stop signal and role changes. Keep everyone involved through small groups or rotating turns, with rests between rounds.',
          cues: 'Know the boundary. Care for your partner. Stop together.'
        },
        {
          section: 'recap', type: 'custom', name: 'Celebrate and close', minutes: 4,
          instructions: 'Slow the activity, invite children to show or name something they enjoyed, and recognize a specific effort or good partner action. Preview the next visit and complete supervised pickup.',
          cues: 'What did you try? What would you like to do again?'
        }
      ]
    },
    {
      id: 'ninety', title: '90-minute series and application practice', minutes: 90,
      summary: 'Prepare, revisit staples, teach a selected series option and use it in meaningful situations. Keep the common foundation consistent while adjusting branches, resistance and physical work to the athletes present.',
      blocks: [
        {
          section: 'prepare', type: 'warmup', name: 'Movement and practice purpose', minutes: 12,
          instructions: 'State today’s foundation and learning goal, then use a familiar dynamic warm-up with movement and reaction tasks. Prepare for the positions being taught without tiring the group before learning. Include partner assignment and space checks.',
          cues: 'Move with control. Know today’s starting position and goal.'
        },
        {
          section: 'staples', type: 'drill', name: 'Review the staples', minutes: 12,
          instructions: 'Select two or three already-taught skills, including the prerequisite for today’s series and one recurring difficulty. Use short partner turns or familiar stations. Coaches observe quality, give concise feedback and adjust partners or difficulty.',
          cues: 'Start correctly. Complete the action. Reset ready for your partner.'
        },
        {
          section: 'teach', type: 'series', name: 'Teach and rehearse selected options', minutes: 18,
          instructions: 'Choose one series foundation and the option being introduced or refined. Demonstrate the starting control, relevant partner response and finish. Alternate short explanations with cooperative repetitions. Add a second option only after its prerequisites are reliable; do not teach every branch simply because it is listed.',
          cues: 'Keep the foundation. Recognize the response. Rehearse both partner roles.'
        },
        {
          section: 'reset', type: 'water', name: 'Water, feedback and reset', minutes: 4,
          instructions: 'Allow recovery and water. Ask one quick question about the decision being learned while coaches set the next starting positions. Replace a difficult branch with a familiar task when needed.',
          cues: 'Which response opens your option? Reset before raising the challenge.'
        },
        {
          section: 'choices', type: 'drill', name: 'Read the reaction and wrestle the situation', minutes: 20,
          instructions: 'Begin with the partner giving a rehearsed response; progress to a choice between familiar responses when ready. Then use short situational rounds with an assigned start, objective for each partner, permitted actions and reset condition. Include rests, role swaps and feedback. Broader live wrestling is an optional extension for ready pairs.',
          cues: 'Read before choosing. Preserve position. Reset when the task is complete.'
        },
        {
          section: 'physical', type: 'strength', name: 'Physical-development stations', minutes: 10,
          instructions: 'Choose a small set of appropriate strength or coordination activities and specify effort, recovery and coaching roles. Teach the movement before adding challenge. If earlier rounds already supplied the intended endurance work, use controlled quality work or review rather than another hard finisher.',
          cues: 'Quality first. Recover between efforts. Make the next repetition as controlled as the first.'
        },
        {
          section: 'game', type: 'game', name: 'Wrestling game', minutes: 10,
          instructions: 'Choose a game that practices movement, reactions, balance or control. Give a clear boundary, objective and reset, and rotate roles. Keep the challenge suitable for the group’s remaining attention and energy.',
          cues: 'Play the task. Respect the stop. Help everyone get another turn.'
        },
        {
          section: 'recap', type: 'custom', name: 'Cool down and identify the next step', minutes: 4,
          instructions: 'Reduce the activity, revisit the main cue and ask athletes to identify a response they recognized. Recognize progress and confirm dismissal arrangements. Coaches note what to repeat or change next time.',
          cues: 'What did you notice? Which option needs another look?'
        }
      ]
    },
    {
      id: 'two-hour', title: '120-minute practice with coached stations', minutes: 120,
      summary: 'Use the longer window for retrieval, partner repetitions, coached stations and individual corrections. The second half revisits and applies the same focus; it does not require another set of new moves. All rounds include rest and feedback.',
      blocks: [
        {
          section: 'prepare', type: 'warmup', name: 'Movement and practice purpose', minutes: 12,
          instructions: 'Set one main learning goal and lead a familiar dynamic warm-up. Include movement that prepares the day’s positions and a brief reaction task. Check space, partners and the stop signal while athletes are fresh.',
          cues: 'Know the goal. Move well before moving faster.'
        },
        {
          section: 'staples', type: 'drill', name: 'Staples and familiar stations', minutes: 18,
          instructions: 'Choose two or three previously taught staples, including today’s prerequisite and a skill needing review. Use short station rotations only when each task and coach assignment are clear. Spend the time on active attempts and corrections rather than queues or extra new techniques.',
          cues: 'Start in position. Complete the task. Be a useful partner.'
        },
        {
          section: 'teach', type: 'series', name: 'Establish the foundation and selected option', minutes: 18,
          instructions: 'Show the common position, the chosen option and the partner response that makes it useful. Alternate brief demonstrations with cooperative repetitions and feedback. Different pairs may rehearse different readiness versions of the same foundation.',
          cues: 'Find the foundation. Show the opening. Finish with control.'
        },
        {
          section: 'choices', type: 'drill', name: 'Practice reading a response', minutes: 12,
          instructions: 'Have partners give a known response, then let ready pairs distinguish between two rehearsed responses. Use short turns and clear role swaps. Coach the decision and partner behavior; return to cooperative rehearsal when the position breaks down.',
          cues: 'Look and feel first. Choose the option that fits. Reset.'
        },
        {
          section: 'reset', type: 'water', name: 'Midpoint water and coaching reset', minutes: 5,
          instructions: 'Provide recovery and water while coaches compare what they observed. Keep the same focus, regroup for useful feedback and choose a simpler or more challenging task for the second half. Additional water and rest remain available throughout practice.',
          cues: 'Recover. Keep what worked. Adjust what did not.'
        },
        {
          section: 'teach', type: 'drill', name: 'Coached follow-up stations', minutes: 12,
          instructions: 'Use small groups for a specific correction, extra practice of the primary option or a familiar additional branch. Assign a coach, task, rotation and success condition to each station. Newcomers can rehearse the foundation while experienced athletes refine a reaction; no pair needs a new move to use this time well.',
          cues: 'One correction at a time. Show the improvement before adding more.'
        },
        {
          section: 'choices', type: 'drill', name: 'Apply the series in situations', minutes: 13,
          instructions: 'Start from the selected foundation or a familiar entry into it. State each partner’s job, permitted resistance and scoring or reset condition. Run short bouts with recovery, role changes and feedback; extend toward open wrestling only where readiness and the day’s purpose support it.',
          cues: 'Keep the position. Read the response. Stop and reset on the agreed condition.'
        },
        {
          section: 'physical', type: 'strength', name: 'Strength, coordination or repeat-effort stations', minutes: 15,
          instructions: 'Select the physical quality that needs attention and use a few appropriately scaled activities. Include demonstration, recovery and transitions in the station time. Replace this block with low-demand movement or technical review if earlier work supplied enough conditioning or control is declining. Loaded or unfamiliar exercises require suitable instruction and supervision.',
          cues: 'Choose the right challenge. Rest between efforts. Keep technique consistent.'
        },
        {
          section: 'game', type: 'game', name: 'Wrestling game', minutes: 10,
          instructions: 'Choose one game suited to today’s learning, remaining energy and available space. Explain roles, boundaries and the stop/reset rule. Use short rounds and rotating turns so the finish stays engaging and controlled.',
          cues: 'Play with purpose. Respect your partner. Stop together.'
        },
        {
          section: 'recap', type: 'custom', name: 'Cool down, reflect and close', minutes: 5,
          instructions: 'Slow the activity, ask athletes to name or show the key decision, and recognize a specific improvement. Confirm dismissal and gear arrangements. Coaches record the next teaching action so the following session builds on what happened.',
          cues: 'What worked? What will we revisit?'
        }
      ]
    }
  ],
  sessions: [
    {
      id: 'core-a', title: 'Core A — foundation and first option',
      description: 'Choose the shared foundation, review its prerequisites and teach or refine one dependable option. Give partners a clear cooperative response. Record what needs another attempt before adding choices.'
    },
    {
      id: 'core-b', title: 'Core B — retrieve and choose',
      description: 'Revisit the foundation and first option without assuming mastery. Add a distinct reaction and a second option only where ready, then practice choosing between familiar responses in short situations.'
    },
    {
      id: 'extension', title: 'Extension — deepen and apply',
      description: 'Use an additional session for individual corrections, suitable extra branches or application from less prescribed starts. Keep the shared core accessible to two-day groups; a third session does not require new material.'
    },
    {
      id: 'revisit', title: 'Revisit — strengthen what is familiar',
      description: 'Return to an earlier foundation or option, check what athletes remember and repair a specific difficulty. Change the task, partner response or starting position while retaining the skill. Repeat a focus across weeks when it is still useful.'
    }
  ],
  stages: [
    {
      id: 'foundation', title: 'Find the foundation',
      description: 'Establish the starting position or control, its purpose and the required movement. Coach the prerequisite and stop/reset behavior before introducing several options.'
    },
    {
      id: 'cooperative', title: 'Rehearse with a partner',
      description: 'Give the partner a specific cooperative response. Practice one chosen option, alternate roles and correct the start and finish. The partner helps learning without collapsing or resisting fully.'
    },
    {
      id: 'choice', title: 'Read and choose',
      description: 'Let the partner supply one of the responses already practiced. The wrestler recognizes it and chooses the fitting option. Keep resistance manageable while the decision becomes familiar.'
    },
    {
      id: 'resistance', title: 'Use controlled resistance',
      description: 'Set a limited starting position, objective for each partner, permitted actions and reset condition. Add resistance gradually, using short attempts with rest and feedback. Reduce the challenge when control or the foundation is lost.'
    },
    {
      id: 'apply', title: 'Apply in wrestling',
      description: 'Enter the familiar series from a broader situation and allow appropriate responses. Use positional or open wrestling according to readiness and the coaching goal, then return to the specific problem that needs practice.'
    }
  ],
  evidence: [
    { title: 'Club schedule', note: 'User-supplied Grindstone Wrestling 2026–2027 Season handout: program days, times, venues and entrances.' },
    { title: 'Coaches’ meeting', note: '20:20–21:07 shared weekly focus; 23:56–25:06 structure and stations; 25:13–27:56 situational practice; 30:03–31:59 staples; 33:18–34:21 proposed practice sections; 39:57–41:42 wrestling games. Exact allocations here are editable coaching proposals.' },
    { title: 'USA Wrestling — practice planning', url: 'https://www.themat.com/sitecore/content/home/usa-wrestling/semifinals-set-in-junior-greco-roman-nationals/2016/november/09/keys-for-developing-a-better-wrestling-practice-plan', note: 'Supports consistent preparation, fundamentals, age-appropriate tasks, activity, flexibility and practice records.' },
    { title: 'United World Wrestling — Practice Plan Essentials', url: 'https://academy.uww.org/videos/webinars/auto-draft-2/', note: 'Public chapter guide distinguishes drill purposes, technique instruction, situational wrestling, circuits and games.' },
    { title: 'Attack Style Wrestling — Skill Development Workbook', url: 'https://www.attackstylewrestling.tv/wp-content/uploads/2021/08/skill_development_workbook.pdf', note: 'Examples of partner duties, reaction-based options and drills. Advanced or intense material requires selection and adaptation; it is not a prescription for every group.' }
  ]
};
