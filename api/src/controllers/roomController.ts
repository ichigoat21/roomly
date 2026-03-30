import { Request, Response } from "express";
import { handleRoomCreate, handleRoomJoin } from "../services/room.Service";
import { roomValidation } from "../validation/room.Types";



export const createRoomHandler = async (req : Request, res : Response)=> {
   const parsedData = roomValidation.safeParse(req.body)
   if(!parsedData.success){
        res.status(403).json({message : "Please provide right name"})
        return
   }
   try {
    const slug = parsedData.data.slug
    const userId = req.userId!
    
    const room = await handleRoomCreate(userId, slug)
    res.status(201).json({room})
   } catch {
    res.status(500).json({message : "Something went wrong"})
   }
}

export const joinRoomHandler = async (req : Request, res : Response)=>{
    try {
        const userId = req.userId!
        console.log(req.params.id)
        const roomId = Number(req.params.id)
        console.log(roomId)

        const memberId = await handleRoomJoin(userId, roomId)
        return res.status(200).json({memberId})
    } catch (err){
        return res.status(500).json({message : "Something went wrong"})
    }
}