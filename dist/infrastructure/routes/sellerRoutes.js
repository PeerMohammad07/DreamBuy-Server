"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// schema imports
const sellerSchema_1 = __importDefault(require("../db/sellerSchema"));
const otpSchema_1 = __importDefault(require("../db/otpSchema"));
const propertySchema_1 = __importDefault(require("../db/propertySchema"));
const revenueSchema_1 = __importDefault(require("../db/revenueSchema"));
// repository
const sellerRepository_1 = __importDefault(require("../../adapters/Repositorys/sellerRepository"));
// use case
const sellerUseCase_1 = __importDefault(require("../../useCase/sellerUseCase"));
// Controller
const sellerController_1 = __importDefault(require("../../adapters/controllers/sellerController"));
// Services
const hashingService_1 = __importDefault(require("../utils/hashingService"));
const otpService_1 = __importDefault(require("../utils/otpService"));
const jwtService_1 = __importDefault(require("../utils/jwtService"));
// Authentication
const sellerAuth_1 = __importDefault(require("../middlewares/sellerAuth"));
const sellerRouter = express_1.default.Router();
const jwtService = new jwtService_1.default();
const otpService = new otpService_1.default();
const hashingService = new hashingService_1.default();
const sellerRepository = new sellerRepository_1.default(sellerSchema_1.default, otpSchema_1.default, propertySchema_1.default, revenueSchema_1.default);
const sellerUseCase = new sellerUseCase_1.default(sellerRepository, hashingService, otpService, jwtService);
const sellerController = new sellerController_1.default(sellerUseCase);
sellerRouter.post("/register", sellerController.register);
sellerRouter.post("/verifyOtp", sellerController.verifyOtp);
sellerRouter.post("/login", sellerController.login);
sellerRouter.post("/logout", sellerController.logout);
sellerRouter.post("/resendOtp", sellerController.resendOtp);
sellerRouter.post("/forgotPassword", sellerController.forgotPassword);
sellerRouter.post("/resetPassword", sellerController.resetPassword);
sellerRouter.post("/updateKycImage", sellerAuth_1.default, sellerController.updateKycImage);
sellerRouter.post("/kycStatusUpdate", sellerController.kycStatusUpdate);
sellerRouter.post("/blockSeller", sellerController.blockSeller);
sellerRouter.post("/changePassword", sellerAuth_1.default, sellerController.changePassword);
sellerRouter.post('/updateSeller', sellerAuth_1.default, sellerController.updateSeller);
sellerRouter.post("/addProperty", sellerAuth_1.default, sellerController.addProperty);
sellerRouter.post('/deleteProperty', sellerAuth_1.default, sellerController.deleteProeprty);
sellerRouter.put('/updateProperty', sellerAuth_1.default, sellerController.updateProeprty);
sellerRouter.get("/getMyProperty/:id", sellerAuth_1.default, sellerController.getMyProperty);
sellerRouter.route('/boostProperty')
    .post(sellerAuth_1.default, sellerController.getBoostProperty)
    .patch(sellerAuth_1.default, sellerController.boostProperty);
exports.default = sellerRouter;
//# sourceMappingURL=sellerRoutes.js.map