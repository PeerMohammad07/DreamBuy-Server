import express, { Router } from "express";

// schema imports
import Seller from "../db/sellerSchema";
import OtpModel from "../db/otpSchema";
import property from "../db/propertySchema";
import RevenueModel from "../db/revenueSchema";

// repository
import SellerRepository from "../../adapters/Repositorys/sellerRepository";

// use case
import SellerUseCase from "../../useCase/sellerUseCase";

// Controller
import SellerController from "../../adapters/controllers/sellerController";

// Services
import HashingService from "../utils/hashingService";
import OtpService from "../utils/otpService";
import JwtToken from "../utils/jwtService";

// Authentication
import sellerAuth from "../middlewares/sellerAuth";

const sellerRouter: Router = express.Router();

const jwtService = new JwtToken();
const otpService = new OtpService();
const hashingService = new HashingService();
const sellerRepository = new SellerRepository(Seller, OtpModel, property,RevenueModel);
const sellerUseCase = new SellerUseCase(
  sellerRepository,
  hashingService,
  otpService,
  jwtService,
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

sellerRouter.get("/getMyProperty/:id",sellerAuth,sellerController.getMyProperty)

sellerRouter.route('/boostProperty')
.post(sellerAuth,sellerController.getBoostProperty)
.patch(sellerAuth,sellerController.boostProperty)

export default sellerRouter;
