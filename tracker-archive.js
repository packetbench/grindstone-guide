/* Pure completed-session archives. No network, browser, storage or clock dependencies. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.GRINDSTONE_ARCHIVE = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const VERSION = 1;
  const SITE = 'https://packetbench.github.io/grindstone-guide/';
  const GROUPS = {pups:['pup','Pups'],blue:['blu','Mat Rats - Blue'],black:['blk','Mat Rats - Black'],valkyries:['val','Valkyries']};
  const FORBIDDEN = new Set(['__proto__','prototype','constructor']);
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object,key);
  const escape = value => String(value == null ? '' : value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));

  // A synchronous SHA-256 implementation also runs in Apps Script V8, which has no Node crypto.
  function sha256(value) {
    if (typeof value !== 'string') throw Error('Digest input must be text.');
    const bytes = [];
    for (let i = 0; i < value.length; i++) {
      let point = value.codePointAt(i);
      if (point > 65535) i++;
      else if (point >= 55296 && point <= 57343) point = 65533;
      if (point < 128) bytes.push(point);
      else if (point < 2048) bytes.push(192 | (point >>> 6),128 | (point & 63));
      else if (point < 65536) bytes.push(224 | (point >>> 12),128 | ((point >>> 6) & 63),128 | (point & 63));
      else bytes.push(240 | (point >>> 18),128 | ((point >>> 12) & 63),128 | ((point >>> 6) & 63),128 | (point & 63));
    }
    const bitLength = bytes.length * 8;
    bytes.push(128);
    while (bytes.length % 64 !== 56) bytes.push(0);
    const high = Math.floor(bitLength / 4294967296), low = bitLength >>> 0;
    for (let shift = 24; shift >= 0; shift -= 8) bytes.push((high >>> shift) & 255);
    for (let shift = 24; shift >= 0; shift -= 8) bytes.push((low >>> shift) & 255);
    const k = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    const h = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    const rotate = (n, count) => (n >>> count) | (n << (32 - count));
    for (let offset = 0; offset < bytes.length; offset += 64) {
      const w = new Array(64);
      for (let i = 0; i < 16; i++) w[i] = (bytes[offset+i*4] << 24) | (bytes[offset+i*4+1] << 16) | (bytes[offset+i*4+2] << 8) | bytes[offset+i*4+3];
      for (let i = 16; i < 64; i++) {
        const a = w[i-15], b = w[i-2];
        w[i] = (w[i-16] + (rotate(a,7) ^ rotate(a,18) ^ (a >>> 3)) + w[i-7] + (rotate(b,17) ^ rotate(b,19) ^ (b >>> 10))) | 0;
      }
      let [a,b,c,d,e,f,g,z] = h;
      for (let i = 0; i < 64; i++) {
        const t1 = (z + (rotate(e,6) ^ rotate(e,11) ^ rotate(e,25)) + ((e & f) ^ (~e & g)) + k[i] + w[i]) | 0;
        const t2 = ((rotate(a,2) ^ rotate(a,13) ^ rotate(a,22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
        z=g; g=f; f=e; e=(d+t1)|0; d=c; c=b; b=a; a=(t1+t2)|0;
      }
      [a,b,c,d,e,f,g,z].forEach((word,i) => { h[i] = (h[i]+word)|0; });
    }
    return h.map(word => (word >>> 0).toString(16).padStart(8,'0')).join('');
  }
  function canonical(value) {
    if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
    if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + canonical(value[key])).join(',') + '}';
    return JSON.stringify(value);
  }
  function utf8Length(value) {
    let length = 0;
    for (let i = 0; i < value.length; i++) {
      const point = value.codePointAt(i);
      length += point < 128 ? 1 : point < 2048 ? 2 : point < 65536 ? 3 : 4;
      if (point > 65535) i++;
    }
    return length;
  }
  function cloneJson(raw) {
    let nodes = 0, characters = 0;
    const active = new Set();
    function copy(value, depth) {
      if (++nodes > 60000 || depth > 30) throw Error('Archive record is too complex.');
      if (value === null || typeof value === 'boolean') return value;
      if (typeof value === 'number' && Number.isFinite(value)) return value;
      if (typeof value === 'string') {
        characters += value.length;
        if (characters > 2000000 || value.includes('\u0000')) throw Error('Archive record is too large or contains unsupported text.');
        return value;
      }
      if (!value || typeof value !== 'object' || active.has(value)) throw Error('Archive record must contain finite, acyclic JSON values.');
      const proto = Object.getPrototypeOf(value);
      if (!Array.isArray(value) && proto && !(Object.getPrototypeOf(proto) === null && own(proto,'constructor') && proto.constructor.name === 'Object')) throw Error('Archive record must contain plain JSON objects.');
      active.add(value);
      let out;
      if (Array.isArray(value)) {
        if (value.length > 10000) throw Error('Archive array is too large.');
        out = value.map(entry => copy(entry,depth+1));
      } else {
        out = {};
        for (const key of Object.keys(value)) {
          if (FORBIDDEN.has(key) || key.length > 100) throw Error('Archive record contains an unsupported field.');
          const descriptor = Object.getOwnPropertyDescriptor(value,key);
          if (!own(descriptor,'value')) throw Error('Archive record cannot contain computed fields.');
          out[key] = copy(descriptor.value,depth+1);
        }
      }
      active.delete(value);
      return out;
    }
    return copy(raw,0);
  }
  function required(value, label, maximum) {
    if (typeof value !== 'string' || !value.trim() || value.length > maximum) throw Error(label + ' must be nonempty text of at most ' + maximum + ' characters.');
  }
  function validate(record) {
    if (!record || typeof record !== 'object' || Array.isArray(record)) throw Error('Choose a tracker session.');
    if (record.status !== 'completed') throw Error('Only confirmed completed sessions can be archived.');
    required(record.id,'Session ID',100);
    if (!/^[A-Za-z0-9][A-Za-z0-9_.:-]*$/.test(record.id) || FORBIDDEN.has(record.id)) throw Error('Session ID contains unsupported characters.');
    required(record.name,'Session name',240);
    required(record.season,'Season',80);
    required(record.lead,'Lead coach',120);
    if (!own(GROUPS,record.group)) throw Error('Choose a supported tracker group.');
    if (typeof record.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(record.date) || record.date < '1900-01-01' || record.date > '2200-12-31') throw Error('A completed session needs a valid practice date.');
    const date = new Date(record.date + 'T12:00:00Z');
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0,10) !== record.date) throw Error('A completed session needs a valid practice date.');
    if (record.revision != null && (!Number.isSafeInteger(record.revision) || record.revision < 0)) throw Error('Revision must be a nonnegative safe integer.');
    if (!Array.isArray(record.skills) || record.skills.length > 500) throw Error('Confirm at most 500 taught skills.');
    const ids = new Set();
    record.skills.forEach(skill => {
      if (!skill || typeof skill !== 'object' || Array.isArray(skill)) throw Error('Each taught skill must be an object.');
      required(skill.id,'Skill ID',100); required(skill.title,'Skill title',240);
      if (ids.has(skill.id)) throw Error('Taught skill IDs must be unique.');
      ids.add(skill.id);
    });
    if (!record.skills.length && !(typeof record.noSkillReason === 'string' && record.noSkillReason.trim())) throw Error('Confirm taught skills or give the no-skill explanation before archiving.');
    if (record.plan != null) {
      if (!record.plan || typeof record.plan !== 'object' || Array.isArray(record.plan) || record.plan.version !== 1 || !Array.isArray(record.plan.blocks) || record.plan.blocks.length > 100) throw Error('The saved plan must be a supported version 1 practice snapshot.');
    }
  }
  function shortDigest(hex) {
    // 128 bits encoded as 26 lowercase base32 characters; never a truncated session ID.
    const alphabet = 'abcdefghijklmnopqrstuvwxyz234567';
    let out = '', buffer = 0, bits = 0;
    for (let i = 0; i < 32; i += 2) {
      buffer = (buffer << 8) | parseInt(hex.slice(i,i+2),16); bits += 8;
      while (bits >= 5) { bits -= 5; out += alphabet[(buffer >>> bits) & 31]; }
    }
    if (bits) out += alphabet[(buffer << (5-bits)) & 31];
    return out;
  }
  function guideLink(value) {
    if (typeof value !== 'string' || value.length > 500 || !/^#(?:move\/[A-Za-z0-9_-]+|moves\/(?:kyle|videos)\/[A-Za-z0-9_-]+|season(?:\?[A-Za-z0-9_.~%=&:+,\/-]+)?)$/.test(value)) return '';
    let decoded;
    try { decoded = decodeURIComponent(value); } catch (_) { return ''; }
    return /[\u0000-\u0020<>"'\\]/.test(decoded) ? '' : SITE + value;
  }
  const LABELS = {sourceNote:'Source scope',ageNote:'Teaching-group guidance',adaptation:'Age adaptations',boundary:'Boundaries',readiness:'Ready when',sourceId:'Guide ID',guideMinutes:'Guide suggested minutes',frameworkPrompt:'Original framework task',instructions:'Task, rounds and rest',cues:'Coaching cues',task:'Task, partner roles and repetitions',steps:'Instruction steps',components:'Saved activities, series and rotations',activities:'Activities sharing this block',selections:'Selected series choices',guides:'Selected guide instructions',rotation:'Partner / station plan',workMinutes:'Work minutes per round',changeMinutes:'Minutes between rounds',briefingMinutes:'Briefing / demonstration minutes',finishMinutes:'Finish / reset minutes',noSkillReason:'Why no skills were tracked',lead:'Coach who led practice',author:'Plan author',actor:'Record confirmed / edited by',notes:'Notes',completedAt:'Completion time',weekContext:'Saved weekly context',handoff:'Saved coach handoff',startTime:'Start time',guideType:'Guide type',timingReview:'Saved timing review',timingConfirmed:'Timing confirmed',simpler:'Simpler version',success:'What success looks like',stop:'Stop / reset conditions'};
  function label(key) { return LABELS[key] || key.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/[_-]/g,' ').replace(/^./,first => first.toUpperCase()); }
  function visible(value) { return value !== null && value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0); }
  function valueHtml(value, key) {
    if (Array.isArray(value)) {
      if (!value.length) return '<p>None recorded.</p>';
      const tag = key === 'steps' || value.some(item => item && typeof item === 'object') ? 'ol' : 'ul';
      return '<' + tag + '>' + value.map(item => '<li>' + valueHtml(item,'') + '</li>').join('') + '</' + tag + '>';
    }
    if (value && typeof value === 'object') return fieldsHtml(value,[]);
    const url = ['path','route'].includes(key) ? guideLink(value) : '';
    if (url) return '<p><a href="' + escape(url) + '" rel="noopener noreferrer">Open saved guide</a> <span class="small">' + escape(value) + '</span></p>';
    return '<p class="pre">' + escape(typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value) + '</p>';
  }
  function fieldsHtml(value, excluded) {
    return '<dl>' + Object.keys(value).filter(key => !excluded.includes(key) && visible(value[key])).map(key => '<div class="field"><dt>' + escape(label(key)) + '</dt><dd>' + valueHtml(value[key],key) + '</dd></div>').join('') + '</dl>';
  }
  function minutes(value) { return Number.isFinite(value) ? String(value) : 'Unspecified'; }
  function planHtml(plan) {
    if (plan == null) return '<section><h2>No saved practice plan</h2><p>This completed session has no attached practice snapshot. The archive contains the confirmed session record only; no plan has been invented.</p></section>';
    let elapsed = 0;
    return '<section><h2>Saved source plan</h2><p>The plan below is preserved as saved. Planned work is not evidence that every activity was taught. Only the separately confirmed skills above count as covered.</p>' + fieldsHtml(plan,['blocks']) + '</section><section><h2>Planned run sheet</h2>' + (plan.blocks.length ? plan.blocks.map((block,index) => {
      const duration = Number.isFinite(block.minutes) ? block.minutes : 0;
      const range = minutes(elapsed) + '\u2013' + minutes(elapsed + duration) + ' minutes from start';
      elapsed += duration;
      return '<article class="block"><h3>' + (index+1) + '. ' + escape(block.name || block.title || 'Unnamed block') + '</h3><p class="timing"><strong>' + escape(minutes(block.minutes)) + ' minutes</strong> \u00b7 ' + escape(range) + '</p>' + fieldsHtml(block,['name','title','minutes']) + '</article>';
    }).join('') : '<p>No blocks were saved in this plan.</p>') + '</section>';
  }
  function documentHtml(record, meta) {
    const title = 'Completed practice record: ' + record.name;
    const skills = record.skills.length ? '<ul>' + record.skills.map(skill => '<li><strong>' + escape(skill.title) + '</strong> <span class="small">(' + escape(skill.id) + ')</span>' + fieldsHtml(skill,['title','id']) + '</li>').join('') + '</ul>' : '<p>No tracked skills were confirmed.</p><p class="pre">' + escape(record.noSkillReason) + '</p>';
    return '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; base-uri \'none\'; form-action \'none\'"><title>' + escape(title) + '</title><style>body{font:16px/1.5 system-ui,sans-serif;color:#17212b;background:white;margin:0 auto;padding:2rem;max-width:60rem}h1,h2,h3{line-height:1.2}h1{font-size:1.8rem}h2{font-size:1.35rem;border-bottom:2px solid #b48c37;padding-bottom:.4rem;margin-top:2rem}h3{font-size:1.15rem}a{color:#174f76;overflow-wrap:anywhere}.brand{font-weight:700;letter-spacing:.06em}.small,.timing{font-size:.9rem;color:#47515b}.pre{white-space:pre-wrap;overflow-wrap:anywhere}p{margin:.3rem 0 .7rem}.field{margin:.6rem 0}dt{font-weight:700}dd{margin-left:1rem}dd dl{border-left:2px solid #ddd;padding-left:.7rem}li{margin:.4rem 0}.block{border:1px solid #ccc;padding:1rem;margin:1rem 0}.integrity{font-size:.75rem;overflow-wrap:anywhere}@page{margin:16mm}@media print{body{padding:0;font-size:10pt;max-width:none}h1,h2,h3,dt{break-after:avoid}li,p{orphans:3;widows:3}.block{border:0;border-top:1px solid #999;padding:.6rem 0}a{color:inherit;text-decoration:underline}}</style></head><body><header><p class="brand">GRINDSTONE WRESTLING</p><h1>' + escape(title) + '</h1><p><strong>' + escape(GROUPS[record.group][1]) + '</strong> \u00b7 ' + escape(record.date) + ' \u00b7 Record revision ' + meta.revision + '</p></header><section><h2>Completed session</h2>' + fieldsHtml(record,['plan','skills','noSkillReason']) + '</section><section><h2>Skills confirmed as actually taught</h2><p>These are the coach-confirmed skills for this completed session, including corrections recorded in this revision. They are separate from the planned activities.</p>' + skills + '</section>' + planHtml(record.plan) + '<footer><h2>Archive identity</h2><p>Each revision is a separate archive. Keep earlier revisions; a corrected record must not overwrite their files. Re-importing the JSON opens the saved source plan according to the builder\u2019s normal import behavior; tracker confirmation remains in the archive wrapper.</p><p class="integrity">Key: ' + escape(meta.key) + '<br>Session SHA-256: ' + meta.identityDigest + '<br>Record SHA-256: ' + meta.contentDigest + '</p></footer></body></html>';
  }
  function prepare(raw) {
    const record = cloneJson(raw);
    validate(record);
    const revision = record.revision == null ? 0 : record.revision;
    const key = record.id + ':r' + revision;
    const identityDigest = sha256(record.id), contentDigest = sha256(canonical(record));
    const baseName = record.date + '-' + GROUPS[record.group][0] + '-' + shortDigest(identityDigest) + '-r' + revision;
    if (baseName.length > 59 || !/^[a-z0-9-]+$/.test(baseName)) throw Error('Archive filename cannot be represented safely.');
    const meta = {version:VERSION,key,sessionId:record.id,revision,identityDigest,contentDigest,baseName};
    const confirmation = {status:'completed',date:record.date,season:record.season,group:record.group,author:record.author || '',lead:record.lead,location:record.location || '',actor:record.actor || '',skills:cloneJson(record.skills),notes:record.notes || '',noSkillReason:record.noSkillReason || ''};
    const hasPlan = record.plan != null;
    const wrapper = hasPlan ? {format:'grindstone-practice',version:1,plan:record.plan,archive:meta,confirmation,trackerRecord:record} : {format:'grindstone-tracker-session',version:1,archive:meta,confirmation,trackerRecord:record};
    const json = JSON.stringify(wrapper,null,2);
    const jsonBytes = utf8Length(json);
    if (hasPlan && jsonBytes > 2000000) throw Error('This complete archive exceeds the builder\u2019s 2 MB JSON import limit. Preserve the record and use a separate large-record archive workflow; do not trim its plan.');
    return {key,baseName,identityDigest,contentDigest,revision,format:wrapper.format,jsonBytes,htmlFilename:baseName+'.html',jsonFilename:baseName+'.json',filenames:{html:baseName+'.html',json:baseName+'.json'},html:documentHtml(record,meta),json};
  }
  return Object.freeze({version:VERSION,prepare,sha256});
});
