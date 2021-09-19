import { Request, Response, NextFunction } from 'express';
import { isValidPassword } from "../../../../utils/helpers";
import { IUserDocument } from "../../../../database/users/users.types";
import { User } from "../../../../database/users/users.model";
import { Code } from "../../../../database/codes/codes.model";
import { success, notFound, validationFailed } from "../../responses";
import { loginValidator, passwordResetValidator, registerValidator, utilValidator } from '../../../http/validators';
import AuthRepository from "../../repositories/AuthRepository";
import RegisterAction from "../../actions/auth/RegisterAction";
import PasswordResetAction from "../../actions/auth/PasswordResetAction";
import PasswordResetVerifyAction from "../../actions/auth/PasswordResetVerifyAction";
import LoginAction from '../../actions/auth/LoginAction';
import ActivationEmailAction from "../../actions/auth/ActivationEmailAction";
import VerifyAccountAction from "../../actions/auth/VerifyAccountAction";
import DeleteAccountAction from "../../actions/auth/DeleteAccountAction";


/**
   * User Registration
   * 
   * @param {Request} req
   * @param {Response} res
   * 
   * @returns {Promise|Response/any} 
*/
const register = async (req: Request | any, res: Response, next: NextFunction): Promise<Response | any> => {

    const { error } = registerValidator.validate(req.body);

    if (error) {
        return validationFailed(res, error.details[0].message);
    }
    //Validate Password
    const validPassword: boolean | undefined = isValidPassword(req.body.password);

    if (!validPassword) {
        return validationFailed(res, 'Password must be at least 6 characters, a lowercase and uppercase letter, a numeric and special character.');
    }

    const registerAction: Promise<Response | any> = RegisterAction.execute(req, res, next);

    return registerAction;
}

/**
   * User Login
   * 
     @param {Request} req
   * @param {Response} res
   * 
   * @returns {Promise <Response|any>}
*/
const login = async (req: Request | any, res: Response, next: NextFunction): Promise<Response | any> => {

    const { error } = loginValidator.validate(req.body);

    if (error) {
        return validationFailed(res, error.details[0].message);
    }

    const login = LoginAction.execute(req, res, next);

    return login;
}

/**
   * User Get Activation Email
   * 
     @param {Request} req
   * @param {Response} res
   * 
   * @returns {Promise <Response|any>}
*/
const getActivationEmail = async (req: Request | any, res: Response, next: NextFunction): Promise<Response | any> => {

    const user_id: any = req.session.user._id;

    const user: IUserDocument | null = await AuthRepository.getUserById(user_id);

    if (!user) {
        return notFound(res, 'User not found');
    }

    await Code.deleteMany({ email: user.email });

    const activationEmail = ActivationEmailAction.execute(req, res, next, user);

    return activationEmail


}

/**
   * User verifies email
   * 
     @param {Request} req
   * @param {Response} res
   * 
   * @returns {Promise <Response|any>}
*/
const verifyAccount = async (req: Request | any, res: Response, next: NextFunction): Promise<Response | any> => {

    const user: IUserDocument | null = await User.findById(req.params.userId);

    if (!user) {
        return notFound(res, 'User not found');
    }

    const verifyAction: Promise<Response | any> = VerifyAccountAction.execute(req, res, next, user);

    return verifyAction;
}

/**
   * User get Password Reset Code
   * 
     @param {Request} req
   * @param {Response} res
   * 
   * @returns {Promise <Response|any>}
*/
const passWordResetGetCode = async (req: Request | any, res: Response, next: NextFunction): Promise<Response | any> => {

    const { error } = utilValidator.emailValidator.validate(req.body);

    if (error) {
        return validationFailed(res, error.details[0].message);
    }

    const passwordReset: Promise<Response | any> = PasswordResetAction.execute(req, res, next);

    return passwordReset;
}

/**
   * User Reset Password
   * 
     @param {Request} req
   * @param {Response} res
   * 
   * @returns {Promise <Response|any>}
*/
const passWordResetVerify = async (req: Request | any, res: Response, next: NextFunction): Promise<Response | any> => {

    const { password } = req.body;

    const { error } = passwordResetValidator.validate(req.body);

    if (error) {
        return validationFailed(res, error.details[0].message);
    }

    const validPassword: boolean | undefined = isValidPassword(password);

    if (!validPassword) {
        return validationFailed(res, 'Password must be at least 6 characters long with lowercase, uppercase, numeric digit and special character.');
    }

    const verify: Promise<Response | any> = PasswordResetVerifyAction.execute(req, res, next);

    return verify;

}

/**
   * User Logout
   * 
     @param {Request} req
   * @param {Response} res
   * 
   * @returns {Promise <Response|any>}
*/
const logout = async (req: Request | any, res: Response): Promise<Response | any> => {

    req.session = null;

    return success(res, 'Logout Successfully');
}

/**
   * User Delete Account
   * 
   * @param {Request} req
   * @param {Response} res
   * 
   * @returns {Promise <Response|any>}
*/
const deleteAccount = async (req: Request | any, res: Response, next: NextFunction): Promise<Response | any> => {

    const { error } = utilValidator.passwordValidator.validate(req.body);

    if (error) {
        return validationFailed(res, error.details[0].message);
    }

    const deleteAccount = DeleteAccountAction.execute(req, res, next);

    return deleteAccount;

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