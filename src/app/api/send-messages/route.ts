import UserModel from "@/models/user";
import { Message } from "@/models/user";
import dbConnect from "@/lib/dbConnect";
import { string } from "zod";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { userName, content } :{userName:string,content:string}= await request.json();
    const user = await UserModel.findOne({ userName: userName });
    
    
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User do not accept messages",
        },
        { status: 403 }
      );
    }

    const newMessage = { content:content , createdAt: new Date() };

    user.messages.push(newMessage as Message);

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error sending messages", error);
    return Response.json(
      {
        success: false,
        message: "Error sending messages",
      },
      { status: 500 }
    );
  }
}