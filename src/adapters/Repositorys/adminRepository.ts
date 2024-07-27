import { Model } from "mongoose";
import IUser, { IAdmin, ICategory, ISeller } from "../../entity/allEntity";
import IadminRepository from "../../Interfaces/Repository/adminRepository";

export default class adminRepository implements IadminRepository {
  private admin: Model<IAdmin>;
  private user: Model<IUser>;
  private seller: Model<ISeller>;
  private category : Model<ICategory>

  constructor(admin: Model<IAdmin>, user: Model<IUser>,seller: Model<ISeller>,category:Model<ICategory>) {
    this.admin = admin;
    this.user = user;
    this.seller = seller
    this.category = category
  }

  async checkEmailExists(email: string) {
    try {
      return await this.admin.findOne({ email });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async checkUserExists(id: string) {
    try {
      return await this.admin.findOne({ _id: id });
    } catch (error) {
      throw new Error("Failed to check the admin exists");
    }
  }

  async getAllUsers(): Promise<IUser[] | []> {
    try {
      const users = await this.user.find({}).sort({ _id: -1 }).lean<IUser[]>();
      return users || null;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async blockOrUnBlockUser(id: string, status: boolean) {
    try {
      return await this.user.findOneAndUpdate(
        { _id: id },
        { $set: { isBlocked: !status } }
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  }


  async getSeller() {
    try {
      return await this.seller.find();
    } catch (error) {
      throw new Error("Failed to get Sellers");
    }
  }

  async getCategory() {
    try {
      return await this.category.find();
    } catch (error) {
      throw new Error("Failed to get Sellers");
    } 
  }

  async blockOrUnBlockCategory(id: string, status: boolean) {
    try {
      return await this.category.findOneAndUpdate(
        { _id: id },
        { $set: { isBlocked: !status } }
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
