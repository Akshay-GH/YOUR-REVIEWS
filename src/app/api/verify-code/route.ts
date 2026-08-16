import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { verifySchema } from "@/schemas/verifySchema";
import { normalizeUserName } from "@/lib/username";
import { checkVerifyRateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const decodedUser = normalizeUserName(decodeURIComponent(body.username)); // insure the values passed through url are decoded

    const rateLimit = await checkVerifyRateLimit(decodedUser);
    if (!rateLimit.allowed) {
      return Response.json(
        {
          success: false,
          message: "Too many verification attempts. Please try again later.",
        },
        { status: 429 }
      );
    }

    await dbConnect();
    const validCode = verifySchema.safeParse({ code:body.code });

    // check zod validation
    if (!validCode.success) {
      return Response.json(
        {
          success: false,
          message: "invalid code",
        },
        { status: 400 },
      );
    }

    const user = await UserModel.findOne({ userName: decodedUser, verifyCode: body.code });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user does not exist",
        },
        {
          status: 404,
        },
      );
    }

    const isCodeValid = user.verifyCode == body.code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "user verified successfully",
        },
        {
          status: 200,
        },
      );
    }else if(!isCodeNotExpired){
        return Response.json(
        {
          success: false,
          message: "code is expired , kindly redirect to signup ",
        },
        {
          status: 400,
        },
      );

    }else{
        return Response.json(
        {
          success: false,
          message: "code is invalid ",
        },
        {
          status: 400,
        },
      );
    }
  } catch (err) {
    console.error("Error veryfying user", err);

    return Response.json(
      {
        success: false,
        message: "Error veryfying user",
      },
      {
        status: 500,
      },
    );
  }
}
