"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class chatRepository {
    constructor(conversation, messsage) {
        this.conversation = conversation;
        this.message = messsage;
    }
    async getConversations(id) {
        try {
            return await this.conversation.find({ $or: [{ senderId: id }, { receiverId: id }] });
        }
        catch (error) {
            console.log(error);
            throw Error;
        }
    }
    async storeMessage(senderId, message, conversationId) {
        try {
            const newMessage = new this.message({
                conversationId,
                message,
                senderId
            });
            await newMessage.save();
            return newMessage;
        }
        catch (error) {
            console.log(error);
            throw Error;
        }
    }
    async getSingleConversation(senderId, receiverId) {
        try {
            const conversation = await this.conversation.findOne({
                $or: [
                    { senderId: senderId, receiverId: receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            });
            return conversation;
        }
        catch (error) {
            console.log(error);
            throw Error;
        }
    }
    async createConversation(senderId, receiverId) {
        try {
            const newConversation = new this.conversation({
                receiverId,
                senderId
            });
            await newConversation.save();
            return newConversation;
        }
        catch (error) {
            console.log(error);
            throw Error;
        }
    }
    async getMessages(conversationId) {
        try {
            return await this.message.find({ conversationId }).populate({
                path: 'conversationId',
                select: 'senderId receiverId',
                populate: ['senderId', 'receiverId']
            });
        }
        catch (error) {
            console.log(error);
            throw Error;
        }
    }
}
exports.default = chatRepository;
//# sourceMappingURL=chatRepository.js.map