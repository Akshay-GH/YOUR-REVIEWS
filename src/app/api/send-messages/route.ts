import UserModel from "@/models/user";
import { Message } from "@/models/user";
import dbConnect from "@/lib/dbConnect";
import { classifyMessage } from "@/lib/moderation";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { normalizeUserName } from "@/lib/username";

export async function POST(request: Request) {
  try {
    const { userName: rawUserName, content }: { userName: string; content: string } =
      await request.json();
    const userName = normalizeUserName(rawUserName);
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(ip, userName);

    if (!rateLimit.allowed) {
      const message =
        rateLimit.reason === "per-link"
          ? "You've sent too many messages to this link. Try again later."
          : "You're sending messages too fast. Please slow down.";

      return Response.json(
        {
          success: false,
          message,
        },
        { status: 429 },
      );
    }

    await dbConnect();

    const user = await UserModel.findOne({ userName });
    
    
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

    const moderation = await classifyMessage(content);
    const newMessage = {
      content,
      createdAt: new Date(),
      status: moderation.status,
      flagReason: moderation.flagReason,
    };

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
