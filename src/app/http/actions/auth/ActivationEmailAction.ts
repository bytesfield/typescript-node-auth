import { NextFunction, Request, Response} from 'express';
import { success, serverError} from "../../responses";
import AuthRepository from "../../repositories/AuthRepository";
import config from "../../../../config";
import path from "path";
import { generateRandomString } from "../../../../utils/helpers";
import { IUserDocument } from "../../../../database/users/users.types";
import { sendMail } from "../../../../utils/helpers";

type verificationDataType = {
    baseUrl: string, userId: string, secretCode: string
}

const execute = async (req: Request| any, res: Response, next:NextFunction, user: IUserDocument)=> {
    const baseUrl: string = req.protocol + "://" + req.get("host");

        const secretCode = generateRandomString({length: 6});

        const codePayload: {code: string, email: string} = {
            code: secretCode,
            email: user.email,
        }
        //Create Code
        await AuthRepository.createCode(codePayload);

        //get the absolute path to the view template with the file extension specified.
        let emailVerificationPath: string = path.resolve('./src/views/email/auth/emailVerification.ejs');
        //Define the object that will get passed to the view. If there is no data to pass just pass an empty object.
        let verificationData: verificationDataType = {
            baseUrl: baseUrl,
            userId: user._id,
            secretCode: secretCode

        };

        const emailFrom: string = `${config.app.name} <${config.service.email.username}>`;
        const emailTo: string = user.email;
        const emailSubject: string = "Your Activation Link for YOUR APP";

        const emailTemplate: { name: string, engine: string, context: verificationDataType } = {
            name: emailVerificationPath,
            engine: 'ejs',
            context: verificationData
        }

        //Send Verification Email
        await sendMail(emailFrom, emailTo, emailSubject, emailTemplate);

        return success(res, 'Check Email for Account Activation Link', user)

    
}

export default {execute};