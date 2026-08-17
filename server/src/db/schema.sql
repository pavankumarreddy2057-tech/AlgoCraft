-- SQLite Schema for AlgoCraft V2 Platform

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  target_role TEXT DEFAULT 'Software Engineer',
  score INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_active_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_score ON users(score);

-- 2. OTP Verifications Table
CREATE TABLE IF NOT EXISTS otp_verifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  otp_hash TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  attempts INTEGER DEFAULT 0,
  consumed INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_otp_email ON otp_verifications(email);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_verifications(expires_at);

-- 3. Problems Table
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

-- 4. Submissions History
CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL DEFAULT 1,
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
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (problem_slug) REFERENCES problems(slug) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_slug ON submissions(problem_slug);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);

-- 5. Spaced Repetition (SuperMemo-2 Algorithm)
CREATE TABLE IF NOT EXISTS spaced_repetition (
  user_id INTEGER NOT NULL DEFAULT 1,
  problem_slug TEXT NOT NULL,
  interval_days INTEGER DEFAULT 1,
  repetition_count INTEGER DEFAULT 0,
  ease_factor REAL DEFAULT 2.5,
  last_reviewed_at DATETIME,
  next_review_at DATETIME,
  flagged_review INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, problem_slug),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (problem_slug) REFERENCES problems(slug) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sr_user_next_review ON spaced_repetition(user_id, next_review_at);
CREATE INDEX IF NOT EXISTS idx_sr_flagged ON spaced_repetition(user_id, flagged_review);

-- 6. Daily Activity Tracking
CREATE TABLE IF NOT EXISTS daily_activity (
  user_id INTEGER NOT NULL DEFAULT 1,
  date TEXT NOT NULL, -- YYYY-MM-DD
  submission_count INTEGER DEFAULT 0,
  solved_count INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, date),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_activity_user_date ON daily_activity(user_id, date);

-- 7. Problem Markdown Notes & Scratchpad
CREATE TABLE IF NOT EXISTS problem_notes (
  user_id INTEGER NOT NULL DEFAULT 1,
  problem_slug TEXT NOT NULL,
  notes_md TEXT DEFAULT '',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, problem_slug),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (problem_slug) REFERENCES problems(slug) ON DELETE CASCADE
);

-- 8. User Problem Bookmarks / Favorites
CREATE TABLE IF NOT EXISTS user_bookmarks (
  user_id INTEGER NOT NULL DEFAULT 1,
  problem_slug TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, problem_slug),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (problem_slug) REFERENCES problems(slug) ON DELETE CASCADE
);
