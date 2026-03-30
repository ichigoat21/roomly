import { Router } from "express";
import { createRoomHandler, joinRoomHandler } from "../controllers/roomController";

const roomRouter = Router()

roomRouter.post("/create", createRoomHandler)
roomRouter.get("/join/:id", joinRoomHandler)

export default roomRouter