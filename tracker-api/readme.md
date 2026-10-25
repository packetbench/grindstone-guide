# Shared practice tracker storage

The guide remains a static GitHub Pages site. This Worker stores group practice
sessions and season skill lists in D1. Public visitors can read the tracker.
Editors enter their name; there is no sign-in or verified identity in the
name-only configuration. Do not store individual athlete, medical, attendance,
or caregiver information here.

## Files and setup

1. Create an isolated D1 database for review. Run `schema.sql` in its console.
2. Create a module Worker. Add a D1 binding named `DB` pointing to that database.
3. Run `node tools/build-tracker-worker.js` from the guide root. Paste the whole
   generated `tracker-api/bundle.mjs` into the Worker editor. The bundle includes
   the shared validation model and has no package imports.
4. Add a plain-text Worker variable `ALLOWED_ORIGINS`, with comma-separated exact
   origins. For the current preview this is:
   `https://packetbench.github.io,http://localhost:50784,http://127.0.0.1:50784`.
   Update this list if the preview uses a different port. There are no wildcard
   origins. An origin controls which browser pages may call the service; it is
   not user authentication.
5. Set `window.GRINDSTONE_TRACKER_CONFIG = {endpoint: "https://YOUR-WORKER.workers.dev"}`
   before loading `tracker-store.js`. Load `tracker-model.js` before that store.
6. Verify `GET /api/tracker?season=2026-2027` and complete a test practice in the
   preview. Use a test season so test entries stay separate from real records.
   Publishing the guide still follows its ordinary review/approval process.

The root agent created the isolated preview database `grindstone-tracker-preview`
on October 25, 2026. Keep setup credentials and API tokens outside this repository.
Use the existing free account options; this implementation does not require a
paid plan or Google Drive integration.

## Optional edit protection

The selected configuration leaves `COACH_CODE` unset. If coaches later choose a
shared editing code, add it as a **Worker secret**, never as a public site variable.
The listing returns `requiresCode: true` without revealing the secret. The browser
sends an entered code only in the save request and keeps it in memory, not browser
storage. Public reading remains available. A shared code is not individual
identity verification or a substitute for separate accounts when those are needed.

## Data contract and history

- `GET /api/tracker?season=...` returns `{sessions,curricula,mode:'shared',requiresCode}`.
- `POST /api/session` and `POST /api/curriculum` accept a model-validated record.
  `revision` is the version the editor started from, or zero for a new record.
  `actor` is the editor's typed name. Send a unique `X-Tracker-Operation` identifier
  for a save attempt and retain it when retrying that same attempt.
- A successful save returns the cleaned record with `revision + 1` and a server
  UTC `savedAt`. The session date is the practice's local calendar date. Future
  completed sessions are rejected using the America/New_York calendar.
- `GET /api/history?kind=session&id=...` returns revisions newest first. Use
  `kind=curriculum` for a season skill-list history.

Each change appends one row. A single conditional SQLite insert checks the current
revision and prevents group or season reassignment of an existing record. Conflicts
return HTTP 409 plus the current record; the editor should reload and reconcile.
Repeating the same operation returns its original saved revision, including when
the first response was lost. Reusing an operation for different data is rejected.
There is no delete endpoint. Corrections and cancellations retain prior revisions.

JSON requests are limited to 256 KiB. Snapshots, dates, skills, group identifiers,
names and internal guide links are validated server-side. The browser repeats
validation for useful feedback; it is not the trust boundary. SQL uses bound
parameters. All reads and writes bypass HTTP caches. Missing database bindings,
network failures and malformed storage produce explicit errors.

## Local preview behavior

An empty endpoint uses this browser's local storage and reports `mode:'local'`.
These records are not shared with other devices or automatically uploaded when an
endpoint is added. A configured shared endpoint that fails **never falls back to
local storage**. Keep the editing form open and retry the same save.

Local revisions use one versioned storage document and Web Locks when available.
Browsers without Web Locks receive an additional pre-write comparison, but that
fallback is not a cross-device database. Unreadable local data is preserved; the
store does not reset or silently replace it. The optional tab-local retry cache
contains operation IDs, never the coach code.

## Validation and maintenance

Run `node tools/build-tracker-worker.js` and then `node tools/tracker-api-check.js`.
The checks use Node's in-memory SQLite to execute the actual D1 SQL, plus browser
transport tests for revisions, races, idempotency, validation, retained history,
optional editing codes and failure behavior. Rebuild and redeploy the bundle after
changing either `tracker-model.js` or `tracker-api/worker.mjs`.

The website's completed-plan export and a future Drive archive are distinct from
the authoritative database. Keep periodic D1 exports as database backups; do not
replace historical rows with edited export files. Verify account limits and
storage usage as the program grows. Do not remove test-season history from an
active database without an explicit administrative decision.

Implementation references checked October 25, 2026:

- [D1 prepared statements and bound parameters](https://developers.cloudflare.com/d1/worker-api/prepared-statements/)
- [Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [D1 local development](https://developers.cloudflare.com/d1/best-practices/local-development/)
- [D1 import and export](https://developers.cloudflare.com/d1/best-practices/import-export-data/)
