"use strict";
// Real SQLite executes the same SQL used by Cloudflare D1. No files are created.
const fs = require("node:fs"), path = require("node:path"), vm = require("node:vm"), assert = require("node:assert/strict");
const { pathToFileURL } = require("node:url");
const { DatabaseSync } = require("node:sqlite");
const root = path.resolve(__dirname, "..");
const ORIGIN = "http://localhost:50784", SEASON = "2026-2027";
let count = 0, nextOperation = 0;
function check(value, message) { assert.ok(value, message); count++; }
function equal(actual, expected, message) { assert.deepEqual(actual, expected, message); count++; }
function db() {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(fs.readFileSync(path.join(root, "tracker-api/schema.sql"), "utf8"));
  return {
    sqlite,
    prepare(sql) {
      let bindings = [];
      return {
        bind(...values) { bindings = values; return this; },
        async first() { return sqlite.prepare(sql).get(...bindings) || null; },
        async all() { return { results: sqlite.prepare(sql).all(...bindings) }; },
        async run() { const result = sqlite.prepare(sql).run(...bindings); return { success: true, meta: { changes: Number(result.changes) } }; }
      };
    }
  };
}
const fixture = extra => ({ id: "practice-one", season: SEASON, group: "blue", date: "2026-10-20", startTime: "18:00", location: "Westminster High School", author: "Thomas", lead: "Kyle", name: "Foundation review", status: "planned", skills: [{ id: "B01", title: "Stance", path: "#move/B01", category: "Neutral" }], actor: "Thomas", revision: 0, ...extra });
function browser(options = {}) {
  const local = new Map(Object.entries(options.local || {})), session = new Map(), locks = [];
  const storage = map => ({ getItem(key) { return map.has(key) ? map.get(key) : null; }, setItem(key, value) { map.set(key, value); } });
  const context = { console, URL, Date, Intl, Map, Set, JSON, TextEncoder, AbortController, setTimeout, clearTimeout, crypto: globalThis.crypto, localStorage: storage(local), sessionStorage: storage(session), navigator: { locks: { async request(name, fn) { locks.push(name); return fn(); } } }, fetch: options.fetch || (async () => { throw new Error("Offline"); }), GRINDSTONE_TRACKER_CONFIG: { endpoint: options.endpoint || "" } };
  context.window = context; vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, "tracker-model.js"), "utf8"), context);
  vm.runInContext(fs.readFileSync(path.join(root, "tracker-store.js"), "utf8"), context);
  return { store: context.GRINDSTONE_TRACKER_STORE, context, local, session, locks };
}
async function rejectsCode(operation, code) {
  await assert.rejects(operation, error => error.code === code); count++;
}

(async () => {
  const worker = (await import(pathToFileURL(path.join(root, "tracker-api/worker.mjs")))).default;
  const database = db(), env = { DB: database, ALLOWED_ORIGINS: ORIGIN + ",https://packetbench.github.io" };
  async function call(route, body, settings = {}) {
    const headers = { Origin: ORIGIN, ...(body !== undefined ? { "Content-Type": "application/json", "X-Tracker-Operation": settings.operation || "operation-test-" + String(++nextOperation).padStart(8, "0") } : {}), ...settings.headers };
    const response = await worker.fetch(new Request("https://tracker.example" + route, { method: settings.method || (body === undefined ? "GET" : "POST"), headers, ...(body === undefined ? {} : { body: typeof body === "string" ? body : JSON.stringify(body) }) }), settings.env || env);
    return { status: response.status, headers: response.headers, body: response.status === 204 ? null : await response.json() };
  }
  equal((await call("/api/tracker?season=" + SEASON, undefined, { env: { ALLOWED_ORIGINS: ORIGIN } })).status, 503, "Missing DB is explicit");
  const initial = await call("/api/tracker?season=" + SEASON);
  equal(initial.body, { sessions: [], curricula: [], mode: "shared", requiresCode: false }, "Public shared read");
  equal(initial.headers.get("Access-Control-Allow-Origin"), ORIGIN, "Allowed origin response");
  equal(initial.headers.get("Cache-Control"), "no-store", "Fresh shared reads");
  equal((await call("/api/tracker?season=" + SEASON, undefined, { headers: { Origin: "https://elsewhere.example" } })).status, 403, "Unconfigured origin blocked");
  equal((await call("/api/session", undefined, { method: "OPTIONS" })).status, 204, "Browser preflight");
  equal((await call("/api/session", "{broken")).body.code, "invalid_json", "Malformed JSON");
  equal((await call("/api/session", fixture(), { headers: { "Content-Type": "text/plain" } })).status, 415, "JSON-only input");
  equal((await call("/api/session", fixture(), { headers: { "X-Tracker-Operation": "short" } })).status, 400, "Idempotency key required");
  equal((await call("/api/session", fixture({ actor: "" }))).status, 400, "Editor name required");
  equal((await call("/api/session", fixture({ date: "2026-02-30" }))).status, 400, "Invalid date rejected");
  equal((await call("/api/session", fixture({ date: "2199-01-01", status: "completed" }))).status, 400, "Future completion rejected");
  equal((await call("/api/session", fixture({ skills: [{ id: "bad", title: "Bad", path: "javascript:alert(1)" }] }))).status, 400, "External executable guide URL rejected");
  equal((await call("/api/session", "x".repeat(256 * 1024 + 1))).status, 413, "Body byte cap is enforced without Content-Length");
  const first = await call("/api/session", fixture({ ignored: "field", savedAt: "1900-01-01" }), { operation: "repeat-first-save-1234" });
  equal(first.status, 200, "First save"); equal(first.body.revision, 1, "Server revision increments");
  check(!Object.hasOwn(first.body, "ignored") && first.body.savedAt !== "1900-01-01", "Only validated fields and server timestamp retained");
  const retry = await call("/api/session", fixture(), { operation: "repeat-first-save-1234" });
  equal(retry.body, first.body, "Ambiguous retry returns exact original save");
  equal((await call("/api/session", fixture({ name: "Changed" }), { operation: "repeat-first-save-1234" })).body.code, "operation_conflict", "Operation cannot save different data");
  const stale = await call("/api/session", fixture({ notes: "Stale edit" }));
  equal(stale.body.code, "revision_conflict", "Stale writes are rejected"); equal(stale.body.current.revision, 1, "Conflict includes latest revision");
  equal((await call("/api/session", fixture({ revision: 1, group: "black" }))).body.code, "identity_conflict", "Group identity immutable");
  equal((await call("/api/session", fixture({ revision: 1, season: "2027-2028" }))).body.code, "identity_conflict", "Season identity immutable");
  const finished = await call("/api/session", fixture({ revision: 1, status: "completed", actor: "Kyle", notes: "Reviewed stance; skipped the single leg." }));
  equal(finished.body.revision, 2, "Completed save is a revision");
  const raced = await Promise.all([call("/api/session", { ...finished.body, notes: "Coach A revision", actor: "Coach A" }), call("/api/session", { ...finished.body, notes: "Coach B revision", actor: "Coach B" })]);
  equal(raced.map(item => item.status).sort(), [200, 409], "Only one same-revision concurrent update wins");
  const latest = raced.find(item => item.status === 200).body;
  const cancelled = await call("/api/session", { ...latest, status: "cancelled", actor: "Kyle" });
  equal(cancelled.body.revision, 4, "Cancellation appends a revision");
  const history = await call("/api/history?kind=session&id=practice-one");
  equal(history.body.map(item => item.revision), [4, 3, 2, 1], "All revisions retained in order");
  equal(history.body[3].record.status, "planned", "Original plan preserved");
  equal(history.body[2].actor, "Kyle", "History records editor");
  equal((await call("/api/session", undefined, { method: "DELETE" })).status, 405, "No destructive endpoint");
  const listed = await call("/api/tracker?season=" + SEASON);
  equal(listed.body.sessions.length, 1, "Only latest revisions listed"); equal(listed.body.sessions[0].revision, 4, "Latest session listed");
  const curriculum = { id: "blue-2026", season: SEASON, group: "blue", skills: fixture().skills, actor: "Thomas", revision: 0 };
  equal((await call("/api/curriculum", curriculum)).body.revision, 1, "Curriculum stored");
  equal((await call("/api/tracker?season=" + SEASON)).body.curricula.length, 1, "Curriculum listed");
  const protectedEnv = { ...env, COACH_CODE: "example-test-code" };
  equal((await call("/api/tracker?season=" + SEASON, undefined, { env: protectedEnv })).body.requiresCode, true, "Optional protection advertised without exposing code");
  equal((await call("/api/session", fixture({ id: "protected" }), { env: protectedEnv })).status, 401, "Optional editing code enforced");
  equal((await call("/api/session", fixture({ id: "protected" }), { env: protectedEnv, headers: { "X-Coach-Code": "example-test-code" } })).status, 200, "Correct optional code permits save");
  const standalone = (await import(pathToFileURL(path.join(root, "tracker-api/bundle.mjs")))).default;
  const bundledResponse = await standalone.fetch(new Request("https://tracker.example/api/tracker?season=" + SEASON, { headers: { Origin: ORIGIN } }), env);
  equal(bundledResponse.status, 200, "Standalone dashboard bundle executes");

  const local = browser();
  equal((await local.store.load(SEASON)).mode, "local", "Unconfigured local preview is explicit");
  const saved = await local.store.saveSession(fixture()); equal(saved.revision, 1, "Local revision saved");
  equal((await local.store.saveSession(fixture())).revision, 1, "Local idempotent retry");
  check(local.locks.length > 0, "Web Locks coordinate local writes");
  await rejectsCode(() => local.store.saveSession(fixture({ notes: "Stale" })), "revision_conflict");
  const updated = await local.store.saveSession({ ...saved, status: "completed", actor: "Kyle" });
  equal(updated.revision, 2, "Local completion retains revision");
  equal((await local.store.history("session", saved.id)).length, 2, "Local history retained");
  equal((await local.store.load(SEASON)).sessions[0].revision, 2, "Local listing only latest revision");
  const corruptedSource = "not valid json";
  const corrupt = browser({ local: { "grindstone.tracker.v1": corruptedSource } });
  await rejectsCode(() => corrupt.store.saveSession(fixture()), "local_corrupt");
  equal(corrupt.local.get("grindstone.tracker.v1"), corruptedSource, "Corrupt storage preserved");
  const offline = browser({ endpoint: "https://tracker.example" });
  await rejectsCode(() => offline.store.load(SEASON), "network_error");
  await rejectsCode(() => offline.store.saveSession(fixture()), "network_error");
  equal(offline.local.size, 0, "Shared failure never creates local fallback records");
  let sentOperation = "", attempts = 0;
  const retryClient = browser({ endpoint: "https://tracker.example", fetch: async (url, options) => {
    const request = new Request(url, { ...options, headers: { ...options.headers, Origin: ORIGIN } });
    const response = await worker.fetch(request, env);
    if (++attempts === 1) { sentOperation = options.headers["X-Tracker-Operation"]; throw new Error("Response lost after DB save"); }
    equal(options.headers["X-Tracker-Operation"], sentOperation, "Client retains operation for ambiguous retry");
    return response;
  } });
  const ambiguous = fixture({ id: "response-lost" });
  await rejectsCode(() => retryClient.store.saveSession(ambiguous), "network_error");
  equal((await retryClient.store.saveSession(ambiguous)).revision, 1, "Lost response retry does not duplicate revision");
  const shared = browser({ endpoint: "https://tracker.example/api", fetch: (url, options) => worker.fetch(new Request(url, { ...options, headers: { ...options.headers, Origin: ORIGIN } }), protectedEnv) });
  equal((await shared.store.load(SEASON)).requiresCode, true, "Client surfaces optional protection");
  await rejectsCode(() => shared.store.saveSession(fixture({ id: "client-protected" })), "coach_code_required");
  shared.store.setCode("example-test-code");
  equal((await shared.store.saveSession(fixture({ id: "client-protected" }))).revision, 1, "Memory-only coach code works");
  check(!JSON.stringify([...shared.local, ...shared.session]).includes("example-test-code"), "Coach code is not persisted");
  equal((await shared.store.history("session", "client-protected")).length, 1, "Shared history client works");
  database.sqlite.close();
  console.log(count + " tracker storage/API checks passed");
})().catch(error => { console.error(error); process.exitCode = 1; });
