import { Router, Request, Response } from 'express';
import { dbManager } from '../db/database.js';
import type { ProblemRecord } from '../db/database.js';
import { AuthRequest, authenticateUser } from '../auth/jwt-middleware.js';

export const problemsRouter = Router();

// GET /api/problems
problemsRouter.get('/', authenticateUser, (req: AuthRequest, res: Response) => {
  try {
    const { difficulty, tag, status, search, sort = 'id', order = 'asc' } = req.query;
    const userId = Number(req.user ? req.user.id : 1) || 1;

    let sql = `
      SELECT 
        p.id, p.slug, p.title, p.difficulty, p.tags, p.time_limit_ms, p.memory_limit_mb, p.created_at,
        COALESCE(sr.flagged_review, 0) as flagged_review,
        sr.interval_days,
        sr.repetition_count,
        sr.next_review_at,
        (SELECT status FROM submissions WHERE problem_slug = p.slug AND user_id = ${userId} ORDER BY id DESC LIMIT 1) as last_submission_status,
        (SELECT COUNT(*) FROM submissions WHERE problem_slug = p.slug AND user_id = ${userId} AND status = 'Accepted') as has_solved,
        (SELECT COUNT(*) FROM submissions WHERE problem_slug = p.slug AND user_id = ${userId}) as total_submissions
      FROM problems p
      LEFT JOIN spaced_repetition sr ON p.slug = sr.problem_slug AND sr.user_id = ${userId}
      WHERE 1=1
    `;

    const params: any[] = [];

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

    let rows: any[] = [];
    try {
      rows = dbManager.query(sql, params);
    } catch (queryErr: any) {
      console.warn('[Problems Route] Primary query failed, attempting schema fallback:', queryErr.message);
      // Fallback query without spaced_repetition join
      const fallbackSql = `
        SELECT 
          p.id, p.slug, p.title, p.difficulty, p.tags, p.time_limit_ms, p.memory_limit_mb, p.created_at,
          0 as flagged_review,
          NULL as interval_days,
          0 as repetition_count,
          NULL as next_review_at,
          NULL as last_submission_status,
          0 as has_solved,
          0 as total_submissions
        FROM problems p
        WHERE 1=1
      `;
      rows = dbManager.query(fallbackSql);
    }

    // Parse JSON tags safely
    let formatted = rows.map((r: any) => {
      let parsedTags: string[] = [];
      try {
        if (Array.isArray(r.tags)) {
          parsedTags = r.tags;
        } else if (typeof r.tags === 'string' && r.tags.trim().length > 0) {
          parsedTags = JSON.parse(r.tags);
        }
      } catch (e) {
        parsedTags = [];
      }

      return {
        id: r.id,
        slug: r.slug,
        title: r.title,
        difficulty: r.difficulty,
        tags: Array.isArray(parsedTags) ? parsedTags : [],
        time_limit_ms: r.time_limit_ms,
        memory_limit_mb: r.memory_limit_mb,
        created_at: r.created_at,
        flagged_review: r.flagged_review ?? 0,
        interval_days: r.interval_days ?? null,
        repetition_count: r.repetition_count ?? 0,
        next_review_at: r.next_review_at ?? null,
        last_submission_status: r.last_submission_status ?? null,
        has_solved: r.has_solved ?? 0,
        total_submissions: r.total_submissions ?? 0,
        status: (r.has_solved > 0) ? 'Solved' : ((r.total_submissions > 0) ? 'Attempted' : 'Todo')
      };
    });

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
      let valA = (a as Record<string, any>)[sort as string] ?? a.id;
      let valB = (b as Record<string, any>)[sort as string] ?? b.id;
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
    console.error('Failed to get problems:', err);
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
        const tags: string[] = typeof r.tags === 'string' ? JSON.parse(r.tags || '[]') : (Array.isArray(r.tags) ? r.tags : []);
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
    const userId = Number(req.user ? req.user.id : 1) || 1;

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

    let testCasesParsed: any[] = [];
    try {
      testCasesParsed = JSON.parse(row.test_cases || '[]');
    } catch (e) {
      testCasesParsed = [];
    }
    const sampleTestCases = testCasesParsed.filter((tc: any) => !tc.hidden);

    let parsedTags: string[] = [];
    try {
      parsedTags = JSON.parse(row.tags || '[]');
    } catch (e) {
      parsedTags = [];
    }

    let parsedConstraints: string[] = [];
    try {
      parsedConstraints = JSON.parse(row.constraints || '[]');
    } catch (e) {
      parsedConstraints = [];
    }

    let parsedExamples: any[] = [];
    try {
      parsedExamples = JSON.parse(row.examples || '[]');
    } catch (e) {
      parsedExamples = [];
    }

    let parsedStarterCode: any = {};
    try {
      parsedStarterCode = JSON.parse(row.starter_code || '{}');
    } catch (e) {
      parsedStarterCode = {};
    }

    let parsedHints: string[] = [];
    try {
      parsedHints = JSON.parse(row.hints || '[]');
    } catch (e) {
      parsedHints = [];
    }

    let parsedRefSol: any = {};
    try {
      parsedRefSol = JSON.parse(row.reference_solution || '{}');
    } catch (e) {
      parsedRefSol = {};
    }

    const problem = {
      id: row.id,
      slug: row.slug,
      title: row.title,
      difficulty: row.difficulty,
      tags: parsedTags,
      time_limit_ms: row.time_limit_ms,
      memory_limit_mb: row.memory_limit_mb,
      created_at: row.created_at,
      statement_md: row.statement_md,
      constraints: parsedConstraints,
      examples: parsedExamples,
      starter_code: parsedStarterCode,
      hints: parsedHints,
      editorial_md: row.editorial_md || '',
      reference_solution: parsedRefSol,
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
