export interface tokenData {
  userId : string
  name : string
  role : string
}

export interface tokenForgotData {
  userId : string
  name : string
}

export interface DecodedJwt {
  id:string;
  role: string;
  userName?:string;
  iat: number;
  exp: number;
}

export default interface IjwtService {
  generateToken(data : tokenData):string
  verfiyToken(token:string):DecodedJwt|null
  generateTokenForgot(data:tokenData,expireTime:string):string
}