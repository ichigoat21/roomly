import { Router } from "express"
import passport from "passport"
import { googleCallback, Signin, Signup } from "../controllers/authController"

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

authRouter.post("/signup", Signup)
authRouter.post("/signin", Signin)

export default authRouter