import { IregisterBody } from "../Controller/IUserController";

export interface Itoken {
  status : boolean
  message : string
  token : string
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
}

export interface googleLoginData{
  name:string
  email:string
  image:string
}

export default interface IuserUseCase{
  register(data:IregisterBody):Promise<void|loginRes>
  verifyOtp(email:string,otp:string):Promise<Itoken>
  verifyToken(token:string):TokenResponse
  loginAuthentication(data:loginBody):Promise<loginRes|null>
  resendOtp(email:string):Promise<string|null>
  googleLogin(data:googleLoginData):Promise<loginRes|null>
  validateForgotPassword(email:string):Promise<string|null>
  resetPassword(password:string,id:string,token:string):Promise<string|void>
}