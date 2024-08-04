import { Document } from "mongoose";

interface IPremiumSubscription {
  subscriptionType?: 'weekly' | 'monthly' | 'three_months';
  startDate?: Date;
  expiryDate?: Date;
}

export interface IAmenities extends Document {
  name: string;
  isBlocked: boolean;
  createdAt: Date;
}

export default interface IUser extends Document {
  _id:string
  name: string;
  email: string;
  password: string;
  isBlocked: boolean;
  otpVerified: boolean;
  image?: string;
  isPremium: boolean;
  premiumSubscription?: IPremiumSubscription;
}

export interface ISeller extends Document {
  _id:string
  name:string
  email:string
  password:string
  phone:number
  isBlocked:boolean
  otpVerified:boolean
  image?:string
  verficationImage:string
  verificationImageUrl:string,
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

interface location {
  location : string
  latitude:number
  longitude:number
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
  location: location;
  Price: number;
  propertyImage: string[];
  sqft: number;
}


export interface ICategory extends Document {
  _id : string
  name : string
  descripton : string
  isBlocked : boolean
  createdAt : Date
}