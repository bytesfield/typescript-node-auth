import { NextFunction, Request, Response } from 'express';
import { success, serverError, badRequest, notFound, unauthorized } from "../../responses";
import AuthRepository from "../../repositories/AuthRepository";
import { IUserDocument } from "../../../../database/users/users.types";
import { User } from "../../../../database/users/users.model";


const execute = async (req: Request | any, res: Response, next: NextFunction) => {

    const { password } = req.body;

    const user_id: any = req.session.user._id;

    const user: IUserDocument | null = await AuthRepository.getUserById(user_id);

    if (!user) {
        return notFound(res, 'User not found');
    }

    if (user.status != "active") {
        return unauthorized(res, 'Account not active, please activate account');

    }

    const passwordCheckSuccess: boolean = await AuthRepository.validPassword(password, user.password);

    if (!passwordCheckSuccess) {
        return badRequest(res, 'The provided password is not correct');
    }

    await User.deleteOne({
        email: user.email,
    });

    return success(res, 'Account deleted Successfully')

}

export default { execute };