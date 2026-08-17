import { Router, Request, Response } from 'express';
import { dbManager } from '../db/database.js';

export const interviewRouter = Router();

export interface InterviewSession {
  sessionId: string;
  durationMinutes: number;
  startTime: string;
  problems: Array<{
    id: number;
    slug: string;
    title: string;
    difficulty: string;
    statement_md: string;
    starter_code: any;
    sample_test_cases: any[];
  }>;
}

// POST /api/interview/start
interviewRouter.post('/start', (req: Request, res: Response) => {
  try {
    const { category, difficulty = 'Mixed' } = req.body;

    let sql = 'SELECT * FROM problems WHERE difficulty != "Hard"';
    if (category && category !== 'All') {
      sql += ` AND tags LIKE '%"${category}"%'`;
    }
    const pool1 = dbManager.query(sql);

    let sql2 = 'SELECT * FROM problems WHERE difficulty IN ("Medium", "Hard")';
    if (category && category !== 'All') {
      sql2 += ` AND tags LIKE '%"${category}"%'`;
    }
    const pool2 = dbManager.query(sql2);

    const prob1 = pool1[Math.floor(Math.random() * pool1.length)] || pool1[0];
    const pool2Filtered = pool2.filter((p: any) => p.slug !== prob1?.slug);
    const prob2 = pool2Filtered[Math.floor(Math.random() * pool2Filtered.length)] || pool2[0];

    const chosenProblems = [prob1, prob2].filter(Boolean).map((p: any) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      difficulty: p.difficulty,
      statement_md: p.statement_md,
      starter_code: JSON.parse(p.starter_code || '{}'),
      sample_test_cases: JSON.parse(p.test_cases || '[]').filter((tc: any) => !tc.hidden)
    }));

    const session: InterviewSession = {
      sessionId: 'intv_' + Date.now(),
      durationMinutes: 45,
      startTime: new Date().toISOString(),
      problems: chosenProblems
    };

    res.json({
      success: true,
      session
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/interview/evaluate
interviewRouter.post('/evaluate', (req: Request, res: Response) => {
  try {
    const { timeSpentSeconds, results = [] } = req.body;

    const totalProblems = results.length || 2;
    const solvedCount = results.filter((r: any) => r.solved).length;

    // Calculate Scores
    const accuracyScore = Math.round((solvedCount / totalProblems) * 100);

    const maxTime = 45 * 60;
    const speedFraction = Math.max(0, (maxTime - (timeSpentSeconds || 0)) / maxTime);
    const speedScore = solvedCount > 0 ? Math.round(speedFraction * 100) : 0;

    const overallScore = Math.round(accuracyScore * 0.7 + speedScore * 0.3);

    let verdict = 'Needs Practice';
    let summary = 'Keep practicing the core algorithmic patterns and edge-case handling.';

    if (overallScore >= 85) {
      verdict = 'Strong Hire';
      summary = 'Exceptional problem-solving speed, clean algorithmic logic, and 100% test case accuracy.';
    } else if (overallScore >= 70) {
      verdict = 'Hire';
      summary = 'Solid coding proficiency and correct algorithmic implementation within the time target.';
    } else if (overallScore >= 50) {
      verdict = 'Leaning Hire';
      summary = 'Good foundational approach, with room for improvement on speed and edge-case coverage.';
    }

    res.json({
      success: true,
      scorecard: {
        overallScore,
        accuracyScore,
        speedScore,
        verdict,
        summary,
        solvedCount,
        totalProblems,
        timeSpentFormatted: `${Math.floor((timeSpentSeconds || 0) / 60)}m ${(timeSpentSeconds || 0) % 60}s`
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
