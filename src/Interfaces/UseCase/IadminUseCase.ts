export interface returnData{
  message:string,
  token? : string
}

export interface IadminUseCase {
  login(email:string,password:string):Promise<returnData|void>
  getUsers():void
  blockUser(id:string,status:boolean):Promise<string|null>
}