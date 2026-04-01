import { Router } from "express";
import { profileController, updatedProfileAvatarController, updateProfileController } from "../controllers/profile.Controller";
import { upload } from "../config/multer";

const profileRouter = Router()

profileRouter.get("/me", profileController)
profileRouter.patch("/change", updateProfileController)
profileRouter.post("/avatar", upload.single("avatar"),updatedProfileAvatarController )

export default profileRouter