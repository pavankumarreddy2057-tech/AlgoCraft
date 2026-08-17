import { Router, Request, Response } from 'express';
import { dbManager } from '../db/database.js';
import type { ProblemRecord } from '../db/database.js';

export const problemsRouter = Router();

// GET /api/problems
problemsRouter.get('/', (req: Request, res: Response) => {
  try {
    const { difficulty, tag, status, search, sort = 'id', order = 'asc' } = req.query;

    let sql = `
      SELECT 
        p.id, p.slug, p.title, p.difficulty, p.tags, p.time_limit_ms, p.memory_limit_mb, p.created_at,
        COALESCE(sr.flagged_review, 0) as flagged_review,
        COALESCE(sr.interval_days, 1) as interval_days,
        sr.next_review_at,
        (SELECT status FROM submissions WHERE problem_slug = p.slug ORDER BY id DESC LIMIT 1) as last_submission_status,
        (SELECT COUNT(*) FROM submissions WHERE problem_slug = p.slug AND status = 'Accepted') as has_solved,
        (SELECT COUNT(*) FROM submissions WHERE problem_slug = p.slug) as total_submissions
      FROM problems p
      LEFT JOIN spaced_repetition sr ON p.slug = sr.problem_slug
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

    let rows = dbManager.query(sql, params);

    // Parse JSON tags
    let formatted = rows.map((r: any) => ({
      ...r,
      tags: JSON.parse(r.tags || '[]'),
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

    rows.forEach(r => {
      try {
        const tags: string[] = JSON.parse(r.tags || '[]');
        tags.forEach(t => {
          tagCountMap[t] = (tagCountMap[t] || 0) + 1;
        });
      } catch (e) {}
    });

    const result = Object.entries(tagCountMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    res.json({ success: true, tags: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/problems/:slug
problemsRouter.get('/:slug', (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const problem = dbManager.queryOne<ProblemRecord>(
      'SELECT * FROM problems WHERE slug = ?',
      [slug]
    );

    if (!problem) {
      return res.status(404).json({ success: false, error: `Problem '${slug}' not found` });
    }

    const sr = dbManager.queryOne(
      'SELECT * FROM spaced_repetition WHERE problem_slug = ?',
      [slug]
    );

    const latestSubmission = dbManager.queryOne(
      'SELECT * FROM submissions WHERE problem_slug = ? ORDER BY id DESC LIMIT 1',
      [slug]
    );

    const testCasesAll = JSON.parse(problem.test_cases || '[]');
    // Sample test cases for the runner UI (non-hidden only by default)
    const sampleCases = testCasesAll.filter((tc: any) => !tc.hidden);

    res.json({
      success: true,
      problem: {
        id: problem.id,
        slug: problem.slug,
        title: problem.title,
        difficulty: problem.difficulty,
        tags: JSON.parse(problem.tags || '[]'),
        statement_md: problem.statement_md,
        constraints: JSON.parse(problem.constraints || '[]'),
        examples: JSON.parse(problem.examples || '[]'),
        starter_code: JSON.parse(problem.starter_code || '{}'),
        sample_test_cases: sampleCases,
        total_test_cases_count: testCasesAll.length,
        hints: JSON.parse(problem.hints || '[]'),
        editorial_md: problem.editorial_md || '',
        reference_solution: JSON.parse(problem.reference_solution || '{}'),
        time_limit_ms: problem.time_limit_ms,
        memory_limit_mb: problem.memory_limit_mb
      },
      spaced_repetition: sr || {
        interval_days: 1,
        repetition_count: 0,
        ease_factor: 2.5,
        flagged_review: 0
      },
      latest_submission: latestSubmission ? {
        ...latestSubmission,
        results: JSON.parse(latestSubmission.results_json || '[]')
      } : null
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
