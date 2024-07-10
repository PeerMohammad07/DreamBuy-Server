import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import  IotpService  from "../../Interfaces/Utils/otpService";

export default class OtpService implements IotpService{

  // generateOtp
  generateOtp() {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    console.log(otp);
    return otp;
  }

  // sendEmail
  async sendEmail(email: string, otp: number, userName: string) {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.NODE_MAILER_PASS,
      },
    });

    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Real Estate",
        link: "https://mailgen.js/",
        // logo : "link"  optional
      },
    });

    const resp = {
      body:{
      name: 'Dream Buy',
      intro: 'Welcome to Dream Buy! We\'re very excited to have you on board.',
      action: {
        instructions: `To complete your registration, please use the following One Time Password (OTP):`,
        button: {
          color: '#22BC66',
          text: `Your OTP is ${otp}`,
          link: 'https://your-company.com/verify', // link to the verification page
        },
      },
      outro: 'If you did not request this email, please ignore it.',
    }
  }

    const html = mailGenerator.generate(resp) 
   // const text = mailGenerator.generate(resp)  Generate the plaintext version of the e-mail 

    const message = {
      from:process.env.EMAIL,
      to:email,
      subject:"DreamBuy OTP verification",
      email:html
    }

    await transporter.sendMail(message)
  }
}
