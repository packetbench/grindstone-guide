-- Append-only records. Every edit, cancellation and completed-practice correction
-- creates a revision; no endpoint deletes an earlier record.
CREATE TABLE IF NOT EXISTS tracker_versions (
  kind TEXT NOT NULL CHECK (kind IN ('session', 'curriculum')),
  id TEXT NOT NULL,
  revision INTEGER NOT NULL CHECK (revision > 0),
  season TEXT NOT NULL,
  group_id TEXT NOT NULL,
  actor TEXT NOT NULL,
  saved_at TEXT NOT NULL,
  operation_id TEXT NOT NULL UNIQUE,
  request_hash TEXT NOT NULL,
  record TEXT NOT NULL CHECK (json_valid(record)),
  PRIMARY KEY (kind, id, revision)
);
CREATE INDEX IF NOT EXISTS tracker_season_latest
  ON tracker_versions (season, kind, id, revision DESC);
