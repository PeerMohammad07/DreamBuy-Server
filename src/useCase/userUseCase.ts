import { IregisterBody } from "../Interfaces/Controller/IUserController";
import IuserRepository from "../Interfaces/Repository/userRepository";
import IhashingService from "../Interfaces/Utils/hashingService";
import IuserUseCase, {
  googleLoginData,
  loginBody,
  loginRes,
} from "../Interfaces/UseCase/IuserUseCase";
import IotpService from "../Interfaces/Utils/otpService";
import IjwtService from "../Interfaces/Utils/jwtServices";
import { randomImageName, sharpImage } from "../infrastructure/utils/sharpImage";
import { createImageUrl, sendObjectToS3 } from "../infrastructure/utils/s3Bucket";
import sendEmailOwnerDetails from "../infrastructure/utils/sendSellerDetails";
import { IProperty } from "../entity/allEntity";
import { IPushNotificationRepository } from "../Interfaces/Repository/pushNotificatio";


interface SearchParams {
  latitude?: number;
  longitude?: number;
}

export interface locationSearch {
  location : string
  cordinates : [number,number]
}

interface FilterParams {
  propertyFor?: string;
  bedrooms?: number[];
  bathrooms?: number[];
  priceRange?: [number, number];
  category?: string;
  sqft?: number;
  amenities?: string[];
}

type SortOption = 'priceAsc' | 'priceDesc' | 'dateAsc' | 'dateDesc';


export default class userUseCase implements IuserUseCase {
  private userRepository: IuserRepository;
  private hashingService: IhashingService;
  private otpService: IotpService;
  private jwtService: IjwtService;

  constructor(
    userRepository: IuserRepository,
    HashingService: IhashingService,
    otpService: IotpService,
    jwtService: IjwtService,
  ) {
    this.userRepository = userRepository;
    this.hashingService = HashingService;
    this.otpService = otpService;
    this.jwtService = jwtService;
  }

  // register
  async register(data: IregisterBody) {
    try {
      let exist = await this.userRepository.checkEmailExists(data.email);
      if (exist) {
        return {
          status: false,
          message: "this user already exist",
        };
      }
      if (data.password) {
        let bycrptedPassword = await this.hashingService.hashing(data.password);
        data.password = bycrptedPassword;
      }

      await this.userRepository.createUser(data);

      let otp = await this.otpService.generateOtp();
      this.userRepository.saveOtp(data.email, otp);
      this.otpService.sendEmail(data.email, otp, data.name);
    } catch (error) {
      throw new Error();
    }
  }

  // verifyOtp
  async verifyOtp(email: string, otp: string) {
    try {
      let data = await this.userRepository.verifyOtp(email);

      if (data?.otp && data.email && data?.otp == otp) {
        let userData = await this.userRepository.updateUserVerified(data.email);
        if (userData) {
          let payload = {
            userId: userData._id,
            name: userData.name,
            role: "user",
          };
          let token = await this.jwtService.generateToken(payload);
          let refreshToken = await this.jwtService.generateRefreshToken(payload)
          return { status: true, message: "Otp verification done", token, refreshToken, user: userData };
        }
      }
      return { status: false, message: "incorrect otp", token: "" };
    } catch (error) {
      throw Error();
    }
  }

  // verifyToken
  verifyToken(token: string) {
    try {
      let verifiedResponse = this.jwtService.verfiyToken(token);
      if (verifiedResponse?.role == "user") {
        return {
          status: true,
          decoded: verifiedResponse,
        };
      }
      return {
        status: false,
      };
    } catch (error) {
      throw Error();
    }
  }

  // login
  async loginAuthentication(data: loginBody) {
    try {
      const value = await this.userRepository.checkEmailExists(data.email);
      if (value) {
        if (!value.password) {
          return {
            status: false,
            message: "this account for login only googleAuth",
          };
        }

        if (value.isBlocked) {
          return {
            status: false,
            message: "this user is blocked ",
          };
        }

        const status = await this.hashingService.compare(
          data.password,
          value.password
        );

        if (!status) {
          return {
            status: false,
            message: "incorrect password",
          };
        }

        if (value.otpVerified == false) {
          let otp = await this.otpService.generateOtp();
          this.userRepository.saveOtp(value.email, otp);
          this.otpService.sendEmail(value.email, otp, value.name);
          return { status: false, message: "otp is not verified" };
        }

        const payload = {
          userId: value._id,
          name: value.name,
          role: "user",
        };

        let token = await this.jwtService.generateToken(payload)
        let refreshToken = await this.jwtService.generateRefreshToken(payload)
        return { status: true, message: "Login Succesfully", user: value, token, refreshToken };
      }
      return { status: false, message: "Email Not found" };
    } catch (error) {
      return {
        status: false,
        message: "",
      };
    }
  }

  // resend Otp
  async resendOtp(email: string) {
    try {
      const user = await this.userRepository.checkEmailExists(email);
      if (user) {
        let otp = await this.otpService.generateOtp();
        this.userRepository.saveOtp(email, otp);
        this.otpService.sendEmail(email, otp, user.name);
        return "resendOtp successfull";
      }
      return "invalid email";
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // google Register
  async googleRegister(data: googleLoginData) {
    try {
      let user = await this.userRepository.checkEmailExists(data.email);
      if (user) {
        return { status: false, message: "user already exists with this email" };
      }
      const newUser = await this.userRepository.createUser(data)

      let payload = {
        userId: newUser?._id as string,
        name: newUser?.name as string,
        role: "user",
      };

      const token = await this.jwtService.generateToken(payload);
      const refreshToken = await this.jwtService.generateRefreshToken(payload)
      return { status: true, message: "google register succesfull", token, refreshToken, newUser };
    } catch (error) {
      console.log(error);
      return null
    }
  }

  // googleLogin
  async googleLogin(data: googleLoginData) {
    let user = await this.userRepository.checkEmailExists(data.email);
    if (!user) {
      return { status: false, message: "please register to login" };
    }
    const loginUser = await this.userRepository.checkEmailExists(data.email);

    let payload = {
      userId: loginUser?._id as string,
      name: loginUser?.name as string,
      role: "user",
    };

    const token = await this.jwtService.generateToken(payload);
    const refreshToken = await this.jwtService.generateRefreshToken(payload)
    return { status: true, message: "google Login succesfull", token, refreshToken, loginUser };
  }

  // forgot password
  async validateForgotPassword(email: string) {
    try {
      const user = await this.userRepository.checkEmailExists(email);
      console.log(email);

      if (!user) {
        return "user not exist with this email";
      }
      let data = {
        userId: user?._id as string,
        name: user?.name as string,
        role: "user",
      };
      const expiresIn = "3m";
      const token = await this.jwtService.generateTokenForgot(data, expiresIn);
      const resetLink = `http://localhost:5000/resetPassword/${token}`;
      await this.otpService.sendEmailForgotPassword(resetLink, user.email);
      return "Email sended to the user";
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async resetPassword(password: string, id: string, token: string) {
    try {
      const user = await this.userRepository.checkUserExists(id);
      if (!user) {
        return "user doesn't exists";
      }
      let verifyToken = await this.jwtService.verfiyToken(token);
      if (!verifyToken) {
        return "token expired";
      }

      let hashPassword = await this.hashingService.hashing(password);
      const passwordUpdated = await this.userRepository.updateUserPassword(
        id,
        hashPassword
      );
      if (passwordUpdated) {
        return "password updated succesfully";
      }
    } catch (error) { }
  }

  async getUsers(id: string, role: string) {
    try {
      if (role == 'user') {
        return await this.userRepository.getSeller(id)
      } else {
        return await this.userRepository.getUser(id)
      }
    } catch (error) {
      console.log(error);
      return null
    }
  }

  async getRentProperty() {
    try {
      const response = await this.userRepository.getRentProperty();
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getSaleProperty() {
    try {
      const response = await this.userRepository.getSaleProperty();
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateUser(id: string, name: string, image: string, type: string) {
    try {
      let url = image;
      if (!image.includes('https://dreambuy')) {
        const sharpedImage = await sharpImage(2000, 2000, image);
        const imageName = await randomImageName();
        if (sharpedImage) {
          await sendObjectToS3(imageName, type, sharpedImage);
        }
        url = await createImageUrl(imageName);
      }
      const response = await this.userRepository.updateUser(id, name, url)
      if (response) {
        return { status: true, message: "user updated successfully", user: response }
      }
      return { status: false, message: "failed try again" }
    } catch (error) {
      console.log(error);
      return null
    }
  }

  async getPremium(data: any) {
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const subscriptionType = data.interval
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [
          {
            price: data.id,
            quantity: 1,
          },
        ],
        success_url: `${process.env.CLIENT_SIDE_URL}paymentStatus?success=true&Type=${subscriptionType}`,
        cancel_url: `${process.env.CLIENT_SIDE_URL}paymentStatus`,
      });
      return session
    } catch (error) {
      console.log(error);
    }
  }



  async updatePremium(id: string, type: string) {
    try {
      let amount;
      const startDate = new Date();
      let expiryDate = new Date();
      if (type === 'weekly') {
        amount = 199
        expiryDate.setDate(startDate.getDate() + 7);
      } else if (type === 'monthly') {
        amount = 299
        expiryDate.setMonth(startDate.getMonth() + 1);
      } else if (type === 'three_months') {
        amount = 799
        expiryDate.setMonth(startDate.getMonth() + 3);
      } else {
        throw new Error("Invalid subscription type");
      }

      const user = await this.userRepository.checkUserExists(id)
      if (user && user.isPremium && user.premiumSubscription?.expiryDate) {
        if (user.premiumSubscription?.subscriptionType == "weekly") {
          amount = 199
          expiryDate.setDate(user.premiumSubscription.expiryDate.getDate() + 7);
        } else if (user.premiumSubscription?.subscriptionType == "monthly") {
          amount = 299
          expiryDate.setDate(user.premiumSubscription.expiryDate.getMonth() + 1);
        } else if (user.premiumSubscription?.subscriptionType == "three_months") {
          amount = 799
          expiryDate.setDate(user.premiumSubscription.expiryDate.getMonth() + 3);
        }
      }

      const newSubscription = {
        subscriptionType: type,
        startDate: startDate,
        expiryDate: expiryDate
      };

      const updatedUser = await this.userRepository.updatePremium(id, newSubscription)

      const transactionId = updatedUser?._id.toString()
      const revenueData = {
        transactionId: transactionId,
        userId: id,
        amount,
        date: startDate
      }
      await this.userRepository.updateRevenue(revenueData)
      return updatedUser
    } catch (error) {
      console.log(error);
      return null
    }
  }

  async productDetail(id: string) {
    try {
      const response = await this.userRepository.productDetail(id)
      if (response) {
        if(response.propertyStatus){
          return { message: "Property has been blocked", status: false, data: response }
        }
        return { message: "productDetails got successfully", status: true, data: response }
      } else {
        return { message: "something went wrong", status: false }
      }
    } catch (error) {
      console.log(error);
      return null
    }
  }

  async sendOwnerDetail(sellerId: string, email: string, name: string, property: IProperty) {
    try {
      const seller = await this.userRepository.checkSellerExists(sellerId)
      if (!seller) {
        return { status: false, message: "seller doesnt exist with this id" }
      }
      await sendEmailOwnerDetails(email, name, seller, property)
      return { status: true, message: "Email sended succesfully" }
    } catch (error) {
      console.log(error);
      return null
    }
  }


  async addToWhishlist(userId: string, propertyId: string) {
    try {
      const exist = await this.userRepository.whishlistPropertyExist(userId, propertyId)
      if (exist) {
        return { status: true, message: "Already in the wishlist", data: exist }
      }
      const response = await this.userRepository.addToWhishlist(userId, propertyId)
      if (response) {
        return { status: true, message: "Property added to whishlist", data: response }
      }
      return { status: false, message: "Failed to add wishlist" }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async removeFromWhishlist(userId: string, propertyId: string) {
    try {
      const response = await this.userRepository.removeFromWhishlist(userId, propertyId)
      if (response.deletedCount >= 1) {
        return { status: true, message: "Removed property from whishlist" }
      }
      return { status: false, message: "Failed to remove from whishilist" }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async getAllWhishlistProperty(userId: string) {
    try {
      return await this.userRepository.getAllWhishlistProperty(userId)
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async getListingProperty(search: SearchParams, filter: FilterParams, sort: SortOption, locationSearch: locationSearch) {
    try {
      const pipeline: any[] = [];
      const sortStage: any = {};

      // Geo-Spatial Search
      if (locationSearch) {
        console.log(locationSearch,"locationSearhc ")
        pipeline.push({
          $geoNear: {
            near: {
              type: "Point",
              coordinates: locationSearch.cordinates,
            },
            distanceField: "dist.calculated",
            maxDistance: 20 * 1000,
            spherical: true,
          },
        });
        sortStage['dist.calculated'] = 1; 
      } else if (search.latitude && search.longitude) {
        console.log(search.latitude,search.longitude,"hehe ennada tih")
        pipeline.push({
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [search.longitude, search.latitude],
            },
            distanceField: "dist.calculated",
            maxDistance: 10000 * 1000,  // 100000 km
            spherical: true,
          },
        });
        sortStage['dist.calculated'] = 1;
      }else{
        // No need to do anything realted to location 
      }


      // Filtering
      const matchStage: any = { propertyStatus: false };

      if (filter) {
        if (filter.propertyFor) matchStage['propertyFor'] = filter.propertyFor;
        if (filter.bedrooms) matchStage['noOfBedroom'] = filter.bedrooms[0];
        if (filter.bathrooms) matchStage['noOfBathroom'] = filter.bathrooms[0];
        if (filter.priceRange) matchStage['Price'] = { $gte: `${filter.priceRange[0]}`, $lte: `${filter.priceRange[1]}` };
        if (filter.category) matchStage['propertyType'] = filter.category;
        if (filter.sqft) matchStage['sqft'] = filter.sqft;
        if (filter.amenities && filter.amenities.length > 0) matchStage['features'] = { $in: filter.amenities };
      }

      pipeline.push({ $match: matchStage });

      // Sorting
      if (sort) {
        switch (sort) {
          case 'priceAsc':
            sortStage['Price'] = 1;
            break;
          case 'priceDesc':
            sortStage['Price'] = -1;
            break;
          case 'dateDesc':
            sortStage['createdAt'] = -1;
            break;
          case 'dateAsc':
            sortStage['createdAt'] = 1;
            break;
        }
        pipeline.push({ $sort: sortStage });
      }

      console.log(JSON.stringify(pipeline), "pipeline");
      const properties = await this.userRepository.getListinProperty(pipeline);
      console.log(properties);
      return properties;
    } catch (error) {
      console.error('Error fetching properties:', error);
      return null;
    }
  }
}
