/* Group teaching history. Plans suggest coverage; only confirmed completed sessions count. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.GRINDSTONE_TRACKER_MODEL = api;
  if (typeof window !== 'undefined') window.GRINDSTONE_TRACKER_MODEL = api;
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : null, function () {
  'use strict';
  const groups = Object.freeze([
    {id:'pups',name:'Pups',age:'4-6',location:'Winters Mill High School',start:'18:00'},
    {id:'blue',name:'Mat Rats — Blue',age:'7-10',location:'Westminster High School',start:'18:00'},
    {id:'black',name:'Mat Rats — Black',age:'11-14',location:'Westminster High School',start:'18:00'},
    {id:'valkyries',name:'Valkyries',age:'',location:'Winters Mill High School',start:'18:30'}
  ].map(Object.freeze));
  const groupIds = new Set(groups.map(group => group.id));
  const forbidden = new Set(['__proto__','prototype','constructor']);
  const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
  const list = value => Array.isArray(value) ? value : [];
  const MAX_SKILLS = 500, MAX_SESSIONS = 5000;
  function object(value, label) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error(label + ' must be an object.');
    const proto = Object.getPrototypeOf(value);
    if (proto && !(Object.getPrototypeOf(proto) === null && own(proto,'constructor') && proto.constructor?.name === 'Object')) throw Error(label + ' must be a plain object.');
    if (Object.keys(value).some(key => forbidden.has(key))) throw Error(label + ' contains an unsupported field.');
    return value;
  }
  function text(value, label, limit, required = false) {
    if (value == null && !required) return '';
    if (typeof value !== 'string' || value.length > limit || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) throw Error(label + ' must be text of at most ' + limit + ' characters.');
    const result = value.trim();
    if (required && !result) throw Error('Enter ' + label.toLowerCase() + '.');
    return result;
  }
  function id(value, label) {
    const result = text(value,label,100,true);
    if (!/^[A-Za-z0-9][A-Za-z0-9_.:-]*$/.test(result) || forbidden.has(result)) throw Error(label + ' contains unsupported characters.');
    return result;
  }
  function date(value, label = 'Practice date', required = false) {
    const result = text(value,label,10,required);
    if (!result) return '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(result) || result < '1900-01-01' || result > '2200-12-31') throw Error('Use a valid ' + label.toLowerCase() + '.');
    const parsed = new Date(result + 'T12:00:00Z');
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0,10) !== result) throw Error('Use a valid ' + label.toLowerCase() + '.');
    return result;
  }
  function revision(value) {
    if (value == null) return 0;
    if (!Number.isSafeInteger(value) || value < 0) throw Error('Revision must be a nonnegative integer.');
    return value;
  }
  function group(value) {
    if (!groupIds.has(value)) throw Error('Choose Pups, Blue, Black or Valkyries.');
    return value;
  }
  // Paths are guide routes only. Imported network URLs never become navigation links.
  function path(value, strict = true) {
    if (value == null || value === '') return '';
    const valid = typeof value === 'string' && value.length <= 500 && /^#(?:move\/[A-Za-z0-9_-]+|moves\/(?:kyle|videos)\/[A-Za-z0-9_-]+|season(?:\?[A-Za-z0-9_.~%=&:+,\/-]+)?)$/.test(value);
    let decoded = '';
    try { decoded = valid ? decodeURIComponent(value) : ''; } catch (_) { /* Invalid escapes are rejected below. */ }
    if (!valid || !decoded || /[\u0000-\u0020<>"'\\]/.test(decoded)) {
      if (strict) throw Error('Use an internal move or season guide link.');
      return '';
    }
    return value;
  }
  function skill(raw) {
    object(raw,'Skill');
    return {id:id(raw.id,'Skill ID'),title:text(raw.title,'Skill title',240,true),path:path(raw.path),category:text(raw.category,'Skill category',160)};
  }
  function skills(raw) {
    if (raw == null) return [];
    if (!Array.isArray(raw) || raw.length > MAX_SKILLS) throw Error('Choose at most ' + MAX_SKILLS + ' skills.');
    const result = raw.map(skill);
    if (new Set(result.map(item => item.id)).size !== result.length) throw Error('Each skill must appear only once.');
    return result;
  }
  function snapshot(raw) {
    if (raw == null) return null;
    object(raw,'Practice snapshot');
    let nodes = 0, characters = 0;
    function copy(value, depth) {
      if (++nodes > 50000 || depth > 25) throw Error('Practice snapshot is too complex.');
      if (value === null || typeof value === 'boolean') return value;
      if (typeof value === 'number' && Number.isFinite(value)) return value;
      if (typeof value === 'string') {
        characters += value.length;
        if (characters > 2000000 || value.includes('\u0000')) throw Error('Practice snapshot is too large or contains unsupported text.');
        return value;
      }
      if (Array.isArray(value)) {
        if (value.length > 10000) throw Error('Practice snapshot array is too large.');
        return value.map(item => copy(item,depth + 1));
      }
      object(value,'Practice snapshot');
      const out = {};
      for (const key of Object.keys(value)) {
        if (key.length > 100) throw Error('Practice snapshot field is too long.');
        out[key] = copy(value[key],depth + 1);
      }
      return out;
    }
    const result = copy(raw,0);
    const optionalText = (value, keys, label) => {
      for (const key of keys) if (value[key] != null) text(value[key],label + ' ' + key,16000);
    };
    const array = (value, label, limit) => {
      if (value == null) return [];
      if (!Array.isArray(value) || value.length > limit) throw Error(label + ' must be an array of at most ' + limit + ' entries.');
      return value;
    };
    function guide(value) {
      object(value,'Snapshot guide');
      optionalText(value,['sourceId','title','task','setup','readiness','boundary','adaptation','ageNote','sourceNote'],'Snapshot guide');
      for (const key of ['steps','cues']) for (const entry of array(value[key],'Snapshot guide ' + key,100)) text(entry,'Snapshot guide ' + key,16000);
    }
    function series(value) {
      object(value,'Snapshot series');
      optionalText(value,['id','kind'],'Snapshot series');
      for (const entry of array(value.guides,'Snapshot series guides',100)) guide(entry);
      for (const entry of array(value.selections,'Snapshot series choices',100)) {
        object(entry,'Snapshot series choice'); optionalText(entry,['key','title'],'Snapshot series choice');
      }
    }
    function activity(value, label) {
      object(value,label);
      optionalText(value,['id','title','name','type','task','instructions','cues','notes','coach','equipment','space','group','rounds','simpler','success','stop'],label);
      if (value.guide != null) guide(value.guide);
      if (value.series != null) series(value.series);
    }
    optionalText(result,['name','notes','focus'],'Practice snapshot');
    for (const block of array(result.blocks,'Practice blocks',100)) {
      object(block,'Practice block');
      optionalText(block,['sourceId','title','name','type','instructions','cues','notes'],'Practice block');
      if (block.minutes != null && (typeof block.minutes !== 'number' || !Number.isFinite(block.minutes) || block.minutes < 0 || block.minutes > 240)) throw Error('Practice block minutes must be a number from 0 to 240.');
      for (const added of array(block.activities,'Practice block activities',100)) activity(added,'Practice activity');
      if (block.components != null) {
        object(block.components,'Practice components');
        for (const added of array(block.components.activities,'Added practice activities',100)) activity(added,'Added activity');
        if (block.components.series != null) series(block.components.series);
        if (block.components.rotation != null) {
          object(block.components.rotation,'Practice rotation');
          for (const station of array(block.components.rotation.stations,'Practice stations',100)) activity(station,'Practice station');
        }
      }
    }
    return result;
  }
  function cleanSession(raw, options = {}) {
    object(raw,'Session');
    const status = raw.status == null ? 'planned' : raw.status;
    if (!['planned','completed','cancelled'].includes(status)) throw Error('Choose a valid session status.');
    const startTime = text(raw.startTime,'Start time',5);
    if (startTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime)) throw Error('Start time must use HH:MM.');
    const out = {
      id:id(raw.id,'Session ID'),season:text(raw.season,'Season',80,true),group:group(raw.group),
      date:date(raw.date,'Practice date',status === 'completed'),startTime,
      location:text(raw.location,'Building / location',200),author:text(raw.author,'Plan author',120),
      lead:text(raw.lead,'Lead coach',120,status === 'completed'),name:text(raw.name,'Session name',240,true),
      status,plan:snapshot(raw.plan),skills:skills(raw.skills),notes:text(raw.notes,'Group notes',12000),
      noSkillReason:text(raw.noSkillReason,'No-skill explanation',2000),actor:text(raw.actor,'Editor',120),revision:revision(raw.revision)
    };
    if (status === 'completed' && !out.skills.length && !out.noSkillReason) throw Error('Confirm the skills covered, or explain that this session had no tracked skills.');
    if (options.today != null) {
      const today = date(options.today,'Today',true);
      if (status === 'completed' && out.date > today) throw Error('A future practice cannot be marked completed.');
    }
    return out;
  }
  function cleanCurriculum(raw) {
    object(raw,'Curriculum');
    return {id:id(raw.id,'Curriculum ID'),season:text(raw.season,'Season',80,true),group:group(raw.group),skills:skills(raw.skills),actor:text(raw.actor,'Editor',120),revision:revision(raw.revision)};
  }
  function catalogMap(catalog) {
    const rows = catalog instanceof Map ? [...catalog.values()] : Array.isArray(catalog) ? catalog : Object.values(catalog || {});
    if (rows.length > 10000) throw Error('The guide catalog is too large.');
    return new Map(rows.filter(item => item && typeof item.id === 'string').map(item => [item.id,item]));
  }
  function excluded(item, fallbackType = '') {
    const types = list(item?.types).concat(item?.type || [],item?.kind || [],fallbackType);
    return types.some(type => type === 'game' || type === 'water') || /^(?:G\d+)$/.test(item?.id || '');
  }
  function collection(item, sourceId, fallbackType = '') {
    return /^series:/.test(sourceId) || fallbackType === 'series' || item?.kind === 'sequence' || list(item?.types).includes('series');
  }
  function fromCatalog(item) {
    return {id:id(item.id,'Guide ID'),title:text(item.title || item.name,'Guide title',240,true),path:path(item.path || item.route,false),category:text(item.categoryLabel || item.category,'Guide category',160)};
  }
  function candidates(plan, catalog) {
    if (!plan || typeof plan !== 'object') return [];
    const map = catalogMap(catalog), found = new Map(), seen = new WeakSet();
    let visited = 0;
    function add(sourceId, label, type) {
      if (typeof sourceId !== 'string' || !sourceId) return;
      const item = map.get(sourceId);
      if (excluded(item,type) || collection(item,sourceId,type)) return;
      let candidate;
      if (item) candidate = fromCatalog(item);
      else if (plan.status === 'completed' && !/^G\d+$/.test(sourceId)) {
        // Keep historical IDs and titles even when a guide is retired. Never trust its imported URL.
        candidate = {id:id(sourceId,'Historical guide ID'),title:text(label || sourceId,'Historical guide title',240,true),path:'',category:'Previously taught guide'};
      }
      if (candidate && !found.has(candidate.id)) found.set(candidate.id,candidate);
    }
    function visit(value, depth = 0) {
      if (!value || typeof value !== 'object' || seen.has(value)) return;
      if (++visited > 10000 || depth > 20) throw Error('Practice activities are too complex to inspect.');
      seen.add(value);
      const type = value.guideType || value.type || '';
      if (!excluded(map.get(value.sourceId || value.guide?.sourceId),type)) {
        add(value.sourceId,value.title || value.name,type);
        if (value.guide) add(value.guide.sourceId,value.guide.title || value.name,type);
        // Only saved selected guides count. Never expand the series' catalog members/move_ids.
        for (const guide of list(value.series?.guides)) add(guide.sourceId,guide.title,'');
        for (const guide of list(value.components?.series?.guides)) add(guide.sourceId,guide.title,'');
      }
      // Added activities keep their own type even when their containing time slot is a game.
      for (const activity of list(value.components?.activities)) visit(activity,depth + 1);
      for (const station of list(value.components?.rotation?.stations)) visit(station,depth + 1);
    }
    for (const block of list(plan.blocks)) visit(block);
    return [...found.values()];
  }
  function seed(groupId, catalog, pathway = {}) {
    const selected = groups.find(item => item.id === group(groupId)), map = catalogMap(catalog), ids = [];
    const add = values => ids.push(...list(values));
    if (groupId !== 'pups') {
      const foundation = list(pathway.series).find(item => item.kind === 'foundation' || item.id === 'S24');
      if (foundation) {
        add(foundation.move_ids);
        for (const member of list(foundation.members)) if (member.move_id) ids.push(member.move_id);
        for (const branch of list(foundation.branches)) add(branch.move_ids);
      }
    }
    if (groupId !== 'valkyries') {
      const ageGroup = list(pathway.groups).find(item => String(item.age_group || '').replace(/[–—]/g,'-') === selected.age);
      for (const phase of list(ageGroup?.phases)) {
        add(phase.move_ids);
        for (const activityId of list(phase.activity_ids)) ids.push(activityId.startsWith('activity:') ? activityId : 'activity:' + activityId);
      }
    }
    if (groupId === 'pups') add(['activity:C18','activity:C19','activity:C20','activity:C21','activity:C22']);
    const found = new Map();
    for (const rawId of ids) {
      const item = [rawId,'kyle:' + rawId,'facebook:' + rawId,'activity:' + rawId].map(value => map.get(value)).find(Boolean);
      if (item && !excluded(item) && !collection(item,item.id) && !found.has(item.id)) found.set(item.id,fromCatalog(item));
    }
    return [...found.values()];
  }
  function coverage(rawCurriculum, rawSessions) {
    const curriculum = cleanCurriculum(rawCurriculum);
    if (!Array.isArray(rawSessions) || rawSessions.length > MAX_SESSIONS) throw Error('Choose at most ' + MAX_SESSIONS + ' sessions.');
    const latest = new Map();
    for (const raw of rawSessions) {
      const session = cleanSession(raw), previous = latest.get(session.id);
      // A corrected or cancelled revision replaces the earlier record, including its coverage.
      if (!previous || session.revision >= previous.revision) latest.set(session.id,session);
    }
    const relevant = [...latest.values()].filter(session => session.status === 'completed' && session.group === curriculum.group && session.season === curriculum.season)
      .sort((a,b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
    return curriculum.skills.map(item => {
      const matched = relevant.filter(session => session.skills.some(covered => covered.id === item.id));
      return {...item,firstCovered:matched[0]?.date || '',lastReviewed:matched[matched.length - 1]?.date || '',count:matched.length,sessionIds:matched.map(session => session.id)};
    });
  }
  return Object.freeze({groups,candidates,seed,cleanSession,cleanCurriculum,coverage});
});
