import jwt from "jsonwebtoken"

class JwtToken {
    generateToken(userId:string,role:string){
      let secretKey = process.env.JWT_SECRET_KEY
      if(secretKey){
        let token = jwt.sign({userId,role},secretKey)
        return token
      }
      throw new Error("Secret Key is Not Available")
    }
}


export default JwtToken