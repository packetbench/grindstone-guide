/* Shared tracker transport; local preview is explicit and never a network fallback. */
(function (root) {
  "use strict";
  const model = root.GRINDSTONE_TRACKER_MODEL;
  const LOCAL_KEY = "grindstone.tracker.v1";
  const PENDING_KEY = "grindstone.tracker.pending.v1";
  const MAX_BYTES = 256 * 1024;
  const pending = new Map();
  let coachCode = "", restoredPending = false;
  const copy = value => JSON.parse(JSON.stringify(value));
  function problem(message, code, status, extra = {}) { return Object.assign(new Error(message), { code, status, ...extra }); }
  function today() {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
    return ["year", "month", "day"].map(type => parts.find(part => part.type === type).value).join("-");
  }
  function clean(kind, raw, writing = false) {
    const result = kind === "session" ? model.cleanSession(raw, writing ? { today: today() } : {}) : model.cleanCurriculum(raw);
    if (writing && !result.actor) throw problem("Enter your name before saving a change.", "invalid_record", 400);
    if (!writing) {
      if (result.revision < 1) throw problem("This saved record has an invalid revision.", "invalid_response", 502);
      if (typeof raw.savedAt !== "string" || !/^\d{4}-\d{2}-\d{2}T/.test(raw.savedAt) || !Number.isFinite(Date.parse(raw.savedAt))) throw problem("This saved record has an invalid timestamp.", "invalid_response", 502);
      result.savedAt = raw.savedAt;
    }
    return result;
  }
  function endpoint() {
    const configured = root.GRINDSTONE_TRACKER_CONFIG?.endpoint;
    if (configured == null || configured === "") return "";
    if (typeof configured !== "string") throw problem("The shared tracker address is not configured correctly.", "invalid_config", 503);
    let url;
    try { url = new URL(configured); } catch (_) { throw problem("The shared tracker address is invalid.", "invalid_config", 503); }
    if (url.username || url.password || url.search || url.hash || !(url.protocol === "https:" || url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))) throw problem("Use an HTTPS shared tracker address.", "invalid_config", 503);
    return url.href.replace(/\/+$/, "").replace(/\/api$/, "");
  }
  function seasonValue(value) {
    if (typeof value !== "string" || !value.trim() || value.length > 80 || /[\u0000-\u001f\u007f]/.test(value)) throw problem("Choose a valid season.", "invalid_season", 400);
    return value;
  }
  function restorePending() {
    if (restoredPending) return;
    restoredPending = true;
    try {
      const saved = JSON.parse(root.sessionStorage?.getItem(PENDING_KEY) || "[]");
      if (Array.isArray(saved)) for (const pair of saved.slice(-100)) if (Array.isArray(pair) && typeof pair[0] === "string" && /^[A-Za-z0-9_-]{16,100}$/.test(pair[1])) pending.set(pair[0], pair[1]);
    } catch (_) { /* This optional retry cache is not the record store. */ }
  }
  function operation(key) {
    restorePending();
    if (!pending.has(key)) {
      const identifier = root.crypto?.randomUUID ? root.crypto.randomUUID() : "save-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
      pending.set(key, identifier);
      while (pending.size > 100) pending.delete(pending.keys().next().value);
      try { root.sessionStorage?.setItem(PENDING_KEY, JSON.stringify([...pending])); } catch (_) { /* Saving still works without a reload-persistent retry cache. */ }
    }
    return pending.get(key);
  }
  async function request(base, path, record, op) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const options = { method: record ? "POST" : "GET", headers: {}, signal: controller.signal, credentials: "omit", cache: "no-store" };
      if (record) {
        options.headers["Content-Type"] = "application/json";
        options.headers["X-Tracker-Operation"] = op;
        if (coachCode) options.headers["X-Coach-Code"] = coachCode;
        options.body = JSON.stringify(record);
      }
      const response = await root.fetch(base + path, options);
      let data;
      try { data = await response.json(); }
      catch (_) { throw problem("Shared storage returned an unreadable response. Keep your changes and retry.", "invalid_response", response.status || 502); }
      if (!response.ok) throw problem(typeof data.error === "string" ? data.error : "The shared tracker could not save this change.", data.code || "request_failed", response.status, { current: data.current });
      return data;
    } catch (error) {
      if (typeof error.code === "string" && typeof error.status === "number") throw error;
      throw problem("The shared tracker could not be reached. Your changes have not been saved locally; keep them open and retry.", "network_error", 0, { retryable: true });
    } finally { clearTimeout(timer); }
  }
  function readLocal() {
    let source;
    try { source = root.localStorage.getItem(LOCAL_KEY); }
    catch (_) { throw problem("This browser is blocking local preview storage. Enable browser storage or connect shared storage.", "local_unavailable", 503); }
    if (source == null) return { source: null, value: { version: 1, entries: [] } };
    try {
      const value = JSON.parse(source);
      if (!value || value.version !== 1 || !Array.isArray(value.entries) || value.entries.length > 100000) throw new Error("Unsupported local data");
      const keys = new Set(), ops = new Set();
      for (const item of value.entries) {
        if (!item || !["session", "curriculum"].includes(item.kind) || !item.record || !Number.isSafeInteger(item.record.revision) || item.record.revision < 1 || typeof item.operation !== "string" || typeof item.request !== "string") throw new Error("Invalid local revision");
        clean(item.kind, item.record);
        const key = item.kind + ":" + item.record.id + ":" + item.record.revision;
        if (keys.has(key) || ops.has(item.operation)) throw new Error("Duplicate local revision");
        keys.add(key); ops.add(item.operation);
      }
      return { source, value };
    } catch (_) { throw problem("Local tracker records could not be read. They have been preserved unchanged; export or recover browser storage before resetting anything.", "local_corrupt", 500); }
  }
  function latestEntries(entries) {
    const values = new Map();
    for (const item of entries) {
      const key = item.kind + ":" + item.record.id;
      if (!values.has(key) || values.get(key).record.revision < item.record.revision) values.set(key, item);
    }
    return [...values.values()];
  }
  async function localSave(kind, record, op, key) {
    const write = () => {
      const storage = readLocal();
      const oldOperation = storage.value.entries.find(item => item.operation === op);
      if (oldOperation) {
        if (oldOperation.request !== key) throw problem("This save identifier already belongs to another change.", "operation_conflict", 409);
        return clean(kind, oldOperation.record);
      }
      const old = latestEntries(storage.value.entries).find(item => item.kind === kind && item.record.id === record.id)?.record;
      if ((old?.revision || 0) !== record.revision) throw problem("A newer version exists. Reload it before applying your changes.", "revision_conflict", 409, { current: old });
      if (old && (old.group !== record.group || old.season !== record.season)) throw problem("A saved record must keep its original group and season. Create another scheduled practice instead.", "identity_conflict", 409, { current: old });
      const saved = { ...record, revision: record.revision + 1, savedAt: new Date().toISOString() };
      storage.value.entries.push({ kind, operation: op, request: key, record: saved });
      try {
        if (root.localStorage.getItem(LOCAL_KEY) !== storage.source) throw problem("Another tab changed the local tracker. Reload before trying again.", "revision_conflict", 409);
        root.localStorage.setItem(LOCAL_KEY, JSON.stringify(storage.value));
      } catch (error) {
        if (error.code === "revision_conflict") throw error;
        throw problem("The browser could not store this change. Existing local records are unchanged; free space or export a backup before trying again.", "local_write_failed", 507);
      }
      return copy(saved);
    };
    if (root.navigator?.locks?.request) return root.navigator.locks.request("grindstone-tracker-write", write);
    return write();
  }
  async function save(kind, raw) {
    const record = clean(kind, raw, true);
    const encoded = JSON.stringify(record);
    if (new TextEncoder().encode(encoded).byteLength > MAX_BYTES) throw problem("This practice record is too large to save. Use a smaller practice snapshot.", "too_large", 413);
    const base = endpoint(), key = base + "\n" + kind + "\n" + encoded, op = operation(key);
    if (base) return clean(kind, await request(base, "/api/" + kind, record, op));
    return localSave(kind, record, op, key);
  }
  async function load(season) {
    seasonValue(season);
    const base = endpoint();
    if (base) {
      const data = await request(base, "/api/tracker?season=" + encodeURIComponent(season));
      if (!data || data.mode !== "shared" || !Array.isArray(data.sessions) || !Array.isArray(data.curricula)) throw problem("Shared storage returned an invalid tracker listing.", "invalid_response", 502);
      return { sessions: data.sessions.map(raw => clean("session", raw)), curricula: data.curricula.map(raw => clean("curriculum", raw)), mode: "shared", requiresCode: Boolean(data.requiresCode) };
    }
    const entries = latestEntries(readLocal().value.entries).filter(item => item.record.season === season);
    return { sessions: entries.filter(item => item.kind === "session").map(item => clean("session", item.record)), curricula: entries.filter(item => item.kind === "curriculum").map(item => clean("curriculum", item.record)), mode: "local", requiresCode: false };
  }
  async function history(kind, id) {
    if (!["session", "curriculum"].includes(kind) || typeof id !== "string" || !/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,99}$/.test(id)) throw problem("Choose a valid record history.", "invalid_record", 400);
    const base = endpoint();
    if (base) {
      const data = await request(base, "/api/history?kind=" + kind + "&id=" + encodeURIComponent(id));
      if (!Array.isArray(data)) throw problem("Shared storage returned an invalid revision history.", "invalid_response", 502);
      return data.map(item => { const record = clean(kind, item.record); return { revision: record.revision, actor: record.actor, savedAt: record.savedAt, record }; });
    }
    return readLocal().value.entries.filter(item => item.kind === kind && item.record.id === id).sort((a, b) => b.record.revision - a.record.revision).map(item => ({ revision: item.record.revision, actor: item.record.actor, savedAt: item.record.savedAt, record: clean(kind, item.record) }));
  }
  const api = Object.freeze({ load, saveSession: record => save("session", record), saveCurriculum: record => save("curriculum", record), history, setCode(value) { coachCode = typeof value === "string" ? value : ""; } });
  root.GRINDSTONE_TRACKER_STORE = api;
  if (typeof window !== "undefined") window.GRINDSTONE_TRACKER_STORE = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
