import { z } from "zod"

const messageValidation = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("join"),
    roomID: z.string()
  }),
  z.object({
    type: z.literal("leave"),
    roomID: z.string()
  }),
  z.object({
    type: z.literal("chat"),
    roomID: z.string(),
    message: z.string().min(1).max(500)
  })
])

export default messageValidation