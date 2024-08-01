import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';
import moment from 'moment';

// Configure your email transporter (use environment variables for sensitive information)
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

// Function to send email
const sendEmailPremiumExpiration = async (to: string, name: string, expiryDate: Date) => {
  try {
    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'Dream Buy',
        link: 'https://dreambuy.com',
      },
    });

    const emailContent = {
      body: {
        name: name,
        intro: 'Your premium subscription is about to expire!',
        table: {
          data: [
            {
              item: 'Subscription Expiry Date',
              description: moment(expiryDate).format('MMMM D, YYYY'),
            },
          ],
        },
        action: {
          instructions: 'Renew your subscription to continue enjoying premium features:',
          button: {
            color: '#22BC66',
            text: 'Renew Subscription',
            link: process.env.CLIENT_SIDE_URL||'http://localhost:5000',
          },
        },
        outro: 'If you have any questions, feel free to contact us.',
      },
    };

    const html = mailGenerator.generate(emailContent);

    const message = {
      from: process.env.EMAIL,
      to,
      subject: 'Reminder: Your Premium Subscription is Expiring Soon',
      html: html,
    };

    await transporter.sendMail(message);
    console.log('Premium expiration email sent successfully.');
  } catch (error) {
    console.error('Error sending premium expiration email:', error);
  }
};

export default sendEmailPremiumExpiration;
