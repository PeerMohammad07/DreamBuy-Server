import { IregisterBody } from "../Interfaces/Controller/IUserController";
import userRepository from "../adapters/Repositorys/userRepository";
import IhashingService from "../Interfaces/Utils/hashingService";
import IuserUseCase from "../Interfaces/UseCase/IuserUseCase";

export default class userUseCase implements IuserUseCase{
  private userRepository 
  private hashingService

  constructor(userRepository:userRepository,HashingService:IhashingService){
    this.userRepository = userRepository
    this.hashingService = HashingService
  }

  async register(data:IregisterBody){
    let exist =  await this.userRepository.checkEmailExists(data.email)
    if(exist){
      throw new Error("Email and phone Number is already used");
    }

    console.log(data,"data");
    
    let bycrptedPassword = await this.hashingService.hashing(data.password)
    data.password = bycrptedPassword

    await this.userRepository.createUser(data)
  }
}