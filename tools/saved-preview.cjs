'use strict';
// QA ONLY: loopback static preview and disposable in-memory tracker. No Worker calls or disk writes.
const http = require('node:http'), fs = require('node:fs'), path = require('node:path');
const model = require('../tracker-model.js');
const root = fs.realpathSync(path.resolve(__dirname, '..'));
const MAX_BYTES = 256 * 1024, MAX_REVISIONS = 1000;
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.svg':'image/svg+xml','.pdf':'application/pdf','.zip':'application/zip','.txt':'text/plain; charset=utf-8','.md':'text/plain; charset=utf-8'};
const copy = value => JSON.parse(JSON.stringify(value));
const within = file => file.toLowerCase().startsWith((root + path.sep).toLowerCase());
function immutable(value) { if (value && typeof value === 'object') { Object.values(value).forEach(immutable); Object.freeze(value); } return value; }
function today() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(p => [p.type,p.value]));
  return parts.year + '-' + parts.month + '-' + parts.day;
}
function fixture(id, status) {
  const title = 'QA ONLY — ' + (status === 'completed' ? 'Completed practice' : 'Editable scheduled practice');
  const plan = {version:1,id:'qa-source-' + id,name:title,age:'4-6',program:'pups',target:6,startTime:'18:00',status:'planned',date:'2026-10-29',owner:'QA Plan Author',revision:'QA source label',focus:'QA ONLY — test saved practice editing',notes:'QA ONLY source-plan notes. No actual practice or athlete data.',blocks:[
    {id:'qa-stance',type:'move',sourceId:'P01',name:'QA ONLY — Stance',minutes:5,instructions:'Practice a balanced stance and short controlled steps.',cues:'Head up; knees soft.',setup:'Spread out on marked spots.',readiness:'Follow the coach stop signal.',boundary:'Keep space between partners.',steps:['Set a balanced stance.','Take two short steps and stop.'],ageNote:'QA ONLY Pups fixture.',sourceNote:'Synthetic QA instructions, not a published coaching guide.',delivery:'whole'},
    {id:'qa-water',type:'water',sourceId:'',name:'QA ONLY — Water',minutes:1,instructions:'Drink water and return to your space.',cues:'Walk back.',steps:[],delivery:'whole'}
  ]};
  return immutable({...model.cleanSession({id,revision:1,season:'2026-2027',group:'pups',date:'2026-10-29',startTime:'18:00',location:'QA ONLY — Test mat',author:'QA Plan Author',lead:'QA Lead Coach',name:title,status,plan,skills:status === 'completed' ? [{id:'P01',title:'QA ONLY — Stance confirmed',path:'#move/P01',category:'movement'}] : [],notes:'QA ONLY session notes. Preserve separately from the source plan.',noSkillReason:'',actor:'QA Fixture'}),savedAt:'2026-10-29T22:00:00.000Z'});
}
function createPreviewServer() {
  const histories = new Map([['qa-planned',[fixture('qa-planned','planned')]],['qa-completed',[fixture('qa-completed','completed')]]]);
  const operations = new Map();
  let writes = 0;
  const latest = () => [...histories.values()].map(entries => entries[entries.length - 1]);
  const count = () => [...histories.values()].reduce((sum,entries) => sum + entries.length,0);
  const json = (res,status,value,head = false) => { const body = JSON.stringify(value); res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Content-Length':Buffer.byteLength(body)}); res.end(head ? undefined : body); };
  const error = (res,status,message,code,extra = {}) => json(res,status,{error:message,code,...extra});
  const server = http.createServer((req,res) => {
    const port = server.address()?.port;
    const allowedHosts = ['127.0.0.1:' + port,'localhost:' + port];
    const allowedOrigins = allowedHosts.map(host => 'http://' + host);
    res.setHeader('Cache-Control','no-store'); res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('X-Grindstone-QA','in-memory-only');
    if (!allowedHosts.includes(req.headers.host)) return error(res,403,'Use this preview on localhost.','qa_host');
    if (req.headers.origin && !allowedOrigins.includes(req.headers.origin)) return error(res,403,'Cross-origin requests are not allowed.','qa_origin');
    if (req.headers.origin) { res.setHeader('Access-Control-Allow-Origin',req.headers.origin); res.setHeader('Vary','Origin'); }
    let url, route;
    try { url = new URL(req.url,'http://127.0.0.1:' + port); route = decodeURIComponent(url.pathname); }
    catch { return error(res,400,'Bad request.','invalid_request'); }
    if (req.method === 'OPTIONS') {
      res.writeHead(204,{'Access-Control-Allow-Methods':'GET, HEAD, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type, X-Tracker-Operation, X-Coach-Code'}); return res.end();
    }
    if (route.startsWith('/api/')) {
      if (['GET','HEAD'].includes(req.method)) {
        const head = req.method === 'HEAD';
        if (route === '/api/tracker') return json(res,200,{mode:'shared',requiresCode:false,sessions:latest().filter(record => record.season === url.searchParams.get('season')),curricula:[]},head);
        if (route === '/api/archive/status') return json(res,200,{enabled:false,jobs:[],qaOnly:true},head);
        if (route === '/api/qa-state') return json(res,200,{qaOnly:true,persistent:false,productionRequests:0,writeCount:writes,revisionCount:count(),sessions:latest(),histories:[...histories].map(([id,records]) => ({id,records}))},head);
        if (route === '/api/history') {
          const kind = url.searchParams.get('kind'), id = url.searchParams.get('id');
          if (!['session','curriculum'].includes(kind) || !/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,99}$/.test(id || '')) return error(res,400,'Choose a valid history record.','invalid_record');
          const records = kind === 'session' ? histories.get(id) || [] : [];
          return json(res,200,[...records].reverse().map(record => ({revision:record.revision,actor:record.actor,savedAt:record.savedAt,record})),head);
        }
        return error(res,404,'No such QA endpoint.','not_found');
      }
      if (req.method !== 'POST' || route !== '/api/session') return error(res,405,'Only session saves are supported by this QA server.','method_not_allowed');
      if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) return error(res,415,'Send a JSON record.','invalid_content_type');
      const op = req.headers['x-tracker-operation'];
      if (typeof op !== 'string' || !/^[A-Za-z0-9_-]{16,100}$/.test(op)) return error(res,400,'A valid save-operation ID is required.','invalid_operation');
      if (Number(req.headers['content-length']) > MAX_BYTES) { req.resume(); return error(res,413,'The QA record exceeds 256 KiB.','too_large'); }
      const chunks = []; let bytes = 0, stopped = false;
      req.on('data',chunk => {
        if (stopped) return;
        bytes += chunk.length;
        if (bytes > MAX_BYTES) { stopped = true; chunks.length = 0; error(res,413,'The QA record exceeds 256 KiB.','too_large'); return; }
        chunks.push(chunk);
      });
      req.on('error',() => { stopped = true; if (!res.writableEnded) error(res,400,'The request was interrupted.','invalid_request'); });
      req.on('end',() => {
        if (stopped) return;
        let record;
        try {
          record = model.cleanSession(JSON.parse(Buffer.concat(chunks).toString('utf8')),{today:today()});
          if (!record.actor) throw Error('Enter your name before saving a change.');
        } catch (err) { return error(res,400,err.message || 'Invalid practice record.','invalid_record'); }
        const encoded = JSON.stringify(record), previousOperation = operations.get(op);
        if (previousOperation) {
          if (previousOperation.encoded !== encoded) return error(res,409,'This operation ID belongs to a different change.','operation_conflict');
          return json(res,200,previousOperation.saved);
        }
        const entries = histories.get(record.id) || [], current = entries[entries.length - 1];
        if ((current?.revision || 0) !== record.revision) return error(res,409,'A newer version exists. Keep your edits and review the latest record.','revision_conflict',{current:current || null});
        if (current && (current.group !== record.group || current.season !== record.season)) return error(res,409,'A saved record must retain its group and season.','identity_conflict',{current});
        if (count() >= MAX_REVISIONS) return error(res,507,'This disposable QA server reached its limit. Restart it to reset fixtures.','qa_capacity');
        const saved = immutable({...copy(record),revision:record.revision + 1,savedAt:new Date().toISOString()});
        histories.set(record.id,[...entries,saved]); operations.set(op,{encoded,saved}); writes++;
        return json(res,200,saved);
      });
      return;
    }
    if (!['GET','HEAD'].includes(req.method)) return error(res,405,'Method not allowed.','method_not_allowed');
    if (route === '/tracker-config.js') {
      const body = '/* QA ONLY — no production service or archive calls. */\nwindow.GRINDSTONE_TRACKER_CONFIG = Object.freeze(' + JSON.stringify({endpoint:'http://127.0.0.1:' + port,qaOnly:true}) + ');\n';
      res.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8','Content-Length':Buffer.byteLength(body)}); return res.end(req.method === 'HEAD' ? undefined : body);
    }
    if (route.split(/[\\/]/).some(part => part.startsWith('.'))) { res.writeHead(404); return res.end('Not found'); }
    const file = path.resolve(root,'.' + (route === '/' ? '/index.html' : route));
    if (!within(file)) { res.writeHead(404); return res.end('Not found'); }
    fs.realpath(file,(err,real) => {
      if (err || !within(real)) { res.writeHead(404); return res.end('Not found'); }
      fs.stat(real,(err,stat) => {
        if (err || !stat.isFile()) { res.writeHead(404); return res.end('Not found'); }
        res.writeHead(200,{'Content-Type':types[path.extname(real).toLowerCase()] || 'application/octet-stream','Content-Length':stat.size});
        if (req.method === 'HEAD') return res.end();
        const stream = fs.createReadStream(real); stream.on('error',() => res.destroy()); stream.pipe(res);
      });
    });
  });
  server.requestTimeout = 30000;
  return server;
}
if (require.main === module) {
  const port = Number(process.argv[2] || 50785);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw Error('Invalid QA preview port');
  createPreviewServer().listen(port,'127.0.0.1',() => console.log('QA ONLY disposable saved-practice preview: http://127.0.0.1:' + port + '/#plans?season=2026-2027'));
}
module.exports = {createPreviewServer};
