import nodemailer from "nodemailer";
import config from "../config";

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465, // true for 465, false for other ports
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const sendEmail = async (mailOptions: MailOptions) => {
  try {
    await transporter.sendMail({
      ...mailOptions,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send email.");
  }
};

export const sendVerificationEmail = async (to: string, token: string) => {
  const verificationLink = `${config.frontendUrl}/verify-email?token=${token}`;
  const mailOptions = {
    to,
    subject: "Confirm Your Email",
    html: `<p>Please click the following link to verify your email address:</p>
           <a href="${verificationLink}">${verificationLink}</a>`,
  };
  await sendEmail(mailOptions);
};

export const sendOtpEmail = async (to: string, otp: string) => {
  const mailOptions = {
    to,
    subject: "Your One-Time Passcode",
    html: `<p>Your one-time passcode is: <strong>${otp}</strong></p>
           <p>This code will expire in 10 minutes.</p>`,
  };
  await sendEmail(mailOptions);
};
