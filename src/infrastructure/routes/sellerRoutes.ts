import express ,{Router} from "express";
import SellerRepository from "../../adapters/Repositorys/sellerRepository";

import Seller from "../db/sellerSchema";
import OtpModel from "../db/otpSchema";

import SellerUseCase from "../../useCase/sellerUseCase";
import SellerController  from "../../adapters/controllers/sellerController";
import HashingService from "../utils/hashingService";
import OtpService from "../utils/otpService";
import JwtToken from "../utils/jwtService";


const sellerRouter:Router = express.Router()

const jwtService = new JwtToken()
const otpService = new OtpService()
const hashingService = new HashingService()
const sellerRepository = new SellerRepository(Seller,OtpModel)
const sellerUseCase = new SellerUseCase(sellerRepository,hashingService,otpService,jwtService)
const sellerController  = new SellerController(sellerUseCase)

sellerRouter.post("/register",sellerController.register)
sellerRouter.post("/verifyOtp",sellerController.verifyOtp)
sellerRouter.post("/login",sellerController.login)
sellerRouter.post("/logout",sellerController.logout)
sellerRouter.post("/resendOtp",sellerController.resendOtp)
sellerRouter.post("/forgotPassword",sellerController.forgotPassword)
sellerRouter.post("/resetPassword",sellerController.resetPassword)

export default sellerRouter