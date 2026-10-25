import "../tracker-model.js";

const MAX_BYTES = 256 * 1024;
const API_PATHS = new Set(["/api/tracker", "/api/session", "/api/curriculum", "/api/history"]);
const ID = /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,99}$/;
const OPERATION = /^[a-zA-Z0-9_-]{16,100}$/;
const model = globalThis.GRINDSTONE_TRACKER_MODEL;

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
  if (earlier) return replay(earlier, requestHash);
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
    if (duplicate) return replay(duplicate, requestHash);
    throw error;
  }
  if (!result.meta || Number(result.meta.changes) !== 1) {
    const duplicate = await byOperation(db, operation);
    if (duplicate) return replay(duplicate, requestHash);
    const current = await latest(db, kind, record.id);
    const changedIdentity = current && (current.season !== record.season || current.group !== record.group);
    throw failure(409, changedIdentity ? "identity_conflict" : "revision_conflict", changedIdentity ? "A saved record must keep its original group and season. Create another scheduled practice instead." : "Someone saved a newer version. Reload it before applying your changes.", { current });
  }
  return saved;
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
        return json(await save(env.DB, url.pathname.slice(5), supplied, operation), 200, responseHeaders);
      }
      throw failure(405, "method_not_allowed", "This operation is not available. Earlier records cannot be deleted.");
    } catch (error) {
      if (error.status) return json({ error: error.message, code: error.code, ...(error.current ? { current: error.current } : {}) }, error.status, responseHeaders);
      console.error("Tracker storage request failed", error instanceof Error ? error.message : "Unknown storage failure");
      return json({ error: "Shared storage could not complete this request. Keep your changes and retry; no local fallback was saved.", code: "storage_error" }, 503, responseHeaders);
    }
  }
};
