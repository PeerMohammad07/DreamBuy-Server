import mongoose, { Schema } from "mongoose";
import { ICategory } from "../../entity/allEntity";

const categorySchema = new Schema({
  name : {
    type:String,
    required : true
  },
  description :{
    type:String,
    required : true
  },
  isBlocked :{
    type:Boolean,
    default : false,
    required : true
  },
  createdAt :{
    type:Date,
    default : new Date(),
    required:true
  }
})

const categoryModal = mongoose.model<ICategory>('category',categorySchema)

export default categoryModal