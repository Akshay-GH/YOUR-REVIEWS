import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { sanitizeMessagePurpose } from "@/lib/purpose";
import { normalizeUserName } from "@/lib/username";
import UserModel from "@/models/user";

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const rawUserName = searchParams.get("userName");

    if (rawUserName) {
      const userName = normalizeUserName(rawUserName);
      const foundUser = await UserModel.findOne({ userName }).select("purpose");

      if (!foundUser) {
        return Response.json(
          { success: false, message: "User not found" },
          { status: 404 },
        );
      }

      return Response.json(
        {
          success: true,
          message: "Message purpose fetched",
          purpose: sanitizeMessagePurpose(foundUser.purpose),
        },
        { status: 200 },
      );
    }

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
      return Response.json(
        { success: false, message: "Not Authenticated" },
        { status: 401 },
      );
    }

    const foundUser = await UserModel.findById(user._id).select("purpose");

    if (!foundUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message purpose fetched",
        purpose: sanitizeMessagePurpose(foundUser.purpose),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching message purpose", error);

    return Response.json(
      { success: false, message: "Error fetching message purpose" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
      return Response.json(
        { success: false, message: "Not Authenticated" },
        { status: 401 },
      );
    }

    const { purpose } = await request.json();
    const sanitizedPurpose = sanitizeMessagePurpose(purpose);

    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { purpose: sanitizedPurpose },
      { new: true },
    ).select("purpose");

    if (!updatedUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message purpose updated",
        purpose: sanitizeMessagePurpose(updatedUser.purpose),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating message purpose", error);

    return Response.json(
      { success: false, message: "Error updating message purpose" },
      { status: 500 },
    );
  }
}
