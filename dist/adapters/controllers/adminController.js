"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class adminController {
    constructor(adminUseCase) {
        this.adminUseCase = adminUseCase;
        this.login = this.login.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.getSeller = this.getSeller.bind(this);
        this.blockUser = this.blockUser.bind(this);
        this.logout = this.logout.bind(this);
        this.getCategory = this.getCategory.bind(this);
        this.blockCategory = this.blockCategory.bind(this);
        this.addCategory = this.addCategory.bind(this);
        this.editCategory = this.editCategory.bind(this);
        this.blockProperty = this.blockProperty.bind(this);
        this.getAmenities = this.getAmenities.bind(this);
        this.addAmenity = this.addAmenity.bind(this);
        this.editAmenity = this.editAmenity.bind(this);
        this.blockAmenity = this.blockAmenity.bind(this);
        this.allDashboardDatas = this.allDashboardDatas.bind(this);
        this.getMonthlyRevenue = this.getMonthlyRevenue.bind(this);
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const response = await this.adminUseCase.login(email, password);
            if ((response === null || response === void 0 ? void 0 : response.message) == "Invalid Email") {
                res.status(403).json({ message: "Invalid Email" });
            }
            if ((response === null || response === void 0 ? void 0 : response.message) == "Incorrect Password") {
                res.status(403).json({ message: "incorrect password" });
            }
            if ((response === null || response === void 0 ? void 0 : response.message) == "Login succesfully") {
                res.cookie("adminToken", response.token, {
                    httpOnly: true,
                    maxAge: 3600000,
                }).cookie("adminRefreshToken", response.adminRefreshToken, {
                    httpOnly: true,
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                });
                res.status(200).json({ message: "login Successfully" });
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async getUsers(req, res) {
        try {
            const users = await this.adminUseCase.getUsers();
            res.status(200).json({ users });
        }
        catch (error) {
            console.log(error);
        }
    }
    async blockUser(req, res) {
        try {
            const { id, status } = req.body;
            const response = await this.adminUseCase.blockUser(id, status);
            res.status(200).json(response);
        }
        catch (error) {
            console.log(error);
        }
    }
    async logout(req, res) {
        try {
            res.cookie("adminToken", "", { httpOnly: true, expires: new Date() });
            res.status(200).json({ status: true });
        }
        catch (error) {
            console.log(error);
        }
    }
    async getSeller(req, res) {
        try {
            const response = await this.adminUseCase.getSeller();
            res.status(200).json({ sellers: response });
        }
        catch (error) {
            console.log(error);
        }
    }
    async getCategory(req, res) {
        try {
            const response = await this.adminUseCase.getCategory();
            res.status(200).json({ category: response });
        }
        catch (error) {
            console.log(error);
        }
    }
    async blockCategory(req, res) {
        try {
            const { id, status } = req.body;
            const response = await this.adminUseCase.blockCategory(id, status);
            res.status(200).json(response);
        }
        catch (error) {
            console.log(error);
        }
    }
    async addCategory(req, res) {
        try {
            const { name, description } = req.body;
            const response = await this.adminUseCase.addCategory(name, description);
            res.status(200).json({ response });
        }
        catch (error) {
            console.log(error);
        }
    }
    async editCategory(req, res) {
        try {
            const { id, name, description } = req.body;
            const response = await this.adminUseCase.editCategory(id, name, description);
            res.status(200).json({ response });
        }
        catch (error) {
            console.log(error);
        }
    }
    async blockProperty(req, res) {
        try {
            const { id, status } = req.body;
            const response = await this.adminUseCase.blockProperty(id, status);
            res.status(200).json(response);
        }
        catch (error) {
            console.log(error);
        }
    }
    async getAmenities(req, res) {
        try {
            const response = await this.adminUseCase.getAmenities();
            res.status(200).json({ amenities: response });
        }
        catch (error) {
            console.log(error);
        }
    }
    async addAmenity(req, res) {
        try {
            const { name } = req.body;
            const response = await this.adminUseCase.addAmenity(name);
            res.status(200).json({ amenity: response });
        }
        catch (error) {
            console.log(error);
        }
    }
    async editAmenity(req, res) {
        try {
            const { id, name } = req.body;
            const response = await this.adminUseCase.editAmenity(id, name);
            res.status(200).json({ amenity: response });
        }
        catch (error) {
            console.log(error);
        }
    }
    async blockAmenity(req, res) {
        try {
            const { id, status } = req.body;
            const response = await this.adminUseCase.blockAmenity(id, status);
            res.status(200).json(response);
        }
        catch (error) {
            console.log(error);
        }
    }
    async allDashboardDatas(req, res) {
        try {
            const response = await this.adminUseCase.getAllDashboardDatas();
            res.status(200).json(response);
        }
        catch (error) {
            console.log(error);
        }
    }
    async getMonthlyRevenue(req, res) {
        try {
            const response = await this.adminUseCase.getMonthlyRevenue();
            res.status(200).json(response);
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.default = adminController;
//# sourceMappingURL=adminController.js.map