"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SellerController {
    constructor(sellerUseCase) {
        this.sellerUseCase = sellerUseCase;
        this.register = this.register.bind(this);
        this.verifyOtp = this.verifyOtp.bind(this);
        this.login = this.login.bind(this);
        this.resendOtp = this.resendOtp.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.updateKycImage = this.updateKycImage.bind(this);
        this.kycStatusUpdate = this.kycStatusUpdate.bind(this);
        this.blockSeller = this.blockSeller.bind(this);
        this.addProperty = this.addProperty.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.updateSeller = this.updateSeller.bind(this);
        this.getMyProperty = this.getMyProperty.bind(this);
        this.deleteProeprty = this.deleteProeprty.bind(this);
        this.updateProeprty = this.updateProeprty.bind(this);
        this.getBoostProperty = this.getBoostProperty.bind(this);
        this.boostProperty = this.boostProperty.bind(this);
    }
    async register(req, res) {
        try {
            const { name, email, password, phone } = req.body;
            const data = {
                name,
                email,
                password,
                phone,
            };
            const response = await this.sellerUseCase.register(data);
            if (!(response === null || response === void 0 ? void 0 : response.status) &&
                (response === null || response === void 0 ? void 0 : response.message) == "this seller already exist") {
                res.status(403).json({
                    status: false,
                    message: "seller already exist with this email",
                });
                return;
            }
            res.cookie("otpEmail", data.email);
            res.status(200).json({
                status: true,
                message: "seller created and otp sended successfully",
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    async verifyOtp(req, res) {
        try {
            const { otp } = req.body;
            const email = req.cookies.otpEmail;
            const response = await this.sellerUseCase.verifyOtp(email, otp);
            if (!(response === null || response === void 0 ? void 0 : response.status)) {
                res.status(401).json(response);
                return;
            }
            res.cookie("otpEmail", "");
            res.cookie("sellerToken", response.token, { maxAge: 3600000 }).cookie("sellerRefreshToken", response.sellerRefreshToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json(response);
        }
        catch (error) {
            console.log(error);
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const response = await this.sellerUseCase.login(email, password);
            if (!(response === null || response === void 0 ? void 0 : response.status) && (response === null || response === void 0 ? void 0 : response.message) == "otp is not verified") {
                res.cookie("otpEmail", email, { maxAge: 3600000 });
                res.status(403).json({ otpVerified: "false" });
            }
            else if (response === null || response === void 0 ? void 0 : response.status) {
                const { token, sellerRefreshToken } = response;
                res.cookie("sellerToken", token, {
                    httpOnly: true,
                    maxAge: 3600000,
                }).cookie("sellerRefreshToken", sellerRefreshToken, {
                    httpOnly: true,
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                });
                res.status(200).json(response);
            }
            else if (!(response === null || response === void 0 ? void 0 : response.status) &&
                (response === null || response === void 0 ? void 0 : response.message) == "incorrect password") {
                res.status(403).json(response);
            }
            else {
                res.status(403).json(response);
            }
        }
        catch (error) {
            console.log(error, "mah");
        }
    }
    async logout(req, res) {
        try {
            res.cookie("sellerToken", "", { httpOnly: true, expires: new Date() }).cookie("sellerRefreshToken", "", { httpOnly: true, expires: new Date() });
            res.status(200).json({ status: true });
        }
        catch (error) {
            console.log(error);
        }
    }
    async resendOtp(req, res) {
        try {
            const email = req.cookies.otpEmail;
            const response = await this.sellerUseCase.resendOtp(email);
            if (response == "resendOtp successfull") {
                res.cookie("otpEmail", email, { maxAge: 360000 });
                res.json({ status: true });
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const response = await this.sellerUseCase.validateForgotPassword(email);
            if (response == "Email sended to the seller") {
                res.status(200).json({ message: "email sended succesfully" });
                return;
            }
            else if (response == "seller not exist with this email") {
                res
                    .status(403)
                    .json({ message: "seller doesnt exist with this email" });
                return;
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async resetPassword(req, res) {
        try {
            const { password, userId, token } = req.body;
            console.log("reached", password, userId, token);
            const response = await this.sellerUseCase.resetPassword(password, userId, token);
            if (response == "password updated succesfully") {
                res.status(200).json({ message: "password updated succesfully" });
                return;
            }
            else if (response == "token expired") {
                res.status(403).json({ message: "token has been expired" });
                return;
            }
            else if (response == "user doesn't exists") {
                res.status(403).json({ message: "user doesn't exist" });
                return;
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async updateKycImage(req, res) {
        try {
            const { buffer, type, id } = req.body;
            const response = await this.sellerUseCase.updateKycImage(type, buffer, id);
            if ((response === null || response === void 0 ? void 0 : response.message) == "added succesfully" && response.status) {
                res
                    .status(200)
                    .json({ message: "Kyc image added", seller: response.seller });
            }
            res.status(403).json(response);
        }
        catch (error) {
            console.log(error);
        }
    }
    async kycStatusUpdate(req, res) {
        try {
            const { id, status } = req.body;
            const response = await this.sellerUseCase.kycStatusUpdate(id, status);
            res.status(200).json({ response });
        }
        catch (error) {
            console.log(error);
        }
    }
    async blockSeller(req, res) {
        try {
            const { id, status } = req.body;
            const response = await this.sellerUseCase.blockSeller(id, status);
            res.status(200).json(response);
        }
        catch (error) {
            console.log(error);
        }
    }
    async addProperty(req, res) {
        try {
            const { sellerId, propertyFor, propertyType, propertyName, state, city, bedrooms, bathrooms, expectedPrice, features, description, images, location, sqft, } = req.body.data;
            const data = {
                propertyType,
                propertyFor,
                propertyName,
                state,
                city,
                bedrooms,
                bathrooms,
                price: Number(expectedPrice),
                features,
                description,
                images,
                location,
                sellerId,
                sqft
            };
            const response = await this.sellerUseCase.addProperty(sellerId, data);
            res.status(200).json(response);
        }
        catch (error) {
            console.log(error);
        }
    }
    async changePassword(req, res) {
        try {
            const { oldPassword, newPassword, sellerId } = req.body;
            const response = await this.sellerUseCase.changePassword(oldPassword, newPassword, sellerId);
            res.status(200).json(response);
        }
        catch (error) {
            console.log(error);
        }
    }
    async updateSeller(req, res) {
        try {
            const { name, phone, sellerId } = req.body;
            const response = await this.sellerUseCase.updateSeller(name, phone, sellerId);
            if ((response === null || response === void 0 ? void 0 : response.message) == "seller updated") {
                res.status(200).json(response);
            }
            else {
                res.status(403).json(response);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async getMyProperty(req, res) {
        try {
            const id = req.params.id;
            const response = await this.sellerUseCase.getMyProperty(id);
            res.status(200).json(response);
        }
        catch (error) {
            console.log(error);
        }
    }
    async deleteProeprty(req, res) {
        try {
            const { id } = req.body;
            const response = await this.sellerUseCase.deleteProperty(id);
            res.status(200).json(response);
        }
        catch (error) {
            console.log(error);
        }
    }
    async updateProeprty(req, res) {
        try {
            const { data } = req.body;
            const response = await this.sellerUseCase.updateProeprty(data);
            res.status(200).json(response);
        }
        catch (error) {
            console.log(error);
        }
    }
    async getBoostProperty(req, res) {
        try {
            const { planId, duration, propertyId } = req.body;
            const session = await this.sellerUseCase.getBoostProperty(planId, duration, propertyId);
            res.status(200).json({ session });
        }
        catch (error) {
            console.log(error);
        }
    }
    async boostProperty(req, res) {
        try {
            const { propertyId, type } = req.body;
            const response = await this.sellerUseCase.boostProperty(propertyId, type);
            res.status(200).json({ response });
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.default = SellerController;
//# sourceMappingURL=sellerController.js.map