import { IConversation, IMessage } from "../../entity/allEntity";

interface returnMessage {
  status:boolean,
  message : string,
  data ? : IMessage|IConversation| any[]
}

interface FileObject {
  path: string;
  mimetype: string;
}

export default interface IchatUseCase {
  getConversations(id:string) : Promise<IConversation[]>
  sendMessage(senderId:string,message:string,recieverId:string):Promise<IMessage>
  getMessages(senderId:string,receiverId:string):Promise<IMessage[]|returnMessage>
  createConversation(senderId:string,recieverId:string):Promise<returnMessage>
  uploadChatFile(senderId: string, files: FileObject[], recieverId: string):Promise<returnMessage>
}