import nodemailer from "nodemailer";
import { ApiResponse } from "@/types/apiResponse";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(
  email: string,
  userName: string,
  otp: string,
): Promise<ApiResponse> {
  try {
    await transporter.sendMail({
      from: `"Your Reviews" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Mystery Message | Verification Code",
      html: `
        <div style="font-family: Roboto, Verdana, sans-serif; padding: 20px;">
          <h2>Hello ${userName},</h2>
          <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
          <h1 style="letter-spacing: 4px; font-size: 32px;">${otp}</h1>
          <p>If you did not request this code, please ignore this email.</p>
        </div>
      `,
    });
    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (emailError) {
    console.log("Error Sending Verification Email", emailError);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
