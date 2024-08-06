import mongoose from "mongoose";
import IUser, { IProperty, ISeller } from "../../entity/allEntity";
import { IregisterBody } from "../Controller/IUserController";
import { googleLoginData, Itoken } from "../UseCase/IuserUseCase";

export interface IotpData {
  _id : string
  otp : string
  email : string
  createdAt : Date
}

export interface IPremiumSubscription {
  subscriptionType: string;
  startDate: Date;
  expiryDate: Date;
}

export default interface IuserRepository{
  checkEmailExists(email:string):Promise<IUser|null>
  checkUserExists(id:string):Promise<IUser|null>
  createUser(data:IregisterBody):Promise<IUser|null>
  saveOtp(email:string,otp:string):void
  verifyOtp(email:string):Promise<IotpData|null>
  updateUserVerified(email:string):Promise<IUser|null>
  saveGoogleLogin(data:googleLoginData):void
  updateUserPassword(id:string,password:string):Promise<IUser|null>
  getSaleProperty():Promise<IProperty[]|null>
  getRentProperty():Promise<IProperty[]|null>
  updateUser(id:string,name:string,image:string):Promise<IUser|null>
  updatePremium(id:string,newSubscription:IPremiumSubscription): Promise<IUser | null>
  productDetail(id:string):Promise<IProperty|null>
  checkSellerExists(id: string):Promise<ISeller|null>
  getUser(id:string):Promise<IUser|null>
}