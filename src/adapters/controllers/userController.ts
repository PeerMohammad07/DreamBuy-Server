import { IregisterBody, IUserController } from "../../Interfaces/Controller/IUserController";
import IuserUseCase from "../../Interfaces/UseCase/IuserUseCase";
import { Request,Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export default class userController implements IUserController {
  private userUseCase:IuserUseCase

  constructor(userUseCase:IuserUseCase){
    this.userUseCase = userUseCase
    this.register = this.register.bind(this)
  }

  register(req:Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>){
   this.userUseCase.register(req.body)
  }
}