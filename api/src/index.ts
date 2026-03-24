import express from "express"
import authRouter from "./routes/auth.Routes"
import "./config/passport"
import { authMiddleware } from "./middlewares/auth.Middleware"
import roomRouter from "./routes/room.Routes"


const app = express()

app.use(express.json())
app.use('/auth', authRouter)
app.use("/room", authMiddleware, roomRouter)

app.listen(3000, ()=> {console.log("Server Up")})