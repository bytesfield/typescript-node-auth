import express, { Request, Response, NextFunction } from "express";
import compression from "compression";
import cors from "cors";
import cookieSession from "cookie-session";
import config from "../src/config";
import csurf from "csurf";
import routes from "./routes";
import ExceptionHandler from "../src/app/middlewares/ExceptionHandler";
import { HttpException } from "../src/app/exceptions";


const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cors());

app.use(
    cookieSession({
        secret: config.cookie.secret,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        httpOnly: true,
        secure: false,
    })
);

// if (config.app.env == "production") {
//     app.use(csurf());

//     app.use((req: Request, res: Response, next: NextFunction): void => {
//         res.set("x-frame-options", "DENY");

//         res.cookie("mytoken", req.csrfToken());
//         next();
//     });
// }

app.use(routes);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
    next(new HttpException(`Requested path ${req.path} not found.`, 404));
});

app.use(ExceptionHandler);

export default app;