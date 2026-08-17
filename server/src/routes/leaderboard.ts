import { Router, Request, Response } from 'express';
import { dbManager } from '../db/database.js';

export const leaderboardRouter = Router();

// 1. Global Solvers Rankings
leaderboardRouter.get('/rankings', (req: Request, res: Response) => {
  try {
    const users = dbManager.query(
      `SELECT u.id, u.username, u.avatar_url, u.bio, u.target_role, u.score, u.created_at,
              COUNT(DISTINCT CASE WHEN s.status = 'Accepted' THEN s.problem_slug END) as solved_count,
              COUNT(s.id) as total_submissions
       FROM users u
       LEFT JOIN submissions s ON u.id = s.user_id
       GROUP BY u.id
       ORDER BY u.score DESC, solved_count DESC, u.id ASC
       LIMIT 100`
    );

    const rankings = users.map((u: any, idx: number) => ({
      rank: idx + 1,
      id: u.id,
      username: u.username,
      avatar_url: u.avatar_url,
      bio: u.bio,
      target_role: u.target_role,
      score: u.score || (u.solved_count * 20),
      solved_count: u.solved_count,
      total_submissions: u.total_submissions,
      joined_at: u.created_at
    }));

    res.json({ rankings });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to retrieve rankings.' });
  }
});

// 2. Live Global Solve Pulse (Recent Solves across all users)
leaderboardRouter.get('/pulse', (req: Request, res: Response) => {
  try {
    const pulse = dbManager.query(
      `SELECT s.id, s.problem_slug, p.title as problem_title, p.difficulty, s.language, s.runtime_ms, s.created_at,
              u.username, u.avatar_url
       FROM submissions s
       JOIN problems p ON s.problem_slug = p.slug
       JOIN users u ON s.user_id = u.id
       WHERE s.status = 'Accepted'
       ORDER BY s.created_at DESC
       LIMIT 25`
    );

    res.json({ pulse });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Category Champions
leaderboardRouter.get('/champions', (req: Request, res: Response) => {
  try {
    const categories = ['Dynamic Programming', 'Graphs', 'Trees', 'Arrays & Hashing', 'Two Pointers', 'SQL'];
    const champions: Record<string, any> = {};

    for (const cat of categories) {
      const topUser = dbManager.queryOne(
        `SELECT u.username, u.avatar_url, u.target_role, COUNT(DISTINCT s.problem_slug) as solved_in_category
         FROM submissions s
         JOIN problems p ON s.problem_slug = p.slug
         JOIN users u ON s.user_id = u.id
         WHERE s.status = 'Accepted' AND p.tags LIKE ?
         GROUP BY u.id
         ORDER BY solved_in_category DESC, u.id ASC
         LIMIT 1`,
        [`%${cat}%`]
      );

      if (topUser) {
        champions[cat] = topUser;
      }
    }

    res.json({ champions });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Global Platform Analytics & Hardest Problems
leaderboardRouter.get('/stats', (req: Request, res: Response) => {
  try {
    const totalUsers = dbManager.queryOne<{ cnt: number }>('SELECT count(*) as cnt FROM users')?.cnt || 1;
    const totalSubmissions = dbManager.queryOne<{ cnt: number }>('SELECT count(*) as cnt FROM submissions')?.cnt || 0;
    const totalAccepted = dbManager.queryOne<{ cnt: number }>('SELECT count(*) as cnt FROM submissions WHERE status = "Accepted"')?.cnt || 0;
    
    // Language distribution
    const langStats = dbManager.query<{ language: string; cnt: number }>(
      'SELECT language, count(*) as cnt FROM submissions GROUP BY language ORDER BY cnt DESC'
    );

    // Hardest problems (highest submission count with lowest acceptance)
    const hardestProblems = dbManager.query(
      `SELECT p.slug, p.title, p.difficulty,
              COUNT(s.id) as attempts,
              SUM(CASE WHEN s.status = 'Accepted' THEN 1 ELSE 0 END) as accepted
       FROM problems p
       JOIN submissions s ON p.slug = s.problem_slug
       GROUP BY p.slug
       HAVING attempts >= 2
       ORDER BY (CAST(accepted AS FLOAT) / attempts) ASC, attempts DESC
       LIMIT 5`
    );

    res.json({
      totalUsers,
      totalSubmissions,
      totalAccepted,
      globalAcceptanceRate: totalSubmissions > 0 ? Number(((totalAccepted / totalSubmissions) * 100).toFixed(1)) : 0,
      languageDistribution: langStats,
      hardestProblems
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
