-- Additive migration only. Existing tracker revisions are never changed.
CREATE TABLE IF NOT EXISTS tracker_archives (
  job_id TEXT NOT NULL UNIQUE,
  session_id TEXT NOT NULL,
  revision INTEGER NOT NULL CHECK (revision > 0),
  season TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'archived', 'failed')),
  record_hash TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  next_attempt_at TEXT NOT NULL,
  pdf_file_id TEXT NOT NULL DEFAULT '',
  json_file_id TEXT NOT NULL DEFAULT '',
  error TEXT NOT NULL DEFAULT '',
  last_operation_id TEXT NOT NULL DEFAULT '',
  last_operation_hash TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (session_id, revision)
);
CREATE INDEX IF NOT EXISTS tracker_archive_due
  ON tracker_archives (status, next_attempt_at, created_at);
CREATE INDEX IF NOT EXISTS tracker_archive_season
  ON tracker_archives (season, session_id, revision);
