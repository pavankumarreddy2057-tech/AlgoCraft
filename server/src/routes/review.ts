import { Router, Response } from 'express';
import { dbManager } from '../db/database.js';
import type { SpacedRepetitionRecord } from '../db/database.js';
import { calculateSM2 } from '../spaced-repetition/sm2.js';
import { AuthRequest, authenticateUser } from '../auth/jwt-middleware.js';

export const reviewRouter = Router();

// GET /api/review/queue
reviewRouter.get('/queue', authenticateUser, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user ? req.user.id : 1;
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
        (SELECT status FROM submissions WHERE problem_slug = p.slug AND user_id = ? ORDER BY id DESC LIMIT 1) as last_status
      FROM problems p
      LEFT JOIN spaced_repetition sr ON p.slug = sr.problem_slug AND sr.user_id = ?
      WHERE (sr.next_review_at IS NOT NULL AND sr.next_review_at <= ?)
         OR (sr.flagged_review = 1)
         OR (sr.repetition_count = 0 AND (SELECT COUNT(*) FROM submissions WHERE problem_slug = p.slug AND user_id = ? AND status = 'Accepted') > 0)
      ORDER BY 
        sr.flagged_review DESC,
        sr.next_review_at ASC
    `;

    const rows = dbManager.query(sql, [userId, userId, nowIso, userId]);

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
reviewRouter.post('/:slug/record', authenticateUser, (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const { grade } = req.body; // 0 = Again, 3 = Hard, 4 = Good, 5 = Easy
    const userId = req.user ? req.user.id : 1;

    if (grade === undefined || typeof grade !== 'number') {
      res.status(400).json({ success: false, error: 'Numeric grade (0-5) is required' });
      return;
    }

    let record = dbManager.queryOne<SpacedRepetitionRecord>(
      'SELECT * FROM spaced_repetition WHERE user_id = ? AND problem_slug = ?',
      [userId, slug]
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
         WHERE user_id = ? AND problem_slug = ?`,
        [
          sm2Result.interval,
          sm2Result.repetitions,
          sm2Result.easeFactor,
          nowIso,
          sm2Result.nextReviewAt,
          userId,
          slug
        ]
      );
    } else {
      dbManager.run(
        `INSERT INTO spaced_repetition (
          user_id, problem_slug, interval_days, repetition_count, ease_factor, last_reviewed_at, next_review_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
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
reviewRouter.post('/:slug/toggle-flag', authenticateUser, (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const userId = req.user ? req.user.id : 1;

    let record = dbManager.queryOne<SpacedRepetitionRecord>(
      'SELECT * FROM spaced_repetition WHERE user_id = ? AND problem_slug = ?',
      [userId, slug]
    );

    const newFlag = record && record.flagged_review ? 0 : 1;

    if (record) {
      dbManager.run(
        'UPDATE spaced_repetition SET flagged_review = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND problem_slug = ?',
        [newFlag, userId, slug]
      );
    } else {
      dbManager.run(
        'INSERT INTO spaced_repetition (user_id, problem_slug, flagged_review) VALUES (?, ?, ?)',
        [userId, slug, newFlag]
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
