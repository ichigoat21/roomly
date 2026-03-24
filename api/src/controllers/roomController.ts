import { Request, Response } from "express";
import { handleRoomCreate } from "../services/room.Service";



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