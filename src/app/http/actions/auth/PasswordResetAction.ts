import { Request, Response} from 'express';
import path from "path";
import { generateRandomString } from "../../../../utils/helpers";
import config from "../../../../config";
import { notFound, success, serverError} from "../../responses";
import AuthRepository from "../../repositories/AuthRepository";
import { sendMail } from "../../../../utils/helpers";

const execute = async (req: Request| any, res: Response)=> {

    const { email } = req.body;

    try {
        const user = await AuthRepository.getUserByEmail(email);

        if (!user) {
            return notFound(res, 'The provided email address is not registered!');
        }
        const secretCode = generateRandomString(6);

        const codePayload: {code: string, email: string} = {
            code: secretCode,
            email: email,
        }
        //Create Code
        await AuthRepository.createCode(codePayload);

        //get the absolute path to the view template with the file extension specified.
        let passwordResetEmailPath: string = path.resolve('./src/views/email/auth/passwordResetVerification.ejs');
        //Define the object that will get passed to the view. If there is no data to pass just pass an empty object.
        let passwordResetData: {userName: string, secretCode: string} = {
            userName: user.firstname,
            secretCode: secretCode

        };

        const emailFrom: string = `${config.app.name} <${config.service.email.username}>`;
        const emailTo: string = email;
        const emailSubject: string = "Your Password Reset Code";

        const emailTemplate: { name: string, engine: string, context: {userName: string, secretCode: string} } = {
            name: passwordResetEmailPath,
            engine: 'ejs',
            context: passwordResetData
        }

        //Send Password Reset Code to email
        await sendMail(emailFrom, emailTo, emailSubject, emailTemplate);

        return success(res,'Password reset code Sent to your registered email')

    } catch (err) {
        console.log("Error on /api/auth/password-reset/get-code: ", err);
        return serverError(res,'Something went wrong. Please try again!');
    }
}

export default {execute};