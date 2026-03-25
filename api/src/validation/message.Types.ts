import { z } from "zod"

const messageValidation = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("join"),
    roomId: z.string()
  }),
  z.object({
    type: z.literal("leave"),
    roomId: z.string()
  }),
  z.object({
    type: z.literal("chat"),
    roomId: z.string(),
    message: z.string().min(1).max(500)
  })
])

export default messageValidation