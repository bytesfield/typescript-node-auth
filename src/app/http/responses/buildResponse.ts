import { Response } from "express";

type responseDataType = {
    status: string,
    statusCode: number,
    message: string,
    data?: {}
    headers?: {}
}

const buildResponse = (response: Response, message: string, status: string, statusCode: number, data: any = null, headers: any = null): Response => {
    const responseData: responseDataType = {
        status: status,
        statusCode: statusCode,
        message: message,
    };

    if (data != null) {
        responseData.data = data;

    }
    if (headers != null) {
        return response.header(headers).status(statusCode).send(responseData)

    }

    return response.status(statusCode).send(responseData);

}

export default buildResponse;