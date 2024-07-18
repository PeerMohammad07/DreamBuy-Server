import { Model } from "mongoose";
import IUser, { IAdmin } from "../../entity/userEntity";
import IadminRepository  from "../../Interfaces/Repository/adminRepository";

export default class adminRepository implements IadminRepository {

  private admin : Model<IAdmin>
  private user : Model<IUser>

  constructor(admin:Model<IAdmin>,user:Model<IUser>){
    this.admin = admin
    this.user = user
  }

  async checkEmailExists(email:string){
    try {
      return await this.admin.findOne({email})
    } catch (error) {
      console.log(error);
      return null
    }
  }

  async getAllUsers():Promise<IUser[]|[]>{
    try {
      const users =  await this.user.find({}).sort({_id:-1}).lean<IUser[]>()
      return users || null
    } catch (error) {
      console.log(error);
      return []
    }
  }

  async blockOrUnBlockUser(id:string,status:boolean){
    try {
     return await this.user.findOneAndUpdate({_id:id},{$set:{isBlocked:!status}})
    } catch (error) {
      console.log(error);
      return null
    }
  }
}