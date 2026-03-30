import { Router } from "express";
import { createRoomHandler, joinRoomHandler } from "../controllers/roomController";

const roomRouter = Router()

roomRouter.post("/create", createRoomHandler)
roomRouter.post("/join/:id", joinRoomHandler)

export default roomRouter