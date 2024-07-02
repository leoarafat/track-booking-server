/* eslint-disable @typescript-eslint/ban-ts-comment */
import nodemailer, { Transporter } from 'nodemailer';
import { IEmailOptions } from '../app/modules/user/user.interface';
import config from '../config';
import { formattedDate } from './utils';

const sendEmail = async (options: IEmailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: config.smtp.smtp_host,
    port: parseInt(config.smtp.smtp_port as string),
    auth: {
      user: config.smtp.smtp_mail,
      pass: config.smtp.smtp_password,
    },
  });
  const { email, subject, html } = options;

  const mailOptions = {
    from: `${config.smtp.NAME} <${config.smtp.smtp_mail}>`,
    to: email,
    date: formattedDate,
    signed_by: 'bdCalling.com',
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
