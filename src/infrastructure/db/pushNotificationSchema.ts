import mongoose, {  Schema } from "mongoose";
import { INotification } from "../../entity/allEntity";

const pushNotificationSchema = new Schema({
  userId:{
    type:mongoose.Types.ObjectId,
    required:true
  },
  token :{
    type : {
      type:String,
      required:true
    }
  }
})

const notificationModel = mongoose.model<INotification>('notification',pushNotificationSchema)

export default notificationModel