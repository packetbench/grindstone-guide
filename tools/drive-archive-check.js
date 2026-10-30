'use strict';
// Owner-script tests use fake Google services and never write files or contact Drive.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict'), crypto = require('node:crypto');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const source = fs.readFileSync(path.join(__dirname,'../drive-archive/archive.gs'),'utf8');
let checks = 0;
function check(name, fn) { fn(); console.log('PASS ' + name); checks++; }
function harness() {
  let failPdf = false, loseAck = false, lockHeld = false, triggerCount = 0;
  const files = [], acks = [], logs = [], writes = [];
  const record = {id:'test-session',revision:1,status:'completed'};
  const prepared = {baseName:'2026-10-30-blu-test-r1',key:'test-session:1',identityDigest:'a'.repeat(64),contentDigest:'b'.repeat(64),html:'<h1>Test</h1>',json:'{"test":true}'};
  const feed = {folderId:'1nH6QOx1E0mTWGiRg9MroZ6iJX9PQuXK_',jobs:[{jobId:'job-1',sessionId:record.id,revision:1,record,recordHash:sha256(JSON.stringify(record))}]};
  const blob = (content,type,name) => ({content,type,name,setName(n){this.name=n;return this;},getAs(type){if(failPdf)throw Error('conversion failed with private data');return blob('pdf bytes',type);}});
  const context = {
    console:{log:(...x)=>logs.push(x.join(' '))},
    GRINDSTONE_ARCHIVE:{prepare:()=>prepared,sha256},
    PropertiesService:{getScriptProperties:()=>({getProperty:()=> 'secret-for-tests-only-xxxxxxxxxxxxxxxxxxxxxxxxxx'})},
    DriveApp:{getFolderById:id=>{assert.equal(id,feed.folderId);return {isTrashed:()=>false,getName:()=> 'Practices',getId:()=>id};}},
    Drive:{Files:{
      list:options=>{assert(options.q.startsWith("'"+feed.folderId+"' in parents"));const name=/name = '([^']+)'/.exec(options.q)[1];return {files:files.filter(f=>f.name===name)};},
      create:(meta,bytes)=>{assert.deepEqual(Array.from(meta.parents),[feed.folderId]);writes.push(meta);const f={...meta,id:'google-file-'+(files.length+1),bytes};files.push(f);return {id:f.id};}
    }},
    Utilities:{newBlob:blob,getUuid:()=> 'attempt-'+(acks.length+1)},
    UrlFetchApp:{fetch:(url,options)=>{
      assert(url.startsWith('https://grindstone-tracker-preview.tjschne2.workers.dev/api/archive/'));
      assert(options.headers.Authorization.startsWith('Bearer secret-for-tests-only-'));
      assert.equal(options.followRedirects,false);
      if(url.endsWith('/ack')) {acks.push(JSON.parse(options.payload));if(loseAck)throw Error('network lost');}
      return {getResponseCode:()=>200,getContentText:()=>JSON.stringify(url.includes('/queue?')?feed:{ok:true})};
    }},
    LockService:{getScriptLock:()=>({tryLock:()=>!lockHeld,releaseLock:()=>logs.push('unlock')})},
    ScriptApp:{getProjectTriggers:()=>Array.from({length:triggerCount},()=>({getHandlerFunction:()=> 'archiveCompletedPractices'})),newTrigger:name=>({timeBased:()=>({everyMinutes:n=>({create:()=>{assert.equal(n,5);assert.equal(name,'archiveCompletedPractices');triggerCount++;}})})})}
  };
  vm.createContext(context);vm.runInContext(source,context);
  return {context,files,acks,logs,writes,feed,prepared,failPdf:v=>{failPdf=v;},loseAck:v=>{loseAck=v;},lockHeld:v=>{lockHeld=v;},triggers:()=>triggerCount};
}
check('copies both formats to only the fixed folder, then acknowledges success',()=>{
  const h=harness();h.context.archiveCompletedPractices();assert.equal(h.files.length,2);assert.deepEqual(h.files.map(f=>f.mimeType),['application/json','application/pdf']);assert.equal(h.acks[0].status,'archived');assert.equal(h.acks[0].jsonFileId,'google-file-1');assert(h.files.every(f=>f.appProperties.sourceHash===h.prepared.contentDigest));
});
check('repeated processing reconciles files without duplicate writes',()=>{
  const h=harness();h.context.archiveCompletedPractices();h.context.archiveCompletedPractices();assert.equal(h.files.length,2);assert.equal(h.acks.length,2);
});
check('partial PDF failure keeps JSON and safely completes on retry',()=>{
  const h=harness();h.failPdf(true);assert.throws(()=>h.context.archiveCompletedPractices(),/need attention/);assert.equal(h.files.length,1);assert.equal(h.acks[0].status,'failed');assert(!h.acks[0].error.includes('private'));h.failPdf(false);h.context.archiveCompletedPractices();assert.equal(h.files.length,2);assert.equal(h.acks[1].status,'archived');
});
check('lost acknowledgement recovers the same existing file pair',()=>{
  const h=harness();h.loseAck(true);assert.throws(()=>h.context.archiveCompletedPractices(),/network lost/);assert.equal(h.files.length,2);assert(h.logs.includes('unlock'));h.loseAck(false);h.failPdf(true);h.context.archiveCompletedPractices();assert.equal(h.files.length,2);assert.equal(h.acks[1].status,'archived');
});
check('an unrelated same-name file is preserved and blocks copying',()=>{
  const h=harness();h.files.push({name:h.prepared.baseName+'.json',id:'unrelated',mimeType:'application/json',appProperties:{}});assert.throws(()=>h.context.archiveCompletedPractices(),/need attention/);assert.equal(h.writes.length,0);assert.equal(h.files[0].id,'unrelated');
});
check('same record identity with changed content refuses to overwrite',()=>{
  const h=harness();h.context.archiveCompletedPractices();h.prepared.contentDigest='c'.repeat(64);assert.throws(()=>h.context.archiveCompletedPractices(),/need attention/);assert.equal(h.files.length,2);
});
check('changed destination, too many jobs and malformed job are rejected',()=>{
  const h=harness();h.feed.folderId='different-folder';assert.throws(()=>h.context.archiveCompletedPractices(),/Unexpected/);assert.equal(h.writes.length,0);
  const a=harness();a.feed.jobs=Array(4).fill(a.feed.jobs[0]);assert.throws(()=>a.context.archiveCompletedPractices(),/Unexpected/);
  const b=harness();b.feed.jobs[0].record.status='planned';assert.throws(()=>b.context.archiveCompletedPractices(),/need attention/);assert.equal(b.writes.length,0);
});
check('unsafe filename never reaches cloud create',()=>{
  const h=harness();h.prepared.baseName='../escape';assert.throws(()=>h.context.archiveCompletedPractices(),/need attention/);assert.equal(h.writes.length,0);
});
check('record content must match the authoritative queue hash',()=>{
  const h=harness();h.feed.jobs[0].recordHash='0'.repeat(64);assert.throws(()=>h.context.archiveCompletedPractices(),/need attention/);assert.equal(h.writes.length,0);
});
check('concurrent run exits without writes and install is idempotent',()=>{
  const h=harness();h.lockHeld(true);h.context.archiveCompletedPractices();assert.equal(h.writes.length,0);h.lockHeld(false);h.context.installArchiveTrigger();h.context.installArchiveTrigger();assert.equal(h.triggers(),1);
});
check('no public upload endpoint, deletion, share changes or embedded credentials',()=>{
  assert(!/function\s+do(?:Get|Post)\s*\(/.test(source));assert(!/\.setSharing\(|\.setTrashed\(|\.deleteFile\(/.test(source));assert(!/DRIVE_ARCHIVE_KEY\s*[:=]\s*['"]/.test(source));
});
console.log(checks+' Drive archive checks passed. No network calls or file writes.');
