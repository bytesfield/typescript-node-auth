import { Request, Response} from 'express';
import { notFound, success, serverError} from "../../responses";
import AuthRepository from "../../repositories/AuthRepository";
import { IUserDocument } from "../../../../database/users/users.types";
import { ICodeDocument } from "../../../../database/codes/codes.types";
import { User } from "../../../../database/users/users.model";
import { Code } from "../../../../database/codes/codes.model";

const execute = async (req: Request| any, res: Response)=> {

    const { email, password, code } = req.body;

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

export default {execute};