import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendPasswordResetEmail = async (to: string, resetCode: string) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "RouteFlow password reset code",
    text: `Your password reset code is ${resetCode}. It expires in 10 minutes.`,
  });
};
