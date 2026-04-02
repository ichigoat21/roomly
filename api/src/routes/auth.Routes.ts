import { Router } from "express"
import passport from "passport"
import { googleCallback, Signin, Signup } from "../controllers/authController"

const authRouter = Router()

// Remove the scope from here since it's now in the strategy
authRouter.get("/google", 
    passport.authenticate("google", {
        session : false
    })
)

authRouter.get("/google/callback", 
    passport.authenticate("google", {
        failureRedirect : `${process.env.WEB_URL}/auth`,
        session : false
    }),
    googleCallback
)

authRouter.post("/signup", Signup)
authRouter.post("/signin", Signin)

export default authRouter