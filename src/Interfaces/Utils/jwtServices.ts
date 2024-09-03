export interface tokenData {
  userId : string
  name : string
  role : string
  iat?: number;
}

export interface tokenForgotData {
  userId : string
  name : string
}

export interface DecodedJwt {
  userId:string;
  role: string;
  name?:string;
  iat: number;
  exp?: number;
}


// Interface for Jwt service
export default interface IjwtService {
  generateToken(data : tokenData):string
  verfiyToken(token:string):DecodedJwt|null
  generateTokenForgot(data:tokenData,expireTime:string):string
  generateRefreshToken(data:tokenData):string
}