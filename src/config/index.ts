import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  socket_port: process.env.SOCKET_PORT,
  ip: process.env.IP,
  base_url: process.env.BASE_URL,
  database_url: process.env.MONGO_URL,
  database_password: process.env.DB_PASSWORD,
  activation_secret: process.env.ACTIVATION_SECRET,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  smtp: {
    smtp_host: process.env.SMTP_HOST,
    smtp_port: process.env.SMTP_PORT,
    smtp_service: process.env.SMTP_SERVICE,
    smtp_mail: process.env.SMTP_MAIL,
    smtp_password: process.env.SMTP_PASSWORD,
    NAME: process.env.SERVICE_NAME,
  },
  cloudinary: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  },
  resetlink: process.env.RESET_PASS_UI_LINK,

  sendgrid: {
    from_email: process.env.FORM_EMAIL,
    api_key: process.env.SEND_GRIDAPI_KEY,
  },
  stripe: {
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  },
};
