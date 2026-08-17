import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { dbManager, UserRecord } from '../db/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'algocraft-secret-jwt-key-2026-offline-first';

export interface AuthRequest extends Request {
  user?: UserRecord;
}

export function signUserToken(user: { id: number; email: string; username: string }): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export function verifyUserToken(token: string): { id: number; email: string; username: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; email: string; username: string };
  } catch (err) {
    return null;
  }
}

export function authenticateUser(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const decoded = verifyUserToken(token);

    if (decoded) {
      const user = dbManager.queryOne<UserRecord>('SELECT * FROM users WHERE id = ?', [decoded.id]);
      if (user) {
        req.user = user;
        // Update last_active_at
        dbManager.run('UPDATE users SET last_active_at = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
        return next();
      }
    }
  }

  // Fallback to Guest User (id: 1)
  const guestUser = dbManager.queryOne<UserRecord>('SELECT * FROM users WHERE id = 1');
  if (guestUser) {
    req.user = guestUser;
  } else {
    req.user = {
      id: 1,
      email: 'guest@algocraft.io',
      username: 'Guest Coder',
      avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=guest',
      bio: 'Practicing DSA offline with AlgoCraft',
      target_role: 'Software Engineer',
      score: 100,
      created_at: new Date().toISOString(),
      last_active_at: new Date().toISOString()
    };
  }

  next();
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Please sign in.' });
    return;
  }

  const token = authHeader.substring(7);
  const decoded = verifyUserToken(token);
  if (!decoded) {
    res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
    return;
  }

  next();
}
