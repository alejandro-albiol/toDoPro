import nodemailer from 'nodemailer';
import { InvalidEmailConfigException } from '../../auth/exceptions/invalid-email-config.exception.js';

export class EmailService {
    private static transporter: nodemailer.Transporter;

    static initialize(): void {
        if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new InvalidEmailConfigException('Email configuration is missing');
        }

        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    static async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
        if (!this.transporter) {
            this.initialize();
        }

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        await this.transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to,
            subject: 'Password Reset Request',
            html: `
                <h1>Password Reset Request</h1>
                <p>You have requested to reset your password. Click the link below to proceed:</p>
                <a href="${resetLink}">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you did not request this, please ignore this email.</p>
            `
        });
    }
} 