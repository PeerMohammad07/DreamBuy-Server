import IUser, { IAdmin, IAmenities, ICategory, IProperty, ISeller } from "../../entity/allEntity";

export default interface IadminRepository {
  checkEmailExists(email: string): Promise<IAdmin | null>;
  checkUserExists(id: string): Promise<IAdmin | null>;
  getAllUsers(): Promise<IUser[]>;
  getSeller(): Promise<ISeller[] | null>;
  blockOrUnBlockUser(id: string, status: boolean): Promise<IUser | null>;
  getCategory(): Promise<ICategory[] | null>;
  blockOrUnBlockCategory(id: string, status: boolean): Promise<ICategory | null>;
  addCategory(name: string, description: string): Promise<ICategory>;
  editCategory(id: string, name: string, description: string): Promise<ICategory | null>;
  blockProperty(id: string, status: boolean): Promise<IProperty | null>;
  getAllAmenities(): Promise<IAmenities[]>;
  addAmenity(name: string): Promise<IAmenities>;
  editAmenity(id: string, name: string): Promise<IAmenities | null>;
  blockAmenity(id: string, status: boolean): Promise<IAmenities | null>;
  noOfRentProperty(): Promise<IProperty[]>;
  noOfSaleProperty(): Promise<IProperty[]>;
  noOfAmenities(): Promise<number>;
  noOfCategory(): Promise<number>;
  noOfSellers(): Promise<number>;
  noOfUsers(): Promise<number>;
  mostUsedCategorys():Promise<IProperty[]>
  mostUsedAmenities():Promise<IProperty[]>
  noOfPremiumUsers():Promise<number>
  totalRevenue():Promise<any[]>
  userGrowth():Promise<any[]>
  sellerGrowth():Promise<any[]>,
  monthlyRevenue() : Promise<any[]>
}
