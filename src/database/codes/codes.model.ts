import { model } from "mongoose";
import { ICodeDocument } from "./codes.types";
import CodeSchema from "./codes.schema";

export const Code = model<ICodeDocument>("Code", CodeSchema);