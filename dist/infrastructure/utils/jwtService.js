"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtToken {
    // generating token
    generateToken(data) {
        let secretKey = process.env.JWT_SECRET_KEY;
        if (secretKey) {
            let token = jsonwebtoken_1.default.sign(data, secretKey);
            return token;
        }
        throw new Error("Secret Key is Not Available");
    }
    // tokenForEmail
    generateTokenForgot(data, expireTime) {
        let secretKey = process.env.JWT_SECRET_KEY;
        if (secretKey) {
            let token = jsonwebtoken_1.default.sign(data, secretKey, { expiresIn: expireTime });
            return token;
        }
        throw new Error("Secret Key is Not Available");
    }
    generateRefreshToken(data) {
        let refreshTokenSecretKey = process.env.JWT_REFRESH_SECRET_KEY;
        if (refreshTokenSecretKey) {
            let refreshToken = jsonwebtoken_1.default.sign(data, refreshTokenSecretKey);
            return refreshToken;
        }
        throw new Error("refresh secret Key is Not Available");
    }
    // verifying JWT Token
    verfiyToken(token) {
        try {
            let secretKey = process.env.JWT_SECRET_KEY;
            let decoded = jsonwebtoken_1.default.verify(token, secretKey);
            return decoded;
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return null;
            }
            else {
                throw new Error("JWT verification Error");
            }
        }
    }
    // verify refresh token
    verifyRefreshToken(token) {
        try {
            let refreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY;
            if (refreshSecretKey) {
                let decoded = jsonwebtoken_1.default.verify(token, refreshSecretKey);
                return decoded;
            }
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return null;
            }
            else {
                throw new Error("JWT verification Error");
            }
        }
    }
}
exports.default = JwtToken;
//# sourceMappingURL=jwtService.js.map