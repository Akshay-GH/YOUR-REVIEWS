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
      subject: "Message Mint | Verification Code",
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

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
): Promise<ApiResponse> {
  try {
    await transporter.sendMail({
      from: `"Your Reviews" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "MessageMint | Reset Your Password",
      html: `
        <div style="font-family: Roboto, Verdana, sans-serif; padding: 20px;">
          <h2>Password reset request</h2>
          <p>We received a request to reset your password. Use the link below to set a new password:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>This link will expire in 30 minutes.</p>
          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
      `,
    });
    return {
      success: true,
      message: "Password reset email sent successfully",
    };
  } catch (emailError) {
    console.log("Error Sending Password Reset Email", emailError);
    return {
      success: false,
      message: "Failed to send password reset email",
    };
  }
}
