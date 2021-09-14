import dotenv from 'dotenv';

dotenv.config();

export default {
    mailgun: {
        secret: process.env.MAILGUN_SECRET || 'MAILGUN_SECRET',
        domain: process.env.MAILGUN_DOMAIN || 'MAILGUN_DOMAIN'
    },
    email: {
        host: process.env.EMAIL_HOST || 'EMAIL_HOST',
        username: process.env.EMAIL_USERNAME || 'EMAIL_USERNAME',
        password: process.env.EMAIL_PASSWORD || 'EMAIL_PASSWORD',
        port: process.env.EMAIL_PORT || 587
    }
};
