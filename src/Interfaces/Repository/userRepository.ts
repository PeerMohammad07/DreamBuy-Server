import IUser from "../../entity/userEntity";
import { IregisterBody } from "../Controller/IUserController";
import { googleLoginData } from "../UseCase/IuserUseCase";

export interface IotpData {
  _id : string
  otp : string
  email : string
  createdAt : Date
}



export default interface IuserRepository{
  checkEmailExists(email:string):Promise<IUser|null>
  createUser(data:IregisterBody):Promise<IUser|null>
  saveOtp(email:string,otp:string):void
  verifyOtp(email:string):Promise<IotpData|null>
  updateUserVerified(email:string):Promise<IUser|null>
  saveGoogleLogin(data:googleLoginData):void
}