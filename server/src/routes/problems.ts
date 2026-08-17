import { Router, Request, Response } from 'express';
import { dbManager } from '../db/database.js';
import type { ProblemRecord } from '../db/database.js';
import { AuthRequest, authenticateUser } from '../auth/jwt-middleware.js';

export const problemsRouter = Router();

// GET /api/problems
problemsRouter.get('/', authenticateUser, (req: AuthRequest, res: Response) => {
  try {
    const { difficulty, tag, status, search, sort = 'id', order = 'asc' } = req.query;
    const userId = req.user ? req.user.id : 1;

    let sql = `
      SELECT 
        p.id, p.slug, p.title, p.difficulty, p.tags, p.time_limit_ms, p.memory_limit_mb, p.created_at,
        COALESCE(sr.flagged_review, 0) as flagged_review,
        sr.interval_days,
        sr.repetition_count,
        sr.next_review_at,
        (SELECT status FROM submissions WHERE problem_slug = p.slug AND user_id = ? ORDER BY id DESC LIMIT 1) as last_submission_status,
        (SELECT COUNT(*) FROM submissions WHERE problem_slug = p.slug AND user_id = ? AND status = 'Accepted') as has_solved,
        (SELECT COUNT(*) FROM submissions WHERE problem_slug = p.slug AND user_id = ?) as total_submissions
      FROM problems p
      LEFT JOIN spaced_repetition sr ON p.slug = sr.problem_slug AND sr.user_id = ?
      WHERE 1=1
    `;

    const params: any[] = [userId, userId, userId, userId];

    if (difficulty && typeof difficulty === 'string' && difficulty !== 'All') {
      sql += ` AND p.difficulty = ?`;
      params.push(difficulty);
    }

    if (tag && typeof tag === 'string' && tag !== 'All') {
      sql += ` AND p.tags LIKE ?`;
      params.push(`%"${tag}"%`);
    }

    if (search && typeof search === 'string' && search.trim().length > 0) {
      const term = `%${search.trim().toLowerCase()}%`;
      sql += ` AND (LOWER(p.title) LIKE ? OR LOWER(p.statement_md) LIKE ? OR LOWER(p.tags) LIKE ?)`;
      params.push(term, term, term);
    }

    let rows = dbManager.query(sql, params);

    // Parse JSON tags
    let formatted = rows.map((r: any) => ({
      ...r,
      tags: JSON.parse(r.tags || '[]'),
      interval_days: r.interval_days ?? null,
      repetition_count: r.repetition_count ?? 0,
      status: r.has_solved > 0 ? 'Solved' : (r.total_submissions > 0 ? 'Attempted' : 'Todo')
    }));

    // Filter by solved status
    if (status && typeof status === 'string' && status !== 'All') {
      if (status === 'Solved') {
        formatted = formatted.filter(p => p.status === 'Solved');
      } else if (status === 'Unsolved' || status === 'Todo') {
        formatted = formatted.filter(p => p.status === 'Todo');
      } else if (status === 'Attempted') {
        formatted = formatted.filter(p => p.status === 'Attempted');
      }
    }

    // Sort
    const isAsc = String(order).toLowerCase() === 'asc';
    formatted.sort((a, b) => {
      let valA = a[sort as string] ?? a.id;
      let valB = b[sort as string] ?? b.id;
      if (typeof valA === 'string') {
        return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return isAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

    res.json({
      success: true,
      total: formatted.length,
      problems: formatted
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/problems/tags
problemsRouter.get('/meta/tags', (req: Request, res: Response) => {
  try {
    const rows = dbManager.query<{ tags: string }>('SELECT tags FROM problems');
    const tagCountMap: Record<string, number> = {};

    for (const r of rows) {
      try {
        const tags: string[] = JSON.parse(r.tags || '[]');
        for (const t of tags) {
          tagCountMap[t] = (tagCountMap[t] || 0) + 1;
        }
      } catch (e) {}
    }

    const result = Object.entries(tagCountMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    res.json({ success: true, tags: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/problems/:slug
problemsRouter.get('/:slug', authenticateUser, (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const userId = req.user ? req.user.id : 1;

    const row = dbManager.queryOne<ProblemRecord>(
      'SELECT * FROM problems WHERE slug = ?',
      [slug]
    );

    if (!row) {
      res.status(404).json({ success: false, error: `Problem '${slug}' not found` });
      return;
    }

    const srRecord = dbManager.queryOne(
      'SELECT * FROM spaced_repetition WHERE user_id = ? AND problem_slug = ?',
      [userId, slug]
    );

    const latestSubmission = dbManager.queryOne(
      'SELECT * FROM submissions WHERE user_id = ? AND problem_slug = ? ORDER BY id DESC LIMIT 1',
      [userId, slug]
    );

    const totalSubmissions = dbManager.queryOne<{ count: number }>(
      'SELECT COUNT(*) as count FROM submissions WHERE user_id = ? AND problem_slug = ?',
      [userId, slug]
    );

    const solvedSubmissions = dbManager.queryOne<{ count: number }>(
      'SELECT COUNT(*) as count FROM submissions WHERE user_id = ? AND problem_slug = ? AND status = "Accepted"',
      [userId, slug]
    );

    const testCasesParsed = JSON.parse(row.test_cases || '[]');
    const sampleTestCases = testCasesParsed.filter((tc: any) => !tc.hidden);

    const problem = {
      id: row.id,
      slug: row.slug,
      title: row.title,
      difficulty: row.difficulty,
      tags: JSON.parse(row.tags || '[]'),
      time_limit_ms: row.time_limit_ms,
      memory_limit_mb: row.memory_limit_mb,
      created_at: row.created_at,
      statement_md: row.statement_md,
      constraints: JSON.parse(row.constraints || '[]'),
      examples: JSON.parse(row.examples || '[]'),
      starter_code: JSON.parse(row.starter_code || '{}'),
      hints: JSON.parse(row.hints || '[]'),
      editorial_md: row.editorial_md || '',
      reference_solution: JSON.parse(row.reference_solution || '{}'),
      sample_test_cases: sampleTestCases
    };

    res.json({
      success: true,
      problem,
      spaced_repetition: srRecord || null,
      latest_submission: latestSubmission || null,
      stats: {
        total_submissions: totalSubmissions?.count || 0,
        is_solved: (solvedSubmissions?.count || 0) > 0
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
