import { Model } from "mongoose";
import { IOtp, IProperty, ISeller } from "../../entity/allEntity";
import ISellerRepository from "../../Interfaces/Repository/sellerRepository";
import { IregisterData } from "../../useCase/sellerUseCase";
import {
  Property,
  PropertyData,
} from "../../Interfaces/UseCase/IsellerUseCase";

export default class SellerRepository implements ISellerRepository {
  private seller: Model<ISeller>;
  private otp: Model<IOtp>;
  private property: Model<IProperty>;

  constructor(
    seller: Model<ISeller>,
    otp: Model<IOtp>,
    property: Model<IProperty>
  ) {
    this.seller = seller;
    this.otp = otp;
    this.property = property;
  }

  async checkEmailExists(email: string) {
    try {
      return await this.seller.findOne({ email });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async checkUserExists(id: string) {
    try {
      return await this.seller.findOne({ _id: id });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async createSeller(data: IregisterData) {
    try {
      const seller = new this.seller({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      await seller.save();
    } catch (error) {
      console.log(error);
    }
  }

  async saveOtp(email: string, otp: string) {
    try {
      await this.otp.deleteMany({ email });
      const Otp = new this.otp({
        email: email,
        otp: otp,
      });
      await Otp.save();
    } catch (error) {
      console.log(error);
    }
  }

  async verifyOtp(email: string) {
    try {
      return await this.otp.findOne({ email });
    } catch (error) {
      throw new Error("failed to verify the seller");
    }
  }

  async updateSellerVerified(email: string) {
    try {
      return await this.seller.findOneAndUpdate(
        { email },
        { $set: { otpVerified: true } }
      );
    } catch (error) {
      throw new Error("failed to update the seller");
    }
  }

  async updateSellerPassword(id: string, password: string) {
    try {
      return await this.seller.findOneAndUpdate(
        { _id: id },
        { $set: { password: password } }
      );
    } catch (error) {
      throw new Error("Failed to update seller verified ");
    }
  }

  async updateKyc(id: string, image: string, url: string) {
    try {
      return await this.seller.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            verficationImage: image,
            kycVerified: "Verification Pending",
            verificationImageUrl: url,
          },
        },
        { new: true }
      );
    } catch (error) {
      throw new Error("Failed to update Kyc");
    }
  }

  async kycStatusUpdate(id: string, status: string) {
    try {
      return await this.seller.findByIdAndUpdate(
        { _id: id },
        { $set: { kycVerified: status } },
        { new: true }
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async blockSeller(id: string, status: boolean) {
    try {
      return await this.seller.findOneAndUpdate(
        { _id: id },
        { $set: { isBlocked: !status } }
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async addProperty(data: Property) {
    try {
      console.log(data,"data");
      
      const property = new this.property({
        propertyName: data.propertyName,
        sellerId: data.sellerId,
        propertyFor: data.propertyFor,
        propertyType: data.propertyType,
        state: data.state,
        city: data.city,
        features: data.features,
        noOfBedroom: data.bedrooms,
        noOfBathroom: data.bathrooms,
        description: data.description,
        location: data.location,
        Price: data.expectedPrice,
        propertyImage: data.images,
        sqft:data.sqft,
      });
      return await property.save();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateSeller(sellerId: string, name: string, phone: string){
    try {
      return await this.seller.findByIdAndUpdate({_id:sellerId},{$set:{name:name,phone:phone}},{new:true})
    } catch (error) {
      console.log(error);
      return null
    }
  }

}
