import mongoose, { Schema } from "mongoose"
import { IConversation } from "../../entity/allEntity"

const conversationSchema = new Schema({
  senderId : {
    type:mongoose.Types.ObjectId,
    required : true
  },
  receiverId :{
    type:mongoose.Types.ObjectId,
    required : true
  }
},{timestamps:true})


const conversationModal = mongoose.model<IConversation>('conversation',conversationSchema)

export default conversationModal