
import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import config from '../../config';
import { notFound, unauthorized, conflict } from "../responses";

const verifyJwtToken = (req: Request | any, res: Response, next: NextFunction): Response | undefined => {

    let token: string | undefined = req.header('auth-token');

    if (!token) {
        return notFound(res, 'Access Denied, token required');
    }

    try {

        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length).trimLeft();

        }

        const verified: string | jwt.JwtPayload = jwt.verify(token, config.jwt.secret);

        if (!verified) {
            return unauthorized(res, 'Invalid Token');

        }

        req.session.user = verified;

        next();

    } catch (err) {
        return conflict(res, 'Something went wrong, token invalid', err);
    }
}

export default verifyJwtToken;