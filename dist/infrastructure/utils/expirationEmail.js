"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailgen_1 = __importDefault(require("mailgen"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const moment_1 = __importDefault(require("moment"));
// Configure your email transporter (use environment variables for sensitive information)
const transporter = nodemailer_1.default.createTransport({
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
const sendEmailPremiumExpiration = async (to, name, expiryDate) => {
    try {
        const mailGenerator = new mailgen_1.default({
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
                            description: (0, moment_1.default)(expiryDate).format('MMMM D, YYYY'),
                        },
                    ],
                },
                action: {
                    instructions: 'Renew your subscription to continue enjoying premium features:',
                    button: {
                        color: '#22BC66',
                        text: 'Renew Subscription',
                        link: process.env.CLIENT_SIDE_URL || 'http://localhost:5000',
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
    }
    catch (error) {
        console.error('Error sending premium expiration email:', error);
    }
};
exports.default = sendEmailPremiumExpiration;
//# sourceMappingURL=expirationEmail.js.map