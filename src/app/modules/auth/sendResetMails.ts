import nodemailer from 'nodemailer';
import config from '../../../config';

export async function sendResetEmail(to: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: config.smtp.smtp_host,
    port: parseInt(config.smtp.smtp_port as string),
    // secure: false,
    auth: {
      user: config.smtp.smtp_mail,
      pass: config.smtp.smtp_password,
    },
  });

  await transporter.sendMail({
    from: config.smtp.smtp_mail,
    to,
    subject: 'Reset Password Link',
    html,
  });
}
