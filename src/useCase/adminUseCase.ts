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
      return { message: "Login succesfully", token, adminRefreshToken };
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
      const response = await this.adminRepository.blockOrUnBlockUser(id, status);
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

  async blockCategory(id: string, status: boolean) {
    try {
      const response = await this.adminRepository.blockOrUnBlockCategory(id, status);
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

  async addCategory(name: string, description: string) {
    try {
      return await this.adminRepository.addCategory(name, description);
    } catch (error) {
      console.log(error);
    }
  }

  async editCategory(id: string, name: string, description: string) {
    try {
      return await this.adminRepository.editCategory(id, name, description);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async blockProperty(id: string, status: boolean) {
    try {
      const response = await this.adminRepository.blockProperty(id, status);
      if (response?.propertyStatus) {
        return "unblocked successfully";
      } else {
        return "blocked successfully";
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getAmenities() {
    try {
      return await this.adminRepository.getAllAmenities();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async addAmenity(name: string) {
    try {
      return await this.adminRepository.addAmenity(name);
    } catch (error) {
      console.log(error);
    }
  }

  async editAmenity(id: string, name: string) {
    try {
      return await this.adminRepository.editAmenity(id, name);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async blockAmenity(id: string, status: boolean) {
    try {
      const response = await this.adminRepository.blockAmenity(id, status);
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

  async getAllDashboardDatas() {
    try {
      const [noOfUsers, noOfSellers, noOfCategories, noOfAmenities, noOfRentProperties, noOfSaleProperties,mostUsedAmenities,mostUsedCategorys,noOfPremiumUsers,totalRevenue] = await Promise.all([
        this.adminRepository.noOfUsers(),
        this.adminRepository.noOfSellers(),
        this.adminRepository.noOfCategory(),
        this.adminRepository.noOfAmenities(),
        this.adminRepository.noOfRentProperty(),
        this.adminRepository.noOfSaleProperty(),
        this.adminRepository.mostUsedAmenities(),
        this.adminRepository.mostUsedCategorys(),
        this.adminRepository.noOfPremiumUsers(),
        this.adminRepository.totalRevenue(),
      ]);
      return {
        noOfUsers,
        noOfSellers,
        noOfCategories,
        noOfAmenities,
        noOfRentProperties: noOfRentProperties.length,
        noOfSaleProperties: noOfSaleProperties.length,
        mostUsedAmenities ,
        mostUsedCategorys,
        noOfPremiumUsers,
        totalRevenue
      };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch dashboard data");
    }
  }
  
  async getMonthlyRevenue(){
    try {
      const [userGrowth,sellerGrowth,monthlyRevenue] = await Promise.all([
        this.adminRepository.userGrowth(),
        this.adminRepository.sellerGrowth(),
        this.adminRepository.monthlyRevenue()
      ])
      const combinedGrowth = userGrowth.map((user) => {
        const seller = sellerGrowth.find(seller => seller.year === user.year && seller.month === user.month);
        return {
          year: user.year,
          month: user.month,
          newUsers: user.newUsers,
          newSellers: seller ? seller.newSellers : 0
        };
      });
      return { combinedGrowth, monthlyRevenue };
    } catch (error) {
      console.log(error)
      throw new Error("Failed to get monthly revenue")
    }
  }
}
