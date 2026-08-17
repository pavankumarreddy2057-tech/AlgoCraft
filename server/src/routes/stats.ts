import { Router, Response } from 'express';
import { dbManager } from '../db/database.js';
import { AuthRequest, authenticateUser } from '../auth/jwt-middleware.js';

export const statsRouter = Router();

// GET /api/stats
statsRouter.get('/', authenticateUser, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user ? req.user.id : 1;

    // 1. Difficulty solved breakdown
    const totalProblems = dbManager.query<{ difficulty: string; count: number }>(`
      SELECT difficulty, COUNT(*) as count FROM problems GROUP BY difficulty
    `);

    const solvedProblems = dbManager.query<{ difficulty: string; count: number }>(`
      SELECT p.difficulty, COUNT(DISTINCT p.slug) as count
      FROM problems p
      JOIN submissions s ON p.slug = s.problem_slug
      WHERE s.status = 'Accepted' AND s.user_id = ?
      GROUP BY p.difficulty
    `, [userId]);

    const difficultyStats = {
      Easy: { total: 0, solved: 0 },
      Medium: { total: 0, solved: 0 },
      Hard: { total: 0, solved: 0 }
    };

    totalProblems.forEach(r => {
      if (difficultyStats[r.difficulty as keyof typeof difficultyStats]) {
        difficultyStats[r.difficulty as keyof typeof difficultyStats].total = r.count;
      }
    });

    solvedProblems.forEach(r => {
      if (difficultyStats[r.difficulty as keyof typeof difficultyStats]) {
        difficultyStats[r.difficulty as keyof typeof difficultyStats].solved = r.count;
      }
    });

    const totalSolved = Object.values(difficultyStats).reduce((acc, d) => acc + d.solved, 0);
    const totalBank = Object.values(difficultyStats).reduce((acc, d) => acc + d.total, 0);

    // 2. Streaks calculation
    const activityRows = dbManager.query<{ date: string; submission_count: number; solved_count: number }>(`
      SELECT date, submission_count, solved_count 
      FROM daily_activity 
      WHERE user_id = ?
      ORDER BY date ASC
    `, [userId]);

    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    const activeDates = new Set(activityRows.filter(r => r.submission_count > 0).map(r => r.date));
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    // Compute current streak backwards from today/yesterday
    let checkDate = new Date(today);
    if (!activeDates.has(todayStr) && activeDates.has(yesterdayStr)) {
      checkDate = yesterday;
    }

    if (activeDates.has(checkDate.toISOString().slice(0, 10))) {
      while (activeDates.has(checkDate.toISOString().slice(0, 10))) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }

    // Compute max streak
    const sortedDates = Array.from(activeDates).sort();
    if (sortedDates.length > 0) {
      tempStreak = 1;
      maxStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const prev = new Date(sortedDates[i - 1]);
        const curr = new Date(sortedDates[i]);
        const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          tempStreak++;
          if (tempStreak > maxStreak) maxStreak = tempStreak;
        } else {
          tempStreak = 1;
        }
      }
    }

    // 3. 365-day activity heatmap data
    const heatmap: Record<string, { submissions: number; solved: number }> = {};

    activityRows.forEach(r => {
      heatmap[r.date] = {
        submissions: r.submission_count,
        solved: r.solved_count
      };
    });

    // 4. Topic mastery breakdown
    const allProblems = dbManager.query<{ slug: string; tags: string }>('SELECT slug, tags FROM problems');
    const solvedSlugs = new Set(
      dbManager.query<{ slug: string }>("SELECT DISTINCT problem_slug as slug FROM submissions WHERE status = 'Accepted' AND user_id = ?", [userId]).map(r => r.slug)
    );

    const tagMasteryMap: Record<string, { total: number; solved: number }> = {};

    allProblems.forEach(p => {
      try {
        const tags: string[] = JSON.parse(p.tags || '[]');
        const isSolved = solvedSlugs.has(p.slug);
        tags.forEach(t => {
          if (!tagMasteryMap[t]) {
            tagMasteryMap[t] = { total: 0, solved: 0 };
          }
          tagMasteryMap[t].total += 1;
          if (isSolved) tagMasteryMap[t].solved += 1;
        });
      } catch (e) {}
    });

    const topicMastery = Object.entries(tagMasteryMap)
      .map(([tag, data]) => ({
        tag,
        total: data.total,
        solved: data.solved,
        percentage: data.total > 0 ? Math.round((data.solved / data.total) * 100) : 0
      }))
      .sort((a, b) => b.total - a.total);

    // 5. Total submissions count
    const totalSubmissionsRow = dbManager.queryOne<{ count: number }>('SELECT COUNT(*) as count FROM submissions WHERE user_id = ?', [userId]);

    res.json({
      success: true,
      stats: {
        totalSolved,
        totalBank,
        totalSubmissions: totalSubmissionsRow?.count || 0,
        currentStreak,
        maxStreak,
        difficulty: difficultyStats,
        heatmap,
        topicMastery
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
