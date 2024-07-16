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
    this.verifyOtp = this.verifyOtp.bind(this)
    this.login = this.login.bind(this)
    this.getToken = this.getToken.bind(this)
    this.logout = this.logout.bind(this)
    this.resendOtp = this.resendOtp.bind(this)
    this.googleLogin = this.googleLogin.bind(this)
  }

    async register(req:Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>):Promise<void>{
      try {
        const {name,email,password} = req.body
        if(!name||!email||!password){
            res.status(400).json({
              status:false,
              message:"All fields are required"
          })
        }
    
        const data = {
          name,
          email,
          password
        }
    
        const response =  await this.userUseCase.register(data)
        if(!response?.status && response?.message == 'this user already exist' ){
           res.status(403).json({
            status:false,
            message:"user already exist with this email"
          })
          return
        }
        res.cookie("otpEmail", email, { maxAge: 3600000 })
        res.status(200).json({
          status:true,
          message:"User created and otp sended successfully"
        })
      } catch (error) {
        res.json(error)
      }
    }

  async verifyOtp( req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,res: Response<any, Record<string, any>>){
    try {      
      const {otp} = req.body
      let email = req.cookies.otpEmail
      const response = await this.userUseCase.verifyOtp(email,otp)

      if (!response?.status) {
        res.status(401).json(response);
        return;
      }

      res.cookie("otpEmail","")
      res.cookie("userToken",response.token,{maxAge:3600000})
      res.status(200).json(response)
    } catch (error) {
      res.json(error)
    }
  }

  async logout(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,res: Response<any, Record<string, any>>){
    try {
      res.cookie("userToken","",{httpOnly:true,expires:new Date()})
      res.status(200).json({status:true})
    } catch (error) {
      res.json(error)
    }
  }

  async getToken(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>){
    try {
      const token = req.cookies.userToken
      const response = await this.userUseCase.verifyToken(token)
      res.status(200).json(response)
    }catch (error){
      console.log("getToken in user Controller");
      throw Error()
    }
  }

  async login(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,res: Response<any, Record<string, any>>):Promise<void>{
    try {      
      const {email,password} = req.body
      const data = {
        email,
        password
      }
            
      const response = await this.userUseCase.loginAuthentication(data)
      if(!response?.status&&response?.message=="otp is not verified"){        
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
      console.log(error);
      
    }   
  }

  async resendOtp(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,res: Response<any, Record<string, any>>){
    try {      
      const email = req.cookies.otpEmail
      const response = await this.userUseCase.resendOtp(email)
      if(response == "resendOtp successfull"){
        res.cookie("otpEmail",email,{maxAge:360000})
        res.json({status:true})
      }
    } catch (error) {
      console.log(error);
    }
  }

  async googleLogin(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,res: Response<any, Record<string, any>>){
    const {name,email,image} = req.body
    const data = {
      name,
      email,
      image
    }
    const response = await this.userUseCase.googleLogin(data)

    if(response?.message == "google Login succesfull"){
      const {token} = response
      res.cookie("userToken",token,{
        httpOnly:true,
        maxAge:360000
      })
    }
    res.status(200).json(response)
  }
}