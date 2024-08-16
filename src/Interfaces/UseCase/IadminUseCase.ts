import { IAmenities, ICategory } from "../../entity/allEntity"

export interface returnData{
  message:string,
  token? : string
  adminRefreshToken?:string
}

export type DashboardData = {
  noOfUsers: number;
  noOfSellers: number;
  noOfCategories: number;
  noOfAmenities: number;
  noOfRentProperties: number;
  noOfSaleProperties: number;
};

export interface IadminUseCase {
  login(email:string,password:string):Promise<returnData|void>
  getUsers():void
  getSeller():void
  blockUser(id:string,status:boolean):Promise<string|null>
  getCategory():void
  blockCategory(id:string,status:boolean):Promise<string|null>
  addCategory(name:string,description:string):Promise<ICategory|void>
  editCategory(id:string,name:string,description:string):Promise<ICategory|null>
  blockProperty(id: string, status: boolean):Promise<string|null>
  getAmenities():void
  addAmenity(name: string):Promise<IAmenities|void>
  editAmenity(id: string, name: string):Promise<IAmenities|null>
  blockAmenity(id: string, status: boolean):Promise<string|null>
  getAllDashboardDatas(): Promise<DashboardData>;

}