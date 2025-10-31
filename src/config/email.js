require('dotenv').config();

const emailConfig = {
  provider: process.env.EMAIL_PROVIDER || 'gmail',
  
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // Use STARTTLS with port 587
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    logger: false,
    debug: false
  },

  imap: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
    host: process.env.IMAP_HOST,
    port: parseInt(process.env.IMAP_PORT),
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false
    },
    authTimeout: 10000
  },

  from: {
    name: process.env.EMAIL_FROM_NAME || 'Your Name',
    address: process.env.EMAIL_USER
  }
};

module.exports = emailConfig;
