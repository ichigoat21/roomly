import { Request, Response } from "express"
import { profileHandler } from "../services/me.Service"

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