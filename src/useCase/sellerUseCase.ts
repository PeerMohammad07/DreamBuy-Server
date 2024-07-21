import { createImageUrl, sendObjectToS3 } from "../infrastructure/utils/s3Bucket";
import { randomImageName, sharpImage } from "../infrastructure/utils/sharpImage";
import ISellerRepository from "../Interfaces/Repository/sellerRepository";
import ISellerUsecase from "../Interfaces/UseCase/IsellerUseCase";
import IhashingService from "../Interfaces/Utils/hashingService";
import IjwtService from "../Interfaces/Utils/jwtServices";
import IotpService from "../Interfaces/Utils/otpService";


export interface IregisterData {
  name: string;
  email: string;
  phone: number;
  password: string;
}

export default class SellerUseCase implements ISellerUsecase {
  private sellerRepository: ISellerRepository;
  private hashingService: IhashingService;
  private otpService: IotpService;
  private jwtService: IjwtService;

  constructor(
    sellerRepository: ISellerRepository,
    hashingService: IhashingService,
    otpService: IotpService,
    jwtService: IjwtService
  ) {
    this.sellerRepository = sellerRepository;
    this.hashingService = hashingService;
    this.otpService = otpService;
    this.jwtService = jwtService;
  }


  // Seller registeration
  async register(data: IregisterData) {
    try {
      const exist = await this.sellerRepository.checkEmailExists(data.email);
      if (exist) {        
        return {
          status:false,
          message:"this seller already exist"
        }
      }
      const bycryptPassword = await this.hashingService.hashing(data.password);
      data.password = bycryptPassword;

      await this.sellerRepository.createSeller(data);

      const otp = await this.otpService.generateOtp();
      this.sellerRepository.saveOtp(data.email, otp);
      this.otpService.sendEmail(data.email, otp, data.name);
    } catch (error) {
      console.log(error);
    }
  }

  // Seller verify otp
  async verifyOtp(email: string, otp: string) {
    try {
      const otpExist = await this.sellerRepository.verifyOtp(email);
      if (otpExist && otpExist.otp == otp && otpExist.email) {
        const sellerData = await this.sellerRepository.updateSellerVerified(
          otpExist.email
        );
        if (sellerData) {
          let payload = {
            userId: sellerData._id,
            name: sellerData.name,
            role: "seller",
          };
          let token = await this.jwtService.generateToken(payload);
          return { status: true, message: "Otp verification done", token ,sellerData};
        }
      }
      return { status: false, message: "invalid otp", token: "" };
    } catch (error) {
      console.log(error);
      return { status: false, message: "verification failed", token: "" };
    }
  }


  // Seller Login
  async login(email: string, password: string) {
    try {      
      const seller = await this.sellerRepository.checkEmailExists(email);
      if (seller) {        
        const passwordCheck = await this.hashingService.compare(
          password,
          seller.password
        );        
        if (!passwordCheck) {
          return {
            status: false,
            message: "incorrect password",
          };
        } 
        
        if (seller.otpVerified == false) {          
          const otp = await this.otpService.generateOtp();
          this.sellerRepository.saveOtp(seller.email, otp);
          this.otpService.sendEmail(seller.email, otp, seller.name);
          return {status:false, message : "otp is not verified"}
        }

        let payload = {
          userId: seller._id,
          name: seller.name,
          role: "seller",
        };
        let token = await this.jwtService.generateToken(payload);
        return { status: true, message: "login succesfully", token ,seller};
      }else {
        return {status:false,message:"email not found"}
      }

    } catch (error) {
      console.log(error);
      return {
        status :false,
        message : ""
      }
    }
  }

  async resendOtp(email:string){
    try {
      const user = await this.sellerRepository.checkEmailExists(email)
      if(user){
        let otp = await this.otpService.generateOtp();
        this.sellerRepository.saveOtp(email, otp);
        this.otpService.sendEmail(email, otp, user.name);        
        return "resendOtp successfull"
      }
      return "invalid email"
    } catch (error) {
      console.log(error);
      return null
    }
  }


  // forgot password
  async validateForgotPassword(email:string){
    try {
      const seller = await this.sellerRepository.checkEmailExists(email)
      console.log(seller,"seller");
      if(!seller){
        return "seller not exist with this email"
      }
      let data = {
        userId : seller?._id as string,
        name : seller?.name as string,
        role:"seller"
      }
      const expiresIn = "3m"
      const token = await this.jwtService.generateTokenForgot(data,expiresIn)
      const resetLink = `http://localhost:5000/resetPassword/${token}`
      await this.otpService.sendEmailForgotPassword(resetLink,seller.email)
      return "Email sended to the seller"
    } catch (error) {
      console.log(error);
      return null
    }
  }

  async resetPassword(password:string,id:string,token:string){
    try {
      const user = await this.sellerRepository.checkUserExists(id)
      if(!user){
        return "user doesn't exists"
      }
      let verifyToken = await this.jwtService.verfiyToken(token)
      if(!verifyToken){
        return "token expired"
      }

      let hashPassword = await this.hashingService.hashing(password)
      const passwordUpdated = await this.sellerRepository.updateSellerPassword(id,hashPassword)
      if(passwordUpdated){
        return "password updated succesfully"
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateKycImage(type:string,buffer:string,id:string){
    try {      
      const sharpedImage = await sharpImage(buffer)
      const imageName = await randomImageName()
      if(sharpedImage){
         await sendObjectToS3(imageName,type,sharpedImage)
      }
      const url = await createImageUrl(imageName)
      const response = await this.sellerRepository.updateKyc(id,imageName,url)
      if(response){
        return {message:"added succesfully",seller:response,status:true}
      }
      return {message:"something went wrong",status:false}
    } catch (error) {
      console.log(error,"err user case");
      return null
    }
  }

  async getSeller(){
    try {
      return await this.sellerRepository.getSeller()
    } catch (error) {
      console.log(error);
      return null
    }
  }


  async kycStatusUpdate(id:string,status:string){
    try {
      const response = await this.sellerRepository.kycStatusUpdate(id,status)
      return response
    } catch (error) {
      console.log(error);
      return null
    }
  }

  async blockSeller(id:string,status:boolean){
    try {
      const response = await this.sellerRepository.blockSeller(id,status)
      if(response?.isBlocked){
        return "unblocked successfully"
      }else {
        return "blocked successfully"
      }
    } catch (error) {
      console.log(error);
      return null
    }
  }
}