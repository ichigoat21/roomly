import {v2 as cloudinary} from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import multer from "multer"
import { config } from "dotenv"

config()

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.API_KEY,
    api_secret : process.env.API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params : { folder: "avatars", allowed_formats: ["jpg", "png", "webp"], transformation: [{ width: 200, height: 200, crop: "fill" }] } as any
})

export const upload = multer({storage})

