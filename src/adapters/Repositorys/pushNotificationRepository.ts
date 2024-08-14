import notificationModel from "../../infrastructure/db/pushNotificationSchema"
import firebase from "../../infrastructure/utils/firebase";
import { IPushNotificationRepository } from "../../Interfaces/Repository/pushNotificatio";

export default class PushNotificationRepository implements IPushNotificationRepository {

  async updateToken(userId:string,token:string){
    try {
      return await notificationModel.updateOne({userId:userId},{$set:{token:token}},{upsert:true})
    } catch (error) {
      console.log(error)
    }
  }

  async sendPushNotification(receiverId:string,content:string){
    try {
      const pushToken = await notificationModel.findOne({
        userId: receiverId,
      });

      if (!pushToken || !pushToken.token) {
        console.error("No valid push token found for user:", receiverId);
        return; 
      }

      let message = {
        token: pushToken.token,
        notification: {
          title: "Dream Buy",
          body: content,
        },
      };
      const response = await firebase.messaging().send(message);
    } catch (error) {
      
    }
  }
}