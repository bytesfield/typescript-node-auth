import { Request, Response, NextFunction } from "express";
import { buildResponse, serverError } from "../responses";
import config from "../../config";


export default (error: any, req: Request, res: Response, next: NextFunction) => {

    const statusCode: number = error.statusCode || config.http.code.SERVER_ERROR;
    const status: string = error.status || config.http.status.FAILED;
    const message: string = error.message || "Server Error Occured";
    const isOperational: string = error.isOperational || false;

    if (config.app.env == 'production') {

        if (!isOperational) {
            return serverError(res, 'Something went wrong.');
        }

        return buildResponse(res, message, status, statusCode);
    }

    return buildResponse(res, message, status, statusCode, { error: error, stack: error.stack });

}


