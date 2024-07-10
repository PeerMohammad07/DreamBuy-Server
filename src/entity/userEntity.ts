import { Document } from "mongoose";

export default interface IUser extends Document{
  name : string
  email: string
  password : string,
  isBlocked:boolean,
  otpVerified:boolean
  image?:string
}