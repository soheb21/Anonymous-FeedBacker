import { z } from "zod"

export const MessageSchema = z.object({
    content: z.string()
        .min(10, { message: "Content must be atleast 10 characters" })
        .max(300, { message: "content must be no longer then 300 characters" })
})