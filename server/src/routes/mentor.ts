import { Router, Request, Response } from 'express';
import { generateSocraticHint, isOllamaAvailable } from '../ai-mentor/ollama-client.js';

export const mentorRouter = Router();

// GET /api/mentor/status
mentorRouter.get('/status', async (req: Request, res: Response) => {
  try {
    const status = await isOllamaAvailable();
    res.json({
      success: true,
      ollama: status
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/mentor/hint
mentorRouter.post('/hint', async (req: Request, res: Response) => {
  try {
    const { problemTitle, statementMd, userCode, language, userQuestion } = req.body;

    if (!problemTitle) {
      return res.status(400).json({ success: false, error: 'problemTitle is required' });
    }

    const mentorRes = await generateSocraticHint({
      problemTitle,
      statementMd: statementMd || '',
      userCode: userCode || '',
      language: language || 'python',
      userQuestion
    });

    res.json({
      success: true,
      data: mentorRes
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
