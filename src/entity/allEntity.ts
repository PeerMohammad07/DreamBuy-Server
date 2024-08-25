import { Document, ObjectId } from "mongoose";

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

export interface IRevenue {
  transactionId: string;
  userId: string;
  amount: number;
  date: Date;
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

export interface IWhishlist extends Document {
  _id:string
  userId : string
  propertyId : string 
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

export interface INotification extends Document {
  userId : string,
  token : string
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
  _id: string;
  propertyName: string;
  sellerId: string;
  propertyStatus: boolean;
  propertyFor: string;
  propertyType: string;
  state: string;
  city: string;
  features: string[];
  noOfBedroom: string;
  noOfBathroom: number;
  description: string;
  location: {
    location: string;
    latitude: number;
    longitude: number;
  };
  locationCoordinates: {
    type: 'Point';
    coordinates: [number, number];
  };
  Price: string;
  propertyImage: string[];
  sqft: string;
  isBoosted: boolean; 
  boostDetails?: { 
    expiryDate?: Date;
    boostLevel?: '1 week' | '1 month' | '3 month';
  };
}



export interface ICategory extends Document {
  _id : string
  name : string
  descripton : string
  isBlocked : boolean
  createdAt : Date
}

export interface IConversation extends Document {
  _id:string,
  senderId : ObjectId
  receiverId :ObjectId
  createdAt : true
  updatedAt : true
}

export interface IMessage extends Document {
  _id:string,
  senderId : ObjectId
  conversationId : string
  message :string
  createdAt? : true
  updatedAt?: true
}


