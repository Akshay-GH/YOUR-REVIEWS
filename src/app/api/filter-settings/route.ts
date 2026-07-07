import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";

export async function GET() {
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

    const foundUser = await UserModel.findById(user._id).select(
      "showFilteredMessages",
    );

    if (!foundUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Filter settings fetched",
        showFilteredMessages: foundUser.showFilteredMessages,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching filter settings", error);

    return Response.json(
      { success: false, message: "Error fetching filter settings" },
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

    const { showFilteredMessages } = await request.json();

    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { showFilteredMessages: Boolean(showFilteredMessages) },
      { new: true },
    ).select("showFilteredMessages");

    if (!updatedUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Filter settings updated",
        showFilteredMessages: updatedUser.showFilteredMessages,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating filter settings", error);

    return Response.json(
      { success: false, message: "Error updating filter settings" },
      { status: 500 },
    );
  }
}
