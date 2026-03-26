import z from "zod";

export const userValidator = z.object({
    username : z.string().max(15).min(3),
    password : z.string().max(10).min(2),
    email : z.email()
})