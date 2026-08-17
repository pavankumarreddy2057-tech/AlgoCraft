import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from multiple candidate paths (cwd, server/.env, root/.env)
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { dbManager } from './db/database.js';
import { syncProblemBank } from './db/seed-loader.js';
import { problemsRouter } from './routes/problems.js';
import { submissionsRouter } from './routes/submissions.js';
import { reviewRouter } from './routes/review.js';
import { statsRouter } from './routes/stats.js';
import { adminRouter } from './routes/admin.js';
import { notesRouter } from './routes/notes.js';
import { mentorRouter } from './routes/mentor.js';
import { interviewRouter } from './routes/interview.js';
import { benchmarkRouter } from './runner/benchmark-runner.js';
import { authRouter } from './routes/auth.js';
import { userRouter } from './routes/user.js';
import { leaderboardRouter } from './routes/leaderboard.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: 'offline',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/problems', problemsRouter);
app.use('/api/submissions', submissionsRouter);
app.use('/api/review', reviewRouter);
app.use('/api/stats', statsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/notes', notesRouter);
app.use('/api/mentor', mentorRouter);
app.use('/api/interview', interviewRouter);
app.use('/api/benchmark', benchmarkRouter);

// Serve Client Static Files in Production
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('AlgoCraft API Server is running. Client build not found in dist/. Please run client dev server.');
    }
  });
});

// Start Server
async function bootstrap() {
  try {
    await dbManager.init();
    console.log('[Server] SQLite DB initialized.');

    // Auto-sync problem files on startup
    await syncProblemBank();

    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`  🚀 AlgoCraft Platform V2 Server running at:`);
      console.log(`  👉 http://localhost:${PORT}`);
      if (process.env.SMTP_USER) {
        console.log(`  📧 Real Email OTP enabled via: ${process.env.SMTP_USER}`);
      } else {
        console.log(`  ⚠️  No SMTP_USER configured in .env (falling back to dev log OTP)`);
      }
      console.log(`======================================================\n`);
    });
  } catch (err: any) {
    console.error('[Server] Fatal bootstrap error:', err);
    process.exit(1);
  }
}

bootstrap();
