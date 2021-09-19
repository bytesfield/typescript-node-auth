import { IUserDocument } from "../../database/users/users.types";
import AuthRepository from "../../app/http/repositories/AuthRepository";


class UserFactory {

    async create(status: string = 'active'): Promise<IUserDocument>{

        const hashedPassword = await AuthRepository.hashPassword('Password@123');

        const payload: { firstname: string, lastname: string, email: string, password:string, status: string } = {
            firstname : 'Abraham',
            lastname : 'Udele',
            email : "codeflashtech@gmail.com",
            password : hashedPassword,
            status : status
        }
    
        const user: IUserDocument = await AuthRepository.createUser(payload);

        return user;
    }
}


export default UserFactory;
