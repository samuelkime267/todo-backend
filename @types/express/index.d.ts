import { Document } from "mongoose";
import User, { UserType } from "../../models/user.model";
import { Types } from "mongoose";

export type UserDocument = Document<unknown, any, UserType> &
  UserType & { _id: Types.ObjectId };

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      tokenExpiryDate?: Date;
      resource?: any;
    }
  }
}
