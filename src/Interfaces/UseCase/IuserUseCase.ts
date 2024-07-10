import { IregisterBody } from "../Controller/IUserController";

export default interface IuserUseCase{
  register(data:IregisterBody):void
}