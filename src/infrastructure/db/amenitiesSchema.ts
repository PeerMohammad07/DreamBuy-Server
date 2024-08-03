import mongoose, { Schema } from "mongoose";
import { IAmenities } from "../../entity/allEntity";

const amenitiesSchema = new Schema({
  name : {
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

const amenitiesModal = mongoose.model<IAmenities>('amenities',amenitiesSchema)

export default amenitiesModal