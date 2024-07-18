import { Model } from "mongoose"
import IUser, { IOtp, IToken } from "../../entity/userEntity"
import IuserRepository, { IotpData } from "../../Interfaces/Repository/userRepository"
import { IregisterBody } from "../../Interfaces/Controller/IUserController"
import { googleLoginData } from "../../Interfaces/UseCase/IuserUseCase"

export default class userRepository implements IuserRepository{
  private user:Model<IUser>
  private otp : Model<IOtp>

  constructor(user:Model<IUser>,otp:Model<IOtp>){
    this.user = user  
    this.otp = otp
  }

  async checkEmailExists(email:string){
    try {
       return await this.user.findOne({email})
    } catch (error) {
       throw new Error("Failed to check the email exists")
    }
  }

  async checkUserExists(id:string){
    try {
       return await this.user.findOne({_id:id})
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

  async saveOtp(email:string,otp:string){
    try {
        await this.otp.deleteMany({email})
        let newOtp = new this.otp({email,otp})
        await newOtp.save()
    } catch (error) {
      throw new Error("Failed to store Otp")
    }
  }

  async verifyOtp(email : string){
    try {
      return await this.otp.findOne({email})
    } catch (error) {
      throw new Error("failed to veify the user")
    }
  }

  async updateUserVerified(email:string){
    try {
       return await this.user.findOneAndUpdate({email},{$set:{otpVerified:true}}) 
    } catch (error) {
        throw new Error("Failed to update user verified ")
    }
  }

  async saveGoogleLogin(data:googleLoginData){
    try {
        const user = new this.user({
          name:data.name,
          email:data.email,
          image:data.image,
          otpVerified:true
        })
        await user.save()
    } catch (error) {
      console.log(error);
    }
  }
  
  async updateUserPassword(id:string,password:string){
    try {
       return await this.user.findOneAndUpdate({_id:id},{$set:{password:password}}) 
    } catch (error) {
        throw new Error("Failed to update user verified ")
    }
  }
}