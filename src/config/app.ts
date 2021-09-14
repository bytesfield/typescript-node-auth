import dotenv from 'dotenv';

dotenv.config();

export default {
    name: process.env.APP_NAME || 'Node',
    port: process.env.APP_PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    url: process.env.APP_URL || 'http://localhost',
};