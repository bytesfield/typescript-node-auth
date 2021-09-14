import { User } from "../../../database/users/users.model";
import { IUserDocument } from "../../../database/users/users.types";
import { Code } from "../../../database/codes/codes.model";
import { ICodeDocument } from "../../../database/codes/codes.types";
import config from "../../../config/index";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const createUser = async (payload: object): Promise<IUserDocument> => {
    const newUser = await new User(payload);

    await newUser.save();

    return newUser;
}

const createCode = async (payload: object): Promise<ICodeDocument> => {
    const newCode = await new Code(payload);
    await newCode.save();

    return newCode;
}
const getUserByEmail = async (email: string): Promise<IUserDocument | null> => {

    const user = await User.findOne({ email: email });

    return user;
}

const getUserById = async (id: number): Promise<IUserDocument | null> => {

    const user = await User.findById(id);

    return user;
}

const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
}

const createToken = async (tokenData: object, tokenSecret: jwt.Secret, tokenExpiry: jwt.SignOptions): Promise<string> => {
    const token = await jwt.sign(tokenData, tokenSecret, tokenExpiry);

    return token;
}

const validPassword = async (password: string, inPassword: string): Promise<boolean> => {
    const isValidPassword = await bcrypt.compare(password, inPassword);

    return isValidPassword;
}

const sendEmail = async (from: string, to: string, subject: string, template: any) => {

    //Sends Email Activation Link
    const emailData = {
        from: from,
        to: to,
        subject: subject,
        text: 'text',
        template: template
    };
    const sentEmail = await config.nodemailer.mailgunService.sendMail(emailData);
    return sentEmail;
}

export default {
    createUser,
    createCode,
    sendEmail,
    getUserByEmail,
    hashPassword,
    createToken,
    validPassword,
    getUserById
}