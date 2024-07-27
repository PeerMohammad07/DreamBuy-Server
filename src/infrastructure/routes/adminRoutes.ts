import express, { Router } from "express";
import adminController from "../../adapters/controllers/adminController";
import adminUseCase from "../../useCase/adminUseCase";
import JwtToken from "../utils/jwtService";
import HashingService from "../utils/hashingService";
import adminRepository from "../../adapters/Repositorys/adminRepository";
import adminSchema from "../db/adminSchema";
import UserModel from "../db/userSchema";
import adminAuth from "../middlewares/adminAuth";
import Seller from "../db/sellerSchema";
import categoryModal from "../db/categorySchema";

const adminRouter: Router = express.Router();

const AdminRepository = new adminRepository(adminSchema, UserModel,Seller,categoryModal);
const JwtService = new JwtToken();
const hashingService = new HashingService();
const AdminUseCase = new adminUseCase(
  AdminRepository,
  hashingService,
  JwtService
);
const AdminController = new adminController(AdminUseCase);

adminRouter.post("/login", AdminController.login);
adminRouter.post("/logout", AdminController.logout);
adminRouter.get("/getUsers", adminAuth, AdminController.getUsers);
adminRouter.get("/getSellers",adminAuth ,AdminController.getSeller);
adminRouter.put("/blockUser",adminAuth ,AdminController.blockUser);
adminRouter.get("/getCategory",adminAuth ,AdminController.getCategory)
adminRouter.put("/blockCategory",adminAuth ,AdminController.blockCategory)

export default adminRouter;
