"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwtService_1 = __importDefault(require("../utils/jwtService"));
const userRepository_1 = __importDefault(require("../../adapters/Repositorys/userRepository"));
const userSchema_1 = __importDefault(require("../db/userSchema"));
const otpSchema_1 = __importDefault(require("../db/otpSchema"));
const propertySchema_1 = __importDefault(require("../db/propertySchema"));
const sellerSchema_1 = __importDefault(require("../db/sellerSchema"));
const whishlist_1 = __importDefault(require("../db/whishlist"));
const revenueSchema_1 = __importDefault(require("../db/revenueSchema"));
const jwtService = new jwtService_1.default();
const userRepo = new userRepository_1.default(userSchema_1.default, otpSchema_1.default, propertySchema_1.default, sellerSchema_1.default, whishlist_1.default, revenueSchema_1.default);
const userAuth = async (req, res, next) => {
    const refreshToken = req.cookies.userRefreshToken;
    let userToken = req.cookies.userToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "Not authorized, no refresh token" });
    }
    if (!userToken || userToken === '' || Object.keys(userToken).length === 0) {
        try {
            const newUserToken = await refreshAccessToken(refreshToken);
            res.cookie("userToken", newUserToken, {
                httpOnly: true,
                maxAge: 3600000,
            });
            userToken = newUserToken;
        }
        catch (error) {
            return res.status(401).json({ message: "Failed to refresh access token" });
        }
    }
    try {
        const decoded = jwtService.verfiyToken(userToken);
        let user;
        if (decoded) {
            user = await userRepo.checkUserExists(decoded.userId);
        }
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        if (user.isBlocked) {
            return res.status(401).json({ message: "Not authorized" });
        }
        if ((decoded === null || decoded === void 0 ? void 0 : decoded.role) != 'user') {
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
            const newToken = await jwtService.generateToken({ userId: decoded.userId, name: decoded.name, role: decoded.role });
            return newToken;
        }
    }
    catch (error) {
        throw new Error("Invalid refresh token");
    }
}
exports.default = userAuth;
//# sourceMappingURL=userAuth.js.map