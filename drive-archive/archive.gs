/* Owner-run Google Apps Script. No web app or public upload endpoint is deployed.
 * Load tracker-model.js and tracker-archive.js into this project before this file.
 * Enable the Advanced Drive service. Credentials live in Script Properties only.
 */
const GRINDSTONE_DRIVE_FOLDER = '1nH6QOx1E0mTWGiRg9MroZ6iJX9PQuXK_';
const GRINDSTONE_TRACKER_API = 'https://grindstone-tracker-preview.tjschne2.workers.dev';
const GRINDSTONE_ARCHIVE_FORMAT = '1';

function checkDriveFolder() {
  const folder = DriveApp.getFolderById(GRINDSTONE_DRIVE_FOLDER);
  if (folder.isTrashed()) throw new Error('The Practices folder is in Trash. Restore it before connecting the archive.');
  // Reading this folder does not change sharing or upload any practice.
  console.log('Archive folder available: ' + folder.getName());
  return folder.getId();
}

function archiveRequest_(path, body) {
  if (!['/api/archive/queue?limit=3', '/api/archive/ack'].includes(path)) throw new Error('Unsupported archive operation.');
  const key = PropertiesService.getScriptProperties().getProperty('DRIVE_ARCHIVE_KEY');
  if (!key || key.length < 32) throw new Error('The archive connection key has not been configured.');
  const response = UrlFetchApp.fetch(GRINDSTONE_TRACKER_API + path, {
    method: body ? 'post' : 'get',
    contentType: 'application/json',
    headers: {Authorization: 'Bearer ' + key},
    ...(body ? {payload: JSON.stringify(body)} : {}),
    followRedirects: false,
    muteHttpExceptions: true
  });
  const status = response.getResponseCode();
  if (status !== 200) throw new Error('Tracker archive connection returned HTTP ' + status + '.');
  let result;
  try { result = JSON.parse(response.getContentText()); }
  catch (_) { throw new Error('Tracker archive response was not readable JSON.'); }
  return result;
}

function archiveFile_(prepared, extension, makeBlob) {
  const filename = prepared.baseName + '.' + extension;
  // Flat folder layout; each descendant is checked before a cloud write.
  if (filename.length > 64 || !/^[a-z0-9][a-z0-9-]*\.(?:pdf|json)$/.test(filename) || filename.length + 10 > 200) throw new Error('Unsafe archive filename.');
  const expectedType = extension === 'pdf' ? 'application/pdf' : 'application/json';
  const marker = {grindstoneArchive: GRINDSTONE_ARCHIVE_FORMAT, identityHash: prepared.identityDigest, sourceHash: prepared.contentDigest, format: extension};
  const matches = Drive.Files.list({
    q: "'" + GRINDSTONE_DRIVE_FOLDER + "' in parents and trashed = false and name = '" + filename + "'",
    fields: 'files(id,name,mimeType,appProperties),nextPageToken', pageSize: 100
  });
  if (matches.nextPageToken || (matches.files || []).length > 1) throw new Error('Multiple archive files share this name; manual review is needed.');
  const existing = (matches.files || [])[0];
  if (existing) {
    if (existing.mimeType !== expectedType || Object.keys(marker).some(k => existing.appProperties?.[k] !== marker[k])) throw new Error('An existing file does not match this record. It was preserved unchanged.');
    return existing.id;
  }
  // The identity and source hash are written atomically with file creation.
  // A retry can recover either member of a partially saved PDF/JSON pair.
  const created = Drive.Files.create({name: filename, mimeType: expectedType,
    parents: [GRINDSTONE_DRIVE_FOLDER], appProperties: marker,
    description: 'Grindstone completed practice revision. Source key: ' + prepared.key + '. Earlier revisions are preserved.'
  }, makeBlob().setName(filename), {fields: 'id'});
  if (!created.id) throw new Error('Google Drive did not return a saved file ID.');
  return created.id;
}

function processArchiveJob_(job) {
  if (!job || job.record?.id !== job.sessionId || job.record?.revision !== job.revision || job.record?.status !== 'completed') throw new Error('Archive job does not match its saved completed record.');
  if (!/^[a-f0-9]{64}$/.test(job.recordHash || '') || GRINDSTONE_ARCHIVE.sha256(JSON.stringify(job.record)) !== job.recordHash) throw new Error('The archive job integrity check failed.');
  const prepared = GRINDSTONE_ARCHIVE.prepare(job.record);
  if (prepared.json.length > 2000000 || prepared.html.length > 4000000) throw new Error('The practice export is too large.');
  const jsonFileId = archiveFile_(prepared, 'json', () => Utilities.newBlob(prepared.json, 'application/json'));
  const pdfFileId = archiveFile_(prepared, 'pdf', () => Utilities.newBlob(prepared.html, 'text/html', prepared.baseName + '.html').getAs('application/pdf'));
  return {pdfFileId, jsonFileId};
}

function archiveCompletedPractices() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  let failed = 0;
  try {
    const feed = archiveRequest_('/api/archive/queue?limit=3');
    if (feed.folderId !== GRINDSTONE_DRIVE_FOLDER || !Array.isArray(feed.jobs) || feed.jobs.length > 3) throw new Error('Unexpected archive destination or queue response.');
    for (const job of feed.jobs) {
      const operationId = Utilities.getUuid();
      let result;
      try {
        result = {jobId: job.jobId, operationId, status: 'archived', ...processArchiveJob_(job)};
      } catch (_) {
        // Never put account details, tokens or raw Google responses in public tracker errors.
        failed++;
        result = {jobId: job.jobId, operationId, status: 'failed', error: 'Drive could not complete this copy. The saved practice is unchanged. The archive owner should check folder access, quota and the script execution.'};
      }
      // Lost acknowledgements are retried by the next scheduled run. Existing files
      // are reconciled by their fixed names and metadata, not blindly created again.
      archiveRequest_('/api/archive/ack', result);
    }
  } finally {
    lock.releaseLock();
  }
  if (failed) throw new Error(failed + ' practice archive(s) need attention. See tracker archive status; saved teaching records are unchanged.');
}

function installArchiveTrigger() {
  checkDriveFolder();
  archiveRequest_('/api/archive/queue?limit=3');
  const existing = ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'archiveCompletedPractices');
  if (existing.length > 1) throw new Error('Multiple archive triggers exist. Review them before continuing.');
  if (!existing.length) ScriptApp.newTrigger('archiveCompletedPractices').timeBased().everyMinutes(5).create();
  console.log('Completed practices will be checked about every five minutes. Drive sharing remains unchanged.');
}
