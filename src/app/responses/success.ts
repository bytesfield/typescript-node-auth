import { Response } from 'express';
import buildResponse from './buildResponse';
import config from "../../config";

const statusCode = config.http.code.OK;
const status = config.http.status.SUCCESS;

const respond = (response: Response, message: string, data: any = null, headers: any = null): Response => {
    return buildResponse(response, message, status, statusCode, data, headers);
};

export default respond;