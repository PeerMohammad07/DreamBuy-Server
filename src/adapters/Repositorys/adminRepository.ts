import { Model } from "mongoose";
import IUser, { IAdmin, IAmenities, ICategory, IProperty, IRevenue, ISeller } from "../../entity/allEntity";
import IadminRepository from "../../Interfaces/Repository/adminRepository";

export default class adminRepository implements IadminRepository {
  private admin: Model<IAdmin>;
  private user: Model<IUser>;
  private seller: Model<ISeller>;
  private category: Model<ICategory>;
  private property: Model<IProperty>;
  private amenities: Model<IAmenities>;
  private revenue: Model<IRevenue>

  constructor(admin: Model<IAdmin>, user: Model<IUser>, seller: Model<ISeller>, category: Model<ICategory>, property: Model<IProperty>, amenities: Model<IAmenities>, revenue: Model<IRevenue>) {
    this.admin = admin;
    this.user = user;
    this.seller = seller;
    this.category = category;
    this.amenities = amenities;
    this.property = property;
    this.revenue = revenue
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
      throw new Error("Failed to get Categories");
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

  async addCategory(name: string, description: string) {
    try {
      const category = new this.category({
        name,
        description
      });
      return await category.save();
    } catch (error) {
      throw new Error("Failed to add Category");
    }
  }

  async editCategory(id: string, name: string, description: string) {
    try {
      return await this.category.findByIdAndUpdate(
        { _id: id },
        { $set: { name, description } },
        { new: true }
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async blockProperty(id: string, status: boolean) {
    try {
      return await this.property.findOneAndUpdate(
        { _id: id },
        { $set: { propertyStatus: !status } }
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getAllAmenities(): Promise<IAmenities[] | []> {
    try {
      return await this.amenities.find();
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async addAmenity(name: string) {
    try {
      const amenity = new this.amenities({ name });
      return await amenity.save();
    } catch (error) {
      throw new Error("Failed to add Amenity");
    }
  }

  async editAmenity(id: string, name: string) {
    try {
      return await this.amenities.findByIdAndUpdate(
        { _id: id },
        { $set: { name } },
        { new: true }
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async blockAmenity(id: string, status: boolean) {
    try {
      return await this.amenities.findOneAndUpdate(
        { _id: id },
        { $set: { isBlocked: !status } }
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  }


  async noOfRentProperty() {
    try {
      return await this.property.find({ propertyFor: "rent" })
    } catch (error) {
      throw new Error()
    }
  }

  async noOfSaleProperty() {
    try {
      return await this.property.find({ propertyFor: "sale" })
    } catch (error) {
      throw new Error()
    }
  }

  async noOfAmenities() {
    try {
      return await this.amenities.find({ isBlocked: false }).countDocuments()
    } catch (error) {
      throw new Error()
    }
  }

  async noOfCategory() {
    try {
      return await this.category.find({ isBlocked: false }).countDocuments()
    } catch (error) {
      throw new Error()
    }
  }

  async noOfSellers() {
    try {
      return await this.seller.find({ isBlocked: false }).countDocuments()
    } catch (error) {
      throw new Error()
    }
  }

  async noOfUsers() {
    try {
      return await this.user.find({ isBlocked: false }).countDocuments()
    } catch (error) {
      throw new Error()
    }
  }

  async mostUsedCategorys() {
    try {
      return await this.property.aggregate([{
        $group: { _id: '$propertyType', count: { $sum: 1 } }
      }, {
        $sort: { count: -1 },
      },
      { $project: { propertyType: 1, count: 1 } },
      { $limit: 5 }
      ])
    } catch (error) {
      throw new Error()
    }
  }

  async mostUsedAmenities() {
    try {
      return await this.property.aggregate([
        { $unwind: '$features' },
        { $group: { _id: '$features', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    } catch (error) {
      throw new Error()
    }
  }

  async noOfPremiumUsers() {
    try {
      return await this.user.find({ isPremium: true, isBlocked: false }).countDocuments()
    } catch (error) {
      throw new Error()
    }
  }

  async totalRevenue() {
    try {
      return await this.revenue.aggregate([{
        $group: {
          _id: '$transactionId',
          amount: { $first: '$amount' }
        }
      }, { $group: { _id: null, sum: { $sum: '$amount' } } }, { $project: { sum: 1, _id: 0 } }])
    } catch (error) {
      throw new Error()
    }
  }

  async monthlyRevenue() {
    try {
      return await this.revenue.aggregate([
        {
          $group: {
            _id: '$transactionId',
            amount: { $first: '$amount' },
            date: { $first: '$date' }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" }
            },
            totalRevenue: { $sum: "$amount" }
          }
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1
          }
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            totalRevenue: 1
          }
        }
      ]);
    } catch (error) {
      console.log(error)
      throw new Error("Failed to show monthly revenue");
    }
  }


  async userGrowth() {
    try {
      return this.user.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            newUsers: { $sum: 1 }
          },
        }, {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            newUsers: 1
          }
        },
        {
          $sort: {
            year: 1,
            month: 1
          }
        }
      ])
    } catch (error) {
      throw new Error("Failed to get User Growth")
    }
  }

  async sellerGrowth() {
    try {
      return this.seller.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            newSellers: { $sum: 1 }
          },
        }, {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            newSellers: 1
          }
        },
        {
          $sort: {
            year: 1,
            month: 1
          }
        }
      ])
    } catch (error) {
      throw new Error("Failed to get Seller Growth")
    }
  }
}
