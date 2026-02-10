import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";

import { success, z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body= await request.json();
    console.log(body)
    const decodedUser = decodeURIComponent(body.username); // insure the values passed through url are decoded
    const validCode = verifySchema.safeParse({ code:body.code });


     console.log(typeof body.code)
     console.log(validCode);

    // check zod validation
    if (!validCode.success) {
      const verifyCodeErrors = validCode.error.format();
      return Response.json(
        {
          success: false,
          message: "invalid code",
        },
        { status: 400 },
      );
    }

    const user = await UserModel.findOne({ userName: decodedUser, verifyCode: body.code });
    console.log(user)
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user does not exist",
        },
        {
          status: 500,
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
          status: 500,
        },
      );

    }else{
        return Response.json(
        {
          success: false,
          message: "code is invalid ",
        },
        {
          status: 500,
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
