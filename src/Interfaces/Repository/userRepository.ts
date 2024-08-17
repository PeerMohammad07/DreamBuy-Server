import mongoose from "mongoose";
import IUser, { IProperty, IRevenue, ISeller, IWhishlist } from "../../entity/allEntity";
import { IregisterBody } from "../Controller/IUserController";
import { googleLoginData, Itoken } from "../UseCase/IuserUseCase";
import { DeleteResult } from 'mongodb';

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

export interface IRevenueData {
  transactionId: string|undefined
  userId: string;
  amount: number;
  date: Date;
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
  getSeller(id:string):Promise<ISeller|null>
  addToWhishlist(userId:string,propertyId:string):Promise<IWhishlist>
  removeFromWhishlist(userId:string,propertyId:string):Promise<DeleteResult>
  getAllWhishlistProperty(userId:string):Promise<IWhishlist[]>
  whishlistPropertyExist(userId:string,propertyId:string):Promise<IWhishlist|null>
  updateRevenue(data:IRevenueData):Promise<IRevenue>
}