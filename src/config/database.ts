import dotenv from 'dotenv';

dotenv.config();

export default {
    mongoDbConnection: process.env.MONGODB_CONNECTION || "MONGODB_CONNECTION"
};