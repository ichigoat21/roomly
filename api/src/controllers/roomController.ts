import { Request, Response } from "express";
import { handleRoomCreate, handleRoomJoin } from "../services/room.Service";



export const createRoomHandler = async (req : Request, res : Response)=> {
   try {
    const userId = req.userId!
    const slug = req.body.slug
    const room = await handleRoomCreate(userId, slug)
    res.status(201).json({room})
   } catch {
    res.status(500).json({message : "Something went wrong"})
   }
}

export const joinRoomHandler = async (req : Request, res : Response)=>{
    try {
        const userId = req.userId!
        const roomId = req.body.roomId

        const memberId = handleRoomJoin(userId, roomId)
        res.json(200).json({memberId})
    } catch (err){
        res.status(500).json({message : "Something went wrong"})
    }
}