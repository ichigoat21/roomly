import { Request, Response } from "express"
import { handleProfilePicture, profileHandler, updateProfileHandler } from "../services/me.Service"
import { uploadToCloudinary } from "../config/multer"


export const profileController = async (req: Request, res: Response) => {
  try {
    const id = req.userId

    if (!id) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const result = await profileHandler(id)

    if (!result.success) {
      return res.status(404).json({ message: result.message })
    }

    return res.status(200).json(result.data)

  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" })
  }
}

export const updateProfileController = async (req : Request, res : Response)=>{
  try {
    const id = req.userId
    if(!id){
      return res.status(403).json({message : "Cannot Process Request"})
    }
    const username = req.body.username
    const avatar = req.body.avatar
    const updatedProfile = updateProfileHandler(id, username, avatar);
    return res.status(201).json({updatedProfile})
  } catch (e){
    res.status(500).json({message : "Something went wrong"})
  }
}

export const updatedProfileAvatarController = async (req: Request, res: Response) => {
  try {
    const id = req.userId
 
    if (!id) {
      return res.status(401).json({ message: "Unauthorized" })
    }
 
    // memoryStorage → file lives in req.file.buffer, not req.file.path
    if (!req.file?.buffer) {
      return res.status(400).json({ message: "No file uploaded" })
    }
 
    // Push buffer straight to cloudinary, get back a secure URL
    const avatarUrl = await uploadToCloudinary(req.file.buffer)
 
    const result = await handleProfilePicture(avatarUrl, id)
 
    if (!result.success) {
      return res.status(500).json({ message: result.message })
    }
 
    return res.status(201).json({ image: result.avataredUser?.avatar })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Failed to upload avatar" })
  }
}