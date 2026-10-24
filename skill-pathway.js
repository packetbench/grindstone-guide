/* A readiness-led season pathway, independent of fixed practice plans. */
(() => {
  "use strict";
  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const list = values => "<ul>" + (values || []).map(value => "<li>" + esc(value) + "</li>").join("") + "</ul>";
  const para = value => value ? "<p>" + esc(value) + "</p>" : "";
  const route = (age, phase) => "#season?" + new URLSearchParams({age, ...(phase ? {phase} : {})});
  const choose = (age, type, id) => "#practices?" + new URLSearchParams({age, [type]:id});
  function moveCatalog() {
    const catalog = new Map((window.GRINDSTONE?.moves || []).map(move => [move.id, {name: move.name, path: '#move/' + move.id}]));
    (window.GRINDSTONE_KYLE?.entries || []).forEach(move => catalog.set(move.id, {name: move.name, path: '#moves/kyle/' + move.id}));
    return catalog;
  }
  function moves(ids) {
    const catalog = moveCatalog();
    return '<div class="pathway-links">' + (ids || []).filter(id => catalog.has(id)).map(id => '<a href="' + esc(catalog.get(id).path) + '">' + esc(id + " · " + catalog.get(id).name) + '</a>').join("") + '</div>';
  }
  function seriesMembers(series) {
    const catalog = moveCatalog();
    const members = (series.members || []).filter(member => catalog.has(member.move_id));
    if (!members.length) return moves(series.move_ids);
    const labels = {foundation:"Foundation", prerequisite:"Before this series", entry:"Entries", option:"Options", finish:"Finishes", recovery:"Recoveries", drill:"Practice drills", defense:"Partner's defense", reference:"Related guides"};
    const roles = [...Object.keys(labels).filter(role => members.some(member => member.role === role)), ...new Set(members.map(member => member.role).filter(role => !labels[role]))];
    return '<div class="pathway-members"><h4>Guides in this series</h4>' + roles.map(role => '<section class="pathway-member-group"><h5>' + esc(labels[role] || role || "Related guides") + '</h5><ul>' + members.filter(member => member.role === role).map(member => '<li><a href="' + esc(catalog.get(member.move_id).path) + '">' + esc(member.move_id + ' · ' + catalog.get(member.move_id).name) + '</a>' + (member.note ? '<p>' + esc(member.note) + '</p>' : '') + '</li>').join("") + '</ul></section>').join("") + '</div>';
  }
  function trainingTrack(title, data) {
    return '<section class="pathway-track"><h3>' + title + '</h3>' + para(data.goal) + list(data.activities) + '<h4>Start here</h4>' + para(data.dose) + '<h4>Build from there</h4>' + para(data.progress) + '</section>';
  }
  function seriesCard(series, age) {
    const branches = (series.branches || []).map(branch => '<section class="pathway-branch"><h4>' + esc(branch.title) + '</h4><p><strong>When:</strong> ' + esc(branch.when) + '</p><p><strong>Option:</strong> ' + esc(branch.action) + '</p>' + (branch.readiness ? '<p><strong>Before adding this option:</strong> ' + esc(branch.readiness) + '</p>' : '') + moves(branch.move_ids) + '</section>').join("");
    const references = (series.sources || []).filter(source => /^https:\/\//.test(source.url));
    return '<article class="pathway-series-card" id="series-' + esc(series.id) + '"><p class="eyebrow">' + esc(series.id) + ' · TECHNIQUE SERIES</p><h3>' + esc(series.title) + '</h3>' + para(series.summary) + '<div class="pathway-foundation"><h4>Common foundation</h4>' + para(series.foundation) + '</div><p><strong>Ready when:</strong> ' + esc(series.readiness) + '</p><div class="pathway-branches">' + branches + '</div><details><summary>Teaching guides, setup & practice cues</summary><div class="detail-body">' + seriesMembers(series) + para(series.setup) + '<ol>' + (series.steps || []).map(step => '<li>' + esc(step) + '</li>').join("") + '</ol><h4>Say this</h4>' + list(series.cues) + '<p><strong>Coach watch:</strong> ' + esc(series.boundaries) + '</p>' + (references.length ? '<h4>Instructor references</h4><ul>' + references.map(source => '<li><a href="' + esc(source.url) + '" target="_blank" rel="noopener noreferrer">' + esc(source.title) + ' ↗</a>' + (source.note ? para(source.note) : '') + '</li>').join("") + '</ul>' : '') + '</div></details><a class="button outline" href="' + esc(choose(age, "series", series.id)) + '">Choose this series in the builder →</a></article>';
  }
  function sequenceCard(sequence, age) {
    return '<article class="pathway-series-card" id="sequence-' + esc(sequence.id) + '"><p class="eyebrow">' + esc(sequence.id) + ' · LINKED MOVEMENT DRILL</p><h3>' + esc(sequence.title) + '</h3>' + para(sequence.summary) + '<p><strong>Ready when:</strong> ' + esc(sequence.readiness) + '</p><details><summary>Setup, sequence & coaching cues</summary><div class="detail-body">' + para(sequence.setup) + '<ol>' + sequence.steps.map(step => '<li>' + esc(step) + '</li>').join("") + '</ol><h4>Say this</h4>' + list(sequence.cues) + '<p><strong>Coach watch:</strong> ' + esc(sequence.boundaries) + '</p>' + moves(sequence.move_ids) + '</div></details><a class="button outline" href="' + esc(choose(age, "sequence", sequence.id)) + '">Choose this drill in the builder →</a></article>';
  }
  function activities(data, age) {
    const items = data.activities.filter(item => item.age_groups.includes(age));
    return '<section class="pathway-series"><h2>Movement, strength & endurance blocks</h2><p>Choose a block for your practice, then adjust its time and coaching notes. Use the current phase’s starting dose and progress only while movement stays controlled.</p><details><summary>Browse ' + items.length + ' activity blocks for ages ' + esc(age) + '</summary><div class="detail-body">' + items.map(item => '<article class="pathway-series-card"><p class="eyebrow">' + esc(item.type) + '</p><h3>' + esc(item.title) + '</h3>' + para(item.instructions) + '<p><strong>Cues:</strong> ' + esc(item.cues.join(" · ")) + '</p>' + para(item.boundary) + '<a class="button outline" href="' + esc(choose(age, "activity", item.id)) + '">Choose this activity →</a></article>').join("") + '</div></details></section>';
  }
  function guidance(data) {
    const labels = {repeat:"When to repeat",advance:"When to move on",catch_up:"After missed practices",late_joiner:"Joining during the season"};
    return '<section class="panel"><h2>Keep the season flexible</h2><div class="grid two">' + Object.entries(labels).map(([key, title]) => '<div><h3>' + title + '</h3>' + para(data.guidance[key]) + '</div>').join("") + '</div></section>';
  }
  function sources(data) {
    return '<details class="pathway-sources"><summary>How this pathway was developed</summary><p>Grindstone’s coaching progression draws on the youth development and training principles below. The phase sequence and practice doses are practical starting examples, adapted by the coach for readiness, experience and the day’s group.</p><ul>' + data.sources.filter(source => /^https:\/\//.test(source.url)).map(source => '<li><a href="' + esc(source.url) + '" target="_blank" rel="noopener noreferrer">' + esc(source.title) + ' ↗</a></li>').join("") + '</ul><p>Reviewed ' + esc(data.reviewed) + '.</p></details>';
  }
  function practiceCycle(phase, age) {
    const cycle = phase.practice_cycle;
    if (!cycle) return "";
    const sessions = window.GRINDSTONE_FRAMEWORKS?.sessions || [];
    const cards = [["core_a", "core-a", "Core A"], ["core_b", "core-b", "Core B"], ["extension", "extension", "Extension"]].filter(([key]) => cycle[key]).map(([key, id, label]) => {
      const item = cycle[key], session = sessions.find(value => value.id === id);
      const focus = Array.isArray(item.focus) ? list(item.focus) : para(item.focus);
      const href = '#practices?' + new URLSearchParams({age, phase:phase.id, session:id});
      return '<article class="pathway-track"><p class="eyebrow">' + label + '</p><h3>' + esc(item.title) + '</h3>' + focus + (session?.description ? '<p class="fine">' + esc(session.description) + '</p>' : '') + '<a class="button outline" href="' + esc(href) + '">Build ' + label + ' →</a></article>';
    }).join("");
    return '<section class="pathway-cycle"><h2>Practice rhythm for this phase</h2>' + para(cycle.label) + '<p>Keep the same foundation in view across practices. Repeat a session or revisit a skill when the group needs it; these are teaching choices, not calendar deadlines.</p><div class="pathway-grid">' + cards + '</div></section>';
  }
  function clockTime(minutes) {
    const hour = Math.floor(minutes / 60) % 24, minute = Math.round(minutes % 60);
    return (hour % 12 || 12) + ':' + String(minute).padStart(2, '0') + (hour < 12 ? ' am' : ' pm');
  }
  function programTime(program) {
    const match = /^(\d{1,2}):(\d{2})$/.exec(String(program.start || ''));
    if (!match) return String(program.start || '');
    const start = Number(match[1]) * 60 + Number(match[2]);
    return clockTime(start) + (Number(program.minutes) > 0 ? '–' + clockTime(start + Number(program.minutes)) : '');
  }
  function practiceFrameworks(compact = false) {
    const data = window.GRINDSTONE_FRAMEWORKS;
    if (!data) return "";
    const programs = (data.programs || []).map(program => {
      const days = Array.isArray(program.days) ? program.days.join(' / ') : program.days;
      const framework = (data.frameworks || []).find(item => item.id === program.defaultFramework);
      const href = '#practices?' + new URLSearchParams({program:program.id});
      return '<article class="card pathway-program"><h3>' + esc(program.name) + '</h3><p><strong>' + esc(days) + '</strong><br>' + esc(programTime(program)) + (program.minutes ? ' · ' + esc(program.minutes) + ' min' : '') + '</p>' + para(program.location) + (program.entrance ? '<p class="fine"><strong>Enter:</strong> ' + esc(program.entrance) + '</p>' : '') + (framework ? '<p class="fine">Practice format: ' + esc(framework.title) + '</p>' : '') + '<a class="button outline" href="' + esc(href) + '">Build for ' + esc(program.name) + ' →</a></article>';
    }).join("");
    const frameworks = (data.frameworks || []).map(framework => {
      let elapsed = 0;
      const blocks = (framework.blocks || []).map(block => {
        const start = elapsed;
        elapsed += Number(block.minutes) || 0;
        const cues = Array.isArray(block.cues) ? block.cues.join(' · ') : block.cues;
        return '<li><p class="pathway-timeline-time">' + esc(start) + '–' + esc(elapsed) + ' min <span>· ' + esc(block.minutes) + ' min</span></p><div><h4>' + esc(block.name) + '</h4>' + para(block.instructions) + (cues ? '<p class="fine"><strong>Coach cue:</strong> ' + esc(cues) + '</p>' : '') + '</div></li>';
      }).join("");
      return '<details class="pathway-series-card"><summary>' + esc(framework.minutes) + ' minutes · ' + esc(framework.title) + '</summary><div class="detail-body">' + para(framework.summary) + '<ol class="pathway-timeline">' + blocks + '</ol><p class="fine">Total: ' + esc(elapsed) + ' minutes. Choose the moves, drills and games that fit your current teaching focus.</p></div></details>';
    }).join("");
    const stages = (data.stages || []).length ? '<details class="pathway-stages"><summary>How to build a skill within these blocks</summary><ol>' + data.stages.map(stage => '<li><strong>' + esc(stage.title) + '</strong>' + para(stage.description) + '</li>').join("") + '</ol></details>' : '';
    const content = '<p>Use the club practice window to set the time, then choose the teaching focus and activities. Check TeamSnap for the current schedule and changes.</p><div class="pathway-programs grid">' + programs + '</div><div class="pathway-frameworks"><h3>Practice time breakdowns</h3><p>These outlines give each part of practice a purpose. Fill the slots with your own selections.</p>' + frameworks + stages + '</div>';
    return compact ? '<details class="panel pathway-windows"><summary>Club practice windows & time breakdowns</summary><div class="detail-body">' + content + '</div></details>' : '<section class="pathway-series pathway-windows"><h2>Plan around your practice window</h2>' + content + '</section>';
  }
  function render(params = new URLSearchParams()) {
    const data = window.GRINDSTONE_PATHWAY;
    if (!data?.groups?.length) return '<h1>Season pathway</h1><p>The pathway could not load. Refresh to try again.</p>';
    const group = data.groups.find(item => item.age_group === params.get("age"));
    const age = group?.age_group;
    let html = '<div class="pathway-page"><nav class="practice-tabs" aria-label="Practice planning"><a href="#practices' + (age ? '?age=' + age : '') + '">Build a practice</a><a href="#season' + (age ? '?age=' + age : '') + '" aria-current="page">Season pathway</a></nav><div class="page-title"><p class="eyebrow">BUILD THROUGH THE SEASON</p><h1>Season pathway.</h1>' + para(data.intro) + '</div><div class="pathway-controls"><p class="meta-title">Choose your teaching group</p><nav class="pathway-age-tabs" aria-label="Season age group">' + data.groups.map(item => '<a href="' + route(item.age_group) + '"' + (item === group ? ' aria-current="page"' : '') + '>Ages ' + esc(item.age_group) + '</a>').join("") + '</nav></div>';
    if (!group) {
      html += '<div class="grid">' + data.groups.map(item => '<article class="card"><p class="eyebrow">AGES ' + esc(item.age_group) + '</p><h2>' + esc(item.phases[0].title) + '</h2>' + para(item.summary) + '<p>' + esc(item.phases.length) + ' phases · skills & series · strength · endurance</p><a class="card-link" href="' + route(item.age_group) + '">Explore this pathway →</a></article>').join("") + '</div>' + practiceFrameworks();
    } else {
      const phase = group.phases.find(item => item.id === params.get("phase")) || group.phases[0];
      const phaseIndex = group.phases.indexOf(phase);
      const selectedSeries = (phase.series_ids || []).map(id => data.series.find(item => item.id === id)).filter(Boolean);
      const selectedSequences = (phase.sequence_ids || []).map(id => (data.sequences || []).find(item => item.id === id)).filter(Boolean);
      html += para(group.summary) + (group.schedule_note ? '<p class="builder-notice">' + esc(group.schedule_note) + '</p>' : '') + '<nav class="pathway-phase-tabs" aria-label="Learning phase">' + group.phases.map((item, index) => '<a href="' + esc(route(age, item.id)) + '"' + (item === phase ? ' aria-current="page"' : '') + '><span>Phase ' + (index + 1) + '</span>' + esc(item.title) + '</a>').join("") + '</nav><section class="pathway-overview"><p class="eyebrow">AGES ' + esc(age) + ' · PHASE ' + (phaseIndex + 1) + '</p><h2>' + esc(phase.title) + '</h2>' + para(phase.overview) + '<p>Spend as many practices here as the group needs. Revisit earlier skills throughout the season.</p></section>' + practiceCycle(phase, age) + '<div class="pathway-grid"><section class="pathway-track"><h3>Skills & connected techniques</h3>' + list(phase.skills) + '<h4>Teaching guides</h4>' + moves(phase.move_ids) + '</section>' + trainingTrack("Strength & control", phase.strength) + trainingTrack("Endurance & recovery", phase.endurance) + '</div><section class="pathway-readiness"><h3>Ready for the next phase?</h3>' + list(phase.ready) + '<p><strong>If the group needs a step back:</strong> ' + esc(phase.regress) + '</p></section>';
      if (selectedSeries.length) html += '<section class="pathway-series"><h2>Technique series: one foundation, several options</h2><p>Start from the same position or control. Teach one option, then add another for a different reaction. Reset to the foundation between attempts and let the wrestler learn to recognize the opening.</p>' + selectedSeries.map(item => seriesCard(item, age)).join("") + '</section>';
      if (selectedSequences.length) html += '<section class="pathway-series"><h2>Linked movement drills</h2><p>Practice these actions in order to build movement and transitions. Use them alongside the technique options you are teaching.</p>' + selectedSequences.map(item => sequenceCard(item, age)).join("") + '</section>';
      html += '<div class="buttons"><a class="button" href="#practices?age=' + age + '">Build a practice for this group →</a>' + (phaseIndex < group.phases.length - 1 ? '<a class="button outline" href="' + esc(route(age, group.phases[phaseIndex + 1].id)) + '">See the next phase →</a>' : '<a class="button outline" href="' + route(age) + '">Revisit the foundations →</a>') + '</div>' + practiceFrameworks(true) + activities(data, age);
    }
    return html + '<details class="panel pathway-howto"><summary>How to use the pathway</summary>' + list(data.coaching_principles) + '</details>' + guidance(data) + sources(data) + '</div>';
  }
  window.GRINDSTONE_SKILL_PATHWAY = {render};
})();
