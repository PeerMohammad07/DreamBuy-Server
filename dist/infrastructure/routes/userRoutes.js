"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Controllers
const userController_1 = __importDefault(require("../../adapters/controllers/userController"));
// UseCases
const userUseCase_1 = __importDefault(require("../../useCase/userUseCase"));
// Repositorys
const userRepository_1 = __importDefault(require("../../adapters/Repositorys/userRepository"));
//Schemas
const otpSchema_1 = __importDefault(require("../db/otpSchema"));
const userSchema_1 = __importDefault(require("../db/userSchema"));
// Utils
const hashingService_1 = __importDefault(require("../utils/hashingService"));
const otpService_1 = __importDefault(require("../utils/otpService"));
const jwtService_1 = __importDefault(require("../utils/jwtService"));
const propertySchema_1 = __importDefault(require("../db/propertySchema"));
const userAuth_1 = __importDefault(require("../middlewares/userAuth"));
const sellerSchema_1 = __importDefault(require("../db/sellerSchema"));
const whishlist_1 = __importDefault(require("../db/whishlist"));
const revenueSchema_1 = __importDefault(require("../db/revenueSchema"));
const userRouter = express_1.default.Router();
const jwtService = new jwtService_1.default();
const hashingService = new hashingService_1.default();
const otpService = new otpService_1.default();
const UserRepository = new userRepository_1.default(userSchema_1.default, otpSchema_1.default, propertySchema_1.default, sellerSchema_1.default, whishlist_1.default, revenueSchema_1.default);
const UserUseCase = new userUseCase_1.default(UserRepository, hashingService, otpService, jwtService);
const UserController = new userController_1.default(UserUseCase);
userRouter.post("/register", UserController.register);
userRouter.post("/login", UserController.login);
userRouter.post("/verifyOtp", UserController.verifyOtp);
userRouter.post("/logout", UserController.logout);
userRouter.post("/getToken", UserController.getToken);
userRouter.post("/resendOtp", UserController.resendOtp);
userRouter.post('/googleRegister', UserController.googleRegister);
userRouter.post("/googleLogin", UserController.googleLogin);
userRouter.post("/forgotPassword", UserController.forgotPassword);
userRouter.post("/resetPassword", UserController.resetPassword);
userRouter.post('/productDetail', UserController.productDetail);
userRouter.get('/getUser', UserController.getUser);
userRouter.get('/whishlist/:userId', UserController.getAllWhishlistProperty);
userRouter.post('/whishlist', userAuth_1.default, UserController.addToWhishlist);
userRouter.delete('/whishlist/:userId/:propertyId', userAuth_1.default, UserController.removeFromWishlist);
userRouter.get("/getRentProperty", UserController.getRentProperty);
userRouter.get("/getSaleProperty", UserController.getSaleProperty);
userRouter.put('/updateUser', userAuth_1.default, UserController.updateUser);
userRouter.patch('/getPremium', userAuth_1.default, UserController.getPremium);
userRouter.patch('/updatePremium', userAuth_1.default, UserController.updatePremium);
userRouter.post('/sendOwnerDetail', userAuth_1.default, UserController.sendOwnerDetail);
userRouter.get('/listProeprty', UserController.getListingProperty);
exports.default = userRouter;
//# sourceMappingURL=userRoutes.js.map