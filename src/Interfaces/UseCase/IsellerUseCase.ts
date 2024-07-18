import { IregisterData } from "../../useCase/sellerUseCase";

export interface returnMessage {
  status : boolean
  message : string
  token ?: string
}


export default interface ISellerUsecase {
  register(data:IregisterData):Promise<void|returnMessage>
  verifyOtp(email:string,otp:string):Promise<returnMessage>
  login(email: string, password: string):Promise<returnMessage>
  resendOtp(email:string):Promise<string|null>
  validateForgotPassword(email:string):Promise<string|null>
  resetPassword(password:string,id:string,token:string):Promise<string|void>
}