import express,{Router} from "express"

// Controllers
import userController from "../../adapters/controllers/userController"

// UseCases
import userUseCase from "../../useCase/userUseCase"

// Repositorys
import userRepository from "../../adapters/Repositorys/userRepository"

//Schemas
import OtpSchema from "../db/otpSchema"
import Users from "../db/userSchema"

// Utils
import HashingService from "../utils/hashingService"
import OtpService from "../utils/otpService"
import JwtToken from "../utils/jwtService"

const userRouter:Router = express.Router()

const jwtService = new JwtToken()
const hashingService = new HashingService()
const otpService = new OtpService()
const UserRepository = new userRepository(Users,OtpSchema)
const UserUseCase = new userUseCase(UserRepository,hashingService,otpService,jwtService)
const UserController = new userController(UserUseCase)

userRouter.post('/register',UserController.register)
userRouter.post('/login',UserController.login)
userRouter.post('/verifyOtp',UserController.verifyOtp)
userRouter.post('/logout',UserController.logout)
userRouter.post("/getToken",UserController.getToken)
userRouter.post("/resendOtp",UserController.resendOtp)
userRouter.post("/googleLogin",UserController.googleLogin)


export default userRouter