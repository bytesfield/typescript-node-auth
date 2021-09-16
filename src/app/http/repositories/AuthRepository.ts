import { User } from "../../../database/users/users.model";
import { IUserDocument } from "../../../database/users/users.types";
import { Code } from "../../../database/codes/codes.model";
import { ICodeDocument } from "../../../database/codes/codes.types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const createUser = async (payload: object): Promise<IUserDocument> => {
    const newUser: IUserDocument = await new User(payload);

    await newUser.save();

    return newUser;
}

const createCode = async (payload: object): Promise<ICodeDocument> => {
    const newCode: ICodeDocument = await new Code(payload);
    await newCode.save();

    return newCode;
}

const getUserByEmail = async (email: string): Promise<IUserDocument | null> => {

    const user: IUserDocument | null = await User.findOne({ email: email });

    return user;
}

const getUserById = async (id: any): Promise<IUserDocument | null> => {

    const user: IUserDocument | null = await User.findById(id);

    return user;
}

const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword: string = await bcrypt.hash(password, salt);

    return hashedPassword;
}

const createToken = async (tokenData: object, tokenSecret: jwt.Secret, tokenExpiry: jwt.SignOptions): Promise<string> => {
    const token: string = await jwt.sign(tokenData, tokenSecret, tokenExpiry);

    return token;
}

const validPassword = async (password: string, inPassword: string): Promise<boolean> => {
    const isValidPassword: boolean = await bcrypt.compare(password, inPassword);

    return isValidPassword;
}


export default {
    createUser,
    createCode,
    getUserByEmail,
    hashPassword,
    createToken,
    validPassword,
    getUserById
}