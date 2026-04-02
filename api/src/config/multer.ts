import { v2 as cloudinary } from "cloudinary"
import multer from "multer"
import { config } from "dotenv"
import { Request, Response, NextFunction } from "express"
import { Readable } from "stream"

config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})

// Store file in memory as a Buffer 
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (_req, file, cb) => {
        if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error("Only jpg, png, and webp are allowed"))
        }
    },
})

// Helper: pipe a Buffer into cloudinary's upload_stream
export function uploadToCloudinary(buffer: Buffer, folder = "avatars"): Promise<string> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                transformation: [{ width: 200, height: 200, crop: "fill" }],
                format: "webp", // normalise everything to webp
            },
            (error, result) => {
                if (error || !result) return reject(error ?? new Error("Upload failed"))
                resolve(result.secure_url)
            }
        )
        Readable.from(buffer).pipe(stream)
    })
}