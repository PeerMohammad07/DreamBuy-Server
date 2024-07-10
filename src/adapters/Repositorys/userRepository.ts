import { Model } from "mongoose"
import IUser from "../../entity/userEntity"
import IuserRepository from "../../Interfaces/Repository/userRepository"
import { IregisterBody } from "../../Interfaces/Controller/IUserController"

export default class userRepository implements IuserRepository{
  private user

  constructor(user:Model<IUser>){
    this.user = user
  }

  async checkEmailExists(email:string){
    try {
       return await this.user.findOne({email})
    } catch (error) {
       throw new Error("Failed to check the email exists")
    }
  }

  async createUser(data:IregisterBody){
    try {
      let user = new this.user(data)
      return await user.save()
    } catch (error) {
      throw new Error("Failed to Create New User")
    }
  }

}