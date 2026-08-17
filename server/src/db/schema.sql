-- SQLite Schema for Offline Coding Practice Platform

CREATE TABLE IF NOT EXISTS problems (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK(difficulty IN ('Easy', 'Medium', 'Hard')),
  tags TEXT NOT NULL, -- JSON array
  statement_md TEXT NOT NULL,
  constraints TEXT NOT NULL, -- JSON array
  examples TEXT NOT NULL, -- JSON array
  starter_code TEXT NOT NULL, -- JSON object {python: "...", javascript: "..."}
  test_cases TEXT NOT NULL, -- JSON array [{input, expected_output, hidden, explanation}]
  reference_solution TEXT NOT NULL, -- JSON object {python: "...", javascript: "..."}
  hints TEXT NOT NULL, -- JSON array
  time_limit_ms INTEGER DEFAULT 2000,
  memory_limit_mb INTEGER DEFAULT 128,
  editorial_md TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Full-Text Search Virtual Table
CREATE VIRTUAL TABLE IF NOT EXISTS problems_fts USING fts5(
  slug UNINDEXED,
  title,
  statement_md,
  tags,
  tokenize='porter unicode61'
);

-- Triggers for FTS5 Synchronization
CREATE TRIGGER IF NOT EXISTS problems_ai AFTER INSERT ON problems BEGIN
  INSERT INTO problems_fts(rowid, slug, title, statement_md, tags)
  VALUES (new.id, new.slug, new.title, new.statement_md, new.tags);
END;

CREATE TRIGGER IF NOT EXISTS problems_ad AFTER DELETE ON problems BEGIN
  INSERT INTO problems_fts(problems_fts, rowid, slug, title, statement_md, tags)
  VALUES ('delete', old.id, old.slug, old.title, old.statement_md, old.tags);
END;

CREATE TRIGGER IF NOT EXISTS problems_au AFTER UPDATE ON problems BEGIN
  INSERT INTO problems_fts(problems_fts, rowid, slug, title, statement_md, tags)
  VALUES ('delete', old.id, old.slug, old.title, old.statement_md, old.tags);
  INSERT INTO problems_fts(rowid, slug, title, statement_md, tags)
  VALUES (new.id, new.slug, new.title, new.statement_md, new.tags);
END;

-- Submissions History
CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  problem_slug TEXT NOT NULL,
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Memory Limit Exceeded')),
  runtime_ms REAL DEFAULT 0,
  memory_kb REAL DEFAULT 0,
  test_cases_passed INTEGER NOT NULL DEFAULT 0,
  total_test_cases INTEGER NOT NULL DEFAULT 0,
  error_message TEXT DEFAULT '',
  results_json TEXT DEFAULT '[]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (problem_slug) REFERENCES problems(slug) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_submissions_slug ON submissions(problem_slug);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);

-- Spaced Repetition (SuperMemo-2 Algorithm)
CREATE TABLE IF NOT EXISTS spaced_repetition (
  problem_slug TEXT PRIMARY KEY,
  interval_days INTEGER DEFAULT 1,
  repetition_count INTEGER DEFAULT 0,
  ease_factor REAL DEFAULT 2.5,
  last_reviewed_at DATETIME,
  next_review_at DATETIME,
  flagged_review INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (problem_slug) REFERENCES problems(slug) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sr_next_review ON spaced_repetition(next_review_at);
CREATE INDEX IF NOT EXISTS idx_sr_flagged ON spaced_repetition(flagged_review);

-- Daily Activity tracking for Heatmaps and Streaks
CREATE TABLE IF NOT EXISTS daily_activity (
  date TEXT PRIMARY KEY, -- YYYY-MM-DD
  submission_count INTEGER DEFAULT 0,
  solved_count INTEGER DEFAULT 0
);

-- Problem Markdown Notes & Scratchpad
CREATE TABLE IF NOT EXISTS problem_notes (
  problem_slug TEXT PRIMARY KEY,
  notes_md TEXT DEFAULT '',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (problem_slug) REFERENCES problems(slug) ON DELETE CASCADE
);
