"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class adminUseCase {
    constructor(adminRepository, hashingService, jwtService) {
        this.adminRepository = adminRepository;
        this.hashingService = hashingService;
        this.jwtService = jwtService;
    }
    // Admin Login
    async login(email, password) {
        try {
            const admin = await this.adminRepository.checkEmailExists(email);
            if (!admin) {
                return { message: "Invalid Email" };
            }
            const checkPass = await this.hashingService.compare(password, admin.password);
            if (!checkPass) {
                return { message: "Incorrect Password" };
            }
            let payload = {
                userId: admin._id,
                name: admin.name,
                role: "admin",
            };
            let token = this.jwtService.generateToken(payload);
            const adminRefreshToken = this.jwtService.generateRefreshToken(payload);
            return { message: "Login succesfully", token, adminRefreshToken };
        }
        catch (error) {
            console.log(error);
        }
    }
    // Get all users
    async getUsers() {
        try {
            const users = await this.adminRepository.getAllUsers();
            return users;
        }
        catch (error) {
            console.log(error);
        }
    }
    // Block user
    async blockUser(id, status) {
        try {
            const response = await this.adminRepository.blockOrUnBlockUser(id, status);
            if (response === null || response === void 0 ? void 0 : response.isBlocked) {
                return "unblocked successfully";
            }
            else {
                return "blocked successfully";
            }
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    // Get all Sellers
    async getSeller() {
        try {
            return await this.adminRepository.getSeller();
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    // Get all Categorys
    async getCategory() {
        try {
            return await this.adminRepository.getCategory();
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    // Block Category
    async blockCategory(id, status) {
        try {
            const response = await this.adminRepository.blockOrUnBlockCategory(id, status);
            if (response === null || response === void 0 ? void 0 : response.isBlocked) {
                return "unblocked successfully";
            }
            else {
                return "blocked successfully";
            }
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    // Add category
    async addCategory(name, description) {
        try {
            return await this.adminRepository.addCategory(name, description);
        }
        catch (error) {
            console.log(error);
        }
    }
    // Edit Category
    async editCategory(id, name, description) {
        try {
            return await this.adminRepository.editCategory(id, name, description);
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    // Block Property
    async blockProperty(id, status) {
        try {
            const response = await this.adminRepository.blockProperty(id, status);
            if (response === null || response === void 0 ? void 0 : response.propertyStatus) {
                return "unblocked successfully";
            }
            else {
                return "blocked successfully";
            }
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    // Get all amenities
    async getAmenities() {
        try {
            return await this.adminRepository.getAllAmenities();
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    // Add amenity
    async addAmenity(name) {
        try {
            return await this.adminRepository.addAmenity(name);
        }
        catch (error) {
            console.log(error);
        }
    }
    // Edit Amenity
    async editAmenity(id, name) {
        try {
            return await this.adminRepository.editAmenity(id, name);
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    // Block amenity
    async blockAmenity(id, status) {
        try {
            const response = await this.adminRepository.blockAmenity(id, status);
            if (response === null || response === void 0 ? void 0 : response.isBlocked) {
                return "unblocked successfully";
            }
            else {
                return "blocked successfully";
            }
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    // Get all dashboard data
    async getAllDashboardDatas() {
        try {
            const [noOfUsers, noOfSellers, noOfCategories, noOfAmenities, noOfRentProperties, noOfSaleProperties, mostUsedAmenities, mostUsedCategorys, noOfPremiumUsers, totalRevenue] = await Promise.all([
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
                mostUsedAmenities,
                mostUsedCategorys,
                noOfPremiumUsers,
                totalRevenue
            };
        }
        catch (error) {
            console.log(error);
            throw new Error("Failed to fetch dashboard data");
        }
    }
    // Get monthly revenue
    async getMonthlyRevenue() {
        try {
            const [userGrowth, sellerGrowth, monthlyRevenue] = await Promise.all([
                this.adminRepository.userGrowth(),
                this.adminRepository.sellerGrowth(),
                this.adminRepository.monthlyRevenue()
            ]);
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
        }
        catch (error) {
            console.log(error);
            throw new Error("Failed to get monthly revenue");
        }
    }
}
exports.default = adminUseCase;
//# sourceMappingURL=adminUseCase.js.map