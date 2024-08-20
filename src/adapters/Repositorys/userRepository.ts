import { Model } from "mongoose";
import IUser, { IOtp, IProperty, IRevenue, ISeller, IToken, IWhishlist } from "../../entity/allEntity";
import IuserRepository, {
  IotpData,
  IPremiumSubscription,
  IRevenueData,
} from "../../Interfaces/Repository/userRepository";
import { IregisterBody } from "../../Interfaces/Controller/IUserController";
import { googleLoginData } from "../../Interfaces/UseCase/IuserUseCase";
import { Mode } from "fs";

export default class userRepository implements IuserRepository {
  private user: Model<IUser>;
  private otp: Model<IOtp>;
  private property: Model<IProperty>;
  private seller: Model<ISeller>
  private whishlist: Model<IWhishlist>
  private revenue: Model<IRevenue>

  constructor(
    user: Model<IUser>,
    otp: Model<IOtp>,
    property: Model<IProperty>,
    seller: Model<ISeller>,
    whishlist: Model<IWhishlist>,
    revenue: Model<IRevenue>
  ) {
    this.user = user;
    this.otp = otp;
    this.property = property;
    this.seller = seller
    this.whishlist = whishlist
    this.revenue = revenue
  }

  async checkEmailExists(email: string) {
    try {
      return await this.user.findOne({ email });
    } catch (error) {
      throw new Error("Failed to check the email exists");
    }
  }

  async checkUserExists(id: string) {
    try {
      return await this.user.findOne({ _id: id });
    } catch (error) {
      throw new Error("Failed to check the email exists");
    }
  }

  async checkSellerExists(id: string) {
    try {
      return await this.seller.findOne({ _id: id });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async createUser(data: IregisterBody) {
    try {
      let user = new this.user(data);
      return await user.save();
    } catch (error) {
      throw new Error("Failed to Create New User");
    }
  }

  async saveOtp(email: string, otp: string) {
    try {
      await this.otp.deleteMany({ email });
      let newOtp = new this.otp({ email, otp });
      await newOtp.save();
    } catch (error) {
      throw new Error("Failed to store Otp");
    }
  }

  async getUser(id: string) {
    try {
      return await this.user.findOne({ _id: id })
    } catch (error) {
      throw Error
    }
  }

  async getSeller(id: string) {
    try {
      return await this.seller.findOne({ _id: id })
    } catch (error) {
      throw Error
    }
  }


  async verifyOtp(email: string) {
    try {
      return await this.otp.findOne({ email });
    } catch (error) {
      throw new Error("failed to veify the user");
    }
  }

  async updateUserVerified(email: string) {
    try {
      return await this.user.findOneAndUpdate(
        { email },
        { $set: { otpVerified: true } }
      );
    } catch (error) {
      throw new Error("Failed to update user verified ");
    }
  }

  async saveGoogleLogin(data: googleLoginData) {
    try {
      const user = new this.user({
        name: data.name,
        email: data.email,
        image: data.image,
        otpVerified: true,
      });
      await user.save();
    } catch (error) {
      console.log(error);
    }
  }

  async updateUserPassword(id: string, password: string) {
    try {
      return await this.user.findOneAndUpdate(
        { _id: id },
        { $set: { password: password } }
      );
    } catch (error) {
      throw new Error("Failed to update user verified ");
    }
  }

  async getRentProperty() {
    try {
      return await this.property.find({ propertyFor: "rent" });
    } catch (error) {
      throw new Error("Failed to get rent property");
    }
  }

  async getSaleProperty() {
    try {
      return await this.property.find({ propertyFor: "sale" });
    } catch (error) {
      throw new Error("Failed to get sale property");
    }
  }

  async updateUser(id: string, name: string, image: string): Promise<IUser | null> {
    try {
      return await this.user.findByIdAndUpdate(
        { _id: id },
        { $set: { name: name, image: image } },
        { new: true }
      ).exec();
    } catch (error) {
      throw new Error("Failed to update user");
    }
  }

  async updateRevenue(data: IRevenueData) {
    try {
      const newRevenue = new this.revenue({
        userId: data.userId,
        amount: data.amount,
        date: data.date,
        transactionId: data.transactionId
      })
      return await newRevenue.save()
    } catch (error) {
      console.log(error)
      throw new Error("Failed to create revenue");
    }
  }

  async updatePremium(id: string, newSubscription: IPremiumSubscription): Promise<IUser | null> {
    try {
      return await this.user.findByIdAndUpdate(
        { _id: id },
        { $set: { isPremium: true, premiumSubscription: newSubscription } },
        { new: true }
      ).exec();
    } catch (error) {
      throw new Error("Failed to update user");
    }
  }

  async productDetail(id: string) {
    try {
      return await this.property.findById({ _id: id })
    } catch (error) {
      throw new Error("Failed to get product");
    }
  }

  async addToWhishlist(userId: string, propertyId: string) {
    try {
      return (await this.whishlist.create({ userId, propertyId })).populate("propertyId")
    } catch (error) {
      throw new Error("Failed to add to whishlist");
    }
  }

  async removeFromWhishlist(userId: string, propertyId: string) {
    try {
      return await this.whishlist.deleteOne({ userId: userId, propertyId: propertyId })
    } catch (error) {
      throw new Error("Failed to remove from whishlist");
    }
  }

  async getAllWhishlistProperty(userId: string) {
    try {
      return await this.whishlist.find({ userId: userId }).populate("propertyId")
    } catch (error) {
      throw new Error("Failder to get all whishlist property")
    }
  }

  async whishlistPropertyExist(userId: string, propertyId: string) {
    try {
      return await this.whishlist.findOne({ userId: userId, propertyId: propertyId })
    } catch (error) {
      throw new Error("Failder to get all whishlist property")
    }
  }

  async getListinProperty(query: any) {
    try {
      return await this.property.aggregate(query)
    } catch (error) {
      console.log(error)
      throw new Error("Failde to get listing property")
    }
  }
}
