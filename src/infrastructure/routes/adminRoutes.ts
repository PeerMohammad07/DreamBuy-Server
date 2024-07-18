import express, { Router } from "express"
import adminController from "../../adapters/controllers/adminController"
import adminUseCase from "../../useCase/adminUseCase"
import JwtToken from "../utils/jwtService"
import HashingService from "../utils/hashingService"
import adminRepository from "../../adapters/Repositorys/adminRepository"
import adminSchema from "../db/adminSchema"
import UserModel from "../db/userSchema"

const adminRouter:Router = express.Router()

const AdminRepository = new adminRepository(adminSchema,UserModel)
const JwtService = new JwtToken()
const hashingService = new HashingService()
const AdminUseCase = new adminUseCase(AdminRepository,hashingService,JwtService)
const AdminController = new adminController(AdminUseCase)

adminRouter.post("/login",AdminController.login)
adminRouter.get("/getUsers",AdminController.getUsers)
adminRouter.put("/blockUser",AdminController.blockUser)

export default adminRouter