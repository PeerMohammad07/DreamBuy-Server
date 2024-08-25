import IUser, { IProperty, ISeller, IWhishlist } from "../../entity/allEntity";
import { IregisterBody } from "../Controller/IUserController";

export interface Itoken {
  status : boolean
  message : string
  token : string
  refreshToken ? :string,
}

export interface updateUser{
  status:boolean,
  message:string,
  user ?: IUser
}

export interface TokenResponse{
  status:boolean,
  decoded?:object
}

export interface loginBody {
  email:string
  password: string
}

export interface loginRes {
  status:boolean
  message : string
  token?: string
  refreshToken ?: string
  user?:IUser
}

export interface googleLoginData{
  name:string
  email:string
  image:string
}

interface premiumData {
  id:string
  price : string,
  interval : string
}

interface returnMessage {
  status:boolean,
  message:string,
  data ?: IProperty|null|IWhishlist
}

export default interface IuserUseCase{
  register(data:IregisterBody):Promise<void|loginRes>
  verifyOtp(email:string,otp:string):Promise<Itoken>
  verifyToken(token:string):TokenResponse
  loginAuthentication(data:loginBody):Promise<loginRes|null>
  resendOtp(email:string):Promise<string|null>
  googleLogin(data:googleLoginData):Promise<loginRes|null>
  googleRegister(data: googleLoginData) :Promise<loginRes|null>
  validateForgotPassword(email:string):Promise<string|null>
  resetPassword(password:string,id:string,token:string):Promise<string|void>
  getUsers(id:string,role:string):Promise<IUser|ISeller|null>
  getSaleProperty():Promise<IProperty[]|null>
  getRentProperty():Promise<IProperty[]|null>
  updateUser(id:string,name:string,image:string,type:string):Promise<updateUser|null>
  getPremium(data:any):Promise<null>
  updatePremium(id:string,type:string):Promise<IUser|null>
  productDetail(id:string):Promise<returnMessage|null>
  sendOwnerDetail(sellerId:string,email:string,name:string,property:IProperty):Promise<returnMessage|null>
  removeFromWhishlist(userId:string,propertyId:string):Promise<returnMessage|null>
  addToWhishlist(userId:string,propertyId:string):Promise<returnMessage|null>
  getAllWhishlistProperty(userId:string):Promise<IWhishlist[]|null>
  getListingProperty(search:any,filter:any,sort:any,locSearch:any):Promise<null|IProperty[]>
}