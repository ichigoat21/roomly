import { Request, Response } from "express"
import { handleProfilePicture, profileHandler, updateProfileHandler } from "../services/me.Service"


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

export const updatedProfileAvatarController = async (req : Request, res : Response)=>{
  let result
  try {
    const avatarUrl = (req.file)?.path
   
    const id = req.userId
    if(!avatarUrl){
      return res.status(403).json({message : "Bad Request"})
    }
    if(!id){
      return res.status(401).json({message : "Something went wrong"})
    }
    result = await handleProfilePicture(avatarUrl, id)
    return  res.status(201).json({image : result.avataredUser?.avatar})
  } catch(err){
    console.log(err)
    return res.status(500).json({message : result?.message})
  }

}