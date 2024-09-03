"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwtService_1 = __importDefault(require("../utils/jwtService"));
const otpSchema_1 = __importDefault(require("../db/otpSchema"));
const propertySchema_1 = __importDefault(require("../db/propertySchema"));
const sellerRepository_1 = __importDefault(require("../../adapters/Repositorys/sellerRepository"));
const sellerSchema_1 = __importDefault(require("../db/sellerSchema"));
const revenueSchema_1 = __importDefault(require("../db/revenueSchema"));
const jwtService = new jwtService_1.default();
const sellerRepo = new sellerRepository_1.default(sellerSchema_1.default, otpSchema_1.default, propertySchema_1.default, revenueSchema_1.default);
const sellerAuth = async (req, res, next) => {
    const refreshToken = req.cookies.sellerRefreshToken;
    let sellerToken = req.cookies.sellerToken;
    if (!refreshToken) {
        return res.status(401)
            .json({ message: "Not authorized, no refresh token" });
    }
    if (!sellerToken || sellerToken === '' || Object.keys(sellerToken).length === 0) {
        try {
            const newUserToken = await refreshAccessToken(refreshToken);
            res.cookie("sellerToken", newUserToken, {
                httpOnly: true,
                maxAge: 3600000,
            });
            sellerToken = newUserToken;
        }
        catch (error) {
            return res
                .status(401)
                .json({ message: "Failed to refresh access token" });
        }
    }
    try {
        const decoded = jwtService.verfiyToken(sellerToken);
        let user;
        if (decoded) {
            user = await sellerRepo.checkUserExists(decoded.userId);
        }
        if (!user) {
            return res.status(401).json({ message: "Seller not found" });
        }
        if (user.isBlocked) {
            return res.status(401).json({ message: "You are blocked by admin!" });
        }
        if ((decoded === null || decoded === void 0 ? void 0 : decoded.role) != 'seller') {
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
exports.default = sellerAuth;
//# sourceMappingURL=sellerAuth.js.map