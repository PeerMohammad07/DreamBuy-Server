"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = __importDefault(require("../../adapters/controllers/chatController"));
const chatUseCase_1 = __importDefault(require("../../useCase/chatUseCase"));
const chatRepository_1 = __importDefault(require("../../adapters/Repositorys/chatRepository"));
const message_1 = __importDefault(require("../db/message"));
const conversation_1 = __importDefault(require("../db/conversation"));
const imageAndVideoUploads_1 = __importDefault(require("../utils/imageAndVideoUploads"));
const multer_1 = require("../middlewares/multer");
const geminiChatBots_1 = __importDefault(require("../utils/geminiChatBots"));
const chatRouter = express_1.default.Router();
const ChatRepositoty = new chatRepository_1.default(conversation_1.default, message_1.default);
const imageAndVideoUpload = new imageAndVideoUploads_1.default();
const ChatUseCase = new chatUseCase_1.default(ChatRepositoty, imageAndVideoUpload);
const geminiChatBot = new geminiChatBots_1.default();
const ChatController = new chatController_1.default(ChatUseCase, geminiChatBot);
chatRouter.get('/getConversations', ChatController.getConversations);
chatRouter.post('/sendMessage', ChatController.sendMessage);
chatRouter.get('/getMessages', ChatController.getMessage);
chatRouter.post('/createConversation', ChatController.createConversation);
chatRouter.post('/uploadFile', multer_1.ImageUpload.array('files'), ChatController.uploadChatFile);
chatRouter.post('/sendMessageAi', ChatController.sendMessageAi);
exports.default = chatRouter;
//# sourceMappingURL=chatRoutes.js.map