import IUser, { IAdmin } from "../../entity/userEntity";

export default interface IadminRepository {
  checkEmailExists(email:string):Promise<IAdmin|null>
  getAllUsers():Promise<IUser[]|[]>
  blockOrUnBlockUser(id:string,status:boolean):Promise<IUser|null>
}