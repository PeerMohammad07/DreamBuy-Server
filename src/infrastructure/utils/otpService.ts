import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import  IotpService  from "../../Interfaces/Utils/otpService";

export default class OtpService implements IotpService {

  // generateOtp
  generateOtp() {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    console.log(otp);
    return otp;
  }

  // sendEmail
  async sendEmail(email: string, otp: string, name: string) {

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
        name: "Dream Buy",
        link: "https://mailgen.js/",
        // logo : "link"  optional
      },
    });

    const resp = {
      body: {
        name: `${name}`,
        intro: 'Welcome to Dream Buy! We\'re very excited to have you on board.',
        action: {
          instructions: `To complete your registration, please use the following One Time Password (OTP):`,
          button: {
            color: '#22BC66',
            text: `Your OTP is ${otp}`,
            link: 'http://localhost:5173/verifyOtp',
          },
        },
        outro: 'If you did not request this email, please ignore it.',
      }
    };

    const html = mailGenerator.generate(resp) 
   // const text = mailGenerator.generate(resp)  Generate the plaintext version of the e-mail 

    const message = {
      from:process.env.EMAIL,
      to:email,
      subject:"DreamBuy OTP verification",
      html:html
    }

    await transporter.sendMail(message)
  }


  // Send Email to Forgot Password 
  async sendEmailForgotPassword(resetLink:string,email:string){
    try {
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
          name: "Dream Buy",
          link: "https://mailgen.js/",
        },
      });
  
      const emailContent = {
        body: {
          name: "User",
          intro: "You are receiving this email because we received a password reset request for your account.",
          action: {
            instructions: "To reset your password, click the button below:",
            button: {
              color: "#22BC66",
              text: "Reset Password",
              link: resetLink, 
            },
          },
          outro: "If you didn't request a password reset, no further action is required.",
        },
      };
  
      const html = mailGenerator.generate(emailContent);
  
      const message = {
        from: process.env.EMAIL,
        to: email,
        subject: "DreamBuy Password Reset",
        html: html,
      };
  
      await transporter.sendMail(message);
      console.log("Password reset email sent successfully.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error; // Handle or log the error as needed
    }
  }
}
