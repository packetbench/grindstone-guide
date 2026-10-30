import "../tracker-model.js";

const MAX_BYTES = 256 * 1024;
const API_PATHS = new Set(["/api/tracker", "/api/session", "/api/curriculum", "/api/history", "/api/archive/status", "/api/archive/queue", "/api/archive/ack", "/api/archive/retry"]);
const ID = /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,99}$/;
const OPERATION = /^[a-zA-Z0-9_-]{16,100}$/;
const model = globalThis.GRINDSTONE_TRACKER_MODEL;
const DRIVE_FOLDER = "1nH6QOx1E0mTWGiRg9MroZ6iJX9PQuXK_";
const DRIVE_ID = /^[A-Za-z0-9_-]{10,200}$/;
const ARCHIVE_ATTEMPTS = 5;

function failure(status, code, message, extra = {}) {
  return Object.assign(new Error(message), { status, code, ...extra });
}
function origins(env) {
  return String(env.ALLOWED_ORIGINS || "https://packetbench.github.io")
    .split(",").map(value => value.trim()).filter(Boolean);
}
function headers(origin, allowed) {
  const result = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "Vary": "Origin", "X-Content-Type-Options": "nosniff" };
  if (origin && allowed.includes(origin)) result["Access-Control-Allow-Origin"] = origin;
  return result;
}
function json(value, status, responseHeaders) {
  return new Response(JSON.stringify(value), { status, headers: responseHeaders });
}
function nyToday() {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  return ["year", "month", "day"].map(type => parts.find(part => part.type === type).value).join("-");
}
async function hash(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}
async function codeMatches(given, expected) {
  const [a, b] = await Promise.all([hash(given), hash(expected)]);
  let diff = 0;
  for (let index = 0; index < a.length; index++) diff |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return diff === 0;
}
async function bodyJson(request) {
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get("Content-Type") || "")) throw failure(415, "json_required", "Send this record as JSON.");
  if (Number(request.headers.get("Content-Length")) > MAX_BYTES) throw failure(413, "too_large", "This practice record is too large to save.");
  if (!request.body) throw failure(400, "invalid_json", "The request has no record.");
  const reader = request.body.getReader();
  const chunks = [];
  let length = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > MAX_BYTES) { await reader.cancel(); throw failure(413, "too_large", "This practice record is too large to save."); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
  catch { throw failure(400, "invalid_json", "This record could not be read as JSON."); }
}
function validated(kind, record) {
  try {
    const clean = kind === "session" ? model.cleanSession(record, { today: nyToday() }) : model.cleanCurriculum(record);
    if (!clean.actor) throw new Error("Enter your name before saving a change.");
    return clean;
  } catch (error) {
    throw failure(400, "invalid_record", error.message || "Check this practice record before saving.");
  }
}
function unpack(row) {
  return row ? JSON.parse(row.record) : null;
}
async function byOperation(db, operation) {
  return db.prepare("SELECT request_hash, record FROM tracker_versions WHERE operation_id = ?").bind(operation).first();
}
async function latest(db, kind, id) {
  return unpack(await db.prepare("SELECT record FROM tracker_versions WHERE kind = ? AND id = ? ORDER BY revision DESC LIMIT 1").bind(kind, id).first());
}
function replay(row, requestHash) {
  if (row.request_hash !== requestHash) throw failure(409, "operation_conflict", "This save identifier was already used for different information. Reload before trying again.");
  return unpack(row);
}
async function save(db, kind, supplied, operation) {
  const record = validated(kind, supplied);
  const requestHash = await hash(kind + "\n" + JSON.stringify(record));
  const earlier = await byOperation(db, operation);
  if (earlier) return { record: replay(earlier, requestHash), created: false };
  const savedAt = new Date().toISOString();
  const saved = { ...record, revision: record.revision + 1, savedAt };
  let result;
  try {
    // A single conditional insert is the concurrency boundary. Both the revision
    // and immutable group/season are checked inside SQLite, not in a prior read.
    result = await db.prepare(`INSERT INTO tracker_versions
      (kind, id, revision, season, group_id, actor, saved_at, operation_id, request_hash, record)
      SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      WHERE COALESCE((SELECT MAX(revision) FROM tracker_versions WHERE kind = ? AND id = ?), 0) = ?
      AND NOT EXISTS (SELECT 1 FROM tracker_versions WHERE kind = ? AND id = ? AND (season <> ? OR group_id <> ?))`)
      .bind(kind, record.id, saved.revision, record.season, record.group, record.actor, savedAt, operation, requestHash, JSON.stringify(saved), kind, record.id, record.revision, kind, record.id, record.season, record.group).run();
  } catch (error) {
    // An ambiguous network retry or two simultaneous copies of the same save
    // can reach the unique operation constraint; return that original revision.
    const duplicate = await byOperation(db, operation);
    if (duplicate) return { record: replay(duplicate, requestHash), created: false };
    throw error;
  }
  if (!result.meta || Number(result.meta.changes) !== 1) {
    const duplicate = await byOperation(db, operation);
    if (duplicate) return { record: replay(duplicate, requestHash), created: false };
    const current = await latest(db, kind, record.id);
    const changedIdentity = current && (current.season !== record.season || current.group !== record.group);
    throw failure(409, changedIdentity ? "identity_conflict" : "revision_conflict", changedIdentity ? "A saved record must keep its original group and season. Create another scheduled practice instead." : "Someone saved a newer version. Reload it before applying your changes.", { current });
  }
  return { record: saved, created: true };
}

function archiveEnabled(env) { return env.DRIVE_ARCHIVE_ENABLED === true || env.DRIVE_ARCHIVE_ENABLED === "true"; }
function eligibleArchive(record) {
  const years = /^(\d{4})-(\d{4})$/.exec(record.season);
  return record.status === "completed" && !!years && Number(years[1]) >= 1900 && Number(years[2]) <= 2200 && Number(years[2]) === Number(years[1]) + 1;
}
function archiveView(row) {
  return { jobId: row.job_id, sessionId: row.session_id, revision: row.revision, status: row.status,
    pdfUrl: row.pdf_file_id ? "https://drive.google.com/file/d/" + row.pdf_file_id + "/view" : "",
    jsonUrl: row.json_file_id ? "https://drive.google.com/file/d/" + row.json_file_id + "/view" : "",
    error: row.error || "", updatedAt: row.updated_at, attempts: row.attempts,
    retryable: row.status === "failed", automaticRetry: row.status === "failed" && row.attempts < ARCHIVE_ATTEMPTS };
}
async function archiveJob(db, sessionId, revision) {
  return db.prepare("SELECT * FROM tracker_archives WHERE session_id = ? AND revision = ?").bind(sessionId, revision).first();
}
async function enqueueArchive(db, record) {
  const stamp = new Date().toISOString(), recordHash = await hash(JSON.stringify(record));
  await db.prepare(`INSERT INTO tracker_archives
    (job_id, session_id, revision, season, status, record_hash, attempts, next_attempt_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'pending', ?, 0, ?, ?, ?) ON CONFLICT(session_id, revision) DO NOTHING`)
    .bind(crypto.randomUUID(), record.id, record.revision, record.season, recordHash, stamp, stamp, stamp).run();
  return archiveView(await archiveJob(db, record.id, record.revision));
}
async function archiveAfterSave(env, saved) {
  const record = saved.record;
  if (!archiveEnabled(env) || !eligibleArchive(record)) return record;
  try {
    // Only a newly committed completion creates an automatic job. Replaying an
    // older operation after enabling Drive must not backfill historical records.
    const row = saved.created ? await enqueueArchive(env.DB, record) : await archiveJob(env.DB, record.id, record.revision);
    return { ...record, archive: row ? (saved.created ? row : archiveView(row)) : { status: "not-queued", warning: "This saved revision has no Drive job. It was not automatically backfilled." } };
  } catch (_) {
    // D1 has already committed the practice. An archive configuration failure
    // must never tell the coach that their completed practice failed to save.
    return { ...record, archive: { status: "failed", warning: "Practice saved. Its Drive archive could not be queued. Reconnect the archive, then retry this saved revision." } };
  }
}
async function archiveAuth(request, env) {
  if (!archiveEnabled(env)) throw failure(503, "archive_disabled", "Automatic Drive archiving is not connected.");
  const key = typeof env.DRIVE_ARCHIVE_KEY === "string" ? env.DRIVE_ARCHIVE_KEY : "";
  if (key.length < 32) throw failure(503, "archive_unconfigured", "The archive service is not connected.");
  const given = request.headers.get("Authorization") || "";
  if (!given.startsWith("Bearer ") || !await codeMatches(given.slice(7), key)) throw failure(401, "archive_unauthorized", "Archive service authorization is required.");
}
async function archiveQueue(db, limit) {
  const result = await db.prepare(`SELECT job.*, version.record FROM tracker_archives AS job
    JOIN tracker_versions AS version ON version.kind = 'session' AND version.id = job.session_id AND version.revision = job.revision
    WHERE job.status IN ('pending', 'failed') AND job.attempts < ? AND job.next_attempt_at <= ?
    ORDER BY job.created_at, job.job_id LIMIT ?`).bind(ARCHIVE_ATTEMPTS, new Date().toISOString(), limit).all();
  const jobs = [];
  for (const row of result.results || []) {
    const record = unpack(row);
    if (record.status !== "completed" || await hash(JSON.stringify(record)) !== row.record_hash) throw failure(503, "archive_record_changed", "An archive source record failed its integrity check.");
    jobs.push({ jobId: row.job_id, sessionId: row.session_id, revision: row.revision, recordHash: row.record_hash, record });
  }
  return { folderId: DRIVE_FOLDER, jobs };
}
async function acknowledgeArchive(db, body) {
  if (!body || typeof body !== "object" || !OPERATION.test(body.jobId || "") || !OPERATION.test(body.operationId || "") || !["archived", "failed"].includes(body.status)) throw failure(400, "invalid_archive_ack", "Choose a valid archive job, operation and outcome.");
  if (Object.keys(body).some(key => !["jobId", "operationId", "status", "pdfFileId", "jsonFileId", "error"].includes(key))) throw failure(400, "invalid_archive_ack", "Unsupported archive acknowledgement field.");
  const pdf = body.pdfFileId || "", source = body.jsonFileId || "";
  if ((pdf && !DRIVE_ID.test(pdf)) || (source && !DRIVE_ID.test(source)) || (body.status === "archived" && (!pdf || !source || pdf === source))) throw failure(400, "invalid_archive_files", "Supply the two distinct Google file IDs, not URLs.");
  if (body.error != null && (typeof body.error !== "string" || body.error.length > 500 || /[\u0000-\u001f\u007f]/.test(body.error))) throw failure(400, "invalid_archive_error", "Use a brief archive error message.");
  const row = await db.prepare("SELECT * FROM tracker_archives WHERE job_id = ?").bind(body.jobId).first();
  if (!row) throw failure(404, "archive_not_found", "This archive job does not exist.");
  const acknowledgementHash = await hash(JSON.stringify({ status: body.status, pdf, source, error: body.error || "" }));
  if (row.last_operation_id === body.operationId) {
    if (row.last_operation_hash !== acknowledgementHash) throw failure(409, "archive_operation_conflict", "An archive operation cannot acknowledge different results.");
    return archiveView(row);
  }
  if (row.status === "archived") {
    if (body.status === "archived" && row.pdf_file_id === pdf && row.json_file_id === source) return archiveView(row);
    throw failure(409, "archive_already_saved", "This archived revision cannot be replaced.");
  }
  const attempts = row.attempts + 1, stamp = new Date().toISOString();
  const next = new Date(Date.now() + Math.min(60, 5 * 2 ** Math.min(attempts - 1, 4)) * 60000).toISOString();
  // Only a small, non-sensitive summary is public. Service details stay in Apps
  // Script logs; an exception may contain access tokens or private account data.
  const error = body.status === "failed" ? "Drive copy failed. " + (attempts < ARCHIVE_ATTEMPTS ? "An automatic retry is pending." : "Reconnect the archive or retry this saved revision.") : "";
  const result = await db.prepare(`UPDATE tracker_archives SET status = ?, pdf_file_id = ?, json_file_id = ?, error = ?,
    attempts = ?, next_attempt_at = ?, updated_at = ?, last_operation_id = ?, last_operation_hash = ?
    WHERE job_id = ? AND status <> 'archived' AND attempts = ?`)
    .bind(body.status, pdf || row.pdf_file_id || "", source || row.json_file_id || "", error, attempts, next, stamp, body.operationId, acknowledgementHash, row.job_id, row.attempts).run();
  if (Number(result.meta?.changes) !== 1) throw failure(409, "archive_ack_conflict", "The archive job changed; read its current status before retrying.");
  return archiveView(await archiveJob(db, row.session_id, row.revision));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const allowed = origins(env);
    const responseHeaders = headers(origin, allowed);
    try {
      if (!API_PATHS.has(url.pathname)) throw failure(404, "not_found", "This tracker endpoint does not exist.");
      if (origin && !allowed.includes(origin)) throw failure(403, "origin_denied", "This website is not configured to use the shared tracker.");
      if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { ...responseHeaders, "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, X-Tracker-Operation, X-Coach-Code", "Access-Control-Max-Age": "600" } });
      if (!env.DB) throw failure(503, "storage_unconfigured", "Shared tracker storage is not connected yet. Your changes have not been saved.");
      if (request.method === "GET" && url.pathname === "/api/archive/status") {
        const season = url.searchParams.get("season") || "";
        if (!season.trim() || season.length > 80 || /[\u0000-\u001f\u007f]/.test(season)) throw failure(400, "invalid_season", "Choose a valid season.");
        if (!archiveEnabled(env)) return json({ enabled: false, jobs: [] }, 200, responseHeaders);
        const result = await env.DB.prepare("SELECT * FROM tracker_archives WHERE season = ? ORDER BY session_id, revision DESC").bind(season).all();
        return json({ enabled: true, jobs: (result.results || []).map(archiveView) }, 200, responseHeaders);
      }
      if (request.method === "GET" && url.pathname === "/api/archive/queue") {
        await archiveAuth(request, env);
        const rawLimit = url.searchParams.get("limit") || "3";
        if (!/^[1-5]$/.test(rawLimit)) throw failure(400, "invalid_archive_limit", "Request between one and five archive jobs.");
        return json(await archiveQueue(env.DB, Number(rawLimit)), 200, responseHeaders);
      }
      if (request.method === "POST" && url.pathname === "/api/archive/ack") {
        await archiveAuth(request, env);
        return json(await acknowledgeArchive(env.DB, await bodyJson(request)), 200, responseHeaders);
      }
      if (request.method === "POST" && url.pathname === "/api/archive/retry") {
        if (!archiveEnabled(env)) throw failure(503, "archive_disabled", "Automatic Drive archiving is not connected.");
        if (!origin) throw failure(403, "origin_required", "Retry through the configured Grindstone website.");
        if (env.COACH_CODE && !await codeMatches(request.headers.get("X-Coach-Code") || "", String(env.COACH_CODE))) throw failure(401, "coach_code_required", "Enter the coach editing code to retry.");
        const body = await bodyJson(request);
        if (!body || typeof body !== "object" || !ID.test(body.sessionId || "") || !Number.isSafeInteger(body.revision) || body.revision < 1 || typeof body.actor !== "string" || !body.actor.trim() || body.actor.length > 120 || /[\u0000-\u001f\u007f]/.test(body.actor) || Object.keys(body).some(key => !["sessionId", "revision", "actor"].includes(key))) throw failure(400, "invalid_archive_retry", "Choose a saved revision and enter your name to retry.");
        const record = await latest(env.DB, "session", body.sessionId);
        if (!record || record.revision !== body.revision || !eligibleArchive(record)) throw failure(409, "archive_revision_unavailable", "Only the latest completed practice in a valid year-based season can be retried.");
        let row = await archiveJob(env.DB, record.id, record.revision);
        if (!row) return json(await enqueueArchive(env.DB, record), 200, responseHeaders);
        if (row.status === "failed") {
          const stamp = new Date().toISOString();
          await env.DB.prepare("UPDATE tracker_archives SET status = 'pending', attempts = 0, error = '', next_attempt_at = ?, updated_at = ? WHERE job_id = ? AND status = 'failed'").bind(stamp, stamp, row.job_id).run();
          row = await archiveJob(env.DB, record.id, record.revision);
        }
        return json(archiveView(row), 200, responseHeaders);
      }
      if (request.method === "GET" && url.pathname === "/api/tracker") {
        const season = url.searchParams.get("season") || "";
        if (!season.trim() || season.length > 80 || /[\u0000-\u001f\u007f]/.test(season)) throw failure(400, "invalid_season", "Choose a valid season.");
        const result = await env.DB.prepare(`SELECT kind, record FROM tracker_versions AS version
          WHERE season = ? AND revision = (SELECT MAX(revision) FROM tracker_versions AS newer WHERE newer.kind = version.kind AND newer.id = version.id)
          ORDER BY kind, id`).bind(season).all();
        const rows = result.results || [];
        return json({ sessions: rows.filter(row => row.kind === "session").map(unpack), curricula: rows.filter(row => row.kind === "curriculum").map(unpack), mode: "shared", requiresCode: Boolean(env.COACH_CODE) }, 200, responseHeaders);
      }
      if (request.method === "GET" && url.pathname === "/api/history") {
        const kind = url.searchParams.get("kind");
        const id = url.searchParams.get("id") || "";
        if (!["session", "curriculum"].includes(kind) || !ID.test(id)) throw failure(400, "invalid_record", "Choose a valid record history.");
        const result = await env.DB.prepare("SELECT revision, actor, saved_at, record FROM tracker_versions WHERE kind = ? AND id = ? ORDER BY revision DESC").bind(kind, id).all();
        return json((result.results || []).map(row => ({ revision: row.revision, actor: row.actor, savedAt: row.saved_at, record: unpack(row) })), 200, responseHeaders);
      }
      if (request.method === "POST" && ["/api/session", "/api/curriculum"].includes(url.pathname)) {
        if (!origin) throw failure(403, "origin_required", "Save through the configured Grindstone website.");
        if (env.COACH_CODE && !await codeMatches(request.headers.get("X-Coach-Code") || "", String(env.COACH_CODE))) throw failure(401, "coach_code_required", "Enter the coach editing code to save changes.");
        const operation = request.headers.get("X-Tracker-Operation") || "";
        if (!OPERATION.test(operation)) throw failure(400, "operation_required", "This save needs a unique operation identifier.");
        const supplied = await bodyJson(request);
        const kind = url.pathname.slice(5), saved = await save(env.DB, kind, supplied, operation);
        return json(kind === "session" ? await archiveAfterSave(env, saved) : saved.record, 200, responseHeaders);
      }
      throw failure(405, "method_not_allowed", "This operation is not available. Earlier records cannot be deleted.");
    } catch (error) {
      if (error.status) return json({ error: error.message, code: error.code, ...(error.current ? { current: error.current } : {}) }, error.status, responseHeaders);
      console.error("Tracker storage request failed", error instanceof Error ? error.message : "Unknown storage failure");
      return json({ error: "Shared storage could not complete this request. Keep your changes and retry; no local fallback was saved.", code: "storage_error" }, 503, responseHeaders);
    }
  }
};
