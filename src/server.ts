
import app from "./app";
import dotenv from "dotenv";
import config from "./config/index";
import database from "../src/database/index";

dotenv.config();

const appName = config.app.name;
//const port = config.app.port;
const port = 3000;

database.MongoDB.connect();

app.listen(port, () => {
    console.log(`${appName} server is running on ${config.app.env} at port ${port}`);
});