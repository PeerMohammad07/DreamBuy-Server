"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = __importDefault(require("../../adapters/controllers/adminController"));
const adminUseCase_1 = __importDefault(require("../../useCase/adminUseCase"));
const jwtService_1 = __importDefault(require("../utils/jwtService"));
const hashingService_1 = __importDefault(require("../utils/hashingService"));
const adminRepository_1 = __importDefault(require("../../adapters/Repositorys/adminRepository"));
const adminSchema_1 = __importDefault(require("../db/adminSchema"));
const userSchema_1 = __importDefault(require("../db/userSchema"));
const adminAuth_1 = __importDefault(require("../middlewares/adminAuth"));
const sellerSchema_1 = __importDefault(require("../db/sellerSchema"));
const categorySchema_1 = __importDefault(require("../db/categorySchema"));
const propertySchema_1 = __importDefault(require("../db/propertySchema"));
const amenitiesSchema_1 = __importDefault(require("../db/amenitiesSchema"));
const revenueSchema_1 = __importDefault(require("../db/revenueSchema"));
const adminRouter = express_1.default.Router();
const AdminRepository = new adminRepository_1.default(adminSchema_1.default, userSchema_1.default, sellerSchema_1.default, categorySchema_1.default, propertySchema_1.default, amenitiesSchema_1.default, revenueSchema_1.default);
const JwtService = new jwtService_1.default();
const HashingServiceInstance = new hashingService_1.default();
const AdminUseCaseInstance = new adminUseCase_1.default(AdminRepository, HashingServiceInstance, JwtService);
const AdminController = new adminController_1.default(AdminUseCaseInstance);
// Admin Authentication Routes
adminRouter.post("/login", AdminController.login);
adminRouter.post("/logout", adminAuth_1.default, AdminController.logout);
// User Management Routes
adminRouter.get("/getUsers", adminAuth_1.default, AdminController.getUsers);
adminRouter.put("/blockUser", adminAuth_1.default, AdminController.blockUser);
// Seller Management Routes
adminRouter.get("/getSellers", adminAuth_1.default, AdminController.getSeller);
// Category Management Routes
adminRouter.get("/getCategory", adminAuth_1.default, AdminController.getCategory);
adminRouter.post("/addCategory", adminAuth_1.default, AdminController.addCategory);
adminRouter.put("/editCategory", adminAuth_1.default, AdminController.editCategory);
adminRouter.put("/blockCategory", adminAuth_1.default, AdminController.blockCategory);
// Property Management Routes
adminRouter.put('/blockProperty', adminAuth_1.default, AdminController.blockProperty);
// Amenities Management Routes
adminRouter.route('/amenities')
    .get(adminAuth_1.default, AdminController.getAmenities)
    .post(adminAuth_1.default, AdminController.addAmenity)
    .put(adminAuth_1.default, AdminController.editAmenity);
adminRouter.put('/amenityBlock', AdminController.blockAmenity);
adminRouter.get('/getAllDashbaordData', adminAuth_1.default, AdminController.allDashboardDatas);
adminRouter.get('/getMonthlyRevenue', AdminController.getMonthlyRevenue);
exports.default = adminRouter;
//# sourceMappingURL=adminRoutes.js.map