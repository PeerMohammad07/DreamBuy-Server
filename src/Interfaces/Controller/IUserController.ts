import { Request,Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export interface IregisterBody  {
  name:string
  email:string
  password : string
  confirmPassword : string
}


export interface IUserController {
  register(req:Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>):void
}