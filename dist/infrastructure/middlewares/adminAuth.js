"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwtService_1 = __importDefault(require("../utils/jwtService"));
const userSchema_1 = __importDefault(require("../db/userSchema"));
const sellerSchema_1 = __importDefault(require("../db/sellerSchema"));
const adminRepository_1 = __importDefault(require("../../adapters/Repositorys/adminRepository"));
const adminSchema_1 = __importDefault(require("../db/adminSchema"));
const categorySchema_1 = __importDefault(require("../db/categorySchema"));
const propertySchema_1 = __importDefault(require("../db/propertySchema"));
const amenitiesSchema_1 = __importDefault(require("../db/amenitiesSchema"));
const revenueSchema_1 = __importDefault(require("../db/revenueSchema"));
const jwtService = new jwtService_1.default();
const adminRepo = new adminRepository_1.default(adminSchema_1.default, userSchema_1.default, sellerSchema_1.default, categorySchema_1.default, propertySchema_1.default, amenitiesSchema_1.default, revenueSchema_1.default);
const adminAuth = async (req, res, next) => {
    const refreshToken = req.cookies.adminRefreshToken;
    let adminToken = req.cookies.adminToken;
    if (!refreshToken) {
        res.status(401)
            .json({ message: "Not authorized, no refresh token" });
    }
    if (!adminToken || adminToken === '' || Object.keys(adminToken).length === 0) {
        try {
            const newUserToken = await refreshAccessToken(refreshToken);
            res.cookie("adminToken", newUserToken, {
                httpOnly: true,
                maxAge: 3600000,
            });
            adminToken = newUserToken;
        }
        catch (error) {
            return res
                .status(401)
                .json({ message: "Failed to refresh access token" });
        }
    }
    try {
        const decoded = jwtService.verfiyToken(adminToken);
        let user;
        if (decoded) {
            user = await adminRepo.checkUserExists(decoded.userId);
        }
        if (!user) {
            return res.status(401).json({ message: "Admin not found" });
        }
        if ((decoded === null || decoded === void 0 ? void 0 : decoded.role) != 'admin') {
            return res.status(401).json({ message: "Not authorized, invalid role" });
        }
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Not authorized, invalid token" });
    }
};
async function refreshAccessToken(refreshToken) {
    try {
        const decoded = await jwtService.verifyRefreshToken(refreshToken);
        if (decoded && decoded.name) {
            const newToken = await jwtService.generateToken({ userId: decoded === null || decoded === void 0 ? void 0 : decoded.userId, name: decoded === null || decoded === void 0 ? void 0 : decoded.name, role: decoded === null || decoded === void 0 ? void 0 : decoded.role });
            return newToken;
        }
    }
    catch (error) {
        throw new Error("Invalid refresh token");
    }
}
exports.default = adminAuth;
//# sourceMappingURL=adminAuth.js.map