import express, { Router } from "express";
import SellerRepository from "../../adapters/Repositorys/sellerRepository";

import Seller from "../db/sellerSchema";
import OtpModel from "../db/otpSchema";

import SellerUseCase from "../../useCase/sellerUseCase";
import SellerController from "../../adapters/controllers/sellerController";
import HashingService from "../utils/hashingService";
import OtpService from "../utils/otpService";
import JwtToken from "../utils/jwtService";
import property from "../db/propertySchema";
import sellerAuth from "../middlewares/sellerAuth";
import notificationModel from "../db/pushNotificationSchema";
import PushNotificationRepository from "../../adapters/Repositorys/pushNotificationRepository";

const sellerRouter: Router = express.Router();

const jwtService = new JwtToken();
const otpService = new OtpService();
const hashingService = new HashingService();
const notificationRepository = new PushNotificationRepository()
const sellerRepository = new SellerRepository(Seller, OtpModel, property);
const sellerUseCase = new SellerUseCase(
  sellerRepository,
  hashingService,
  otpService,
  jwtService,
  notificationRepository
);
const sellerController = new SellerController(sellerUseCase);

sellerRouter.post("/register", sellerController.register);
sellerRouter.post("/verifyOtp", sellerController.verifyOtp);
sellerRouter.post("/login", sellerController.login);
sellerRouter.post("/logout", sellerController.logout);
sellerRouter.post("/resendOtp", sellerController.resendOtp);
sellerRouter.post("/forgotPassword", sellerController.forgotPassword);
sellerRouter.post("/resetPassword", sellerController.resetPassword);
sellerRouter.post(
  "/updateKycImage",
  sellerAuth,
  sellerController.updateKycImage
);
sellerRouter.post("/kycStatusUpdate", sellerController.kycStatusUpdate);
sellerRouter.post("/blockSeller",sellerController.blockSeller);
sellerRouter.post("/changePassword",sellerAuth,sellerController.changePassword)
sellerRouter.post('/updateSeller',sellerAuth,sellerController.updateSeller)
sellerRouter.post("/addProperty", sellerAuth, sellerController.addProperty);
sellerRouter.post('/deleteProperty',sellerAuth,sellerController.deleteProeprty)
sellerRouter.put('/updateProperty',sellerAuth,sellerController.updateProeprty)
sellerRouter.post('/setBrowserToken',sellerController.setBrowserToken)


sellerRouter.get("/getMyProperty/:id",sellerAuth,sellerController.getMyProperty)


export default sellerRouter;
