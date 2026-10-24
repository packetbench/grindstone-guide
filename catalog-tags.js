/* Shared browsing metadata for the tagging draft.
   Load after series-expansion.js. Source records, instruction and saved IDs stay unchanged.
   Positions describe the starting work; purposes include preparation toward a goal, not a
   claim that every guide completes that outcome. Uses are planning suggestions, not readiness.
   Age suggestions copy explicit groups first, then the existing written-library tier policy
   and exact game audience labels. Video adaptation paragraphs never imply age clearance. */
(() => {
  'use strict';
  const d = window.GRINDSTONE || {}, k = window.GRINDSTONE_KYLE || {};
  const ki = window.GRINDSTONE_KYLE_INSTRUCTION?.entries || k.instruction || {};
  const v = window.GRINDSTONE_VIDEO_ADDITIONS || {}, p = window.GRINDSTONE_PATHWAY || {};
  const shared = window.GRINDSTONE_TAGS || { categories: [], entries: {} };
  const definitions = {
    positions: [['neutral','Neutral'],['top','Top'],['bottom','Bottom'],['movement','General movement']],
    purposes: [['movement','Movement & balance'],['entry','Enter an attack'],['takedown','Finish a takedown'],['defend','Defend & recover'],['escape','Work toward an escape'],['reverse','Reverse position'],['breakdown','Break down a base'],['ride','Maintain top control'],['turn','Turn for back exposure'],['pin','Finish & hold a pin'],['mat-return','Return to the mat'],['strength','Build strength & control'],['endurance','Build endurance']],
    uses: [['warmup','Warm-up'],['review','Review familiar skills'],['teach','Teach a skill'],['reps','Partner / solo repetitions'],['reaction','Read & react'],['situational','Situational wrestling'],['strength','Strength'],['endurance','Endurance'],['game','Game']]
  };
  Object.keys(definitions).forEach(key => { definitions[key] = Object.freeze(definitions[key].map(([id,label]) => Object.freeze({id,label}))); });
  Object.freeze(definitions);
  const allowed = Object.fromEntries(Object.entries(definitions).map(([key,items]) => [key,new Set(items.map(item => item.id))]));
  const ages = ['4-6','7-10','11-14'];
  const strings = value => Array.isArray(value) ? value.filter(item => typeof item === 'string') : typeof value === 'string' && value ? [value] : [];
  const unique = values => [...new Set(values.filter(Boolean))];
  const norm = value => String(value || '').replace(/[\u2010-\u2015]/g,'-').trim();
  const tierAges = { Pup: ages, Beginner: ages.slice(1), Advanced: ages.slice(2) };
  // These exact audience labels already govern the original game collection's suggestions.
  const gameAges = { 'Pup / all ages': ages, 'Ready beginners 7-14': ages.slice(1), 'Ready older athletes; skills verified': ages.slice(2) };
  const coreByMove = {B17:'stand-up',B21:'stand-up',B07:'double-leg',N24:'single-leg',B08:'single-leg',B22:'breakdown',B26:'half-nelson',B28:'half-nelson',N25:'mat-return'};
  const coreOrder = ['stand-up','double-leg','single-leg','breakdown','half-nelson','mat-return'];
  const positionOverrides = {}, purposeOverrides = {}, extraUses = {};
  function assign(target, ids, values) { ids.split(' ').filter(Boolean).forEach(id => { target[id] = values.split(' ').filter(Boolean); }); }
  // Manual distinctions follow the existing purpose/steps, not a new technique or video review.
  assign(positionOverrides,'P01 P02 P03 P04 P07 P11 B01 B02 B03','neutral');
  assign(positionOverrides,'P05 P06 P08 P09 P10 B14 B16 B17 B18 B19 B20 B21 B27 B30 A14 A15 A16 A18 A28 K16 K17 K18 K19 N11 V13','bottom');
  assign(positionOverrides,'B15 B22 B23 B24 B25 B26 B28 B29 A17 A19 A20 A21 A22 A23 A24 A25 A27 A30 K20 K21 K22 N21 N25','top');
  assign(positionOverrides,'A26','top bottom');
  assign(positionOverrides,'A29','neutral top');
  assign(positionOverrides,'P12 V01 V02 V04 V07 V08 V09 V10 V11 V12 V14 V16','movement');
  assign(positionOverrides,'K01 K02 K03 K04 K05 K06 K07 K08 K09 K10 K11 K12 K13 K14 K15 V05 V06 V17 V18','neutral');
  // V15's written record does not establish a complete starting position.
  positionOverrides.V15 = [];
  assign(purposeOverrides,'P01 P02 P03 P05 P06 P12 B01 B02 B14 B15 B16 K02 K16 K19 V01 V02 V04 V07 V08 V10 V11 V12 V14 V16','movement');
  assign(purposeOverrides,'P04 P11 B03 B04 B05 B06 A01 A03 A13 N01 N02 N24 K07 K08 K09 K12 K13 V05 V17','entry');
  assign(purposeOverrides,'P07 B12 B13 B27 B30 A09 A11 A13 A28 K01 K05 K06 K15 K17 V13 V15','defend');
  assign(purposeOverrides,'P08 P09 P10 B17 B18 B19 B21 A14 A15 A18 N11','escape');
  assign(purposeOverrides,'B20 A16 K18','reverse');
  assign(purposeOverrides,'B07 B08 B09 B10 A02 A04 A05 A06 A07 A10 A12 K04 K10 K11 K14 N03 N04 N05 V06','takedown');
  assign(purposeOverrides,'B11','defend takedown');
  assign(purposeOverrides,'A08','defend entry');
  assign(purposeOverrides,'A17','defend ride');
  assign(purposeOverrides,'B22 B23 B24 A20 K22','breakdown');
  assign(purposeOverrides,'B25 A19 K21','ride');
  assign(purposeOverrides,'B26 A21 A22 A23 A24 A30 N21','turn');
  assign(purposeOverrides,'B28 A27','pin');
  assign(purposeOverrides,'B29 A25','turn pin');
  assign(purposeOverrides,'A26','turn defend');
  assign(purposeOverrides,'A29','takedown breakdown');
  assign(purposeOverrides,'K03','entry takedown');
  assign(purposeOverrides,'K09','entry takedown');
  assign(purposeOverrides,'K19','movement escape');
  assign(purposeOverrides,'K20','ride turn');
  assign(purposeOverrides,'N25','mat-return');
  assign(purposeOverrides,'V09','strength');
  assign(purposeOverrides,'V18','entry');
  assign(extraUses,'P01 P02 P03 B01 B02 K02 V01 V02 V04 V05','warmup');
  assign(extraUses,'A08 A17 A26 A30 K01 K03 V04 V18','reaction');
  assign(extraUses,'B25 A14 A19 A27','situational');
  assign(extraUses,'V09','strength');
  assign(extraUses,'G07 G11 G12 G13 G21 G23 G25 G27 G28 G31 G33','reaction');
  assign(positionOverrides,'G01 G02 G03 G04 G05 G06 G07 G08 G09 G10 G32 G34 G36 G37','movement');
  assign(positionOverrides,'G11 G12 G13 G14 G18 G26 G31 G33','neutral');
  assign(positionOverrides,'G15 G17 G21 G22 G23 G28','bottom');
  assign(positionOverrides,'G19','top bottom');
  assign(positionOverrides,'G16 G30 G35','movement');
  assign(positionOverrides,'G20','neutral top bottom');
  assign(positionOverrides,'G24 G25 G27 G29','neutral bottom');
  assign(purposeOverrides,'G01 G02 G03 G04 G05 G06 G07 G08 G09 G10 G11 G12 G13 G15 G16 G20 G26 G30 G31 G32 G33 G34 G35 G36 G37 V03','movement');
  assign(purposeOverrides,'G14','defend');
  assign(purposeOverrides,'G17 G21 G22 G23 G28','escape');
  assign(purposeOverrides,'G18','entry');
  assign(purposeOverrides,'G19','breakdown');
  // The written game cards name their specific choices; these tags do not add new missions.
  assign(purposeOverrides,'G24','entry escape movement');
  assign(purposeOverrides,'G25','movement escape');
  assign(purposeOverrides,'G27','movement');
  assign(purposeOverrides,'G29','defend movement escape');
  assign(positionOverrides,'S01 S03 S04 S05 S06 S07 S11 S14 S17 S18 S19 S20','neutral');
  assign(positionOverrides,'S02 S08 S10 S13 S23','bottom');
  assign(positionOverrides,'S09 S12 S16 S21','top');
  assign(positionOverrides,'S24','neutral top bottom');
  assign(purposeOverrides,'S01 S05','entry');
  assign(purposeOverrides,'S02 S08 S10','escape');
  assign(purposeOverrides,'S03','defend');
  assign(purposeOverrides,'S07','defend takedown');
  assign(purposeOverrides,'S04 S06 S11 S14 S20','takedown');
  assign(purposeOverrides,'S09','breakdown turn pin');
  assign(purposeOverrides,'S12 S16','ride turn');
  assign(purposeOverrides,'S13 S23','escape reverse');
  assign(purposeOverrides,'S17 S18 S19','entry takedown');
  assign(purposeOverrides,'S21','turn pin');
  assign(purposeOverrides,'S24','escape takedown breakdown turn pin mat-return');
  assign(extraUses,'S07 S10 S11 S12','reaction');
  assign(positionOverrides,'C03 C12 C13','neutral');
  assign(positionOverrides,'C14 C17','neutral top bottom');
  assign(purposeOverrides,'C03','movement');
  assign(purposeOverrides,'C13','entry');
  assign(extraUses,'C03','reaction');
  assign(extraUses,'C13','reps');
  assign(extraUses,'C14','situational');
  assign(extraUses,'C17','review');
  const aliases = {N24:['single leg','single-leg entry','head inside'],B08:['single leg finish','run the pipe'],B17:['stand up','stand-up'],B26:['half','half-nelson'],B28:['half finish'],N25:['hip dump','mat return','standing return'],G31:['ankle tag','toe tag','touch only']};
  function ageGuidance(source, guide, kind, tier) {
    const explicit = unique([...strings(source.age_groups),...strings(guide.age_groups)].map(norm)).filter(value => ages.includes(value));
    const original = unique([source.ages,source.ageNote,source.age_note,guide.ageNote].filter(value => typeof value === 'string' && value));
    const adaptations = guide.age_adaptations || source.age_adaptations;
    if (Array.isArray(adaptations)) adaptations.forEach(item => { if (item.group && item.text) original.push(item.group + ': ' + item.text); });
    else if (adaptations && typeof adaptations === 'object') Object.entries(adaptations).forEach(([group,note]) => { if (typeof note === 'string') original.push(group + ': ' + note); });
    let selected = explicit, basis = explicit.length ? 'explicit' : 'unassigned', lead = '';
    if (!selected.length && kind === 'written' && tierAges[tier]) { selected = tierAges[tier]; basis = 'teaching-tier'; lead = 'Teaching-tier suggestion; adjust for readiness. Existing ' + tier + ' tier suggests ' + selected.join(', ') + '.'; }
    if (!selected.length && kind === 'game' && gameAges[source.ages]) { selected = gameAges[source.ages]; basis = 'source-description'; lead = 'Audience-label suggestion; adjust for readiness. Existing game audience: ' + source.ages + '.'; }
    if (basis === 'explicit') lead = 'Source teaching-group suggestions: ' + selected.join(', ') + '. Readiness and prerequisites still apply.';
    if (basis === 'unassigned') lead = 'No shared age assignment. Read the existing guidance and prerequisites before choosing this guide.';
    return {age_groups:[...selected],ageStatus:selected.length ? 'assigned' : 'unassigned',ageBasis:basis,ageNote:unique([lead,...original]).join('\n')};
  }
  function categoryFor(source, kind) {
    if (kind === 'game' || source.kind === 'game') return 'games';
    const direct = shared.entries[source.id] || source.category;
    if (shared.categories.some(item => item.id === direct)) return direct;
    if (kind === 'activity') return ['strength','endurance'].includes(source.type) ? 'conditioning' : 'movement';
    if (kind === 'sequence') return 'movement';
    if (kind === 'series') return source.kind === 'foundation' ? '' : ({top:'top',bottom:'bottom',neutral:'attacks'}[source.position || positionOverrides[source.id]?.[0]] || 'reaction');
    return '';
  }
  const categoryPositions = {movement:['movement'],entries:['neutral'],setups:['neutral'],attacks:['neutral'],counters:['neutral'],bottom:['bottom'],top:['top'],conditioning:['movement'],mobility:['movement'],games:['movement']};
  const categoryPurposes = {movement:['movement'],entries:['entry'],setups:['entry'],attacks:['takedown'],counters:['defend'],bottom:['escape'],top:['ride'],mobility:['movement'],conditioning:['movement'],games:['movement']};
  function membershipsFor(id) {
    return (p.series || []).flatMap(series => (series.members || []).filter(member => member.move_id === id).map(member => ({id:series.id,title:series.title,role:member.role || '',note:member.note || ''})));
  }
  function gatherText(value) {
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value.flatMap(gatherText);
    return [];
  }
  const records = new Map();
  function add(source, kind, canonical, guide = {}) {
    const id = source.id, category = categoryFor(source,kind), tier = guide.tier || source.tier || '';
    const categoryLabel = shared.categories.find(item => item.id === category)?.label || (source.kind === 'foundation' ? 'Core skills' : source.category || '');
    const positions = positionOverrides[id] || categoryPositions[category] || [];
    let purposes = purposeOverrides[id] || categoryPurposes[category] || [];
    if (kind === 'activity' && !purposeOverrides[id]) purposes = ['strength','endurance'].includes(source.type) ? [source.type] : ['movement'];
    let uses = [];
    if (kind === 'game' || source.kind === 'game') uses = ['game'];
    else if (kind === 'written' || kind === 'kyle' || (kind === 'facebook' && strings(source.steps).length)) uses = ['review','teach','reps'];
    else if (kind === 'series') uses = source.kind === 'foundation' ? ['review','teach','reps'] : ['review','teach','reps','reaction','situational'];
    else if (kind === 'sequence') uses = ['review','reps'];
    else if (kind === 'activity') uses = {warmup:['warmup'],drill:['reps'],strength:['strength'],endurance:['endurance']}[source.type] || [];
    uses = unique([...uses,...(extraUses[id] || [])]);
    const memberships = membershipsFor(id);
    const isCore = memberships.some(item => item.id === 'S24' && /^Essential(?:\s|\u00b7|$)/i.test(item.role));
    const coreSkills = source.kind === 'foundation' ? coreOrder : isCore && coreByMove[id] ? [coreByMove[id]] : [];
    const itemAliases = unique([...strings(source.aliases),...strings(source.keywords),...strings(guide.aliases),...(aliases[id] || [])]);
    const guidance = ageGuidance(source,guide,kind,tier);
    const result = {category,categoryLabel,positions:[...positions],purposes:[...purposes],uses,...guidance,tier,aliases:itemAliases,memberships,coreSkills:[...coreSkills],searchText:''};
    for (const key of ['positions','purposes','uses']) result[key] = unique(result[key]).filter(value => allowed[key].has(value));
    const labels = ['positions','purposes','uses'].flatMap(key => definitions[key].filter(item => result[key].includes(item.id)).map(item => item.label));
    const searchable = [canonical,id,source.name,source.title,source.purpose,guide.purpose,source.summary,source.description,source.observed,source.category,categoryLabel,tier,...itemAliases,...gatherText(source.cues),...gatherText(guide.cues),...labels,...memberships.flatMap(item => [item.title,item.role,item.note]),...coreSkills].filter(Boolean).join(' ').toLowerCase();
    result.searchText = searchable + ' ' + searchable.replace(/[\u2010-\u2015_-]/g,' ');
    records.set(canonical,result);
  }
  (d.moves || []).forEach(source => add(source,'written',source.id));
  (d.games || []).forEach(source => add(source,'game',source.id));
  (k.entries || []).forEach(source => add(source,'kyle','kyle:' + source.id,ki[source.id] || {}));
  (v.entries || []).forEach(source => add(source,'facebook','facebook:' + source.id));
  (p.series || []).forEach(source => add(source,'series','series:' + source.id));
  (p.sequences || []).forEach(source => add(source,'sequence','series:' + source.id));
  (p.activities || []).forEach(source => add(source,'activity','activity:' + source.id));
  function canonicalId(id) {
    if (typeof id !== 'string') return '';
    if (/^K\d+$/.test(id)) return 'kyle:' + id;
    if (/^V\d+$/.test(id)) return 'facebook:' + id;
    return id;
  }
  window.GRINDSTONE_CATALOG_TAGS = Object.freeze({
    definitions,
    resolve(id) { const record = records.get(canonicalId(id)); return record ? JSON.parse(JSON.stringify(record)) : null; },
    allIds() { return [...records.keys()]; }
  });
})();
