import mongoose, { Schema } from "mongoose";
import { IAdmin } from "../../entity/allEntity";

const admin = new Schema({
  name : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true
  },
  password : {
    type : String,
    required : true 
  }
})

const adminSchema = mongoose.model<IAdmin>("admin",admin)
export default adminSchema