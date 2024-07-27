import { IProperty, ISeller } from "../../entity/allEntity";
import { IregisterData } from "../../useCase/sellerUseCase";

import { IOtp } from "../../entity/allEntity";
import { Property, PropertyData } from "../UseCase/IsellerUseCase";

export default interface ISellerRepository {
  checkEmailExists(email:string):Promise<ISeller|null>
  checkUserExists(id:string):Promise<ISeller|null>
  createSeller(data:IregisterData):Promise<void>
  saveOtp(email:string,otp:string):Promise<void>
  verifyOtp(email : string):Promise<IOtp|null>
  updateSellerVerified(email:string):Promise<ISeller|null>
  updateSellerPassword(id:string,password:string):Promise<ISeller|null>
  updateKyc(id:string,image:string,url:string):Promise<ISeller|null>
  kycStatusUpdate(id:string,status:string):Promise<ISeller|null>
  blockSeller(id:string,status:boolean):Promise<ISeller|null>
  addProperty(data:Property):Promise<IProperty|null>
  updateSeller(sellerId:string,name:string,phone:string):Promise<ISeller|null>
}