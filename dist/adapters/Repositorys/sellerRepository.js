"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SellerRepository {
    constructor(seller, otp, property, revenue) {
        this.seller = seller;
        this.otp = otp;
        this.property = property;
        this.revenue = revenue;
    }
    async checkEmailExists(email) {
        try {
            return await this.seller.findOne({ email });
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async checkUserExists(id) {
        try {
            return await this.seller.findOne({ _id: id });
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async createSeller(data) {
        try {
            const seller = new this.seller({
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: data.password,
                image: data.image,
            });
            await seller.save();
        }
        catch (error) {
            console.log(error);
        }
    }
    async saveOtp(email, otp) {
        try {
            await this.otp.deleteMany({ email });
            const Otp = new this.otp({
                email: email,
                otp: otp,
            });
            await Otp.save();
        }
        catch (error) {
            console.log(error);
        }
    }
    async verifyOtp(email) {
        try {
            return await this.otp.findOne({ email });
        }
        catch (error) {
            throw new Error("failed to verify the seller");
        }
    }
    async updateSellerVerified(email) {
        try {
            return await this.seller.findOneAndUpdate({ email }, { $set: { otpVerified: true } });
        }
        catch (error) {
            throw new Error("failed to update the seller");
        }
    }
    async updateSellerPassword(id, password) {
        try {
            return await this.seller.findOneAndUpdate({ _id: id }, { $set: { password: password } });
        }
        catch (error) {
            throw new Error("Failed to update seller verified ");
        }
    }
    async updateKyc(id, image, url) {
        try {
            return await this.seller.findByIdAndUpdate({ _id: id }, {
                $set: {
                    verficationImage: image,
                    kycVerified: "Verification Pending",
                    verificationImageUrl: url,
                },
            }, { new: true });
        }
        catch (error) {
            throw new Error("Failed to update Kyc");
        }
    }
    async kycStatusUpdate(id, status) {
        try {
            return await this.seller.findByIdAndUpdate({ _id: id }, { $set: { kycVerified: status } }, { new: true });
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async blockSeller(id, status) {
        try {
            return await this.seller.findOneAndUpdate({ _id: id }, { $set: { isBlocked: !status } });
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async addProperty(data) {
        try {
            const property = new this.property({
                propertyName: data.propertyName,
                sellerId: data.sellerId,
                propertyFor: data.propertyFor,
                propertyType: data.propertyType,
                state: data.state,
                city: data.city,
                features: data.features,
                noOfBedroom: data.bedrooms,
                noOfBathroom: data.bathrooms,
                description: data.description,
                location: data.location,
                price: data.price,
                propertyImage: data.images,
                sqft: data.sqft,
                locationCoordinates: {
                    type: "Point",
                    coordinates: [data.location.longitude, data.location.latitude],
                },
            });
            return await property.save();
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async updateSeller(sellerId, name, phone) {
        try {
            return await this.seller.findByIdAndUpdate({ _id: sellerId }, { $set: { name: name, phone: phone } }, { new: true });
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async getMyProperty(id) {
        try {
            return await this.property.find({ sellerId: id });
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async deletePropety(id) {
        try {
            return await this.property.findByIdAndDelete({ _id: id });
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async updateProperty(data) {
        try {
            return await this.property.findOneAndUpdate({ sellerId: data.sellerId }, { $set: { ...data } }, { new: true });
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async boostPropert(id, boostDetails) {
        try {
            return await this.property.findByIdAndUpdate({ _id: id }, { $set: { isBoosted: true, boostDetails } });
        }
        catch (error) {
            console.log(error);
            return null;
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
    async getProperty(propertyId) {
        try {
            return await this.property.findOne({ _id: propertyId });
        }
        catch (error) {
            console.log(error);
            throw new Error("Failed to check proerty boosted");
        }
    }
}
exports.default = SellerRepository;
//# sourceMappingURL=sellerRepository.js.map