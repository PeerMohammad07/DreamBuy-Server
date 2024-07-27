import IadminRepository from "../Interfaces/Repository/adminRepository";
import { IadminUseCase, returnData } from "../Interfaces/UseCase/IadminUseCase";
import IhashingService from "../Interfaces/Utils/hashingService";
import IjwtService from "../Interfaces/Utils/jwtServices";

export default class adminUseCase implements IadminUseCase {
  private adminRepository: IadminRepository;
  private hashingService: IhashingService;
  private jwtService: IjwtService;

  constructor(
    adminRepository: IadminRepository,
    hashingService: IhashingService,
    jwtService: IjwtService
  ) {
    this.adminRepository = adminRepository;
    this.hashingService = hashingService;
    this.jwtService = jwtService;
  }

  async login(email: string, password: string): Promise<returnData | void> {
    try {
      const admin = await this.adminRepository.checkEmailExists(email);
      if (!admin) {
        return { message: "Invalid Email" };
      }

      const checkPass = await this.hashingService.compare(
        password,
        admin.password
      );

      if (!checkPass) {
        return { message: "Incorrect Password" };
      }

      let payload = {
        userId: admin._id,
        name: admin.name,
        role: "admin",
      };

      let token = this.jwtService.generateToken(payload);
      const adminRefreshToken = this.jwtService.generateRefreshToken(payload)
      return { message: "Login succesfully", token,adminRefreshToken};
    } catch (error) {
      console.log(error);
    }
  }

  async getUsers() {
    try {
      const users = await this.adminRepository.getAllUsers();
      return users;
    } catch (error) {
      console.log(error);
    }
  }

  async blockUser(id: string, status: boolean) {
    try {
      const response = await this.adminRepository.blockOrUnBlockUser(
        id,
        status
      );
      if (response?.isBlocked) {
        return "unblocked successfully";
      } else {
        return "blocked successfully";
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }


  async getSeller() {
    try {
      return await this.adminRepository.getSeller();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getCategory() {
    try {
      return await this.adminRepository.getCategory();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async blockCategory(id: string, status: boolean){
    try {
      const response = await this.adminRepository.blockOrUnBlockCategory(
        id,
        status
      );
      if (response?.isBlocked) {
        return "unblocked successfully";
      } else {
        return "blocked successfully";
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
