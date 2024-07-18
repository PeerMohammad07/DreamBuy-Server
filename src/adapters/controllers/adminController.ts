import { IAdminController } from "../../Interfaces/Controller/IAdminController";
import { Request, response, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { IadminUseCase } from "../../Interfaces/UseCase/IadminUseCase";
import { json } from "stream/consumers";



export default class adminController implements IAdminController {

  private adminUseCase

  constructor(adminUseCase:IadminUseCase){
    this.adminUseCase = adminUseCase
    this.login = this.login.bind(this)
    this.getUsers = this.getUsers.bind(this)
    this.blockUser = this.blockUser.bind(this)
  }

  async login(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>){
      try {
        const {email,password} = req.body
        const response = await this.adminUseCase.login(email,password)
        if(response?.message == "Invalid Email"){
          res.status(403).json({message:"Invalid Email"})
        }
        if(response?.message == "Incorrect Password"){
          res.status(403).json({message:"incorrect password"})
        }        
        if(response?.message == "Login succesfully"){
          res.cookie("adminToken",response.token,{
            httpOnly:true,
            maxAge:3600000
          })
          res.status(200).json({message:"login Successfully"})
        }
      } catch (error) {
        console.log(error);
      }
  }

  async getUsers(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>){
    try {      
      const users = await this.adminUseCase.getUsers()
      res.status(200).json({users})
    } catch (error) {
      console.log(error)
    }
  }


  async blockUser(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>){
      try {
        const {id,status} = req.body
        const response = await this.adminUseCase.blockUser(id,status)        
        res.status(200).json(response) 
      } catch (error) {
        console.log(error);
      }
  }
}