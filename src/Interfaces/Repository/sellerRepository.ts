import { ISeller } from "../../entity/userEntity";
import { IregisterData } from "../../useCase/sellerUseCase";

import { IOtp } from "../../entity/userEntity";

export default interface ISellerRepository {
  checkEmailExists(email:string):Promise<ISeller|null>
  createSeller(data:IregisterData):Promise<void>
  saveOtp(email:string,otp:string):Promise<void>
  verifyOtp(email : string):Promise<IOtp|null>
  updateSellerVerified(email:string):Promise<ISeller|null>
}