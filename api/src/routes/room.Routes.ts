import { Router } from "express";
import { createRoomHandler } from "../controllers/roomController";

const roomRouter = Router()

roomRouter.post("/create", createRoomHandler)

export default roomRouter