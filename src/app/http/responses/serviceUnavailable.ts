import { Response } from 'express';
import buildResponse from './buildResponse';
import config from "../../../config";

const statusCode = config.http.code.SERVICE_UNAVAILABLE;
const status = config.http.status.FAILED;

const respond = (response: Response, message: string, data: any = null): Response => {
    return buildResponse(response, message, status, statusCode, data);
};

export default respond;