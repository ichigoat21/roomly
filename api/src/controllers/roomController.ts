import { Request, Response } from "express";
import { handleRoomCreate, handleRoomJoin } from "../services/room.Service";
import { roomValidation } from "../validation/room.Types";

export const createRoomHandler = async (req: Request, res: Response) => {
    const parsedData = roomValidation.safeParse(req.body)
    if (!parsedData.success) {
        res.status(403).json({ message: "Please provide a valid room name" })
        return
    }
    try {
        const slug = parsedData.data.slug
        const userId = req.userId!
        const roomId = await handleRoomCreate(userId, slug)
        res.status(201).json({ room: roomId })
    } catch {
        res.status(500).json({ message: "Something went wrong" })
    }
}

export const joinRoomHandler = async (req: Request, res: Response) => {
    try {
        const userId = req.userId!
        const roomId = Number(req.params.id)

        if (isNaN(roomId)) {
            return res.status(400).json({ message: "Invalid room ID" })
        }

        // Returns slug, messages, members, currentUserId, currentUserName, currentUserAvatar
        const data = await handleRoomJoin(userId, roomId)
        return res.status(200).json(data)
    } catch (err: any) {
        if (err.message === "Room not found") {
            return res.status(404).json({ message: "Room not found" })
        }
        console.error(err)
        return res.status(500).json({ message: "Something went wrong" })
    }
}