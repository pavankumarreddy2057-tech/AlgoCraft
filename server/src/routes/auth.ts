import { Router, Response } from 'express';
import { dbManager, UserRecord } from '../db/database.js';
import { OtpService } from '../auth/otp-service.js';
import { MailerService } from '../auth/mailer.js';
import { signUserToken, AuthRequest, authenticateUser, requireAuth } from '../auth/jwt-middleware.js';

export const authRouter = Router();

// 1. Send OTP to Email
authRouter.post('/send-otp', async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otpResult = OtpService.generateOtp(normalizedEmail);

    const mailResult = await MailerService.sendOtpEmail({
      email: normalizedEmail,
      code: otpResult.code,
      expiresInMinutes: 10
    });

    res.json({
      success: true,
      message: `Verification code sent to ${normalizedEmail}`,
      email: normalizedEmail,
      expires_at: otpResult.expires_at,
      is_dev: mailResult.isDev,
      ...(mailResult.isDev && { dev_otp: otpResult.code })
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to generate verification code.' });
  }
});

// 2. Verify OTP & Issue Session Token
authRouter.post('/verify-otp', async (req: AuthRequest, res: Response) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      res.status(400).json({ error: 'Email and 6-digit code are required.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    OtpService.verifyOtp(normalizedEmail, code);

    // Find existing user or create a new user account
    let user = dbManager.queryOne<UserRecord>('SELECT * FROM users WHERE email = ?', [normalizedEmail]);

    if (!user) {
      const emailPrefix = normalizedEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
      let baseUsername = emailPrefix.length >= 3 ? emailPrefix : `coder_${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Ensure unique username
      let username = baseUsername;
      let counter = 1;
      while (dbManager.queryOne('SELECT id FROM users WHERE username = ?', [username])) {
        username = `${baseUsername}_${counter}`;
        counter++;
      }

      const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`;

      dbManager.run(
        `INSERT INTO users (email, username, avatar_url, bio, target_role, score) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [normalizedEmail, username, avatarUrl, 'Practicing algorithms & data structures with AlgoCraft', 'Software Engineer', 100]
      );

      user = dbManager.queryOne<UserRecord>('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
    }

    if (!user) {
      res.status(500).json({ error: 'Failed to retrieve user session.' });
      return;
    }

    // Update last_active_at
    dbManager.run('UPDATE users SET last_active_at = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    const token = signUserToken(user);

    res.json({
      success: true,
      token,
      user
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Verification failed.' });
  }
});

// 3. Get Current Authenticated User Profile
authRouter.get('/me', authenticateUser, (req: AuthRequest, res: Response) => {
  res.json({
    authenticated: req.user && req.user.id !== 1,
    user: req.user
  });
});

// 4. Update Profile
authRouter.put('/profile', authenticateUser, requireAuth, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { username, avatar_url, bio, target_role } = req.body;

    if (username && typeof username === 'string') {
      const trimmed = username.trim();
      if (trimmed.length < 2 || trimmed.length > 30) {
        res.status(400).json({ error: 'Username must be between 2 and 30 characters.' });
        return;
      }
      const existing = dbManager.queryOne<UserRecord>('SELECT id FROM users WHERE username = ? AND id != ?', [trimmed, userId]);
      if (existing) {
        res.status(400).json({ error: 'This username is already taken. Please choose another.' });
        return;
      }
      dbManager.run('UPDATE users SET username = ? WHERE id = ?', [trimmed, userId]);
    }

    if (avatar_url !== undefined) {
      dbManager.run('UPDATE users SET avatar_url = ? WHERE id = ?', [String(avatar_url).trim(), userId]);
    }

    if (bio !== undefined) {
      dbManager.run('UPDATE users SET bio = ? WHERE id = ?', [String(bio).trim().slice(0, 200), userId]);
    }

    if (target_role !== undefined) {
      dbManager.run('UPDATE users SET target_role = ? WHERE id = ?', [String(target_role).trim().slice(0, 50), userId]);
    }

    const updated = dbManager.queryOne<UserRecord>('SELECT * FROM users WHERE id = ?', [userId]);
    res.json({ success: true, user: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update profile.' });
  }
});
