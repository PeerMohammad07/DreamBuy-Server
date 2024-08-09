import express,{ Router } from "express";
import chatController from "../../adapters/controllers/chatController";
import chatUseCase from "../../useCase/chatUseCase";
import chatRepository from "../../adapters/Repositorys/chatRepository";
import messageModal from "../db/message";
import conversationModal from "../db/conversation";


const chatRouter : Router = express.Router()

const ChatRepositoty = new chatRepository(conversationModal,messageModal)
const ChatUseCase = new chatUseCase(ChatRepositoty)
const ChatController = new chatController(ChatUseCase)


chatRouter.get('/getConversations',ChatController.getConversations)
chatRouter.post('/sendMessage',ChatController.sendMessage)
chatRouter.get('/getMessages',ChatController.getMessage)
chatRouter.post('/createConversation',ChatController.createConversation)

export default chatRouter