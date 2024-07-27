import { NextFunction, Request, Response } from "express";
import JwtToken from "../utils/jwtService";
import userRepository from "../../adapters/Repositorys/userRepository";
import UserModel from "../db/userSchema";
import OtpModel from "../db/otpSchema";
import property from "../db/propertySchema";
import SellerRepository from "../../adapters/Repositorys/sellerRepository";
import Seller from "../db/sellerSchema";

const jwtService = new JwtToken()
const sellerRepo = new SellerRepository(Seller, OtpModel, property)

interface IAuthRequest extends Request {
  userId?: string;
}

const sellerAuth = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.sellerRefreshToken
  let sellerToken = req.cookies.sellerToken;

  if (!refreshToken) {
    res.status(401)
      .json({ message: "Not authorized, no refresh token" });
  }

  if (!sellerToken || sellerToken === '' || Object.keys(sellerToken).length === 0) {
    try {
      const newUserToken = refreshAccessToken(refreshToken)
      res.cookie("sellerToken", newUserToken, {
        httpOnly: true,
        maxAge: 3600000,
      })
      sellerToken = newUserToken
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Failed to refresh access token" });
    }
  }

  try {
    const decoded = jwtService.verfiyToken(sellerToken)
    let user;
    if (decoded) {
      user = await sellerRepo.checkUserExists(decoded.userId)
    }

    if (!user) {
      return res.status(401).json({ message: "Seller not found" });
    }

    if (user.isBlocked) {
      return res.status(401).json({ message: "You are blocked by admin!" });
    }

    if (decoded?.role != 'seller') {
      return res.status(401).json({ message: "Not authorized, invalid role" });
    }
    next()
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }

}




async function refreshAccessToken(refreshToken: string) {
  try {
    const decoded = await jwtService.verifyRefreshToken(refreshToken)
    if (decoded && decoded.name) {
      const newToken = await jwtService.generateToken({ userId: decoded?.userId, name: decoded?.name, role: decoded?.role })
      return newToken
    }
  } catch (error) {
    throw new Error("Invalid refresh token")
  }
}



export default sellerAuth;
