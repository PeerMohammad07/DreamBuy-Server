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
  verficationImage:string,
  kycVerified:string
}

export interface IOtp extends Document {
  _id:string
  otp: string;
  email: string;
  createdAt: Date;
}


export interface IAdmin extends Document {
  _id : string
  name : string
  email : string
  password : string
}

export interface IToken extends Document {
  _id : string
  token : string
  userId : string
  email : string
}