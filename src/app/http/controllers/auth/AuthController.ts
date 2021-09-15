import express, { Request, Response, NextFunction } from 'express';
import path from "path";
import { isEmptyObject, isValidPassword, generateRandomString } from "../../../../utils/helpers";
import config from "../../../../config";
import { IUserDocument } from "../../../../database/users/users.types";
import { ICodeDocument } from "../../../../database/codes/codes.types";
import { User } from "../../../../database/users/users.model";
import { Code } from "../../../../database/codes/codes.model";
import { success, created, badRequest, forbidden, notFound, unauthorized, validationFailed, conflict, serverError } from "../../responses";
import { number } from "joi";
import { loginValidator, passwordResetValidator, registerValidator, utilValidator } from '../../../http/validators';
import AuthRepository from "../../repositories/AuthRepository";
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

/**
   * User Registration
   * @param Request req
   * @param {object} res
   * 
   * @returns {object} User 
*/
const register = async (req: Request| any, res: Response, next: NextFunction) => {

    const firstname: string = req.body.firstname;
    const lastname: string = req.body.lastname;
    const email: string = req.body.email;
    const password: string = req.body.password;

    // Validate request
    const { error } = registerValidator.validate(req.body);

    if (error) {
        return validationFailed(res, error.details[0].message);
    }
    //Validate Password
    const validPassword: boolean | undefined = isValidPassword(password);

    if (!validPassword) {
        return validationFailed(res, 'Password must be at least 6 characters, a lowercase and uppercase letter, a numeric and special character.');
    }

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

        const secretCode: string = generateRandomString(6);

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
        await AuthRepository.sendEmail(emailFrom, emailTo, emailSubject, emailTemplate);

        return created(res, 'Registration Successful, Check Email for Activation Link', user);

    } catch (err) {
        console.log("Error on /api/auth/register: ", err);
        return conflict(res, 'Error occured', err)
    }

}

/**
   * User Login
   * @param {object} req
   * @param {object} res
   * 
   * @returns {string} token 
*/
const login = async (req: Request| any, res: Response, next: NextFunction): Promise<Response|any> => {

    const email:string = req.body.email;
    const password: string = req.body.password;

    // Validate request
    const { error } = loginValidator.validate(req.body);

    if (error) {
        return validationFailed(res, error.details[0].message);
    }

    const user: IUserDocument | null = await AuthRepository.getUserByEmail(email);;

    if (!user) {
        return conflict(res,'Email or password is wrong')
    }

    const userStatus: string = user.status;

    const isValidPassword: boolean = await AuthRepository.validPassword(password, user.password);

    if (!isValidPassword) {
        return badRequest(res, 'Invalid Email or Password');
    }

    if (userStatus != "active") {
        return unauthorized(res, 'User Account not active, please activate account');

    }

    const signTokenData = {
        _id: user._id,
    }

    //Create and assign token
    const signTokenSecret = config.jwt.secret;

    const token = await AuthRepository.createToken(signTokenData, signTokenSecret, signTokenExpiry);

    const tokenData = {
        token: token
    };

    return success(res, 'Logged in Successfully', tokenData, {'auth-token': token});

}

/**
   * User Get Activation Email
   * @param {object} req
   * @param {object} res
   * 
   * @returns {object} User 
*/

const getActivationEmail = async (req: Request| any, res: Response, next: NextFunction): Promise<Response|any>  => {
    const baseUrl: string = req.protocol + "://" + req.get("host");

    try {
        const userId: any = req.user._id
        const user: IUserDocument | null = await AuthRepository.getUserById(userId);

        if (!user) {
            return notFound(res,'User not found');
        }
        await Code.deleteMany({ email: user.email });

        const secretCode = generateRandomString(6);

        const codePayload = {
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
        await AuthRepository.sendEmail(emailFrom, emailTo, emailSubject, emailTemplate);

        return success(res, 'Successful, Check Email for Activation Link', user)

    } catch (err) {
        console.log("Error on /api/auth/get-activation-email:: ", err);
        return conflict(res,'Error occurred', err);
    }
}

/**
   * User verifies email
   * @param {object} req
   * @param {object} res
   * 
   * @returns \json
*/
const verifyAccount = async (req: Request| any, res: Response): Promise<Response|any>  => {
    try {
        const user: IUserDocument| null = await User.findById(req.params.userId);

        if (!user) { 
            return notFound(res, 'User not found');
        }

        const response: ICodeDocument | null = await Code.findOne({
            email: user.email,
            code: req.params.secretCode,
        });

        if (!response) {
            return forbidden(res,'Activation Link is expired or used already');
        }

        const activateUser = await User.updateOne(
            { email: user.email },
            { status: "active" }
        );
        const deleteUserCode = await Code.deleteMany({ email: user.email });

        if (activateUser && deleteUserCode) {
            return success(res, 'Account Activated you can proceed to login')
        }
        return conflict(res,'Something went wrong')

    } catch (err) {
        console.log(
            "Error on /api/auth/verification/verify-account: ",
            err
        );
        return conflict(res,'Something went wrong', err)
    }
}

/**
   * User get Password Reset Code
   * @param {object} req
   * @param {object} res
   * 
   * @returns \json
*/
const passWordResetGetCode = async (req: Request| any, res: Response): Promise<Response|any>  => {

    const { email } = req.body;

    // Validate request
    const { error } = utilValidator.emailValidator.validate(req.body);

    if (error) {
        return validationFailed(res, error.details[0].message);
    }

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
        const code: ICodeDocument = await AuthRepository.createCode(codePayload);

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
        await AuthRepository.sendEmail(emailFrom, emailTo, emailSubject, emailTemplate);

        return success(res,'Password reset code Sent to your registered email')

    } catch (err) {
        console.log("Error on /api/auth/password-reset/get-code: ", err);
        return serverError(res,'Something went wrong. Please try again!');
    }
}

/**
   * User Reset Password
   * @param {object} req
   * @param {object} res
   * 
   * @returns \json 
*/
const passWordResetVerify = async (req: Request| any, res: Response): Promise<Response|any>  => {
    const { email, password, code } = req.body;
    // Validate request
    const { error } = passwordResetValidator.validate(req.body);

    if (error) {
        return validationFailed(res, error.details[0].message);
    }
    //Validate Password
    const validPassword: boolean|undefined = isValidPassword(password);

    if (!validPassword) {
        return validationFailed(res, 'Password must be at least 6 characters long with lowercase, uppercase, numeric digit and special character.');
    }
    try {
        const user: IUserDocument | null = await AuthRepository.getUserByEmail(email);

        if (!user) {
            return notFound(res,'The provided email address is not registered!');
        }

        const response: ICodeDocument | null = await Code.findOne({ email, code });

        if (!response) {
            return notFound(res,'Code invalid or expired');
        }

        const newHashedPassword: string = await AuthRepository.hashPassword(password);

        await User.updateOne({ email }, { password: newHashedPassword });
        await Code.deleteOne({ email, code });

        return success(res, 'Password updated Successfully');

    } catch (err) {
        console.log("Error on /api/auth/password-reset/verify: ", err);

        return serverError(res, 'Something went wrong. Please try again!')
    }
}

/**
   * User Logout
   * @param {object} req
   * @param {object} res
   * 
   * @returns \json
*/
const logout = async (req: Request| any, res: Response): Promise<Response|any>  => {

    req.session = null;

    return success(res, 'Logout Successfully');
}

/**
   * User Delete Account
   * @param {object} req
   * @param {object} res
   * 
   * @returns \json
*/
const deleteAccount = async (req: Request| any, res: Response): Promise<Response|any> => {
    const { password } = req.body;

    //Request Validation
    const { error } = utilValidator.passwordValidator.validate(req.body);

    if (error) {
        return validationFailed(res, error.details[0].message);
    }

    try {
        const user_id = req.session.user._id;

        const user: IUserDocument | null = await AuthRepository.getUserById(user_id);

        if (!user) {
            return notFound(res,'User not found');
        }

        const passwordCheckSuccess: boolean = await AuthRepository.validPassword(password, user.password);

        if (!passwordCheckSuccess) {
            return badRequest(res,'The provided password is not correct');
        }

        const deletedUser = await User.deleteOne({
            email: user.email,
        });

        return success(res, 'Account deleted Successfully')

    } catch (err) {
        console.log("Error on /api/auth/delete-account: ", err);

        return serverError(res,'Something went wrong. Please try again!');
    }

}


export default {
    register,
    login,
    getActivationEmail,
    verifyAccount,
    passWordResetGetCode,
    passWordResetVerify,
    logout,
    deleteAccount
}