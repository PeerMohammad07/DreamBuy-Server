import IChatController from "../../Interfaces/Controller/IChatController";
import IchatUseCase from "../../Interfaces/UseCase/IchatUsecase";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export default class chatController implements IChatController {
  private chatUseCase;

  constructor(chatUseCase: IchatUseCase) {
    this.chatUseCase = chatUseCase;
    this.getConversations = this.getConversations.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.getMessage = this.getMessage.bind(this);
    this.createConversation = this.createConversation.bind(this)
  }

  async getConversations(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const id = req.query.id;
      if (typeof id !== "string") {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      const response = await this.chatUseCase.getConversations(id);
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async sendMessage(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const { senderId, message, recieverId } = req.body;
      const response = await this.chatUseCase.sendMessage(
        senderId,
        message,
        recieverId
      );
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getMessage(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const senderId = req.query.senderId as string;
      const receiverId = req.query.receiverId as string;
      const response = await this.chatUseCase.getMessages(senderId, receiverId);
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async createConversation(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const {senderId,receiverId} = req.body
      const response = await this.chatUseCase.createConversation(senderId,receiverId)
      res.status(200).json(response)
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
