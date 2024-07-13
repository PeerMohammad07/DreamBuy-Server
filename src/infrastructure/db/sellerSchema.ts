import mongoose, { Schema } from "mongoose";
import { ISeller } from "../../entity/userEntity";

const sellerSchema = new Schema({
  name : {
    type:String,
    required:true
  },
  email : {
    type:String,
    required:true
  },
  password :{
    type:String,
    required:true
  },
  isBlocked :{
    type:Boolean,
    default : false,
    required:true
  },
  verficationImage : {
    type:String
  },
  image : {
    type:String
  },
  otpVerified :{
    type:Boolean,
    default : false,
    required: true
  }
})

const Seller = mongoose.model<ISeller>("sellerSchema",sellerSchema)

export default Seller