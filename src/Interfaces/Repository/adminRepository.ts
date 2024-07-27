import IUser, { IAdmin, ICategory, ISeller } from "../../entity/allEntity";

export default interface IadminRepository {
  checkEmailExists(email:string):Promise<IAdmin|null>
  checkUserExists(id: string) :Promise<IAdmin|null>
  getAllUsers():Promise<IUser[]|[]>
  getSeller():Promise<ISeller[]|null>
  blockOrUnBlockUser(id:string,status:boolean):Promise<IUser|null>
  getCategory():Promise<ICategory[]|null>
  blockOrUnBlockCategory(id: string, status: boolean):Promise<ICategory|null>
}