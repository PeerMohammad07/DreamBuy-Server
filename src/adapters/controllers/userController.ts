import {
  IregisterBody,
  IUserController,
} from "../../Interfaces/Controller/IUserController";
import IuserUseCase from "../../Interfaces/UseCase/IuserUseCase";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { avatarImage } from "../../infrastructure/utils/avatarImae";

export default class userController implements IUserController {
  private userUseCase: IuserUseCase;

  constructor(userUseCase: IuserUseCase) {
    this.userUseCase = userUseCase;
    this.register = this.register.bind(this);
    this.verifyOtp = this.verifyOtp.bind(this);
    this.login = this.login.bind(this);
    this.getToken = this.getToken.bind(this);
    this.logout = this.logout.bind(this);
    this.resendOtp = this.resendOtp.bind(this);
    this.googleLogin = this.googleLogin.bind(this);
    this.googleRegister = this.googleRegister.bind(this)
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.getRentProperty = this.getRentProperty.bind(this);
    this.getSaleProperty = this.getSaleProperty.bind(this);
    this.updateUser = this.updateUser.bind(this)
    this.getPremium = this.getPremium.bind(this)
    this.updatePremium = this.updatePremium.bind(this)
    this.productDetail = this.productDetail.bind(this)
    this.sendOwnerDetail = this.sendOwnerDetail.bind(this)
    this.getUser = this.getUser.bind(this)
  }

  async register(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        res.status(400).json({
          status: false,
          message: "All fields are required",
        });
      }

      const randNumber =  Math.floor(Math.random() * (10 - 1 + 1)) + 1;
      const randomImage = avatarImage(randNumber)

      const data = {
        name,
        email,
        password,
        image:randomImage,
      };

      const response = await this.userUseCase.register(data);
      if (!response?.status && response?.message == "this user already exist") {
        res.status(403).json({
          status: false,
          message: "user already exist with this email",
        });
        return;
      }
      res.cookie("otpEmail", email, { maxAge: 3600000 });
      res.status(200).json({
        status: true,
        message: "User created and otp sended successfully",
      });
    } catch (error) {
      res.json(error);
    }
  }

  async verifyOtp(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const { otp } = req.body;
      let email = req.cookies.otpEmail;
      const response = await this.userUseCase.verifyOtp(email, otp);

      if (!response?.status) {
        res.status(401).json(response);
        return;
      }

      res.cookie("otpEmail", "");
      res.cookie("userToken", response.token, { httpOnly: true, maxAge: 3600000 }).cookie("userRefreshToken", response.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      res.status(200).json(response);
    } catch (error) {
      res.json(error);
    }
  }

  async logout(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      res.cookie("userToken", "", { httpOnly: true, expires: new Date() }).cookie("userRefreshToken", "", { httpOnly: true, expires: new Date() })
      res.status(200).json({ status: true });
    } catch (error) {
      res.json(error);
    }
  }

  async getToken(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const token = req.cookies.userToken;
      const response = await this.userUseCase.verifyToken(token);
      res.status(200).json(response);
    } catch (error) {
      console.log("getToken in user Controller");
      throw Error();
    }
  }

  async login(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const data = {
        email,
        password,
      };

      const response = await this.userUseCase.loginAuthentication(data);
      if (response?.status && response.message == "Login Succesfully") {
        const { token, refreshToken } = response;
        res.cookie("userToken", token, {
          httpOnly: true,
          maxAge: 360000,
        }).cookie("userRefreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        res.status(200).json({ status: true, message: "Login Succesfully", user: response.user });
      } else if (
        !response?.status &&
        response?.message == "otp is not verified"
      ) {
        res.cookie("otpEmail", email, { maxAge: 3600000 });
        res.status(403).json({ otpVerified: "false" });
      } else if (
        !response?.status &&
        response?.message == "this user is blocked"
      ) {
        res.status(403).json({ message: "this user is blocked" });
      } else if (response?.status) {
        res.status(200).json(response);
      } else if (
        !response?.status &&
        response?.message == "incorrect password"
      ) {
        res.status(403).json(response);
      } else {
        res.status(403).json(response);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async resendOtp(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const email = req.cookies.otpEmail;
      const response = await this.userUseCase.resendOtp(email);
      if (response == "resendOtp successfull") {
        res.cookie("otpEmail", email, { maxAge: 360000 });
        res.json({ status: true });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async googleRegister(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>) {
    try {
      const { name, email, image } = req.body;
      const data = {
        name,
        email,
        image,
      };
      const response = await this.userUseCase.googleRegister(data)
      if (response?.status) {
        const { token, refreshToken } = response;
        res.cookie("userToken", token, {
          httpOnly: true,
          maxAge: 360000,
        }).cookie("userRefreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        res.status(200).json(response)
      } else {
        res.status(403).json(response)
      }
    } catch (error) {

    }
  }

  async googleLogin(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    const { name, email, image } = req.body;
    const data = {
      name,
      email,
      image,
    };
    const response = await this.userUseCase.googleLogin(data);

    if (response?.status && response?.message == "google Login succesfull") {
      const { token, refreshToken } = response;
      res.cookie("userToken", token, {
        httpOnly: true,
        maxAge: 360000,
      }).cookie("userRefreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
      })
      return res.status(200).json(response);
    } else {
      return res.status(403).json(response)
    }
  }

  async forgotPassword(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const { email } = req.body;
      const response = await this.userUseCase.validateForgotPassword(email);
      if (response == "Email sended to the user") {
        res.status(200).json({ message: "email sended succesfully" });
        return;
      } else if (response == "seller not exist with this email") {
        res
          .status(403)
          .json({ message: "seller doesnt exist with this email" });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async resetPassword(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const { password, userId, token } = req.body;
      const response = await this.userUseCase.resetPassword(
        password,
        userId,
        token
      );
      if (response == "password updated succesfully") {
        res.status(200).json({ message: "password updated succesfully" });
        return;
      } else if (response == "token expired") {
        res.status(403).json({ message: "token has been expired" });
        return;
      } else if (response == "user doesn't exists") {
        res.status(403).json({ message: "user doesn't exist" });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getUser(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const id = req.query.id
      const role = req.query.role
      if (typeof id !== 'string'||typeof role !== 'string') {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      const getUsers = await this.userUseCase.getUsers(id,role)
      res.status(200).json(getUsers);
    } catch (error) {
      console.log(error);
    }
  }


  async getRentProperty(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const rentPropertyData = await this.userUseCase.getRentProperty();
      res.status(200).json(rentPropertyData);
    } catch (error) {
      console.log(error);
    }
  }

  async getSaleProperty(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const salePropertyData = await this.userUseCase.getSaleProperty();
      res.status(200).json(salePropertyData);
    } catch (error) {
      console.log(error);
    }
  }

  async updateUser(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>) {
    try {
      const { name, image, id, type } = req.body
      const response = await this.userUseCase.updateUser(id, name, image, type)
      res.status(200).json(response)
    } catch (error) {
      console.log(error);
    }
  }


  async getPremium(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>) {
    try {
      const { data } = req.body
      const session = await this.userUseCase.getPremium(data)
      res.status(200).json({ session })
    } catch (error) {
      console.log(error);
    }
  }

  async updatePremium(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>) {
    try {
      const { type, id } = req.body
      const response = await this.userUseCase.updatePremium(id, type)
      res.status(200).json(response)
    } catch (error) {
      console.log(error);
    }
  }

  async productDetail(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>) {
    try {
      const { id } = req.body
      const response = await this.userUseCase.productDetail(id)
      res.status(200).json(response)
    } catch (error) {
      console.log(error);
    }
  }

  async sendOwnerDetail(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>) {
    try {
      const { sellerId,email, userName ,PropertyDetails} = req.body      
      const response = await this.userUseCase.sendOwnerDetail(sellerId,email,userName,PropertyDetails)
      res.status(200).json(response)
    } catch (error) {
      console.log(error);
    }
  }
}