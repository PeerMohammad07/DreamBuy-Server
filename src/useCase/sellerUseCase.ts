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
          return { status: true, message: "Otp verification done", token };
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

        if(!seller.verficationImage){
          return {
            status: false,
            message: "no verification image",
          };
        }

        if (seller.kycVerified == "inProgress"||seller.kycVerified == "rejected") {
          return {
            status: false,
            message: "Kyc verification in progresss",
          };
        }


        let payload = {
          userId: seller._id,
          name: seller.name,
          role: "seller",
        };
        let token = await this.jwtService.generateToken(payload);
        return { status: true, message: "login succesfully", token };
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
}
