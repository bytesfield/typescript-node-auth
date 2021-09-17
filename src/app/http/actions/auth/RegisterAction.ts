import { Request, Response} from 'express';
import path from "path";
import { generateRandomString } from "../../../../utils/helpers";
import config from "../../../../config";
import { IUserDocument } from "../../../../database/users/users.types";
import { created, conflict} from "../../responses";
import AuthRepository from "../../repositories/AuthRepository";
import { sendMail } from "../../../../utils/helpers";
import dotenv from 'dotenv';

dotenv.config();

type signToken = {
    expiresIn: number
}

const signTokenExpiry = {
    expiresIn: 60 * 60 * 24 * 14,
} as signToken;

type verificationDataType = {
    baseUrl: string, userId: string, secretCode: string
}

const execute = async (req: Request| any, res: Response)=>{

    const firstname: string = req.body.firstname;
    const lastname: string = req.body.lastname;
    const email: string = req.body.email;
    const password: string = req.body.password;

    try {
        //Check Email Exist
        const emailExist: IUserDocument | null = await AuthRepository.getUserByEmail(email);

        if (emailExist) {
            return conflict(res, 'Email already exist');
        }

        //Hash Password
        const hashedPassword: string = await AuthRepository.hashPassword(password);

        const payload = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashedPassword

        }

        //Saves user to database
        const user: IUserDocument = await AuthRepository.createUser(payload);

        const user_id: any = user._id;

        //Create Token
        const signTokenData = {
            _id: user_id,
        }

        const signTokenSecret: string = config.jwt.secret;

        const token: string = await AuthRepository.createToken(signTokenData, signTokenSecret, signTokenExpiry);

        req.session.token = token;

        const baseUrl: string = req.protocol + "://" + req.get("host");

        const secretCode: string = generateRandomString({length: 6});
 
        const codePayload: { code: string, email: string } = {
            code: secretCode,
            email: user.email,
        }
        //Create Code
        await AuthRepository.createCode(codePayload);

        //get the absolute path to the view template with the file extension specified.
        let emailVerificationPath = path.resolve('./src/views/email/auth/emailVerification.ejs');

        //Define the object that will get passed to the view. If there is no data to pass just pass an empty object.
        let verificationData: verificationDataType = {
            baseUrl: baseUrl,
            userId: user_id,
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

        return created(res, 'Registration Successful, Check Email for Activation Link', user);

    } catch (err) {
        console.log("Error on /api/auth/register: ", err);
        return conflict(res, 'Error occured', err);
    }

}

export default {execute};