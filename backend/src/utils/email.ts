import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from './logger';

const transporter = nodemailer.createTransport({
  host: env.smtp.host || 'smtp.gmail.com',
  port: env.smtp.port || 587,
  secure: env.smtp.port === 465,
  auth:
    env.smtp.user && env.smtp.pass
      ? {
          user: env.smtp.user,
          pass: env.smtp.pass,
        }
      : undefined,
});

export const emailService = {
  async sendVoteConfirmation(params: {
    toEmail: string;
    voterName: string;
    nomineeName: string;
    categoryName: string;
    amount: number;
    mpesaReference?: string;
  }) {
    const subject = `🎉 Vote Confirmation — Nduthi Festival & Awards Kenya`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #076B29; color: #ffffff; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Nduthi Festival & Awards Kenya</h1>
          <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">Payment & Vote Receipt</p>
        </div>
        <div style="padding: 24px; color: #333333; line-height: 1.6;">
          <p>Hello <strong>${params.voterName}</strong>,</p>
          <p>Thank you for participating in Nduthi Festival & Awards Kenya! Your payment of <strong>KES ${params.amount}</strong> has been received and your vote has been successfully recorded.</p>
          
          <div style="background-color: #f9f9f9; border-left: 4px solid #076B29; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #076B29;">Vote Details</h3>
            <p style="margin: 5px 0;"><strong>Nominee Voted For:</strong> ${params.nomineeName}</p>
            <p style="margin: 5px 0;"><strong>Category:</strong> ${params.categoryName}</p>
            <p style="margin: 5px 0;"><strong>Amount Paid:</strong> KES ${params.amount}</p>
            <p style="margin: 5px 0;"><strong>M-Pesa Receipt Ref:</strong> ${params.mpesaReference || 'CONFIRMED'}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}</p>
          </div>

          <p>Your support empowers the motorcycle community across Kenya!</p>
          <p style="margin-top: 25px;">Best regards,<br/><strong>Nduthi Festival Team</strong></p>
        </div>
        <div style="background-color: #f1f1f1; color: #666666; padding: 12px; text-align: center; font-size: 12px;">
          © 2025 Nduthi Festival & Awards Kenya. All rights reserved.
        </div>
      </div>
    `;

    if (!env.smtp.user || !env.smtp.pass) {
      logger.warn(`[EMAIL DISPATCH NOTICE] Real email to ${params.toEmail} skipped because SMTP_PASS is empty in backend/.env`);
      logger.info(`[RECEIPT LOG] Voter: ${params.voterName} (${params.toEmail}) | Nominee: ${params.nomineeName} | Category: ${params.categoryName} | Amount: KES ${params.amount} | M-Pesa Ref: ${params.mpesaReference || 'CONFIRMED'}`);
      return;
    }

    try {
      logger.info(`[EMAIL] Sending vote confirmation email to ${params.toEmail}...`);
      const info = await transporter.sendMail({
        from: env.smtp.from,
        to: params.toEmail,
        subject,
        html,
      });
      logger.info(`[EMAIL SUCCESS] Vote confirmation email sent to ${params.toEmail} (Message ID: ${info.messageId})`);
    } catch (err: any) {
      logger.error(`[EMAIL ERROR] Failed to send voter email to ${params.toEmail}: ${err.message}`);
    }
  },

  async sendPaymentFailedNotification(params: {
    toEmail: string;
    voterName: string;
    nomineeName: string;
    categoryName: string;
    amount: number;
    reason?: string;
  }) {
    const subject = `⚠️ Payment Incomplete — Nduthi Festival & Awards Kenya`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #A30000; color: #ffffff; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Nduthi Festival & Awards Kenya</h1>
          <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">Payment Status: Not Completed</p>
        </div>
        <div style="padding: 24px; color: #333333; line-height: 1.6;">
          <p>Hello <strong>${params.voterName}</strong>,</p>
          <p>Your M-Pesa payment of <strong>KES ${params.amount}</strong> to vote for <strong>${params.nomineeName}</strong> (${params.categoryName}) was not completed.</p>
          
          <div style="background-color: #fff8f8; border-left: 4px solid #A30000; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 5px 0;"><strong>Status:</strong> Payment Incomplete / Cancelled</p>
            <p style="margin: 5px 0;"><strong>Reason:</strong> ${params.reason || 'The M-Pesa prompt was cancelled or timed out before PIN was entered.'}</p>
            <p style="margin: 5px 0;"><strong>No funds were deducted from your account.</strong></p>
          </div>

          <p>You can try voting again anytime on the official website!</p>
          <p style="margin-top: 25px;">Best regards,<br/><strong>Nduthi Festival Team</strong></p>
        </div>
      </div>
    `;

    if (!env.smtp.user || !env.smtp.pass) {
      logger.warn(`[EMAIL DISPATCH NOTICE] Payment failure email to ${params.toEmail} skipped because SMTP_PASS is empty in backend/.env`);
      return;
    }

    try {
      logger.info(`[EMAIL] Sending payment failed notification to ${params.toEmail}...`);
      const info = await transporter.sendMail({
        from: env.smtp.from,
        to: params.toEmail,
        subject,
        html,
      });
      logger.info(`[EMAIL SUCCESS] Payment failure email sent to ${params.toEmail} (Message ID: ${info.messageId})`);
    } catch (err: any) {
      logger.error(`[EMAIL ERROR] Failed to send payment failed email to ${params.toEmail}: ${err.message}`);
    }
  },

  async sendAdminPaymentNotification(params: {
    voterName: string;
    voterEmail: string;
    voterPhone?: string;
    nomineeName: string;
    categoryName: string;
    amount: number;
    mpesaReference?: string;
  }) {
    const adminEmail = env.adminEmail;
    const subject = `🔔 [Nduthi Festival] New KES ${params.amount} Vote Payment Received`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #14231A; color: #F5C542; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">Nduthi Festival — Admin Notification</h2>
          <p style="margin: 5px 0 0; color: #ffffff; font-size: 13px;">New Successful Payment & Vote</p>
        </div>
        <div style="padding: 24px; color: #333333; line-height: 1.6;">
          <p>A new vote payment has been processed successfully!</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr style="background-color: #f2f2f2;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Amount Paid</td>
              <td style="padding: 10px; border: 1px solid #ddd; color: #076B29; font-weight: bold;">KES ${params.amount}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Voter Name</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${params.voterName}</td>
            </tr>
            <tr style="background-color: #f2f2f2;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Voter Email</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${params.voterEmail}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Voter Phone</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${params.voterPhone || 'N/A'}</td>
            </tr>
            <tr style="background-color: #f2f2f2;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Nominee Voted For</td>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>${params.nomineeName}</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Category</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${params.categoryName}</td>
            </tr>
            <tr style="background-color: #f2f2f2;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Transaction Ref</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${params.mpesaReference || 'KopoKopo-STK'}</td>
            </tr>
          </table>
        </div>
      </div>
    `;

    if (!env.smtp.user || !env.smtp.pass) {
      logger.warn(`[EMAIL DISPATCH NOTICE] Admin notification email to ${adminEmail} skipped because SMTP_PASS is empty in backend/.env`);
      return;
    }

    try {
      logger.info(`[EMAIL] Sending admin payment notification email to ${adminEmail}...`);
      const info = await transporter.sendMail({
        from: env.smtp.from,
        to: adminEmail,
        subject,
        html,
      });
      logger.info(`[EMAIL SUCCESS] Admin payment notification email sent to ${adminEmail} (Message ID: ${info.messageId})`);
    } catch (err: any) {
      logger.error(`[EMAIL ERROR] Failed to send admin email to ${adminEmail}: ${err.message}`);
    }
  },
};
