import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { passwordValidation } from "@/schemas/signupSchema";
import { createHash } from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";

const resetPasswordApiSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: passwordValidation,
});

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const parsed = resetPasswordApiSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { success: false, message: "Invalid request" },
        { status: 400 },
      );
    }

    const { token, password } = parsed.data;
    const resetTokenHash = createHash("sha256").update(token).digest("hex");

    const user = await UserModel.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return Response.json(
        { success: false, message: "Reset link is invalid or expired" },
        { status: 400 },
      );
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiry = null;
    await user.save();

    return Response.json(
      { success: true, message: "Password updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error resetting password", error);
    return Response.json(
      { success: false, message: "Error resetting password" },
      { status: 500 },
    );
  }
}
