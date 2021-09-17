import { Request, Response} from 'express';
import { conflict, success, forbidden} from "../../responses";
import { IUserDocument } from "../../../../database/users/users.types";
import { ICodeDocument } from "../../../../database/codes/codes.types";
import { User } from "../../../../database/users/users.model";
import { Code } from "../../../../database/codes/codes.model";


const execute = async (req: Request| any, res: Response, user: IUserDocument)=> {

    try {
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
            return success(res, 'Account Activated Successfully')
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

export default {execute};