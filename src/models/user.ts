import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
  status: "safe" | "filtered" | "unmoderated";
  flagReason?: "HARASSMENT" | "SEXUAL" | "THREAT" | "SPAM" | null;
}

const MessageSchema: Schema<Message> = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["safe", "filtered", "unmoderated"],
    default: "safe",
  },
  flagReason: {
    type: String,
    enum: ["HARASSMENT", "SEXUAL", "THREAT", "SPAM", null],
    default: null,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  userName: string;
  email: string;
  password: string;
  purpose?: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  resetPasswordToken?: string | null;
  resetPasswordTokenExpiry?: Date | null;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  showFilteredMessages: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  userName: {
    type: String,
    required: [true, "UserName is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  purpose: {
    type: String,
    trim: true,
    maxlength: 300,
    default: "general anonymous social messaging",
  },
  verifyCode: {
    type: String,
    required: [true, "Verify Code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is required"],
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordTokenExpiry: {
    type: Date,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    required: true,
    default: true,
  },
  showFilteredMessages: {
    type: Boolean,
    required: true,
    default: false,
  },
  messages: [MessageSchema],
});

if (process.env.NODE_ENV === "development" && mongoose.models.User) {
  delete mongoose.models.User;
}

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);
export default UserModel;
