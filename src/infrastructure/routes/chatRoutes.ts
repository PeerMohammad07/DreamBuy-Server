import express,{ Router } from "express";
import chatController from "../../adapters/controllers/chatController";
import chatUseCase from "../../useCase/chatUseCase";
import chatRepository from "../../adapters/Repositorys/chatRepository";
import messageModal from "../db/message";
import conversationModal from "../db/conversation";
<<<<<<< HEAD
=======
import PushNotificationRepository from "../../adapters/Repositorys/pushNotificationRepository";
>>>>>>> 4ba3c8d (feat : whishlist feature done 👍)
import ImageAndVideoUpload from "../utils/imageAndVideoUploads";
import { ImageUpload } from "../middlewares/multer";


const chatRouter : Router = express.Router()

const ChatRepositoty = new chatRepository(conversationModal,messageModal)
<<<<<<< HEAD
const imageAndVideoUpload= new ImageAndVideoUpload()
const ChatUseCase = new chatUseCase(ChatRepositoty,imageAndVideoUpload)
=======
const notificationRepository = new PushNotificationRepository()
const imageAndVideoUpload= new ImageAndVideoUpload()
const ChatUseCase = new chatUseCase(ChatRepositoty,notificationRepository,imageAndVideoUpload)
>>>>>>> 4ba3c8d (feat : whishlist feature done 👍)
const ChatController = new chatController(ChatUseCase)


chatRouter.get('/getConversations',ChatController.getConversations)
chatRouter.post('/sendMessage',ChatController.sendMessage)
chatRouter.get('/getMessages',ChatController.getMessage)
chatRouter.post('/createConversation',ChatController.createConversation)
chatRouter.post('/uploadFile',ImageUpload.array('files'),ChatController.uploadChatFile)

export default chatRouter