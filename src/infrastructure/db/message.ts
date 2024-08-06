import mongoose, { Schema } from "mongoose";
import { IMessage } from "../../entity/allEntity";

const messageSchema = new Schema({
  message:{
    type:String,
    required : true
  },
  conversationId :{
    type:mongoose.Types.ObjectId,
    requried:true,
    ref : 'conversation'
  },
  senderId : {
    type : mongoose.Types.ObjectId,
    required : true
  }
},{timestamps:true})

const messageModal = mongoose.model<IMessage>('messages',messageSchema)
export default messageModal