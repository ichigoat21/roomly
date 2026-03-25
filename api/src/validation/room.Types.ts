import z from "zod"

export const roomValidation = z.object({
    slug : z.string()
})