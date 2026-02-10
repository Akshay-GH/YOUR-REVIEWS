
import { Message } from "@/models/user";

export interface ApiResponse{
    success: boolean;
    message: string;
    isAccesptingMessages?: boolean
    messages?: Array<Message>

}