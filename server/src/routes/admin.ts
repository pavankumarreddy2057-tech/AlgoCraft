import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbManager } from '../db/database.js';
import { validateEntireBank, validateProblem } from '../validator/problem-validator.js';
import { syncProblemBank } from '../db/seed-loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROBLEMS_DIR = path.resolve(__dirname, '../../../problems');

export const adminRouter = Router();

// GET /api/admin/export
adminRouter.get('/export', (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const rows = dbManager.query('SELECT * FROM problems');

    const formatted = rows.map((p: any) => ({
      slug: p.slug,
      title: p.title,
      difficulty: p.difficulty,
      tags: JSON.parse(p.tags || '[]'),
      statement_md: p.statement_md,
      constraints: JSON.parse(p.constraints || '[]'),
      examples: JSON.parse(p.examples || '[]'),
      starter_code: JSON.parse(p.starter_code || '{}'),
      test_cases: JSON.parse(p.test_cases || '[]'),
      reference_solution: JSON.parse(p.reference_solution || '{}'),
      hints: JSON.parse(p.hints || '[]'),
      editorial_md: p.editorial_md || '',
      time_limit_ms: p.time_limit_ms,
      memory_limit_mb: p.memory_limit_mb
    }));

    const exportPayload = {
      export_version: '1.0',
      exported_at: new Date().toISOString(),
      problem_count: formatted.length,
      problems: formatted
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=algocraft-problems-export-${Date.now()}.json`);
    res.send(JSON.stringify(exportPayload, null, 2));
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/import
adminRouter.post('/import', async (req: Request, res: Response) => {
  try {
    const { problems: importedProblems, target_category = 'custom' } = req.body;

    if (!Array.isArray(importedProblems) || importedProblems.length === 0) {
      return res.status(400).json({ success: false, error: 'No problems array provided in payload' });
    }

    const targetDir = path.join(PROBLEMS_DIR, target_category);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    let saved = 0;
    const validationErrors = [];

    for (const prob of importedProblems) {
      const slug = prob.slug || prob.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const filePath = path.join(targetDir, `${slug}.json`);

      // Write problem file
      fs.writeFileSync(filePath, JSON.stringify(prob, null, 2), 'utf-8');
      saved++;
    }

    // Resync database
    const syncRes = await syncProblemBank();

    res.json({
      success: true,
      importedCount: saved,
      totalInBank: syncRes.total
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/validate
adminRouter.post('/validate', async (req: Request, res: Response) => {
  try {
    const report = await validateEntireBank();
    res.json({
      success: true,
      report
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
