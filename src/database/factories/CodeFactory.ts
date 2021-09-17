import AuthRepository from "../../app/http/repositories/AuthRepository";
import { generateRandomString } from "../../utils/helpers";
import { ICodeDocument } from "../codes/codes.types";

class CodeFactory {
    async create(email: string): Promise<ICodeDocument> {

        const secretCode: string = generateRandomString({length: 6});

        const payload: { code: string, email: string} = {
            code: secretCode,
            email: email,
        };

        const code = await AuthRepository.createCode(payload);

        return code;
    }
}

export default CodeFactory;
