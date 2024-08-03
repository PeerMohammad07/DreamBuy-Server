import { NextFunction, Request, Response } from "express";
import JwtToken from "../utils/jwtService";
import UserModel from "../db/userSchema";
import Seller from "../db/sellerSchema";
import adminRepository from "../../adapters/Repositorys/adminRepository";
import adminSchema from "../db/adminSchema";
import categoryModal from "../db/categorySchema";
import property from "../db/propertySchema";
import amenitiesModal from "../db/amenitiesSchema";

const jwtService = new JwtToken()
const adminRepo = new adminRepository(adminSchema, UserModel, Seller,categoryModal,property,amenitiesModal)

interface IAuthRequest extends Request {
  userId?: string;
}

const adminAuth = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.adminRefreshToken
  let adminToken = req.cookies.adminToken;
  
  if (!refreshToken) {
    res.status(401)
      .json({ message: "Not authorized, no refresh token" });
  }

  if (!adminToken || adminToken === '' || Object.keys(adminToken).length === 0) {
    try {
      const newUserToken = await refreshAccessToken(refreshToken)
      res.cookie("adminToken", newUserToken, {
        httpOnly: true,
        maxAge: 3600000,
      })
      adminToken = newUserToken
    } catch (error) {
      return res  
        .status(401)
        .json({ message: "Failed to refresh access token" });
    }
  }

  try {
    const decoded = jwtService.verfiyToken(adminToken)
    let user;
    if (decoded) {
      user = await adminRepo.checkUserExists(decoded.userId)
    }

    if (!user) {
      return res.status(401).json({ message: "Admin not found" });
    }

    if (decoded?.role != 'admin') {
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



export default adminAuth;
