import { Document, Model } from "mongoose";

export interface IUser {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: string;
    status: string;
}
export interface IUserDocument extends IUser, Document { }
export interface IUserModel extends Model<IUserDocument> { }
