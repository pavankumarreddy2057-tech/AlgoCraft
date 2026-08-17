import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function resolveDbPath(): string {
  if (process.env.DB_PATH) return process.env.DB_PATH;
  const candidates = [
    path.resolve(process.cwd(), 'server/data/leetcode_offline.db'),
    path.resolve(process.cwd(), 'data/leetcode_offline.db'),
    path.resolve(__dirname, '../../data/leetcode_offline.db'),
    path.resolve(__dirname, '../../../data/leetcode_offline.db'),
    '/opt/algocraft/server/data/leetcode_offline.db'
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  if (fs.existsSync(path.resolve(process.cwd(), 'server'))) {
    return path.resolve(process.cwd(), 'server/data/leetcode_offline.db');
  }
  return path.resolve(__dirname, '../../data/leetcode_offline.db');
}

const DB_PATH = resolveDbPath();

export interface UserRecord {
  id: number;
  email: string;
  username: string;
  avatar_url: string;
  bio: string;
  target_role: string;
  score: number;
  created_at: string;
  last_active_at: string;
}

export interface OtpRecord {
  id?: number;
  email: string;
  otp_hash: string;
  expires_at: string;
  attempts: number;
  consumed: number;
  created_at?: string;
}

export interface ProblemRecord {
  id?: number;
  slug: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string; // JSON array string
  statement_md: string;
  constraints: string; // JSON array string
  examples: string; // JSON array string
  starter_code: string; // JSON object string
  test_cases: string; // JSON array string
  reference_solution: string; // JSON object string
  hints: string; // JSON array string
  time_limit_ms: number;
  memory_limit_mb: number;
  editorial_md?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SubmissionRecord {
  id?: number;
  user_id: number;
  problem_slug: string;
  language: string;
  code: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Memory Limit Exceeded';
  runtime_ms: number;
  memory_kb: number;
  test_cases_passed: number;
  total_test_cases: number;
  error_message?: string;
  results_json?: string;
  created_at?: string;
}

export interface SpacedRepetitionRecord {
  user_id: number;
  problem_slug: string;
  interval_days: number;
  repetition_count: number;
  ease_factor: number;
  last_reviewed_at?: string;
  next_review_at?: string;
  flagged_review: number;
  updated_at?: string;
}

class DatabaseManager {
  private db: SqlJsDatabase | null = null;
  private SQL: any = null;
  private activeDbPath: string = DB_PATH;

  async init(): Promise<void> {
    if (this.db) return;

    this.activeDbPath = resolveDbPath();
    this.SQL = await initSqlJs();
    const dataDir = path.dirname(this.activeDbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (fs.existsSync(this.activeDbPath)) {
      const fileBuffer = fs.readFileSync(this.activeDbPath);
      this.db = new this.SQL.Database(fileBuffer);
    } else {
      this.db = new this.SQL.Database();
    }

    // Run V2 schema
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    let schema = '';
    if (fs.existsSync(schemaPath)) {
      schema = fs.readFileSync(schemaPath, 'utf-8');
    } else {
      schema = `
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

        CREATE TABLE IF NOT EXISTS otp_verifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL,
          otp_hash TEXT NOT NULL,
          expires_at DATETIME NOT NULL,
          attempts INTEGER DEFAULT 0,
          consumed INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS problems (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          slug TEXT UNIQUE NOT NULL,
          title TEXT NOT NULL,
          difficulty TEXT NOT NULL CHECK(difficulty IN ('Easy', 'Medium', 'Hard')),
          tags TEXT NOT NULL,
          statement_md TEXT NOT NULL,
          constraints TEXT NOT NULL,
          examples TEXT NOT NULL,
          starter_code TEXT NOT NULL,
          test_cases TEXT NOT NULL,
          reference_solution TEXT NOT NULL,
          hints TEXT NOT NULL,
          time_limit_ms INTEGER DEFAULT 2000,
          memory_limit_mb INTEGER DEFAULT 128,
          editorial_md TEXT DEFAULT '',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS submissions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL DEFAULT 1,
          problem_slug TEXT NOT NULL,
          language TEXT NOT NULL,
          code TEXT NOT NULL,
          status TEXT NOT NULL,
          runtime_ms REAL DEFAULT 0,
          memory_kb REAL DEFAULT 0,
          test_cases_passed INTEGER NOT NULL DEFAULT 0,
          total_test_cases INTEGER NOT NULL DEFAULT 0,
          error_message TEXT DEFAULT '',
          results_json TEXT DEFAULT '[]',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

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
          PRIMARY KEY (user_id, problem_slug)
        );

        CREATE TABLE IF NOT EXISTS daily_activity (
          user_id INTEGER NOT NULL DEFAULT 1,
          date TEXT NOT NULL,
          submission_count INTEGER DEFAULT 0,
          solved_count INTEGER DEFAULT 0,
          PRIMARY KEY (user_id, date)
        );

        CREATE TABLE IF NOT EXISTS problem_notes (
          user_id INTEGER NOT NULL DEFAULT 1,
          problem_slug TEXT NOT NULL,
          notes_md TEXT DEFAULT '',
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (user_id, problem_slug)
        );

        CREATE TABLE IF NOT EXISTS user_bookmarks (
          user_id INTEGER NOT NULL DEFAULT 1,
          problem_slug TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (user_id, problem_slug)
        );
      `;
    }

    if (this.db) {
      try {
        this.db.run(schema);
      } catch (err: any) {
        console.warn('[DB] Schema setup note:', err.message);
      }

      // Ensure default guest user (id: 1) exists
      try {
        const guest = this.queryOne('SELECT id FROM users WHERE id = 1');
        if (!guest) {
          this.run(
            `INSERT INTO users (id, email, username, avatar_url, bio, target_role, score) 
             VALUES (1, 'guest@algocraft.io', 'Guest Coder', 'https://api.dicebear.com/7.x/bottts/svg?seed=guest', 'Practicing DSA offline with AlgoCraft', 'Full Stack Developer', 100)`
          );
        }
      } catch (e) {}

      // Safe schema migration for user_id column in existing tables
      try {
        this.db.run('ALTER TABLE submissions ADD COLUMN user_id INTEGER DEFAULT 1;');
      } catch (e) {}

      try {
        this.db.run('ALTER TABLE spaced_repetition ADD COLUMN user_id INTEGER DEFAULT 1;');
      } catch (e) {}

      try {
        this.db.run('UPDATE spaced_repetition SET user_id = 1 WHERE user_id IS NULL;');
      } catch (e) {}

      try {
        this.db.run('ALTER TABLE daily_activity ADD COLUMN user_id INTEGER DEFAULT 1;');
      } catch (e) {}

      try {
        this.db.run('ALTER TABLE problem_notes ADD COLUMN user_id INTEGER DEFAULT 1;');
      } catch (e) {}

      try {
        this.db.run('ALTER TABLE user_bookmarks ADD COLUMN user_id INTEGER DEFAULT 1;');
      } catch (e) {}

      this.save();
    }
    console.log(`[DB] SQLite Database ready at ${this.activeDbPath}`);
  }

  save(): void {
    if (!this.db) return;
    try {
      const data = this.db.export();
      const buffer = Buffer.from(data);
      const dataDir = path.dirname(this.activeDbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(this.activeDbPath, buffer);
    } catch (e) {
      console.error('[DB] Failed to save database to disk:', e);
    }
  }

  getDb(): SqlJsDatabase {
    if (!this.db) throw new Error('Database not initialized. Call init() first.');
    return this.db;
  }

  query<T = any>(sql: string, params: any[] = []): T[] {
    const db = this.getDb();
    const stmt = db.prepare(sql);
    if (params.length > 0) {
      stmt.bind(params);
    }
    const results: T[] = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject() as T);
    }
    stmt.free();
    return results;
  }

  queryOne<T = any>(sql: string, params: any[] = []): T | null {
    const rows = this.query<T>(sql, params);
    return rows.length > 0 ? rows[0] : null;
  }

  run(sql: string, params: any[] = []): void {
    const db = this.getDb();
    if (params.length > 0) {
      const stmt = db.prepare(sql);
      stmt.run(params);
      stmt.free();
    } else {
      db.run(sql);
    }
    this.save();
  }
}

export const dbManager = new DatabaseManager();
