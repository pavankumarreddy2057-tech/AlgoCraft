import { Router, Response } from 'express';
import { dbManager } from '../db/database.js';
import { AuthRequest, authenticateUser } from '../auth/jwt-middleware.js';

export const notesRouter = Router();

// GET /api/notes/:slug
notesRouter.get('/:slug', authenticateUser, (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const userId = req.user ? req.user.id : 1;

    const row = dbManager.queryOne<{ notes_md: string; updated_at: string }>(
      'SELECT notes_md, updated_at FROM problem_notes WHERE user_id = ? AND problem_slug = ?',
      [userId, slug]
    );

    res.json({
      success: true,
      notes_md: row ? row.notes_md : '',
      updated_at: row ? row.updated_at : null
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/notes/:slug
notesRouter.post('/:slug', authenticateUser, (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const { notes_md = '' } = req.body;
    const userId = req.user ? req.user.id : 1;

    const existing = dbManager.queryOne(
      'SELECT problem_slug FROM problem_notes WHERE user_id = ? AND problem_slug = ?',
      [userId, slug]
    );

    if (existing) {
      dbManager.run(
        'UPDATE problem_notes SET notes_md = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND problem_slug = ?',
        [notes_md, userId, slug]
      );
    } else {
      dbManager.run(
        'INSERT INTO problem_notes (user_id, problem_slug, notes_md) VALUES (?, ?, ?)',
        [userId, slug, notes_md]
      );
    }

    res.json({
      success: true,
      problem_slug: slug,
      notes_md
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
