"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharpImage_1 = require("../infrastructure/utils/sharpImage");
const s3Bucket_1 = require("../infrastructure/utils/s3Bucket");
const sendSellerDetails_1 = __importDefault(require("../infrastructure/utils/sendSellerDetails"));
class userUseCase {
    constructor(userRepository, HashingService, otpService, jwtService) {
        this.userRepository = userRepository;
        this.hashingService = HashingService;
        this.otpService = otpService;
        this.jwtService = jwtService;
    }
    // register
    async register(data) {
        try {
            let exist = await this.userRepository.checkEmailExists(data.email);
            if (exist) {
                return {
                    status: false,
                    message: "this user already exist",
                };
            }
            if (data.password) {
                let bycrptedPassword = await this.hashingService.hashing(data.password);
                data.password = bycrptedPassword;
            }
            await this.userRepository.createUser(data);
            let otp = await this.otpService.generateOtp();
            this.userRepository.saveOtp(data.email, otp);
            this.otpService.sendEmail(data.email, otp, data.name);
        }
        catch (error) {
            throw new Error();
        }
    }
    // verifyOtp
    async verifyOtp(email, otp) {
        try {
            let data = await this.userRepository.verifyOtp(email);
            if ((data === null || data === void 0 ? void 0 : data.otp) && data.email && (data === null || data === void 0 ? void 0 : data.otp) == otp) {
                let userData = await this.userRepository.updateUserVerified(data.email);
                if (userData) {
                    let payload = {
                        userId: userData._id,
                        name: userData.name,
                        role: "user",
                    };
                    let token = await this.jwtService.generateToken(payload);
                    let refreshToken = await this.jwtService.generateRefreshToken(payload);
                    return { status: true, message: "Otp verification done", token, refreshToken, user: userData };
                }
            }
            return { status: false, message: "incorrect otp", token: "" };
        }
        catch (error) {
            throw Error();
        }
    }
    // verifyToken
    verifyToken(token) {
        try {
            let verifiedResponse = this.jwtService.verfiyToken(token);
            if ((verifiedResponse === null || verifiedResponse === void 0 ? void 0 : verifiedResponse.role) == "user") {
                return {
                    status: true,
                    decoded: verifiedResponse,
                };
            }
            return {
                status: false,
            };
        }
        catch (error) {
            throw Error();
        }
    }
    // login
    async loginAuthentication(data) {
        try {
            const value = await this.userRepository.checkEmailExists(data.email);
            if (value) {
                if (!value.password) {
                    return {
                        status: false,
                        message: "this account for login only googleAuth",
                    };
                }
                if (value.isBlocked) {
                    return {
                        status: false,
                        message: "This user is blocked ",
                    };
                }
                const status = await this.hashingService.compare(data.password, value.password);
                if (!status) {
                    return {
                        status: false,
                        message: "incorrect password",
                    };
                }
                if (value.otpVerified == false) {
                    let otp = await this.otpService.generateOtp();
                    this.userRepository.saveOtp(value.email, otp);
                    this.otpService.sendEmail(value.email, otp, value.name);
                    return { status: false, message: "otp is not verified" };
                }
                const payload = {
                    userId: value._id,
                    name: value.name,
                    role: "user",
                };
                let token = await this.jwtService.generateToken(payload);
                let refreshToken = await this.jwtService.generateRefreshToken(payload);
                return { status: true, message: "Login Succesfully", user: value, token, refreshToken };
            }
            return { status: false, message: "Email Not found" };
        }
        catch (error) {
            return {
                status: false,
                message: "",
            };
        }
    }
    // resend Otp
    async resendOtp(email) {
        try {
            const user = await this.userRepository.checkEmailExists(email);
            if (user) {
                let otp = await this.otpService.generateOtp();
                this.userRepository.saveOtp(email, otp);
                this.otpService.sendEmail(email, otp, user.name);
                return "resendOtp successfull";
            }
            return "invalid email";
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    // google Register
    async googleRegister(data) {
        try {
            let user = await this.userRepository.checkEmailExists(data.email);
            if (user) {
                return { status: false, message: "user already exists with this email" };
            }
            const newUser = await this.userRepository.createUser(data);
            let payload = {
                userId: newUser === null || newUser === void 0 ? void 0 : newUser._id,
                name: newUser === null || newUser === void 0 ? void 0 : newUser.name,
                role: "user",
            };
            const token = await this.jwtService.generateToken(payload);
            const refreshToken = await this.jwtService.generateRefreshToken(payload);
            return { status: true, message: "google register succesfull", token, refreshToken, newUser };
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    // googleLogin
    async googleLogin(data) {
        let user = await this.userRepository.checkEmailExists(data.email);
        if (!user) {
            return { status: false, message: "please register to login" };
        }
        if (user.isBlocked) {
            return {
                status: false,
                message: "This user is blocked ",
            };
        }
        const loginUser = await this.userRepository.checkEmailExists(data.email);
        let payload = {
            userId: loginUser === null || loginUser === void 0 ? void 0 : loginUser._id,
            name: loginUser === null || loginUser === void 0 ? void 0 : loginUser.name,
            role: "user",
        };
        const token = await this.jwtService.generateToken(payload);
        const refreshToken = await this.jwtService.generateRefreshToken(payload);
        return { status: true, message: "google Login succesfull", token, refreshToken, loginUser };
    }
    // forgot password
    async validateForgotPassword(email) {
        try {
            const user = await this.userRepository.checkEmailExists(email);
            if (!user) {
                return "user not exist with this email";
            }
            let data = {
                userId: user === null || user === void 0 ? void 0 : user._id,
                name: user === null || user === void 0 ? void 0 : user.name,
                role: "user",
            };
            const expiresIn = "3m";
            const token = await this.jwtService.generateTokenForgot(data, expiresIn);
            const resetLink = `http://localhost:5000/resetPassword/${token}`;
            await this.otpService.sendEmailForgotPassword(resetLink, user.email);
            return "Email sended to the user";
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    // reset password
    async resetPassword(password, id, token) {
        try {
            const user = await this.userRepository.checkUserExists(id);
            if (!user) {
                return "user doesn't exists";
            }
            let verifyToken = await this.jwtService.verfiyToken(token);
            if (!verifyToken) {
                return "token expired";
            }
            let hashPassword = await this.hashingService.hashing(password);
            const passwordUpdated = await this.userRepository.updateUserPassword(id, hashPassword);
            if (passwordUpdated) {
                return "password updated succesfully";
            }
        }
        catch (error) { }
    }
    // getUsers
    async getUsers(id, role) {
        try {
            if (role == 'user') {
                return await this.userRepository.getSeller(id);
            }
            else {
                return await this.userRepository.getUser(id);
            }
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    // Get Rent Property
    async getRentProperty() {
        try {
            const response = await this.userRepository.getRentProperty();
            return response;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    // Get Sale property
    async getSaleProperty() {
        try {
            const response = await this.userRepository.getSaleProperty();
            return response;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    // Update User
    async updateUser(id, name, image, type) {
        try {
            let url = image;
            if (!image.includes('https://dreambuy')) {
                const sharpedImage = await (0, sharpImage_1.sharpImage)(2000, 2000, image);
                const imageName = await (0, sharpImage_1.randomImageName)();
                if (sharpedImage) {
                    await (0, s3Bucket_1.sendObjectToS3)(imageName, type, sharpedImage);
                }
                url = await (0, s3Bucket_1.createImageUrl)(imageName);
            }
            const response = await this.userRepository.updateUser(id, name, url);
            if (response) {
                return { status: true, message: "user updated successfully", user: response };
            }
            return { status: false, message: "failed try again" };
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    // Get Premium
    async getPremium(data) {
        try {
            const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
            const subscriptionType = data.interval;
            const session = await stripe.checkout.sessions.create({
                mode: 'subscription',
                line_items: [
                    {
                        price: data.id,
                        quantity: 1,
                    },
                ],
                success_url: `${process.env.CLIENT_SIDE_URL}paymentStatus?success=true&Type=${subscriptionType}`,
                cancel_url: `${process.env.CLIENT_SIDE_URL}paymentStatus`,
            });
            return session;
        }
        catch (error) {
            console.log(error);
        }
    }
    // updatePremium
    async updatePremium(id, type) {
        var _a, _b, _c, _d;
        try {
            let amount;
            const startDate = new Date();
            let expiryDate = new Date();
            if (type === 'weekly') {
                amount = 199;
                expiryDate.setDate(startDate.getDate() + 7);
            }
            else if (type === 'monthly') {
                amount = 299;
                expiryDate.setMonth(startDate.getMonth() + 1);
            }
            else if (type === 'three_months') {
                amount = 799;
                expiryDate.setMonth(startDate.getMonth() + 3);
            }
            else {
                throw new Error("Invalid subscription type");
            }
            const user = await this.userRepository.checkUserExists(id);
            if (user && user.isPremium && ((_a = user.premiumSubscription) === null || _a === void 0 ? void 0 : _a.expiryDate)) {
                if (((_b = user.premiumSubscription) === null || _b === void 0 ? void 0 : _b.subscriptionType) == "weekly") {
                    amount = 199;
                    expiryDate.setDate(user.premiumSubscription.expiryDate.getDate() + 7);
                }
                else if (((_c = user.premiumSubscription) === null || _c === void 0 ? void 0 : _c.subscriptionType) == "monthly") {
                    amount = 299;
                    expiryDate.setDate(user.premiumSubscription.expiryDate.getMonth() + 1);
                }
                else if (((_d = user.premiumSubscription) === null || _d === void 0 ? void 0 : _d.subscriptionType) == "three_months") {
                    amount = 799;
                    expiryDate.setDate(user.premiumSubscription.expiryDate.getMonth() + 3);
                }
            }
            const newSubscription = {
                subscriptionType: type,
                startDate: startDate,
                expiryDate: expiryDate
            };
            const updatedUser = await this.userRepository.updatePremium(id, newSubscription);
            const transactionId = updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser._id.toString();
            const revenueData = {
                transactionId: transactionId,
                userId: id,
                amount,
                date: startDate
            };
            await this.userRepository.updateRevenue(revenueData);
            return updatedUser;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    // Productdetail
    async productDetail(id) {
        try {
            const response = await this.userRepository.productDetail(id);
            if (response) {
                if (response.propertyStatus) {
                    return { message: "Property has been blocked", status: false, data: response };
                }
                return { message: "productDetails got successfully", status: true, data: response };
            }
            else {
                return { message: "something went wrong", status: false };
            }
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    // sendOwnerDetail
    async sendOwnerDetail(sellerId, email, name, property) {
        try {
            const seller = await this.userRepository.checkSellerExists(sellerId);
            if (!seller) {
                return { status: false, message: "seller doesnt exist with this id" };
            }
            await (0, sendSellerDetails_1.default)(email, name, seller, property);
            return { status: true, message: "Email sended succesfully" };
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    // add to wishlist
    async addToWhishlist(userId, propertyId) {
        try {
            const exist = await this.userRepository.whishlistPropertyExist(userId, propertyId);
            if (exist) {
                return { status: true, message: "Already in the wishlist", data: exist };
            }
            const response = await this.userRepository.addToWhishlist(userId, propertyId);
            if (response) {
                return { status: true, message: "Property added to whishlist", data: response };
            }
            return { status: false, message: "Failed to add wishlist" };
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    // remove whishlist
    async removeFromWhishlist(userId, propertyId) {
        try {
            const response = await this.userRepository.removeFromWhishlist(userId, propertyId);
            if (response.deletedCount >= 1) {
                return { status: true, message: "Removed property from whishlist" };
            }
            return { status: false, message: "Failed to remove from whishilist" };
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    // get all wishlist property 
    async getAllWhishlistProperty(userId) {
        try {
            return await this.userRepository.getAllWhishlistProperty(userId);
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    // get listing property
    async getListingProperty(search, filter, sort, locationSearch) {
        try {
            const pipeline = [];
            const sortStage = {};
            // Geo-Spatial Search
            if (locationSearch) {
                pipeline.push({
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: locationSearch.cordinates,
                        },
                        distanceField: "dist.calculated",
                        maxDistance: 20 * 1000,
                        spherical: true,
                    },
                });
                sortStage['dist.calculated'] = 1;
            }
            else if (search.latitude && search.longitude) {
                pipeline.push({
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [search.longitude, search.latitude],
                        },
                        distanceField: "dist.calculated",
                        maxDistance: 1000 * 1000, // 100000 km
                        spherical: true,
                    },
                });
                sortStage['dist.calculated'] = 1;
            }
            // Filtering
            const matchStage = { propertyStatus: false };
            if (filter) {
                if (filter.propertyFor)
                    matchStage['propertyFor'] = filter.propertyFor;
                if (filter.bedrooms)
                    matchStage['noOfBedroom'] = filter.bedrooms[0];
                if (filter.bathrooms)
                    matchStage['noOfBathroom'] = filter.bathrooms[0];
                if (filter.priceRange)
                    matchStage['price'] = { $gte: filter.priceRange[0], $lte: filter.priceRange[1] };
                if (filter.category)
                    matchStage['propertyType'] = filter.category;
                if (filter.sqft)
                    matchStage['sqft'] = filter.sqft;
                if (filter.amenities && filter.amenities.length > 0)
                    matchStage['features'] = { $in: filter.amenities };
            }
            pipeline.push({ $match: matchStage });
            // Sorting
            if (sort) {
                switch (sort) {
                    case 'priceAsc':
                        sortStage['price'] = 1;
                        break;
                    case 'priceDesc':
                        sortStage['price'] = -1;
                        break;
                    case 'dateDesc':
                        sortStage['createdAt'] = -1;
                        break;
                    case 'dateAsc':
                        sortStage['createdAt'] = 1;
                        break;
                }
                pipeline.push({ $sort: sortStage });
            }
            const properties = await this.userRepository.getListinProperty(pipeline);
            console.log(properties, "properties");
            return properties;
        }
        catch (error) {
            console.error('Error fetching properties:', error);
            return null;
        }
    }
}
exports.default = userUseCase;
//# sourceMappingURL=userUseCase.js.map