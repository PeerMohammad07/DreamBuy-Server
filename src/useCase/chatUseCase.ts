import IChatRepository from "../Interfaces/Repository/chatRepository";
import { IPushNotificationRepository } from "../Interfaces/Repository/pushNotificatio";
import IchatUseCase from "../Interfaces/UseCase/IchatUsecase";
import IImageAndVideoUpload from "../Interfaces/Utils/ImageAndVideoUpload";

interface FileObject {
  path: string;
  mimetype: string;
}

export default class chatUseCase implements IchatUseCase {
  private chatRepository
  private imageAndVideoUpload : IImageAndVideoUpload

  constructor(chatRepository: IChatRepository, notificationRepository: IPushNotificationRepository,imageAndVideoUpload : IImageAndVideoUpload) {
    this.chatRepository = chatRepository
    this.imageAndVideoUpload = imageAndVideoUpload
  }

  async getConversations(id: string) {
    try {
      return await this.chatRepository.getConversations(id)
    } catch (error) {
      console.log(error);
      throw Error
    }
  }

  async sendMessage(senderId: string, message: string, recieverId: string) {
    try {
      let conversation = await this.chatRepository.getSingleConversation(senderId, recieverId)
      if (!conversation) {
        conversation = await this.chatRepository.createConversation(senderId, recieverId)
      }
      return await this.chatRepository.storeMessage(senderId, message, conversation._id)
    } catch (error) {
      console.log(error);
      throw Error
    }
  }

  async uploadChatFile(senderId: string, files: FileObject[], recieverId: string) {
    try {
      let conversation = await this.chatRepository.getSingleConversation(senderId, recieverId)
      if (!conversation) {
        conversation = await this.chatRepository.createConversation(senderId, recieverId)
      }
      let fileUploadCloudinary: any;
      let videoFiles = files.filter((file: any) => file.mimetype === "video/mp4");
      if (videoFiles.length > 1) {
        return {
          status: false,
          message : "Only one video file is allowed",
        };
      }

      if (videoFiles.length === 1) {
        fileUploadCloudinary = await this.imageAndVideoUpload.uploadVideo(
          videoFiles[0].path,
          "chat-videos"
        );

        
        const messageData = await this.chatRepository.storeMessage(
          senderId,
          fileUploadCloudinary,
          conversation?._id
        );

        return {
          status: true,
          message: "message sent successfully",
          data : messageData
        };
      } else {

        fileUploadCloudinary = await Promise.all(
          files.map(async (file: any) => {
            return await this.imageAndVideoUpload.upload(file.path, "chat");
          })
        );

        const messageDataPromises = fileUploadCloudinary.map(
          async (file: any) => {
            const messageData = await this.chatRepository.storeMessage(senderId,file,conversation?._id);
            return messageData;
          }
        );
  
        const messageDataResults = await Promise.all(messageDataPromises);

        return {
          status: true,
          message: "Files uploaded successfully",
          data: messageDataResults,
        };
      }
      } catch (error) {
        console.log(error);
        throw Error
      }
    }


  async createConversation(senderId: string, recieverId: string){
      try {
        const alreadyConversation = await this.chatRepository.getSingleConversation(senderId, recieverId)
        if (alreadyConversation) {
          return { status: false, message: "Already have conversation" }
        }
        const conversation = await this.chatRepository.createConversation(senderId, recieverId)
        return { status: true, message: "conversation created successfully", data: conversation }
      } catch (error) {
        console.log(error);
        throw Error
      }
    }

  async getMessages(senderId: string, receiverId: string){
      try {
        const conversation = await this.chatRepository.getSingleConversation(senderId, receiverId)
        if (!conversation) {
          return { message: "no conversation between this user", status: false }
        }
        const messages = await this.chatRepository.getMessages(conversation._id)
        return messages
      } catch (error) {
        console.log(error);
        throw Error
      }
    }
  }