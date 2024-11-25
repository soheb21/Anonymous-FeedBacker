import { z } from "zod"

export const AccptMessageSchema = z.object({
    acceptMessages: z.boolean()
})