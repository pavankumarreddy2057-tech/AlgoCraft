import crypto from 'crypto';
import { dbManager } from '../db/database.js';

export interface OtpGenerationResult {
  code: string;
  expires_at: string;
  email: string;
}

export class OtpService {
  private static hashOtp(email: string, code: string): string {
    const salt = process.env.OTP_SALT || 'algocraft-secure-salt-2026';
    return crypto.createHash('sha256').update(`${email.toLowerCase()}:${code}:${salt}`).digest('hex');
  }

  static generateOtp(email: string): OtpGenerationResult {
    const normalizedEmail = email.trim().toLowerCase();

    // Check rate limit: max 3 requests in the last 10 minutes
    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const recentOtps = dbManager.query(
      `SELECT count(*) as cnt FROM otp_verifications WHERE email = ? AND created_at > ?`,
      [normalizedEmail, tenMinsAgo]
    );

    if (recentOtps.length > 0 && recentOtps[0].cnt >= 5) {
      throw new Error('Too many verification code requests. Please wait a few minutes before trying again.');
    }

    // Invalidate prior unconsumed OTPs for this email
    dbManager.run(
      `UPDATE otp_verifications SET consumed = 1 WHERE email = ? AND consumed = 0`,
      [normalizedEmail]
    );

    // Generate secure 6-digit numeric code (100000 - 999999)
    const code = crypto.randomInt(100000, 999999).toString();
    const otpHash = this.hashOtp(normalizedEmail, code);

    // 10-minute expiry
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    dbManager.run(
      `INSERT INTO otp_verifications (email, otp_hash, expires_at, attempts, consumed) VALUES (?, ?, ?, 0, 0)`,
      [normalizedEmail, otpHash, expiresAt]
    );

    return {
      code,
      expires_at: expiresAt,
      email: normalizedEmail
    };
  }

  static verifyOtp(email: string, inputCode: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    const code = inputCode.trim();

    if (!/^\d{6}$/.test(code)) {
      throw new Error('Invalid code format. Please enter a 6-digit number.');
    }

    const now = new Date().toISOString();
    const record = dbManager.queryOne<any>(
      `SELECT * FROM otp_verifications 
       WHERE email = ? AND consumed = 0 AND expires_at > ? 
       ORDER BY id DESC LIMIT 1`,
      [normalizedEmail, now]
    );

    if (!record) {
      throw new Error('Verification code has expired or was not requested. Please request a new code.');
    }

    if (record.attempts >= 5) {
      dbManager.run(`UPDATE otp_verifications SET consumed = 1 WHERE id = ?`, [record.id]);
      throw new Error('Too many incorrect attempts. This code has been invalidated. Please request a new code.');
    }

    const expectedHash = this.hashOtp(normalizedEmail, code);
    if (record.otp_hash !== expectedHash) {
      dbManager.run(`UPDATE otp_verifications SET attempts = attempts + 1 WHERE id = ?`, [record.id]);
      throw new Error('Incorrect verification code. Please check your email and try again.');
    }

    // Mark as consumed
    dbManager.run(`UPDATE otp_verifications SET consumed = 1 WHERE id = ?`, [record.id]);
    return true;
  }
}
