import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DB_PATH || path.resolve(__dirname, '../../data/leetcode_offline.db');

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

  async init(): Promise<void> {
    if (this.db) return;

    this.SQL = await initSqlJs();
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (fs.existsSync(DB_PATH)) {
      const fileBuffer = fs.readFileSync(DB_PATH);
      this.db = new this.SQL.Database(fileBuffer);
    } else {
      this.db = new this.SQL.Database();
    }

    // Run schema
    const schema = `
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

      CREATE INDEX IF NOT EXISTS idx_submissions_slug ON submissions(problem_slug);
      CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);

      CREATE TABLE IF NOT EXISTS spaced_repetition (
        problem_slug TEXT PRIMARY KEY,
        interval_days INTEGER DEFAULT 1,
        repetition_count INTEGER DEFAULT 0,
        ease_factor REAL DEFAULT 2.5,
        last_reviewed_at DATETIME,
        next_review_at DATETIME,
        flagged_review INTEGER DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS daily_activity (
        date TEXT PRIMARY KEY,
        submission_count INTEGER DEFAULT 0,
        solved_count INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS problem_notes (
        problem_slug TEXT PRIMARY KEY,
        notes_md TEXT DEFAULT '',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    if (this.db) {
      this.db.run(schema);
      this.save();
    }
    console.log(`[DB] SQLite Database ready at ${DB_PATH}`);
  }

  save(): void {
    if (!this.db) return;
    const data = this.db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
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
