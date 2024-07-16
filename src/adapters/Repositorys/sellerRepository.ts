import { Model } from "mongoose"
import { IOtp, ISeller } from "../../entity/userEntity"
import ISellerRepository from "../../Interfaces/Repository/sellerRepository"
import { IregisterData } from "../../useCase/sellerUseCase"

export default class SellerRepository implements ISellerRepository{
  private seller:Model<ISeller>
  private otp : Model <IOtp>

  constructor(seller:Model<ISeller>,otp:Model<IOtp>){
    this.seller = seller 
    this.otp = otp
  }

  async checkEmailExists(email:string){
    try {
      return await this.seller.findOne({email})
    } catch (error) {
      console.log(error); 
      return null
    }
  }

  async createSeller(data:IregisterData){
    try {
      const seller = new this.seller({
        name : data.name,
        email: data.email,
        phone :data.phone,
        password : data.password
      })
      await seller.save()
    } catch (error) {
      console.log(error);     
    }
  }

  async saveOtp(email:string,otp:string){
    try {
      await this.otp.deleteMany({email})
      const Otp = new this.otp({
        email : email,
        otp : otp
      })
      await Otp.save()
    } catch (error) {
      console.log(error)
    }
  }

  async verifyOtp(email : string){
    try {
      return await this.otp.findOne({email})
    } catch (error) {
      throw new Error("failed to verify the seller")
    }
  }

  async updateSellerVerified(email:string){
    try {
      return await this.seller.findOneAndUpdate({email},{$set:{otpVerified:true}})
    } catch (error) {
      throw new Error("failed to update the seller")
    }
  }
}