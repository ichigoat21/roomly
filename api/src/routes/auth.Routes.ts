import { Router } from "express"
import passport from "passport"
import { googleCallback } from "../controllers/authController"

const authRouter = Router()

authRouter.get("/google", 
    passport.authenticate("google", {
        scope : ["email", "profile"],
        session : false
    })
)

authRouter.get("/google/callback", 
    passport.authenticate("google", {
        failureRedirect : "/login",
        session : false
    }),
    googleCallback
)

export default authRouter