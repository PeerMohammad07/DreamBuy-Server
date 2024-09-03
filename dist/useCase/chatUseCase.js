"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class chatUseCase {
    constructor(chatRepository, imageAndVideoUpload) {
        this.chatRepository = chatRepository;
        this.imageAndVideoUpload = imageAndVideoUpload;
    }
    // Get conversations
    async getConversations(id) {
        try {
            return await this.chatRepository.getConversations(id);
        }
        catch (error) {
            console.log(error);
            throw Error;
        }
    }
    // Send Message
    async sendMessage(senderId, message, recieverId) {
        try {
            let conversation = await this.chatRepository.getSingleConversation(senderId, recieverId);
            if (!conversation) {
                conversation = await this.chatRepository.createConversation(senderId, recieverId);
            }
            return await this.chatRepository.storeMessage(senderId, message, conversation._id);
        }
        catch (error) {
            console.log(error);
            throw Error;
        }
    }
    // File upload in chat
    async uploadChatFile(senderId, files, recieverId) {
        try {
            let conversation = await this.chatRepository.getSingleConversation(senderId, recieverId);
            if (!conversation) {
                conversation = await this.chatRepository.createConversation(senderId, recieverId);
            }
            let fileUploadCloudinary;
            let videoFiles = files.filter((file) => file.mimetype === "video/mp4");
            if (videoFiles.length > 1) {
                return {
                    status: false,
                    message: "Only one video file is allowed",
                };
            }
            if (videoFiles.length === 1) {
                fileUploadCloudinary = await this.imageAndVideoUpload.uploadVideo(videoFiles[0].path, "chat-videos");
                const messageData = await this.chatRepository.storeMessage(senderId, fileUploadCloudinary, conversation === null || conversation === void 0 ? void 0 : conversation._id);
                return {
                    status: true,
                    message: "message sent successfully",
                    data: messageData
                };
            }
            else {
                fileUploadCloudinary = await Promise.all(files.map(async (file) => {
                    return await this.imageAndVideoUpload.upload(file.path, "chat");
                }));
                const messageDataPromises = fileUploadCloudinary.map(async (file) => {
                    const messageData = await this.chatRepository.storeMessage(senderId, file, conversation === null || conversation === void 0 ? void 0 : conversation._id);
                    return messageData;
                });
                const messageDataResults = await Promise.all(messageDataPromises);
                return {
                    status: true,
                    message: "Files uploaded successfully",
                    data: messageDataResults,
                };
            }
        }
        catch (error) {
            console.log(error);
            throw Error;
        }
    }
    // Creating Conversation btw user and seller
    async createConversation(senderId, recieverId) {
        try {
            const alreadyConversation = await this.chatRepository.getSingleConversation(senderId, recieverId);
            if (alreadyConversation) {
                return { status: false, message: "Already have conversation" };
            }
            const conversation = await this.chatRepository.createConversation(senderId, recieverId);
            return { status: true, message: "conversation created successfully", data: conversation };
        }
        catch (error) {
            console.log(error);
            throw Error;
        }
    }
    // Get all messages 
    async getMessages(senderId, receiverId) {
        try {
            const conversation = await this.chatRepository.getSingleConversation(senderId, receiverId);
            if (!conversation) {
                return { message: "no conversation between this user", status: false };
            }
            const messages = await this.chatRepository.getMessages(conversation._id);
            return messages;
        }
        catch (error) {
            console.log(error);
            throw Error;
        }
    }
}
exports.default = chatUseCase;
//# sourceMappingURL=chatUseCase.js.map