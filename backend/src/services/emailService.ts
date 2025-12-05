import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import xss from 'xss';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

class EmailService {
    private transporter: nodemailer.Transporter | null = null;

    constructor() {
        this.initializeTransporter();
    }

    private initializeTransporter() {
        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASSWORD;

        if (!emailUser || !emailPass) {
            console.warn('[EMAIL] Email credentials not configured. Email sending will be disabled.');
            return;
        }

        try {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: emailUser,
                    pass: emailPass, 
                },
            });

            console.log('[EMAIL] Email service initialized successfully');
        } catch (error) {
            console.error('[EMAIL] Failed to initialize email service:', error);
        }
    }

    async sendEmail(options: EmailOptions): Promise<boolean> {
        if (!this.transporter) {
            console.error('[EMAIL] Email service not configured. Skipping email send.');
            return false;
        }

        try {
            const info = await this.transporter.sendMail({
                from: `"${process.env.EMAIL_FROM_NAME || 'Fluxion'}" <${process.env.EMAIL_USER}>`,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
            });

            console.log(`[EMAIL] Email sent successfully to ${options.to}. Message ID: ${info.messageId}`);
            return true;
        } catch (error) {
            console.error(`[EMAIL] Failed to send email to ${options.to}:`, error);
            return false;
        }
    }

    private loadTemplate(templateName: string, replacements: Record<string, string>): string {
        try {
            // Use process.cwd() to get the project root directory
            const templatePath = path.join(process.cwd(), 'src', 'templates', `${templateName}.html`);
            let template = fs.readFileSync(templatePath, 'utf-8');

		// Sanitize all replacements to prevent XSS
		for (const [key, value] of Object.entries(replacements)) {
			const sanitizedValue = key === 'resetLink' ? value : xss(value);
			template = template.replace(new RegExp(`{{${key}}}`, 'g'), sanitizedValue);
		}            return template;
        } catch (error) {
            console.error(`[EMAIL] Failed to load template ${templateName}:`, error);
            throw new Error(`Failed to load email template: ${templateName}`);
        }
    }

    async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        const html = this.loadTemplate('passwordResetEmail', {
            userName: email.split('@')[0] || 'User',
            resetLink: resetUrl,
        });

        const text = `
Password Reset Request

We received a request to reset your password for your Fluxion account.

To reset your password, click the following link or copy and paste it into your browser:
${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request this password reset, please ignore this email or contact support if you have concerns.

© ${new Date().getFullYear()} Fluxion. All rights reserved.
		`;

        return await this.sendEmail({
            to: email,
            subject: 'Reset Your Password - Fluxion',
            html,
            text,
        });
    }

    async sendPasswordChangedNotification(email: string, userName: string): Promise<boolean> {
        const html = this.loadTemplate('passwordChangedEmail', {
            userName: userName,
            timestamp: new Date().toLocaleString(),
        });

        const text = `
Password Changed Successfully

Hi ${userName},

This is to confirm that your password was successfully changed on ${new Date().toLocaleString()}.

If you did not make this change, please contact our support team immediately and secure your account.

Thank you for using Fluxion!

© ${new Date().getFullYear()} Fluxion. All rights reserved.
		`;

        return await this.sendEmail({
            to: email,
            subject: 'Your Password Has Been Changed - Fluxion',
            html,
            text,
        });
    }

    async sendVerificationOTP(email: string, userName: string, otp: string): Promise<boolean> {
        const html = this.loadTemplate('emailVerificationOTP', {
            userName: userName,
            otp: otp,
        });

        const text = `
Email Verification - Fluxion

Hello ${userName},

Thank you for registering with Fluxion! To complete your registration and verify your email address, please use the verification code below:

Your Verification Code: ${otp}

This code will expire in 10 minutes.

If you didn't create an account with Fluxion, you can safely ignore this email.

© ${new Date().getFullYear()} Fluxion. All rights reserved.
		`;

        return await this.sendEmail({
            to: email,
            subject: 'Verify Your Email - Fluxion',
            html,
            text,
        });
    }
}

export default new EmailService();
