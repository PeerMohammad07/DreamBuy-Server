import { Request,Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export interface IregisterBody  {
  name:string
  email:string
  password : string
}



export interface IUserController {
  register(req:Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>):void
  verifyOtp( req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,res: Response<any, Record<string, any>>):Promise<void>
  resendOtp(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,res: Response<any, Record<string, any>>):Promise<void>
}