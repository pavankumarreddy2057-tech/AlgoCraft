import { Router, Request, Response } from 'express';
import { dbManager } from '../db/database.js';

export const notesRouter = Router();

// GET /api/notes/:slug
notesRouter.get('/:slug', (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const row = dbManager.queryOne<{ notes_md: string; updated_at: string }>(
      'SELECT notes_md, updated_at FROM problem_notes WHERE problem_slug = ?',
      [slug]
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
notesRouter.post('/:slug', (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { notes_md = '' } = req.body;

    const existing = dbManager.queryOne('SELECT problem_slug FROM problem_notes WHERE problem_slug = ?', [slug]);

    if (existing) {
      dbManager.run(
        'UPDATE problem_notes SET notes_md = ?, updated_at = CURRENT_TIMESTAMP WHERE problem_slug = ?',
        [notes_md, slug]
      );
    } else {
      dbManager.run(
        'INSERT INTO problem_notes (problem_slug, notes_md) VALUES (?, ?)',
        [slug, notes_md]
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
