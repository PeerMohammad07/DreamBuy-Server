"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class userRepository {
    constructor(user, otp, property, seller, whishlist, revenue) {
        this.user = user;
        this.otp = otp;
        this.property = property;
        this.seller = seller;
        this.whishlist = whishlist;
        this.revenue = revenue;
    }
    async checkEmailExists(email) {
        try {
            return await this.user.findOne({ email });
        }
        catch (error) {
            throw new Error("Failed to check the email exists");
        }
    }
    async checkUserExists(id) {
        try {
            return await this.user.findOne({ _id: id });
        }
        catch (error) {
            throw new Error("Failed to check the email exists");
        }
    }
    async checkSellerExists(id) {
        try {
            return await this.seller.findOne({ _id: id });
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async createUser(data) {
        try {
            let user = new this.user(data);
            return await user.save();
        }
        catch (error) {
            throw new Error("Failed to Create New User");
        }
    }
    async saveOtp(email, otp) {
        try {
            await this.otp.deleteMany({ email });
            let newOtp = new this.otp({ email, otp });
            await newOtp.save();
        }
        catch (error) {
            throw new Error("Failed to store Otp");
        }
    }
    async getUser(id) {
        try {
            return await this.user.findOne({ _id: id });
        }
        catch (error) {
            throw Error;
        }
    }
    async getSeller(id) {
        try {
            return await this.seller.findOne({ _id: id });
        }
        catch (error) {
            throw Error;
        }
    }
    async verifyOtp(email) {
        try {
            return await this.otp.findOne({ email });
        }
        catch (error) {
            throw new Error("failed to veify the user");
        }
    }
    async updateUserVerified(email) {
        try {
            return await this.user.findOneAndUpdate({ email }, { $set: { otpVerified: true } });
        }
        catch (error) {
            throw new Error("Failed to update user verified ");
        }
    }
    async saveGoogleLogin(data) {
        try {
            const user = new this.user({
                name: data.name,
                email: data.email,
                image: data.image,
                otpVerified: true,
            });
            await user.save();
        }
        catch (error) {
            console.log(error);
        }
    }
    async updateUserPassword(id, password) {
        try {
            return await this.user.findOneAndUpdate({ _id: id }, { $set: { password: password } });
        }
        catch (error) {
            throw new Error("Failed to update user verified ");
        }
    }
    async getRentProperty() {
        try {
            return await this.property.find({ propertyFor: "rent" });
        }
        catch (error) {
            throw new Error("Failed to get rent property");
        }
    }
    async getSaleProperty() {
        try {
            return await this.property.find({ propertyFor: "sale" });
        }
        catch (error) {
            throw new Error("Failed to get sale property");
        }
    }
    async updateUser(id, name, image) {
        try {
            return await this.user.findByIdAndUpdate({ _id: id }, { $set: { name: name, image: image } }, { new: true }).exec();
        }
        catch (error) {
            throw new Error("Failed to update user");
        }
    }
    async updateRevenue(data) {
        try {
            const newRevenue = new this.revenue({
                userId: data.userId,
                amount: data.amount,
                date: data.date,
                transactionId: data.transactionId
            });
            return await newRevenue.save();
        }
        catch (error) {
            console.log(error);
            throw new Error("Failed to create revenue");
        }
    }
    async updatePremium(id, newSubscription) {
        try {
            return await this.user.findByIdAndUpdate({ _id: id }, { $set: { isPremium: true, premiumSubscription: newSubscription } }, { new: true }).exec();
        }
        catch (error) {
            throw new Error("Failed to update user");
        }
    }
    async productDetail(id) {
        try {
            return await this.property.findById({ _id: id });
        }
        catch (error) {
            throw new Error("Failed to get product");
        }
    }
    async addToWhishlist(userId, propertyId) {
        try {
            return (await this.whishlist.create({ userId, propertyId })).populate("propertyId");
        }
        catch (error) {
            throw new Error("Failed to add to whishlist");
        }
    }
    async removeFromWhishlist(userId, propertyId) {
        try {
            return await this.whishlist.deleteOne({ userId: userId, propertyId: propertyId });
        }
        catch (error) {
            throw new Error("Failed to remove from whishlist");
        }
    }
    async getAllWhishlistProperty(userId) {
        try {
            return await this.whishlist.find({ userId: userId }).populate("propertyId");
        }
        catch (error) {
            throw new Error("Failder to get all whishlist property");
        }
    }
    async whishlistPropertyExist(userId, propertyId) {
        try {
            return await this.whishlist.findOne({ userId: userId, propertyId: propertyId });
        }
        catch (error) {
            throw new Error("Failder to get all whishlist property");
        }
    }
    async getListinProperty(query) {
        try {
            // aggregate(query)
            return await this.property.aggregate(query);
        }
        catch (error) {
            console.log(error);
            throw new Error("Failde to get listing property");
        }
    }
}
exports.default = userRepository;
//# sourceMappingURL=userRepository.js.map