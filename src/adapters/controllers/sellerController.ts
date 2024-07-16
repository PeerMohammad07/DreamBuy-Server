import { Request,Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ISellerController } from "../../Interfaces/Controller/ISellerController";
import ISellerUsecase from "../../Interfaces/UseCase/IsellerUseCase";




export default class SellerController implements ISellerController{
  private sellerUseCase : ISellerUsecase

  constructor(sellerUseCase:ISellerUsecase){
    this.sellerUseCase = sellerUseCase
    this.register = this.register.bind(this)
    this.verifyOtp = this.verifyOtp.bind(this)
    this.login = this.login.bind(this)
    this.resendOtp = this.resendOtp.bind(this)
  }


  async register(req:Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>){
    try {
      const {name , email, password, phone} = req.body
      const data = {
        name,
        email,
        password,
        phone
      }
      const response = await this.sellerUseCase.register(data)      
      if(!response?.status && response?.message == 'this seller already exist' ){
        res.status(403).json({
         status:false,
         message:"seller already exist with this email"
       })       
       return
     }
      res.cookie("otpEmail",data.email)
      res.status(200).json({
        status:true,
        message:"seller created and otp sended successfully"
      })
    } catch (error) {
      console.log(error);
    }
  }

  async verifyOtp(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,res: Response<any, Record<string, any>>){
    try {
      const {otp} = req.body
      const email = req.cookies.otpEmail
      const response = await this.sellerUseCase.verifyOtp(email,otp) 
      if (!response?.status) {
        res.status(401).json(response);
        return;
      }
      res.cookie("otpEmail","")
      res.cookie("sellerToken",response.token,{maxAge:3600000})
      res.status(200).json(response)
    } catch (error) {
      console.log(error);
    }
  }

  async login(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,res: Response<any, Record<string, any>>){
    try {
      const {email,password} = req.body
      const response = await this.sellerUseCase.login(email,password)            
      if(!response?.status&& response?.message=="otp is not verified"){ 
        res.cookie("otpEmail", email, { maxAge: 3600000 })
        res.status(403).json({otpVerified:"false"})
      }else if(response?.status){
        const {token} = response
        res.cookie("userToken",token,{
          httpOnly:true,
          maxAge:3600000
        })
        res.status(200).json(response)
      }else if(!response?.status&&response?.message=="incorrect password"){        
        res.status(403).json(response)
      }else {
        res.status(403).json(response)
      }  
    } catch (error) {
      console.log(error,"mah");
    }
  }

  async logout(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,res: Response<any, Record<string, any>>){
    try {
      res.cookie("userToken","",{httpOnly:true,expires:new Date()})
      res.status(200).json({status:true})
    } catch (error) {
      console.log(error);
    }
  }

  async resendOtp(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,res: Response<any, Record<string, any>>){
    try {      
      const email = req.cookies.otpEmail
      const response = await this.sellerUseCase.resendOtp(email)
      if(response == "resendOtp successfull"){
        res.cookie("otpEmail",email,{maxAge:360000})
        res.json({status:true})
      }
    } catch (error) {
      console.log(error);
    }
  }

  
}