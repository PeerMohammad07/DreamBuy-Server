import { IregisterBody } from "../Interfaces/Controller/IUserController";
import IuserRepository from "../Interfaces/Repository/userRepository";
import IhashingService from "../Interfaces/Utils/hashingService";
import IuserUseCase, { googleLoginData, loginBody, loginRes } from "../Interfaces/UseCase/IuserUseCase";
import IotpService from "../Interfaces/Utils/otpService";
import IjwtService from "../Interfaces/Utils/jwtServices";

export default class userUseCase implements IuserUseCase {
  private userRepository: IuserRepository;
  private hashingService: IhashingService;
  private otpService: IotpService;
  private jwtService: IjwtService;

  constructor(
    userRepository: IuserRepository,
    HashingService: IhashingService,
    otpService: IotpService,
    jwtService: IjwtService
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
        throw new Error("Email is already used");
      }

      let bycrptedPassword = await this.hashingService.hashing(data.password);
      data.password = bycrptedPassword;

      await this.userRepository.createUser(data);

      let otp = await this.otpService.generateOtp();
      this.userRepository.saveOtp(data.email, otp);
      this.otpService.sendEmail(data.email, otp, data.name);
    } catch (error) {
      throw Error();
    }
  }

  // verifyOtp
  async verifyOtp(email: string,otp:string) {
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
          return { status: true, message: "Otp verification done", token };
        }
      }
      return { status: false, message: "incorrect otp", token: "" };
    } catch (error) {
      throw Error();
    }
  }

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
        const status = this.hashingService.compare(
          value.password,
          data.password
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
          return {status:false,message:"otp is not verified"}
        }

        const payload =  {
          userId : value._id,
          name : value.name,
          role : "user"
        }

        let token = await this.jwtService.generateToken(payload)
        return {status:true,message : "Login Succesfully",token}
      }
      return {status:false,message:"Email Not found"}
    } catch (error) {
      return {
        status :false,
        message : ""
      }
    }
  }

  async resendOtp(email:string){
    try {
      const user = await this.userRepository.checkEmailExists(email)
      if(user){
        let otp = await this.otpService.generateOtp();
        this.userRepository.saveOtp(email, otp);
        this.otpService.sendEmail(email, otp, user.name);        
        return "resendOtp successfull"
      }
      return "invalid email"
    } catch (error) {
      console.log(error);
      return null
    }
  }

  async googleLogin(data:googleLoginData){
    let user =await this.userRepository.checkEmailExists(data.email)
    if(!user){
      await this.userRepository.saveGoogleLogin(data)
    }
    const loginUser = await this.userRepository.checkEmailExists(data.email)

    let payload = {
      userId : loginUser?._id as string,
      name : loginUser?.name as string,
      role : "user"
    }

    const token = await this.jwtService.generateToken(payload)
    return {status:true,message:"google Login succesfull",token}
  }
}
