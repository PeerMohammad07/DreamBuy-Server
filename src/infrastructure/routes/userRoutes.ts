import express,{Router} from "express"
import userController from "../../adapters/controllers/userController"
import userUseCase from "../../useCase/userUseCase"
import userRepository from "../../adapters/Repositorys/userRepository"
import HashingService from "../utils/hashingService"

import Users from "../db/userSchema"

const userRouter:Router = express.Router()



const hashingService = new HashingService()
const UserRepository = new userRepository(Users)
const UserUseCase = new userUseCase(UserRepository,hashingService)
const UserController = new userController(UserUseCase)

userRouter.post('/register',UserController.register)


export default userRouter