
import { Message } from "@/models/user";

export interface ApiResponse{
    success: boolean;
    message: string;
    isAccesptingMessages?: boolean
    isAcceptingMessages?: boolean
    showFilteredMessages?: boolean
    messages?: Array<Message>
    purpose?: string

}
