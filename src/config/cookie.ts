import dotenv from "dotenv";

dotenv.config();

export default {
    secret: process.env.COOKIE_SESSION_SECRET || 'mytoken'
};