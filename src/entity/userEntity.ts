import { Document } from "mongoose";

export default interface IUser extends Document {
  _id:string
  name: string;
  email: string;
  password: string;
  isBlocked: boolean;
  otpVerified: boolean;
  image?: string;
}

export interface ISeller extends Document {
  _id:string
  name:string
  email:string
  password:string
  isBlocked:boolean
  otpVerified:boolean
  image?:string
  verficationImage:string
}

export interface IOtp extends Document {
  _id:string
  otp: string;
  email: string;
  createdAt: Date;
}
