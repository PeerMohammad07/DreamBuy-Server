import nodemailer from "nodemailer"
import { IProperty, ISeller } from "../../entity/allEntity";

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

const sendEmailOwnerDetails = async (to: string, userName: string, ownerDetails: ISeller, propertyDetails: IProperty) => {
  const logoUrl = "https://dreambuy.s3.amazonaws.com/dreambuywhitelogo.png"
  try {
    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <div style="text-align: center; padding: 20px;">
            <img src="${logoUrl}" alt="Dream Buy Logo" style="width: 150px;" />
          </div>
          <div style="padding: 20px;">
            <h2>Hi ${userName},</h2>
            <p>Here are the owner details for the property you are interested in!</p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="background-color: #f8f8f8; border-bottom: 1px solid #ddd;">
                <th style="text-align: left; padding: 10px;">Item</th>
                <th style="text-align: left; padding: 10px;">Description</th>
              </tr>
              <tr>
                <td style="padding: 10px;">Owner Name</td>
                <td style="padding: 10px; color: #007bff;">${ownerDetails.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px;">Owner Phone Number</td>
                <td style="padding: 10px; color: #007bff;">${ownerDetails.phone}</td>
              </tr>
              <tr>
                <td style="padding: 10px;">Owner Email</td>
                <td style="padding: 10px; color: #007bff;">${ownerDetails.email}</td>
              </tr>
            </table>
            <h3>Property Details:</h3>
            <div style="margin-bottom: 20px;">
              <img src="${propertyDetails.propertyImage[0]}" alt="Property Image" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px;" />
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background-color: #f8f8f8; border-bottom: 1px solid #ddd;">
                <th style="text-align: left; padding: 10px;">Item</th>
                <th style="text-align: left; padding: 10px;">Description</th>
              </tr>
              <tr>
                <td style="padding: 10px;">Property Name</td>
                <td style="padding: 10px;">${propertyDetails.propertyName}</td>
              </tr>
              <tr>
                <td style="padding: 10px;">Price</td>
                <td style="padding: 10px;">${propertyDetails.Price}</td>
              </tr>
              <tr>
                <td style="padding: 10px;">Location</td>
                <td style="padding: 10px;">${propertyDetails.location.location}</td>
              </tr>
            </table>
            <p style="margin-top: 20px;">Thank you for using Dream Buy. If you have any questions, feel free to contact us.</p>
          </div>
          <div style="text-align: center; padding: 20px;">
            <p style="font-size: 12px; color: #aaa;">© 2024 Dream Buy. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    const message = {
      from: process.env.EMAIL,
      to,
      subject: 'Owner Details for Your Property Interest',
      html: htmlContent,
    };

    await transporter.sendMail(message);
    console.log('Owner details email sent successfully.');
  } catch (error) {
    console.error('Error sending owner details email:', error);
  }
};

export default sendEmailOwnerDetails;
