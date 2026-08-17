import { Router, Response } from 'express';
import { dbManager, UserRecord } from '../db/database.js';
import { AuthRequest, authenticateUser } from '../auth/jwt-middleware.js';

export const userRouter = Router();

// 1. Personal User Dashboard Aggregated Data
userRouter.get('/dashboard', authenticateUser, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user ? req.user.id : 1;
    const user = req.user || dbManager.queryOne<UserRecord>('SELECT * FROM users WHERE id = 1');

    // 1. Total Problems in Bank & Solved Count
    const totalProblemsRows = dbManager.query('SELECT slug, difficulty, tags FROM problems');
    const totalProblems = totalProblemsRows.length;

    const solvedSlugsRows = dbManager.query<{ problem_slug: string }>(
      `SELECT DISTINCT problem_slug FROM submissions WHERE user_id = ? AND status = 'Accepted'`,
      [userId]
    );
    const solvedSlugSet = new Set(solvedSlugsRows.map(r => r.problem_slug));
    const totalSolved = solvedSlugSet.size;

    // Difficulty breakdown
    let easyTotal = 0, easySolved = 0;
    let medTotal = 0, medSolved = 0;
    let hardTotal = 0, hardSolved = 0;

    const topicStatsMap: Record<string, { total: number; solved: number }> = {};

    for (const p of totalProblemsRows) {
      const isSolved = solvedSlugSet.has(p.slug);
      if (p.difficulty === 'Easy') {
        easyTotal++;
        if (isSolved) easySolved++;
      } else if (p.difficulty === 'Medium') {
        medTotal++;
        if (isSolved) medSolved++;
      } else if (p.difficulty === 'Hard') {
        hardTotal++;
        if (isSolved) hardSolved++;
      }

      let tags: string[] = [];
      try {
        tags = JSON.parse(p.tags);
      } catch (e) {}

      for (const t of tags) {
        if (!topicStatsMap[t]) topicStatsMap[t] = { total: 0, solved: 0 };
        topicStatsMap[t].total++;
        if (isSolved) topicStatsMap[t].solved++;
      }
    }

    const topicMastery = Object.entries(topicStatsMap)
      .map(([topic, data]) => ({
        topic,
        total: data.total,
        solved: data.solved,
        percentage: data.total > 0 ? Math.round((data.solved / data.total) * 100) : 0
      }))
      .sort((a, b) => b.total - a.total);

    // 2. 365-Day Activity Grid
    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);
    const startDateStr = oneYearAgo.toISOString().split('T')[0];

    const activityRows = dbManager.query<{ date: string; submission_count: number; solved_count: number }>(
      `SELECT date, submission_count, solved_count FROM daily_activity WHERE user_id = ? AND date >= ? ORDER BY date ASC`,
      [userId, startDateStr]
    );

    const activityMap = new Map<string, { submissions: number; solved: number }>();
    for (const row of activityRows) {
      activityMap.set(row.date, { submissions: row.submission_count, solved: row.solved_count });
    }

    // Build 365 days sequential array
    const calendar: Array<{ date: string; count: number; solved: number }> = [];
    const today = new Date();
    const curr = new Date(oneYearAgo);

    while (curr <= today) {
      const dateKey = curr.toISOString().split('T')[0];
      const act = activityMap.get(dateKey) || { submissions: 0, solved: 0 };
      calendar.push({
        date: dateKey,
        count: act.submissions,
        solved: act.solved
      });
      curr.setDate(curr.getDate() + 1);
    }

    // Calculate current and longest streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < calendar.length; i++) {
      if (calendar[i].count > 0) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    // Current streak working backwards from today
    for (let i = calendar.length - 1; i >= 0; i--) {
      if (calendar[i].count > 0) {
        currentStreak++;
      } else if (i === calendar.length - 1) {
        // Today hasn't had activity yet, check yesterday
        continue;
      } else {
        break;
      }
    }

    // 3. Recent Submissions (Past 15)
    const recentSubmissions = dbManager.query(
      `SELECT s.id, s.problem_slug, p.title as problem_title, p.difficulty, s.language, s.status, s.runtime_ms, s.memory_kb, s.test_cases_passed, s.total_test_cases, s.created_at
       FROM submissions s
       JOIN problems p ON s.problem_slug = p.slug
       WHERE s.user_id = ?
       ORDER BY s.created_at DESC LIMIT 15`,
      [userId]
    );

    // 4. Spaced Repetition Due Queue
    const nowIso = new Date().toISOString();
    const dueReviews = dbManager.query(
      `SELECT sr.problem_slug, p.title as problem_title, p.difficulty, sr.interval_days, sr.repetition_count, sr.ease_factor, sr.next_review_at
       FROM spaced_repetition sr
       JOIN problems p ON sr.problem_slug = p.slug
       WHERE sr.user_id = ? AND (sr.next_review_at <= ? OR sr.flagged_review = 1)
       ORDER BY sr.next_review_at ASC LIMIT 10`,
      [userId, nowIso]
    );

    // 5. Bookmarked Problems
    const bookmarks = dbManager.query(
      `SELECT ub.problem_slug, p.title as problem_title, p.difficulty, p.tags, ub.created_at
       FROM user_bookmarks ub
       JOIN problems p ON ub.problem_slug = p.slug
       WHERE ub.user_id = ?
       ORDER BY ub.created_at DESC`,
      [userId]
    );

    // Compute rank and score
    const computedScore = (easySolved * 10) + (medSolved * 25) + (hardSolved * 50) + (currentStreak * 5);

    // Update user score in DB
    if (user && user.id) {
      dbManager.run('UPDATE users SET score = ? WHERE id = ?', [computedScore, user.id]);
    }

    res.json({
      user: {
        ...user,
        score: computedScore
      },
      stats: {
        totalBank: totalProblems,
        totalSolved,
        acceptanceRate: totalProblems > 0 ? Number(((totalSolved / totalProblems) * 100).toFixed(1)) : 0,
        currentStreak,
        longestStreak,
        difficulty: {
          easy: { solved: easySolved, total: easyTotal },
          medium: { solved: medSolved, total: medTotal },
          hard: { solved: hardSolved, total: hardTotal }
        }
      },
      topicMastery,
      calendar,
      recentSubmissions,
      dueReviews,
      bookmarks
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to retrieve personal dashboard data.' });
  }
});

// 2. Get User Bookmarks
userRouter.get('/bookmarks', authenticateUser, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user ? req.user.id : 1;
    const bookmarks = dbManager.query(
      `SELECT ub.problem_slug, p.title, p.difficulty, p.tags, ub.created_at 
       FROM user_bookmarks ub
       JOIN problems p ON ub.problem_slug = p.slug
       WHERE ub.user_id = ?
       ORDER BY ub.created_at DESC`,
      [userId]
    );
    res.json({ bookmarks });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Toggle Bookmark
userRouter.post('/bookmarks/toggle', authenticateUser, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user ? req.user.id : 1;
    const { problem_slug } = req.body;

    if (!problem_slug) {
      res.status(400).json({ error: 'problem_slug is required.' });
      return;
    }

    const existing = dbManager.queryOne(
      'SELECT problem_slug FROM user_bookmarks WHERE user_id = ? AND problem_slug = ?',
      [userId, problem_slug]
    );

    let isBookmarked = false;
    if (existing) {
      dbManager.run('DELETE FROM user_bookmarks WHERE user_id = ? AND problem_slug = ?', [userId, problem_slug]);
      isBookmarked = false;
    } else {
      dbManager.run('INSERT INTO user_bookmarks (user_id, problem_slug) VALUES (?, ?)', [userId, problem_slug]);
      isBookmarked = true;
    }

    res.json({ success: true, isBookmarked, problem_slug });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
