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


export interface IProperty extends Document {
  _id : string
  propertyName: string;
  sellerId: string;
  propertyStatus: boolean;
  propertyFor: string;
  propertyType: string;
  state: string;
  city: string;
  features: string[];
  bedroom: string;
  bathroom: number;
  description: string;
  location: string;
  price: number;
  propertyImage: string[];
  square_feet: number;
}


export interface ICategory extends Document {
  _id : string
  name : string
  descripton : string
  isBlocked : boolean
  createdAt : Date
}