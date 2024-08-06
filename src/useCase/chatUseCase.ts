import IChatRepository from "../Interfaces/Repository/chatRepository";
import IchatUseCase from "../Interfaces/UseCase/IchatUsecase";

export default class chatUseCase implements IchatUseCase{
  private chatRepository 

  constructor(chatRepository:IChatRepository){
    this.chatRepository = chatRepository
  }

  async getConversations(id:string){
    try {
      return await this.chatRepository.getConversations(id)
    } catch (error) {
      console.log(error);
      throw Error
    }
  } 

  async sendMessage(senderId:string,message:string,recieverId:string){
    try {
      let conversation = await this.chatRepository.getSingleConversation(senderId,recieverId)
      if(!conversation){
        conversation = await this.chatRepository.createConversation(senderId,recieverId)
      }
      return await this.chatRepository.storeMessage(senderId,message,conversation._id)
    } catch (error) {
      console.log(error);
      throw Error
    }
  }

  async getMessages(senderId:string,receiverId:string){
    try {
      const conversation = await this.chatRepository.getSingleConversation(senderId,receiverId)
      if(!conversation){
        return {message:"no conversation between this user",status:false}
      }
      const messages = await this.chatRepository.getMessages(conversation._id)
      return messages
    } catch (error) {
      console.log(error);
      throw Error
    }
  }
}