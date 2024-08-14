export interface IPushNotificationRepository {
  updateToken(userId: string, token: string): Promise<any>;
  sendPushNotification(receiverId: string, content: string): Promise<void>;
}