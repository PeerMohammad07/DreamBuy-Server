import { Model } from "mongoose";
import { IConversation, IMessage } from "../../entity/allEntity";
import IChatRepository from "../../Interfaces/Repository/chatRepository";

export default class chatRepository implements IChatRepository{

  private conversation : Model<IConversation>
  private message : Model<IMessage>

  constructor(conversation:Model<IConversation>,messsage:Model<IMessage>){
    this.conversation = conversation
    this.message = messsage 
  }

  async getConversations(id:string){
    try {
      return await this.conversation.find({$or:[{senderId:id},{receiverId:id}]})
    } catch (error) {
      console.log(error);
      throw Error 
    }
  } 

  async storeMessage(senderId:string,message:string,conversationId:string){
    try {
      const newMessage = new this.message({
        conversationId,
        message,
        senderId
      })
      await newMessage.save()
      return newMessage
    } catch (error) {
      console.log(error);
      throw Error 
    }
  }

  async getSingleConversation(senderId:string,receiverId:string){
    try {
      const conversation = await this.conversation.findOne({
        $or: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      });
      return conversation
    } catch (error) {
      console.log(error);
      throw Error 
    }
  }

  async createConversation(senderId:string,receiverId:string){
    try {
      const newConversation =  new this.conversation({
        receiverId,
        senderId
      })
      await newConversation.save()
      return newConversation
    } catch (error) {
      console.log(error);
      throw Error 
    }
  }

  async getMessages(conversationId:string){
    try {
      return await this.message.find({conversationId}).populate({
        path: 'conversationId',
        select: 'senderId receiverId',
        populate: ['senderId', 'receiverId'] 
      });
    } catch (error) {
      console.log(error);
      throw Error 
    }
  }
}