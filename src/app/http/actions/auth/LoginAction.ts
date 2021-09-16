import { Request, Response} from 'express';
import { conflict, success, serverError, badRequest, unauthorized} from "../../responses";
import AuthRepository from "../../repositories/AuthRepository";
import { IUserDocument } from "../../../../database/users/users.types";
import config from "../../../../config";

type signToken = {
    expiresIn: number
}

const signTokenExpiry = {
    expiresIn: 60 * 60 * 24 * 14,
} as signToken;

const execute = async (req: Request| any, res: Response)=> {

    const email:string = req.body.email;
    const password: string = req.body.password;

    try {

        const user: IUserDocument | null = await AuthRepository.getUserByEmail(email);;

    if (!user) {
        return conflict(res,'Email or password is wrong')
    }

    const isValidPassword: boolean = await AuthRepository.validPassword(password, user.password);

    if (!isValidPassword) {
        return badRequest(res, 'Invalid Email or Password');
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

        
    } catch (err) {
        console.log("Error on /api/auth/register: ", err);
        return serverError(res, 'Error occured', err);
    }

}

export default {execute};