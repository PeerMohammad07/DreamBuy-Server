import express, { Router } from "express";

// Controllers
import userController from "../../adapters/controllers/userController";

// UseCases
import userUseCase from "../../useCase/userUseCase";

// Repositorys
import userRepository from "../../adapters/Repositorys/userRepository";

//Schemas
import OtpSchema from "../db/otpSchema";
import Users from "../db/userSchema";

// Utils
import HashingService from "../utils/hashingService";
import OtpService from "../utils/otpService";
import JwtToken from "../utils/jwtService";
import property from "../db/propertySchema";
import userAuth from "../middlewares/userAuth";
import Seller from "../db/sellerSchema";
import whishListModel from "../db/whishlist";
import RevenueModel from "../db/revenueSchema";

const userRouter: Router = express.Router();

const jwtService = new JwtToken();
const hashingService = new HashingService();
const otpService = new OtpService()
const UserRepository = new userRepository(Users, OtpSchema, property,Seller,whishListModel,RevenueModel);
const UserUseCase = new userUseCase(
  UserRepository,
  hashingService,
  otpService,
  jwtService,
);
const UserController = new userController(UserUseCase);

userRouter.post("/register", UserController.register);
userRouter.post("/login", UserController.login);
userRouter.post("/verifyOtp", UserController.verifyOtp);
userRouter.post("/logout", UserController.logout);
userRouter.post("/getToken", UserController.getToken);
userRouter.post("/resendOtp", UserController.resendOtp);
userRouter.post('/googleRegister',UserController.googleRegister)
userRouter.post("/googleLogin", UserController.googleLogin);
userRouter.post("/forgotPassword", UserController.forgotPassword);
userRouter.post("/resetPassword", UserController.resetPassword);
userRouter.post('/productDetail',UserController.productDetail)

userRouter.get('/getUser',UserController.getUser)

userRouter.get('/whishlist/:userId',UserController.getAllWhishlistProperty)
userRouter.post('/whishlist',userAuth,UserController.addToWhishlist)
userRouter.delete('/whishlist/:userId/:propertyId',userAuth,UserController.removeFromWishlist)

userRouter.get("/getRentProperty", UserController.getRentProperty);
userRouter.get("/getSaleProperty", UserController.getSaleProperty);

userRouter.put('/updateUser',userAuth,UserController.updateUser)

userRouter.patch('/getPremium',userAuth,UserController.getPremium)
userRouter.patch('/updatePremium',userAuth,UserController.updatePremium)

userRouter.post('/sendOwnerDetail',userAuth,UserController.sendOwnerDetail)

userRouter.get('/listProeprty',UserController.getListingProperty)


export default userRouter;
