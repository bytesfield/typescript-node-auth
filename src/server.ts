
import app from "./app";
import dotenv from "dotenv";
import config from "./config/index";
import database from "../src/database/index";

dotenv.config();

const appName = config.app.name;
const port = config.app.port;

database.MongoDB.connect();

app.listen(port, (): void => {
    console.log(`🚀 ${appName} server is running on ${config.app.env} at port ${port}`);
});