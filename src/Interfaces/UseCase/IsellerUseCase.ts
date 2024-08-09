import { IProperty, ISeller } from "../../entity/allEntity";
import { IregisterData } from "../../useCase/sellerUseCase";

export interface returnMessage {
  status: boolean
  message: string
  token?: string
  sellerRefreshToken?:string
}

export interface updateKycReturn {
  status: boolean
  message: string
  seller?: ISeller
}

export interface PropertyData {
  sqft:string
  propertyType: string;
  propertyFor: string;
  propertyName: string;
  state: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  expectedPrice: number;
  features: string[];
  description: string;
  images: { base64String: string; fileName: string; fileType: string }[];
  location: string;
  sellerId: string
};


export interface Property {
  sqft:String
  propertyType: string;
  propertyFor: string;
  propertyName: string;
  state: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  expectedPrice: number;
  features: string[];
  description: string;
  images: string[];
  location: string;
  sellerId: string
};


export default interface ISellerUsecase {
  register(data: IregisterData): Promise<void | returnMessage>
  verifyOtp(email: string, otp: string): Promise<returnMessage>
  login(email: string, password: string): Promise<returnMessage>
  resendOtp(email: string): Promise<string | null>
  validateForgotPassword(email: string): Promise<string | null>
  resetPassword(password: string, id: string, token: string): Promise<string | void>
  updateKycImage(buffer: string, type: string, id: string): Promise<updateKycReturn | null>
  kycStatusUpdate(id: string, status: string): Promise<ISeller | null>
  blockSeller(id: string, status: boolean): Promise<string | null>
  addProperty(id: string, data: PropertyData): Promise<string | null>
  changePassword(oldPassword:string,newPassword:string,sellerId:string):Promise<string|null>
  updateSeller(name:string,phone:string,sellerId:string):Promise<updateKycReturn|null>
  getMyProperty(id:string):Promise<IProperty[]|null>
  deleteProperty(id:string):Promise<returnMessage|null>
}