import { Router, Response } from 'express';
import { dbManager } from '../db/database.js';
import type { ProblemRecord } from '../db/database.js';
import { executeCode } from '../runner/index.js';
import { AuthRequest, authenticateUser } from '../auth/jwt-middleware.js';

export const submissionsRouter = Router();

// Run sample / custom test cases without saving submission
submissionsRouter.post('/:slug/run', async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const { code, language = 'python', custom_test_cases } = req.body;

    if (!code || typeof code !== 'string') {
      res.status(400).json({ success: false, error: 'Code is required' });
      return;
    }

    const problem = dbManager.queryOne<ProblemRecord>(
      'SELECT * FROM problems WHERE slug = ?',
      [slug]
    );

    if (!problem) {
      res.status(404).json({ success: false, error: `Problem '${slug}' not found` });
      return;
    }

    let testCasesToRun = [];

    if (Array.isArray(custom_test_cases) && custom_test_cases.length > 0) {
      testCasesToRun = custom_test_cases.map((tc: any) => ({
        input: tc.input,
        expected_output: tc.expected_output,
        hidden: false
      }));
    } else {
      const allCases = JSON.parse(problem.test_cases || '[]');
      testCasesToRun = allCases.filter((tc: any) => !tc.hidden);
    }

    const execResult = await executeCode({
      code,
      language,
      test_cases: testCasesToRun,
      time_limit_ms: problem.time_limit_ms,
      memory_limit_mb: problem.memory_limit_mb
    });

    res.json({
      success: true,
      execution: execResult
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Submit code against all test cases (sample + hidden) and record submission
submissionsRouter.post('/:slug/submit', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const { code, language = 'python' } = req.body;
    const userId = req.user ? req.user.id : 1;

    if (!code || typeof code !== 'string') {
      res.status(400).json({ success: false, error: 'Code is required' });
      return;
    }

    const problem = dbManager.queryOne<ProblemRecord>(
      'SELECT * FROM problems WHERE slug = ?',
      [slug]
    );

    if (!problem) {
      res.status(404).json({ success: false, error: `Problem '${slug}' not found` });
      return;
    }

    const allTestCases = JSON.parse(problem.test_cases || '[]');

    const execResult = await executeCode({
      code,
      language,
      test_cases: allTestCases,
      time_limit_ms: problem.time_limit_ms,
      memory_limit_mb: problem.memory_limit_mb
    });

    // Save submission to DB
    dbManager.run(
      `INSERT INTO submissions (
        user_id, problem_slug, language, code, status, runtime_ms, memory_kb,
        test_cases_passed, total_test_cases, error_message, results_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        slug,
        language,
        code,
        execResult.status,
        execResult.runtime_ms,
        execResult.memory_kb,
        execResult.test_cases_passed,
        execResult.total_test_cases,
        execResult.error_message || '',
        JSON.stringify(execResult.results)
      ]
    );

    const submissionIdRow = dbManager.queryOne<{ id: number }>('SELECT last_insert_rowid() as id');
    const submissionId = submissionIdRow?.id;

    // Update Daily Activity for this user
    const today = new Date().toISOString().slice(0, 10);
    const existingActivity = dbManager.queryOne(
      'SELECT * FROM daily_activity WHERE user_id = ? AND date = ?',
      [userId, today]
    );

    const isSolved = execResult.status === 'Accepted';

    if (existingActivity) {
      dbManager.run(
        `UPDATE daily_activity SET 
          submission_count = submission_count + 1,
          solved_count = solved_count + ?
         WHERE user_id = ? AND date = ?`,
        [isSolved ? 1 : 0, userId, today]
      );
    } else {
      dbManager.run(
        `INSERT INTO daily_activity (user_id, date, submission_count, solved_count) VALUES (?, ?, 1, ?)`,
        [userId, today, isSolved ? 1 : 0]
      );
    }

    res.json({
      success: true,
      submissionId,
      execution: execResult
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/submissions/:slug/history
submissionsRouter.get('/:slug/history', authenticateUser, (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const userId = req.user ? req.user.id : 1;
    const rows = dbManager.query(
      'SELECT id, problem_slug, language, status, runtime_ms, memory_kb, test_cases_passed, total_test_cases, created_at FROM submissions WHERE problem_slug = ? AND user_id = ? ORDER BY id DESC LIMIT 50',
      [slug, userId]
    );

    res.json({ success: true, submissions: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/submissions (all global recent)
submissionsRouter.get('/', (req: AuthRequest, res: Response) => {
  try {
    const rows = dbManager.query(`
      SELECT 
        s.id, s.problem_slug, s.language, s.status, s.runtime_ms, s.memory_kb,
        s.test_cases_passed, s.total_test_cases, s.created_at, p.title as problem_title, p.difficulty,
        u.username, u.avatar_url
      FROM submissions s
      JOIN problems p ON s.problem_slug = p.slug
      LEFT JOIN users u ON s.user_id = u.id
      ORDER BY s.id DESC
      LIMIT 100
    `);

    res.json({ success: true, submissions: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
