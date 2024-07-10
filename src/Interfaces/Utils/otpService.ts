export default interface IotpService {
  generateOtp():string,
  sendEmail(email: string, otp: number, userName: string) : Promise<void>
}