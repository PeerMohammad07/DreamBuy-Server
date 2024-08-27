import IUser from "../../entity/allEntity";
import mongoose from "mongoose";
import {
  GoogleGenerativeAI,
  GenerativeModel,
  ChatSession,
  GenerationConfig,
} from "@google/generative-ai";


interface Zepchat {
  title: string;
  content: string;
  author: {
    _id: mongoose.Types.ObjectId;
    displayName: string;
    profilePicture: string;
  };
  tags: string[];
  upVotes: number;
  downVotes: number;
  timestamp: Date;
  upVoters?: Array<{
    userId: mongoose.Types.ObjectId;
  }>;
  downVoters?: Array<{
    userId: mongoose.Types.ObjectId;
  }>;
}




interface ZepReply {
  zepChatId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  profilePicture: string;
  displayName: string;
  upVotes: number;
  downVotes: number;
  upVoters?: Array<{
    userId: mongoose.Types.ObjectId;
  }>;
  downVoters?: Array<{
    userId: mongoose.Types.ObjectId;
  }>;
}


interface ZepchatRepo {
  createZepchat(zepchatData: Partial<Zepchat>): Promise<Zepchat>;
  getZepchats(): Promise<Zepchat[]>;
  findById(userId: string): Promise<IUser | null>;
  postReply(zepReply: ZepReply): Promise<ZepReply>;
  fetchReplies(zepChatId: string): Promise<ZepReply[] | null>;
  fetchZepchatById(zepChatId: string): Promise<Zepchat | null>;
}


interface IGeminiChatbot {
  genAI: GoogleGenerativeAI;
  model: GenerativeModel;
  generationConfig: GenerationConfig;
  chatSession: ChatSession;

  sendMessage(message: string): Promise<string>;
}

export default IGeminiChatbot;