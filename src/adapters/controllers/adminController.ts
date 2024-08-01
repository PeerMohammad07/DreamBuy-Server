import { IAdminController } from "../../Interfaces/Controller/IAdminController";
import { Request, response, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { IadminUseCase } from "../../Interfaces/UseCase/IadminUseCase";

export default class adminController implements IAdminController {
  private adminUseCase;

  constructor(adminUseCase: IadminUseCase) {
    this.adminUseCase = adminUseCase;
    this.login = this.login.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.getSeller = this.getSeller.bind(this)
    this.blockUser = this.blockUser.bind(this);
    this.logout = this.logout.bind(this);
    this.getCategory = this.getCategory.bind(this)
    this.blockCategory = this.blockCategory.bind(this)
    this.addCategory = this.addCategory.bind(this)
    this.editCategory = this.editCategory.bind(this)
  }

  async login(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const { email, password } = req.body;
      const response = await this.adminUseCase.login(email, password);
      if (response?.message == "Invalid Email") {
        res.status(403).json({ message: "Invalid Email" });
      }
      if (response?.message == "Incorrect Password") {
        res.status(403).json({ message: "incorrect password" });
      }
      if (response?.message == "Login succesfully") {
        res.cookie("adminToken", response.token, {
          httpOnly: true,
          maxAge: 3600000,
        }).cookie("adminRefreshToken", response.adminRefreshToken, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ message: "login Successfully" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getUsers(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const users = await this.adminUseCase.getUsers();
      res.status(200).json({ users });
    } catch (error) {
      console.log(error);
    }
  }

  async blockUser(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const { id, status } = req.body;
      const response = await this.adminUseCase.blockUser(id, status);
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
    }
  }

  async logout(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      res.cookie("adminToken", "", { httpOnly: true, expires: new Date() });
      res.status(200).json({ status: true });
    } catch (error) {
      console.log(error);
    }
  }


  async getSeller(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const response = await this.adminUseCase.getSeller();
      res.status(200).json({ sellers: response });
    } catch (error) {
      console.log(error);
    }
  }

  async getCategory(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const response = await this.adminUseCase.getCategory();
      res.status(200).json({ category: response });
    } catch (error) {
      console.log(error);
    }
  }

  async blockCategory(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const { id, status } = req.body;
      const response = await this.adminUseCase.blockCategory(id, status);
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
    }
  }

  async addCategory(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>) {
    try {
      const { name, description } = req.body
      const response = await this.adminUseCase.addCategory(name, description)
      res.status(200).json({ response })
    } catch (error) {
      console.log(error);
    }
  }

  async editCategory(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>) {
    try {
      const { id, name, description } = req.body
      const response = await this.adminUseCase.editCategory(id, name, description)
      res.status(200).json({ response })
    } catch (error) {
      console.log(error);
    }
  }

}
