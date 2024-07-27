export interface returnData{
  message:string,
  token? : string
  adminRefreshToken?:string
}

export interface IadminUseCase {
  login(email:string,password:string):Promise<returnData|void>
  getUsers():void
  getSeller():void
  blockUser(id:string,status:boolean):Promise<string|null>
  getCategory():void
  blockCategory(id:string,status:boolean):Promise<string|null>

}