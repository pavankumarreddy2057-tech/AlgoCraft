import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbManager } from './database.js';
import { getAllProblemFiles } from '../validator/problem-validator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROBLEMS_DIR = path.resolve(__dirname, '../../../problems');

export async function syncProblemBank(): Promise<{ added: number; updated: number; total: number }> {
  await dbManager.init();
  const files = getAllProblemFiles(PROBLEMS_DIR);

  let added = 0;
  let updated = 0;

  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);

      const slug = data.slug || path.basename(filePath, '.json');
      const title = data.title || slug;
      const difficulty = data.difficulty || 'Medium';
      const tags = JSON.stringify(data.tags || []);
      const statement_md = data.statement_md || '';
      const constraints = JSON.stringify(data.constraints || []);
      const examples = JSON.stringify(data.examples || []);
      const starter_code = JSON.stringify(data.starter_code || {});
      const test_cases = JSON.stringify(data.test_cases || []);
      const reference_solution = JSON.stringify(data.reference_solution || {});
      const hints = JSON.stringify(data.hints || []);
      const time_limit_ms = data.time_limit_ms || 2000;
      const memory_limit_mb = data.memory_limit_mb || 128;
      const editorial_md = data.editorial_md || '';

      const existing = dbManager.queryOne('SELECT id FROM problems WHERE slug = ?', [slug]);

      if (existing) {
        dbManager.run(
          `UPDATE problems SET 
            title = ?, difficulty = ?, tags = ?, statement_md = ?, constraints = ?, 
            examples = ?, starter_code = ?, test_cases = ?, reference_solution = ?, 
            hints = ?, time_limit_ms = ?, memory_limit_mb = ?, editorial_md = ?, updated_at = CURRENT_TIMESTAMP
           WHERE slug = ?`,
          [
            title, difficulty, tags, statement_md, constraints,
            examples, starter_code, test_cases, reference_solution,
            hints, time_limit_ms, memory_limit_mb, editorial_md, slug
          ]
        );
        updated++;
      } else {
        dbManager.run(
          `INSERT INTO problems (
            slug, title, difficulty, tags, statement_md, constraints, 
            examples, starter_code, test_cases, reference_solution, 
            hints, time_limit_ms, memory_limit_mb, editorial_md
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            slug, title, difficulty, tags, statement_md, constraints,
            examples, starter_code, test_cases, reference_solution,
            hints, time_limit_ms, memory_limit_mb, editorial_md
          ]
        );
        added++;

        // Initialize spaced repetition row for new problem
        dbManager.run(
          `INSERT OR IGNORE INTO spaced_repetition (problem_slug, interval_days, repetition_count, ease_factor, flagged_review)
           VALUES (?, 1, 0, 2.5, 0)`,
          [slug]
        );
      }
    } catch (err: any) {
      console.error(`[Seed Loader] Error processing ${filePath}:`, err.message);
    }
  }

  const countRow = dbManager.queryOne<{ count: number }>('SELECT COUNT(*) as count FROM problems');
  const total = countRow ? countRow.count : 0;

  console.log(`[Seed Loader] Synced ${files.length} problem files (${added} new, ${updated} updated). Total in DB: ${total}`);
  return { added, updated, total };
}

if (process.argv[1] && process.argv[1].includes('seed-loader')) {
  syncProblemBank().then(() => {
    process.exit(0);
  }).catch((err) => {
    console.error('Seed loader error:', err);
    process.exit(1);
  });
}
