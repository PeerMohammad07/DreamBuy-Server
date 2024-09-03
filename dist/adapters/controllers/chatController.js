"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class chatController {
    constructor(chatUseCase, geminiChatBot) {
        this.chatUseCase = chatUseCase;
        this.geminiChatBot = geminiChatBot;
        this.getConversations = this.getConversations.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.getMessage = this.getMessage.bind(this);
        this.createConversation = this.createConversation.bind(this);
        this.uploadChatFile = this.uploadChatFile.bind(this);
        this.sendMessageAi = this.sendMessageAi.bind(this);
    }
    async getConversations(req, res) {
        try {
            const id = req.query.id;
            if (typeof id !== "string") {
                return res.status(400).json({ message: "Invalid ID format" });
            }
            const response = await this.chatUseCase.getConversations(id);
            res.status(200).json(response);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    async sendMessage(req, res) {
        try {
            const { senderId, message, recieverId } = req.body;
            const response = await this.chatUseCase.sendMessage(senderId, message, recieverId);
            res.status(200).json(response);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    async uploadChatFile(req, res) {
        try {
            const files = req.files;
            const { senderId, recieverId } = req.body;
            const response = await this.chatUseCase.uploadChatFile(senderId, files, recieverId);
            console.log(response, "respojnse sended i think so ");
            res.status(200).json(response);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    async getMessage(req, res) {
        try {
            const senderId = req.query.senderId;
            const receiverId = req.query.receiverId;
            const response = await this.chatUseCase.getMessages(senderId, receiverId);
            res.status(200).json(response);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    async createConversation(req, res) {
        try {
            const { senderId, receiverId } = req.body;
            const response = await this.chatUseCase.createConversation(senderId, receiverId);
            res.status(200).json(response);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    async sendMessageAi(req, res) {
        try {
            const { text } = req.body;
            const response = await this.geminiChatBot.sendMessage(text);
            console.log(response);
            res.status(200).json(response);
        }
        catch (error) {
        }
    }
}
exports.default = chatController;
//# sourceMappingURL=chatController.js.map