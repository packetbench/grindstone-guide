/* A readiness-led season pathway, independent of fixed practice plans. */
(() => {
  "use strict";
  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const list = values => "<ul>" + (values || []).map(value => "<li>" + esc(value) + "</li>").join("") + "</ul>";
  const para = value => value ? "<p>" + esc(value) + "</p>" : "";
  const route = (age, phase) => "#season?" + new URLSearchParams({age, ...(phase ? {phase} : {})});
  const choose = (age, type, id) => "#practices?" + new URLSearchParams({age, [type]:id});
  function moves(ids) {
    const catalog = new Map((window.GRINDSTONE?.moves || []).map(move => [move.id, move]));
    return '<div class="pathway-links">' + (ids || []).filter(id => catalog.has(id)).map(id => '<a href="#move/' + esc(id) + '">' + esc(id + " · " + catalog.get(id).name) + '</a>').join("") + '</div>';
  }
  function trainingTrack(title, data) {
    return '<section class="pathway-track"><h3>' + title + '</h3>' + para(data.goal) + list(data.activities) + '<h4>Start here</h4>' + para(data.dose) + '<h4>Build from there</h4>' + para(data.progress) + '</section>';
  }
  function seriesCard(series, age) {
    return '<article class="pathway-series-card" id="series-' + esc(series.id) + '"><p class="eyebrow">' + esc(series.id) + ' · CONNECTED SKILLS</p><h3>' + esc(series.title) + '</h3>' + para(series.summary) + '<p><strong>Ready when:</strong> ' + esc(series.readiness) + '</p><details><summary>Setup, sequence & coaching cues</summary><div class="detail-body">' + para(series.setup) + '<ol>' + series.steps.map(step => '<li>' + esc(step) + '</li>').join("") + '</ol><h4>Say this</h4>' + list(series.cues) + '<p><strong>Coach watch:</strong> ' + esc(series.boundaries) + '</p>' + moves(series.move_ids) + '</div></details><a class="button outline" href="' + esc(choose(age, "series", series.id)) + '">Choose this series in the builder →</a></article>';
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
  function render(params = new URLSearchParams()) {
    const data = window.GRINDSTONE_PATHWAY;
    if (!data?.groups?.length) return '<h1>Season pathway</h1><p>The pathway could not load. Refresh to try again.</p>';
    const group = data.groups.find(item => item.age_group === params.get("age"));
    const age = group?.age_group;
    let html = '<div class="pathway-page"><nav class="practice-tabs" aria-label="Practice planning"><a href="#practices' + (age ? '?age=' + age : '') + '">Build a practice</a><a href="#season' + (age ? '?age=' + age : '') + '" aria-current="page">Season pathway</a></nav><div class="page-title"><p class="eyebrow">BUILD THROUGH THE SEASON</p><h1>Season pathway.</h1>' + para(data.intro) + '</div><div class="pathway-controls"><p class="meta-title">Choose your teaching group</p><nav class="pathway-age-tabs" aria-label="Season age group">' + data.groups.map(item => '<a href="' + route(item.age_group) + '"' + (item === group ? ' aria-current="page"' : '') + '>Ages ' + esc(item.age_group) + '</a>').join("") + '</nav></div>';
    if (!group) {
      html += '<div class="grid">' + data.groups.map(item => '<article class="card"><p class="eyebrow">AGES ' + esc(item.age_group) + '</p><h2>' + esc(item.phases[0].title) + '</h2>' + para(item.summary) + '<p>Six phases · skills & series · strength · endurance</p><a class="card-link" href="' + route(item.age_group) + '">Explore this pathway →</a></article>').join("") + '</div>';
    } else {
      const phase = group.phases.find(item => item.id === params.get("phase")) || group.phases[0];
      const phaseIndex = group.phases.indexOf(phase);
      const selectedSeries = (phase.series_ids || []).map(id => data.series.find(item => item.id === id)).filter(Boolean);
      html += para(group.summary) + '<nav class="pathway-phase-tabs" aria-label="Learning phase">' + group.phases.map((item, index) => '<a href="' + esc(route(age, item.id)) + '"' + (item === phase ? ' aria-current="page"' : '') + '><span>Phase ' + (index + 1) + '</span>' + esc(item.title) + '</a>').join("") + '</nav><section class="pathway-overview"><p class="eyebrow">AGES ' + esc(age) + ' · PHASE ' + (phaseIndex + 1) + '</p><h2>' + esc(phase.title) + '</h2>' + para(phase.overview) + '<p>Spend as many practices here as the group needs. Revisit earlier skills throughout the season.</p></section><div class="pathway-grid"><section class="pathway-track"><h3>Skills & connected techniques</h3>' + list(phase.skills) + '<h4>Teaching guides</h4>' + moves(phase.move_ids) + '</section>' + trainingTrack("Strength & control", phase.strength) + trainingTrack("Endurance & recovery", phase.endurance) + '</div><section class="pathway-readiness"><h3>Ready for the next phase?</h3>' + list(phase.ready) + '<p><strong>If the group needs a step back:</strong> ' + esc(phase.regress) + '</p></section>';
      if (selectedSeries.length) html += '<section class="pathway-series"><h2>Connect the skills into a series</h2><p>Teach each component first, then connect the actions. Open a series for the sequence and readiness cues.</p>' + selectedSeries.map(item => seriesCard(item, age)).join("") + '</section>';
      html += '<div class="buttons"><a class="button" href="#practices?age=' + age + '">Build a practice for this group →</a>' + (phaseIndex < group.phases.length - 1 ? '<a class="button outline" href="' + esc(route(age, group.phases[phaseIndex + 1].id)) + '">See the next phase →</a>' : '<a class="button outline" href="' + route(age) + '">Revisit the foundations →</a>') + '</div>' + activities(data, age);
    }
    return html + '<details class="panel pathway-howto"><summary>How to use the pathway</summary>' + list(data.coaching_principles) + '</details>' + guidance(data) + sources(data) + '</div>';
  }
  window.GRINDSTONE_SKILL_PATHWAY = {render};
})();
