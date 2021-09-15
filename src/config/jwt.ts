import dotenv from 'dotenv';

dotenv.config();

export default {
    secret: process.env.JWT_SECRET || 'JWT_SECRET',
    expires_in: process.env.JWT_TOKEN_EXPIRES_IN || '1h',
};