import { Router } from "express";
import { profileController } from "../controllers/profile.Controller";

const profileRouter = Router()

profileRouter.get("/me", profileController)

export default profileRouter