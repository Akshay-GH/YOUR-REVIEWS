import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { forgotPasswordSchema } from "@/schemas/forgotPasswordSchema";
import { sendPasswordResetEmail } from "@/helpers/sendVerificationEmail";
import { randomBytes, createHash } from "crypto";
import { checkForgotPasswordRateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { success: false, message: "Invalid email" },
        { status: 400 },
      );
    }

    const { email } = parsed.data;
    
    const rateLimit = await checkForgotPasswordRateLimit(email);
    if (!rateLimit.allowed) {
      return Response.json(
        { success: false, message: "Too many password reset requests. Please try again later." },
        { status: 429 },
      );
    }

    await dbConnect();
    const user = await UserModel.findOne({ email, isVerified: true });

    if (user) {
      const resetToken = randomBytes(32).toString("hex");
      const resetTokenHash = createHash("sha256")
        .update(resetToken)
        .digest("hex");
      const expiryDate = new Date(Date.now() + 30 * 60 * 1000);

      user.resetPasswordToken = resetTokenHash;
      user.resetPasswordTokenExpiry = expiryDate;
      await user.save();

      const origin = new URL(request.url).origin;
      const baseUrl = process.env.NEXTAUTH_URL || origin;
      const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

      const emailResponse = await sendPasswordResetEmail(email, resetUrl);
      if (!emailResponse.success) {
        return Response.json(
          { success: false, message: emailResponse.message },
          { status: 500 },
        );
      }
    }

    return Response.json(
      {
        success: true,
        message: "If that email exists, a reset link has been sent.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending reset email", error);
    return Response.json(
      { success: false, message: "Error sending reset email" },
      { status: 500 },
    );
  }
}
