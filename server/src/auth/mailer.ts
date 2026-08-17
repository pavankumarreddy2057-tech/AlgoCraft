import nodemailer from 'nodemailer';

export interface SendOtpMailOptions {
  email: string;
  code: string;
  expiresInMinutes?: number;
}

export class MailerService {
  private static transporter: nodemailer.Transporter | null = null;

  private static getTransporter(): nodemailer.Transporter | null {
    if (this.transporter) return this.transporter;

    const service = process.env.SMTP_SERVICE || process.env.EMAIL_SERVICE;
    const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
    const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587', 10);
    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.SMTP_PASSWORD;

    if (user && pass) {
      if (service?.toLowerCase() === 'gmail' || (!host && user.includes('@gmail.com')) || host === 'smtp.gmail.com') {
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user, pass }
        });
        console.log('[Mailer] Initialized Gmail Transporter for:', user);
        return this.transporter;
      }

      if (host) {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass }
        });
        console.log(`[Mailer] Initialized SMTP Transporter (${host}:${port}) for:`, user);
        return this.transporter;
      }
    }

    return null;
  }

  static async sendOtpEmail(options: SendOtpMailOptions): Promise<{ success: boolean; isDev: boolean; devOtp?: string }> {
    const { email, code, expiresInMinutes = 10 } = options;
    const transporter = this.getTransporter();
    const fromAddress = process.env.SMTP_FROM || process.env.EMAIL_FROM || `"AlgoCraft Security" <${process.env.SMTP_USER || 'noreply@sentinelhq.in'}>`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AlgoCraft Login Verification</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0d1117; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e6edf3;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0d1117; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="500" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; background-color: #161b22; border-radius: 12px; border: 1px solid #30363d; overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td style="padding: 30px 40px; text-align: center; border-bottom: 1px solid #30363d; background: linear-gradient(180deg, #1c2128 0%, #161b22 100%);">
                    <div style="font-size: 28px; font-weight: 800; color: #58a6ff; letter-spacing: -0.5px;">⚡ AlgoCraft</div>
                    <div style="font-size: 13px; color: #8b949e; margin-top: 4px;">DSA Practice & Interview Mastery Platform</div>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <div style="font-size: 18px; font-weight: 600; color: #f0f6fc; margin-bottom: 12px;">Your Verification Code</div>
                    <p style="font-size: 14px; line-height: 1.6; color: #8b949e; margin: 0 0 24px 0;">
                      Use the 6-digit one-time password (OTP) below to sign in to your AlgoCraft account. This code is valid for <strong>${expiresInMinutes} minutes</strong>.
                    </p>
                    <!-- OTP Box -->
                    <div style="background-color: #0d1117; border: 1px solid #388bfd; border-radius: 8px; padding: 18px; text-align: center; margin-bottom: 24px;">
                      <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #58a6ff;">${code}</span>
                    </div>
                    <p style="font-size: 12px; line-height: 1.5; color: #6e7681; margin: 0;">
                      If you did not request this verification code, you can safely ignore this email. Someone may have entered your email address by mistake.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 40px; text-align: center; border-top: 1px solid #21262d; background-color: #0d1117; font-size: 12px; color: #484f58;">
                    AlgoCraft • Coding Platform • sentinelhq.in
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    if (transporter) {
      try {
        await transporter.sendMail({
          from: fromAddress,
          to: email,
          subject: `${code} is your AlgoCraft verification code`,
          text: `Your AlgoCraft verification code is: ${code}. It expires in ${expiresInMinutes} minutes.`,
          html: htmlContent
        });
        console.log(`[Mailer] ✅ Real OTP email successfully delivered to: ${email}`);
        return { success: true, isDev: false };
      } catch (err: any) {
        console.error(`[Mailer] ❌ SMTP Error delivering email to ${email}:`, err.message);
        throw new Error(`Failed to send real email: ${err.message}`);
      }
    }

    // Dev / Offline Console Fallback
    console.log(`\n======================================================`);
    console.log(`  📧 [DEV MAILER] ONE-TIME VERIFICATION CODE`);
    console.log(`  👉 Recipient : ${email}`);
    console.log(`  🔑 OTP Code  : ${code}`);
    console.log(`  ⏳ Expires In: ${expiresInMinutes} minutes`);
    console.log(`======================================================\n`);

    return { success: true, isDev: true, devOtp: code };
  }
}
