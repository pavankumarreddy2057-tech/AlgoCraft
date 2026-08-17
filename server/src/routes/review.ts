import { Router, Request, Response } from 'express';
import { dbManager } from '../db/database.js';
import type { SpacedRepetitionRecord } from '../db/database.js';
import { calculateSM2 } from '../spaced-repetition/sm2.js';

export const reviewRouter = Router();

// GET /api/review/queue
reviewRouter.get('/queue', (req: Request, res: Response) => {
  try {
    const nowIso = new Date().toISOString();

    const sql = `
      SELECT 
        p.id, p.slug, p.title, p.difficulty, p.tags,
        COALESCE(sr.interval_days, 1) as interval_days,
        COALESCE(sr.repetition_count, 0) as repetition_count,
        COALESCE(sr.ease_factor, 2.5) as ease_factor,
        sr.last_reviewed_at,
        sr.next_review_at,
        COALESCE(sr.flagged_review, 0) as flagged_review,
        (SELECT status FROM submissions WHERE problem_slug = p.slug ORDER BY id DESC LIMIT 1) as last_status
      FROM problems p
      LEFT JOIN spaced_repetition sr ON p.slug = sr.problem_slug
      WHERE (sr.next_review_at IS NOT NULL AND sr.next_review_at <= ?)
         OR (sr.flagged_review = 1)
         OR (sr.repetition_count = 0 AND (SELECT COUNT(*) FROM submissions WHERE problem_slug = p.slug AND status = 'Accepted') > 0)
      ORDER BY 
        sr.flagged_review DESC,
        sr.next_review_at ASC
    `;

    const rows = dbManager.query(sql, [nowIso]);

    const queue = rows.map((r: any) => ({
      ...r,
      tags: JSON.parse(r.tags || '[]')
    }));

    res.json({
      success: true,
      count: queue.length,
      queue
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/review/:slug/record
reviewRouter.post('/:slug/record', (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { grade } = req.body; // 0 = Again, 3 = Hard, 4 = Good, 5 = Easy

    if (grade === undefined || typeof grade !== 'number') {
      return res.status(400).json({ success: false, error: 'Numeric grade (0-5) is required' });
    }

    let record = dbManager.queryOne<SpacedRepetitionRecord>(
      'SELECT * FROM spaced_repetition WHERE problem_slug = ?',
      [slug]
    );

    const currentState = {
      repetitions: record?.repetition_count ?? 0,
      interval: record?.interval_days ?? 1,
      easeFactor: record?.ease_factor ?? 2.5
    };

    const sm2Result = calculateSM2(grade, currentState);
    const nowIso = new Date().toISOString();

    if (record) {
      dbManager.run(
        `UPDATE spaced_repetition SET
          interval_days = ?,
          repetition_count = ?,
          ease_factor = ?,
          last_reviewed_at = ?,
          next_review_at = ?,
          updated_at = CURRENT_TIMESTAMP
         WHERE problem_slug = ?`,
        [
          sm2Result.interval,
          sm2Result.repetitions,
          sm2Result.easeFactor,
          nowIso,
          sm2Result.nextReviewAt,
          slug
        ]
      );
    } else {
      dbManager.run(
        `INSERT INTO spaced_repetition (
          problem_slug, interval_days, repetition_count, ease_factor, last_reviewed_at, next_review_at
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          slug,
          sm2Result.interval,
          sm2Result.repetitions,
          sm2Result.easeFactor,
          nowIso,
          sm2Result.nextReviewAt
        ]
      );
    }

    res.json({
      success: true,
      updated: {
        problem_slug: slug,
        ...sm2Result,
        lastReviewedAt: nowIso
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/review/:slug/toggle-flag
reviewRouter.post('/:slug/toggle-flag', (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    let record = dbManager.queryOne<SpacedRepetitionRecord>(
      'SELECT * FROM spaced_repetition WHERE problem_slug = ?',
      [slug]
    );

    const newFlag = record && record.flagged_review ? 0 : 1;

    if (record) {
      dbManager.run(
        'UPDATE spaced_repetition SET flagged_review = ?, updated_at = CURRENT_TIMESTAMP WHERE problem_slug = ?',
        [newFlag, slug]
      );
    } else {
      dbManager.run(
        'INSERT INTO spaced_repetition (problem_slug, flagged_review) VALUES (?, ?)',
        [slug, newFlag]
      );
    }

    res.json({
      success: true,
      problem_slug: slug,
      flagged_review: newFlag
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
