import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import mongoose from "mongoose";
import { User } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user as User;

  if (!session || !_user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }
  const userId = new mongoose.Types.ObjectId(_user._id);
  try {
    const foundUser = await UserModel.findById(userId).select(
      "showFilteredMessages",
    );

    if (!foundUser) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 },
      );
    }

    const messageVisibilityFilter = foundUser.showFilteredMessages
      ? {
          $or: [
            { "messages.status": { $in: ["safe", "unmoderated"] } },
            { "messages.status": "filtered" },
            { "messages.status": { $exists: false } },
          ],
        }
      : {
          $or: [
            { "messages.status": { $in: ["safe", "unmoderated"] } },
            { "messages.status": { $exists: false } },
          ],
        };

    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $match: messageVisibilityFilter },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]).exec();

    if (!user || user.length === 0) {
      return Response.json({ messages: [], success: true }, { status: 200 });
    }

    return Response.json(
      { messages: user[0].messages, success: true },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
