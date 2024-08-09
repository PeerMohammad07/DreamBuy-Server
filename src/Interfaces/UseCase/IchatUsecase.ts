import { IConversation, IMessage } from "../../entity/allEntity";

interface returnMessage {
  status:boolean,
  message : string,
  data ? : IMessage|IConversation
}

export default interface IchatUseCase {
  getConversations(id:string) : Promise<IConversation[]>
  sendMessage(senderId:string,message:string,recieverId:string):Promise<IMessage>
  getMessages(senderId:string,receiverId:string):Promise<IMessage[]|returnMessage>
  createConversation(senderId:string,recieverId:string):Promise<returnMessage>
}