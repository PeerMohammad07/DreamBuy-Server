import { NextFunction, Request, Response } from "express";
import JwtToken from "../utils/jwtService";
import userRepository from "../../adapters/Repositorys/userRepository";
import UserModel from "../db/userSchema";
import OtpModel from "../db/otpSchema";
import property from "../db/propertySchema";
import Seller from "../db/sellerSchema";
import whishListModel from "../db/whishlist";
import RevenueModel from "../db/revenueSchema";

const jwtService = new JwtToken()
const userRepo = new userRepository(UserModel, OtpModel, property,Seller,whishListModel,RevenueModel)

interface IAuthRequest extends Request {
  userId?: string;
}

const userAuth = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.userRefreshToken
  let userToken = req.cookies.userToken;

  if (!refreshToken) {
    res.status(401)
      .json({ message: "Not authorized, no refresh token" });
  }

  if (!userToken || userToken === '' || Object.keys(userToken).length === 0) {
    try {
      const newUserToken = await refreshAccessToken(refreshToken)
      res.cookie("userToken", newUserToken, {
        httpOnly: true,
        maxAge: 3600000,
      })
      userToken = newUserToken
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Failed to refresh access token" });
    }
  }

  try {
    const decoded = jwtService.verfiyToken(userToken)
    let user;
    if (decoded) {
      user = await userRepo.checkUserExists(decoded.userId)
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.isBlocked) {      
      return res.status(401).json({ message: "You are blocked by admin!" });
    }

    if (decoded?.role != 'user') {
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



export default userAuth;
