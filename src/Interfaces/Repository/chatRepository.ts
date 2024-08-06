import { IConversation, IMessage } from "../../entity/allEntity";

export default interface IChatRepository {
  getConversations(id:string):Promise<IConversation[]>
  getSingleConversation(senderId:string,receiverId:string):Promise<IConversation|null>
  createConversation(senderId:string,receiverId:string):Promise<IConversation>
  storeMessage(senderId:string,message:string,conversationId:string):Promise<IMessage>,
  getMessages(conversationId:string):Promise<IMessage[]>
}