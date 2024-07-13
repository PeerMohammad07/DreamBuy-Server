import jwt from "jsonwebtoken"
import jwtService,{DecodedJwt, tokenData} from "../../Interfaces/Utils/jwtServices"

export default class JwtToken implements jwtService{

    // generating token
    generateToken(data:tokenData){
      let secretKey = process.env.JWT_SECRET_KEY
      if(secretKey){
        let token = jwt.sign(data,secretKey)
        return token
      }
      throw new Error("Secret Key is Not Available")
    }


    // verifying JWT Token
    verfiyToken(token:string):DecodedJwt|null{
      try {
        let secretKey = process.env.JWT_SECRET_KEY
        let decoded = jwt.verify(token,secretKey!) as DecodedJwt
        return decoded
      } catch (error) {
        if(error instanceof jwt.TokenExpiredError){
          return null 
        }else {
          throw new Error("JWT verification Error")
        }
      }
    }
}

