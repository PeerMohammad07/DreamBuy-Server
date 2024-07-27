import jwt from "jsonwebtoken"
import jwtService, { DecodedJwt, tokenData, tokenForgotData } from "../../Interfaces/Utils/jwtServices"

export default class JwtToken implements jwtService {

  // generating token
  generateToken(data: tokenData) {
    let secretKey = process.env.JWT_SECRET_KEY
    if (secretKey) {
      let token = jwt.sign(data, secretKey)
      return token
    }
    throw new Error("Secret Key is Not Available")
  }

  // tokenForEmail
  generateTokenForgot(data: tokenData, expireTime: string) {
    let secretKey = process.env.JWT_SECRET_KEY
    if (secretKey) {
      let token = jwt.sign(data, secretKey, { expiresIn: expireTime })
      return token
    }
    throw new Error("Secret Key is Not Available")
  }

  generateRefreshToken(data: tokenData) {
    let refreshTokenSecretKey = process.env.JWT_REFRESH_SECRET_KEY
    if (refreshTokenSecretKey) {
      let refreshToken = jwt.sign(data, refreshTokenSecretKey)
      return refreshToken
    }
    throw new Error("refresh secret Key is Not Available")
  }

  // verifying JWT Token
  verfiyToken(token: string): DecodedJwt | null {
    try {
      let secretKey = process.env.JWT_SECRET_KEY
      let decoded = jwt.verify(token, secretKey!) as DecodedJwt
      return decoded
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return null
      } else {
        throw new Error("JWT verification Error")
      }
    }
  }

  // verify refresh token
  verifyRefreshToken(token: string) {
    try {
      let refreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY
      if (refreshSecretKey) {
        let decoded = jwt.verify(token, refreshSecretKey!) as DecodedJwt
        return decoded
      }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return null
      } else {
        throw new Error("JWT verification Error")
      }
    }
  }
}


