import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { normalizeUserName } from "@/lib/username";
import { checkSignUpRateLimit, getClientIp } from "@/lib/rateLimit";
import { randomInt } from "crypto";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = await checkSignUpRateLimit(ip);

  if (!rateLimit.allowed) {
    return Response.json(
      {
        success: false,
        message: "Too many sign-up attempts. Please try again later.",
      },
      { status: 429 }
    );
  }

  await dbConnect();
  try {
    const { userName: rawUserName, email, password } = await request.json();
    const userName = normalizeUserName(rawUserName);
    const existingUserVerifiedByUserName = await UserModel.findOne({
      userName,
      isVerified: true,
    });
    if (existingUserVerifiedByUserName) {
      return Response.json(
        {
          success: false,
          message: "UserName is already taken",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail = await UserModel.findOne({
      email,
    });

    const otp = randomInt(100000, 1000000).toString();
    if (existingUserByEmail) {
      //condition
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Email is already used",
          },
          {
            status: 400,
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        existingUserByEmail.userName = userName;
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = otp;
        existingUserByEmail.verifyCodeExpiry = expiryDate;

        await existingUserByEmail.save();
      }
    } else {
     
      await UserModel.deleteOne({ userName, isVerified: false });

      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        userName: userName,
        email: email,
        password: hashedPassword,
        verifyCode: otp,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(email, userName, otp);

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User Registered Successfully. Please Verify Your Email",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error Registering User", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}
