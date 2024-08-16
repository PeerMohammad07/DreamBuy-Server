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
<<<<<<< HEAD
=======
import PushNotificationRepository from "../../adapters/Repositorys/pushNotificationRepository";
>>>>>>> 4ba3c8d (feat : whishlist feature done 👍)
import whishListModel from "../db/whishlist";

const userRouter: Router = express.Router();

const jwtService = new JwtToken();
const hashingService = new HashingService();
const otpService = new OtpService();
<<<<<<< HEAD
=======
const notificationRepository = new PushNotificationRepository()
>>>>>>> 4ba3c8d (feat : whishlist feature done 👍)
const UserRepository = new userRepository(Users, OtpSchema, property,Seller,whishListModel);
const UserUseCase = new userUseCase(
  UserRepository,
  hashingService,
  otpService,
  jwtService,
<<<<<<< HEAD
=======
  notificationRepository
>>>>>>> 4ba3c8d (feat : whishlist feature done 👍)
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
userRouter.post('/setBrowserToken',UserController.setBrowserToken)

userRouter.get('/getUser',UserController.getUser)

userRouter.get('/whishlist/:userId',userAuth,UserController.getAllWhishlistProperty)
userRouter.post('/whishlist',userAuth,UserController.addToWhishlist)
userRouter.delete('/whishlist/:userId/:propertyId',userAuth,UserController.removeFromWishlist)

userRouter.get("/getRentProperty", UserController.getRentProperty);
userRouter.get("/getSaleProperty", UserController.getSaleProperty);

userRouter.put('/updateUser', UserController.updateUser)

userRouter.patch('/getPremium',userAuth,UserController.getPremium)
userRouter.patch('/updatePremium',userAuth,UserController.updatePremium)

userRouter.post('/sendOwnerDetail',userAuth,UserController.sendOwnerDetail)

export default userRouter;
