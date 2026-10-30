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

The database and Worker named `grindstone-tracker-preview` now serve the shared
tracker at `https://grindstone-tracker-preview.tjschne2.workers.dev`. The resource
name is retained from setup; the site configuration uses it for shared records.
The Worker was deployed on October 25, 2026 through the official Wrangler CLI,
version `169df08a-0096-4eba-b6d1-f8d781db660e`. The existing `DB` binding and exact
allowed origins were preserved. `GET /api/tracker` returned HTTP 200 and shared
mode; the public-site CORS preflight returned HTTP 204.

Browser verification used the separate `Release QA 2026-10-25` season, without
changing real season records. A scheduled plan snapshot, confirmed skills and
editable expectations appeared in both the in-app browser and Chrome. A dated
correction and restoration retained all four session revisions without inflating
coverage counts. The same flow was checked at a 390 by 844 phone viewport.
Local preview records were not automatically migrated. Full-database disaster
recovery has not been exercised; the procedure below remains a recovery guide.

Use `wrangler.jsonc` for later CLI deployments. It includes only public resource
IDs and allowed origins; keep login credentials and API tokens outside this
repository. Deploy the self-contained bundle with `--no-bundle --keep-vars` and
an explicitly preflighted `--outdir`. The existing free account options suffice;
this implementation does not require a paid plan or Google Drive integration.

## Optional edit protection

The selected configuration leaves `COACH_CODE` unset. If coaches later choose a
shared editing code, add a code-entry interface first, then add the code as a
**Worker secret**, never as a public site variable. The current tracker UI does
not provide a code-entry field; enabling the secret now would block its saves.
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

## Backup and recovery procedure

These are documented administrator procedures, not a claim that a cloud export
or restore has been tested. The app's **History → Review this version → Save**
restores an individual record by appending another revision. Use that for an
ordinary correction; earlier versions remain available.

For a database backup, an authorized administrator should:

1. Arrange a quiet interval with coaches. Export can briefly block D1 requests.
   Choose a dated output in a preflighted backup folder outside the published
   website and Git repository; do not overwrite an earlier backup.
2. Export the full schema and data with Wrangler:
   `wrangler d1 export grindstone-tracker-preview --remote --output="ABSOLUTE_BACKUP_PATH.sql"`.
   Replace the placeholder with the approved full path. Keep **all** rows of
   `tracker_versions`, including operation IDs, hashes and historical revisions.
   An API listing of latest records is not a complete backup.
3. Record the database ID, UTC export time, deployed code revision, file SHA-256,
   and the following counts alongside the export. Retain prior backups. Agree an
   owner and cadence before the tracker becomes the season's shared record.

```sql
SELECT kind, season, group_id, COUNT(*) AS revisions,
       COUNT(DISTINCT id) AS records
FROM tracker_versions
GROUP BY kind, season, group_id
ORDER BY kind, season, group_id;
```

Cloudflare documents SQL export/import through Wrangler; a raw `.sqlite3` file is
not directly importable. [D1 import/export guide](https://developers.cloudflare.com/d1/best-practices/import-export-data/)

Test recovery in a **separate empty database**, never by importing over the active
one. Import using `wrangler d1 execute RECOVERY_DATABASE --remote --file="ABSOLUTE_BACKUP_PATH.sql"`.
Compare every stored field in `kind, id, revision` order, plus the counts above;
then check representative completed records, curricula and histories through an
isolated Worker binding. Confirm the largest saved practice also restores. D1's
SQL statement limit is 100 KB while this app accepts JSON records up to 256 KiB;
a large snapshot may therefore need a restore routine using bound parameters
instead of one oversized SQL literal. Do not truncate records or declare an
untested export recoverable. [D1 limits](https://developers.cloudflare.com/d1/platform/limits/)

For a whole-database incident, preserve the current export and record its recovery
bookmark before any rollback. Cloudflare Time Travel is automatic, with **7 days
on Free and 30 days on Paid** under the current limits. It overwrites the database
in place and cancels in-flight work. Obtain approval for the exact recovery point,
pause edits, and reconcile legitimate work after that point before resuming.
It is a short recovery window, not a season archive. [Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/), [plan limits](https://developers.cloudflare.com/d1/platform/limits/)

The tracker has no bulk export/import UI yet. Opening a saved plan in the builder
and exporting its JSON preserves that **plan**, not the session, curriculum or
revision history. Google Drive archiving is a separate, optional connection described
below; it is not a full database backup. Connecting
the shared endpoint does not migrate local preview records: identify any real
records to carry forward, preserve the local original, and review a deliberate
transfer. Do not automatically upload test seasons or overwrite shared history.

## Automatic completed-practice archive

Enabled October 30, 2026 after release approval. The additive migration and both
indexes were applied to the existing D1 database. Worker version
`20e945c6-d8b2-4352-beef-754332da0a21` preserves the existing DB binding and allowed
origins. Its connection secret matches the Google Script Property; it is not in
the repository. Public status reports enabled, authenticated queue access returns
the intended folder, and the owner-run Google function completed successfully
against that empty queue. The Triggers page confirms exactly one time-driven
`archiveCompletedPractices` trigger with an **Every 5 minutes** interval.

All ten current-season practices were still planned at activation. No teaching
records were changed to manufacture a test. The first genuine completed-practice
PDF/JSON copy and its actual Google PDF layout remain to be verified. Passing
mocked tests and a successful empty-queue run do not prove that file round trip.

After a coach confirms a shared practice as completed, the Worker queues that
exact saved revision. Only consecutive numeric seasons such as `2026-2027` are
eligible; named QA seasons and browser-local records are excluded. There is no
automatic historical backfill. Corrections produce new files and retain earlier
revisions. A Drive failure never rolls back the teaching record in D1.

The owner-run Apps Script checks the queue approximately every five minutes and
saves a printable PDF plus JSON in the selected **Practices** folder:
`1nH6QOx1E0mTWGiRg9MroZ6iJX9PQuXK_`. The JSON includes the original builder snapshot,
confirmed skills and tracker metadata; where a builder plan exists, it can be
imported into the builder. No-plan records use a distinct tracker export format.
Neither the script nor the website changes Drive sharing. The folder is restricted;
a public tracker link does not grant access to its Drive files.

For a fresh connection, after review and publication approval, configure it in
this order:

1. Keep `DRIVE_ARCHIVE_ENABLED` unset or `false`. Apply the additive `archive.sql`
   migration to the existing D1 database. Do not replace the database or its history.
2. In an owner-controlled Google Apps Script project, load `tracker-archive.js`
   followed by `drive-archive/archive.gs`. Use `drive-archive/appsscript.json`,
   including the Advanced Drive v3 service. The staged project is named
   `grindstone-practice-archive` under the folder owner's Google account.
3. Have the owner authorize the script and run `checkDriveFolder`. Google requests
   broad Drive access, external requests and trigger access; it is not a
   folder-scoped grant, even though this implementation uses one fixed folder.
   There is no public web-app deployment or public privileged upload endpoint.
4. Generate a strong random connection key through a secure administrator workflow.
   Set the identical value as the Worker secret `DRIVE_ARCHIVE_KEY` and an Apps
   Script property of that name. Never commit it, log it, include it in a URL or
   put it in browser/site configuration.
5. Rebuild and deploy the reviewed Worker while preserving its DB binding and
   exact allowed origins. Set `DRIVE_ARCHIVE_ENABLED=true`. Run
   `installArchiveTrigger` once; it verifies the connection and creates at most
   one five-minute trigger. Verify the trigger in Google rather than assuming
   that authorization created it.
6. Verify a genuine completed practice, or an explicitly isolated integration-test
   deployment/folder. Do not manufacture a completed real-season teaching record.
   Check both resulting files, PDF layout, JSON import, correct revision and the
   tracker links. Repeat processing to verify it reuses the existing pair.
7. Publish the reviewed front end. Until the connection is enabled, it reports
   that Drive setup is pending. Distinguish an enabled connection from a verified
   successful PDF/JSON copy until the real file round trip has been checked.

The queue uses fixed destination checks, full-record hashes and immutable file
metadata. A retry reconciles an existing PDF/JSON pair instead of duplicating it;
an unrelated or conflicting file is preserved and reported for review. Failed jobs
back off and stop after five attempts. The tracker offers a named-coach retry.
An Apps Script execution failure also appears in its execution history. Turning
off `DRIVE_ARCHIVE_ENABLED` stops queue access without deleting tracker records,
archive jobs or Drive files. Old copies are retained if a later revision cancels
or corrects a practice; consult the tracker for current status.

Archive contracts:

- Public `GET /api/archive/status?season=...` returns status and validated Drive links.
- Browser `POST /api/archive/retry` accepts only session ID, revision and actor.
- Service-only `GET /api/archive/queue?limit=3` and `POST /api/archive/ack` require
  the connection key as a bearer token. They do not accept destination overrides.

Run `tools/tracker-api-check.js`, `tools/tracker-ui-check.js`,
`tools/tracker-archive-store-check.js`, `tools/tracker-archive-check.js` and
`tools/drive-archive-check.js` with Node. The Google service tests are mocked and
make no Drive writes. Real authorization, conversion and upload require the
separate integration check above.

## Alternative when the dashboard editor is unavailable

The supported alternative is Wrangler deployment of the existing module, using
normal Cloudflare authentication. Prepare and review a configuration referencing
`bundle.mjs`, the existing Worker name, compatibility date, **existing** D1 database
ID bound as `DB`, and the exact `ALLOWED_ORIGINS`. Include `keep_vars: true` when
preserving dashboard variables. Do not omit the database ID or assume a CLI deploy
will retain dashboard bindings without configuration. Run a dry-run first; deploy
only the reviewed target. No new website project or replacement database is needed.
[Wrangler deployment](https://developers.cloudflare.com/workers/wrangler/commands/workers/), [configuration and D1 bindings](https://developers.cloudflare.com/workers/wrangler/configuration/)

The official Upload Worker Module API also accepts the bundle with multipart
metadata. It requires an authorized API token and explicit module/binding metadata;
browser session extraction is unnecessary. Wrangler is the simpler fallback here.
Neither fallback has been authenticated or executed as part of this documentation
update. [Upload API](https://developers.cloudflare.com/api/resources/workers/subresources/scripts/methods/update/)

Implementation references checked October 25, 2026:

- [D1 prepared statements and bound parameters](https://developers.cloudflare.com/d1/worker-api/prepared-statements/)
- [Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [D1 local development](https://developers.cloudflare.com/d1/best-practices/local-development/)
- [D1 import and export](https://developers.cloudflare.com/d1/best-practices/import-export-data/)
