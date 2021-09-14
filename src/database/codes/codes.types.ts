import { Date, Document, Model } from "mongoose";

export interface ICode {
    email: string;
    code: string;
    dateCreated: Date;
}
export interface ICodeDocument extends ICode, Document { }
export interface ICodeModel extends Model<ICodeDocument> { }
