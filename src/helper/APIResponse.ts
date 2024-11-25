import { Message } from "@/model/User";

export interface APIResponseType {
    success: boolean,
    message: string,
    isAccpetingMessages?: boolean,
    messages?: Array<Message>
}
