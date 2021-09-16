import { Request, Response, NextFunction } from "express";
import { badRequest, conflict, notFound, serverError, serviceUnavailable, unprocessibleEntity, validationFailed } from "../responses";


const handleValidationError = (error: Error, req: Request, res: Response, next: NextFunction): Response | undefined => {
    if (error.name === 'ValidationError') {
        return validationFailed(res, error.message);
    }
    next(error);

}
const handleTypeError = (error: Error, req: Request, res: Response, next: NextFunction): Response | undefined => {
    if (error.name === 'TypeError') {
        return badRequest(res, error.message);
    }
    next(error);

}

const handleSyntaxError = (error: Error, req: Request, res: Response, next: NextFunction): Response | undefined => {
    if (error.name === 'SyntaxError') {
        return unprocessibleEntity(res, error.message);
    }
    next(error);

}

const handleReferenceError = (error: Error, req: Request, res: Response, next: NextFunction): Response | undefined => {
    if (error.name === 'ReferenceError') {
        return badRequest(res, error.message);
    }
    next(error);

}

const handleNotFoundError = (error: Error, req: Request, res: Response, next: NextFunction): Response | undefined => {
    if (error.name === 'NotFoundError') {
        return notFound(res, error.message);
    }
    next(error);
}

const handleDatabaseError = (error: any, req: Request, res: Response, next: NextFunction): Response | undefined => {
    if (error.name === 'MongoError') {
        if (error.code === 11000) {
            return conflict(res, error.message);
        }
        return serviceUnavailable(res, error.message);

    }
    next(error);
}

const handleServerError = (error: Error, req: Request, res: Response, next: NextFunction): Response | void => {
    if (res.headersSent) {
        return next(error)
    }
    return serverError(res, error.message);

}

export default {
    handleValidationError,
    handleNotFoundError,
    handleDatabaseError,
    handleServerError,
    handleReferenceError,
    handleTypeError,
    handleSyntaxError

}