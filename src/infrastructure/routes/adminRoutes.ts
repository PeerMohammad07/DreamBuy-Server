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
import property from "../db/propertySchema";
import amenitiesModal from "../db/amenitiesSchema";

const adminRouter: Router = express.Router();

const AdminRepository = new adminRepository(
  adminSchema, 
  UserModel, 
  Seller, 
  categoryModal, 
  property, 
  amenitiesModal
);
const JwtService = new JwtToken();
const HashingServiceInstance = new HashingService();
const AdminUseCaseInstance = new adminUseCase(
  AdminRepository,
  HashingServiceInstance,
  JwtService
);
const AdminController = new adminController(AdminUseCaseInstance);

// Admin Authentication Routes
adminRouter.post("/login", AdminController.login);
adminRouter.post("/logout", adminAuth, AdminController.logout);

// User Management Routes
adminRouter.get("/getUsers", adminAuth, AdminController.getUsers);
adminRouter.put("/blockUser", adminAuth, AdminController.blockUser);

// Seller Management Routes
adminRouter.get("/getSellers", adminAuth, AdminController.getSeller);

// Category Management Routes
adminRouter.get("/getCategory", adminAuth, AdminController.getCategory);
adminRouter.post("/addCategory", adminAuth, AdminController.addCategory);
adminRouter.put("/editCategory", adminAuth, AdminController.editCategory);
adminRouter.put("/blockCategory", adminAuth, AdminController.blockCategory);

// Property Management Routes
adminRouter.put('/blockProperty', adminAuth, AdminController.blockProperty);

// Amenities Management Routes
adminRouter.route('/amenities')
  .get(adminAuth, AdminController.getAmenities)
  .post(adminAuth, AdminController.addAmenity)
  .put(adminAuth, AdminController.editAmenity);
adminRouter.put('/amenityBlock',AdminController.blockAmenity)

export default adminRouter;
