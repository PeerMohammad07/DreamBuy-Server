import IUser from "../../entity/userEntity";
import { IregisterBody } from "../Controller/IUserController";

export default interface IuserRepository{
  checkEmailExists(email:string):Promise<IUser|null>
  createUser(data:IregisterBody):void
}