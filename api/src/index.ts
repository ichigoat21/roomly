import express from "express"
import authRouter from "./routes/auth.Routes"
import "./config/passport"
import { authMiddleware } from "./middlewares/auth.Middleware"
import roomRouter from "./routes/room.Routes"
import cors from "cors"
import profileRouter from "./routes/profile.Route"



const app = express()

app.use(express.json())
app.use(cors({
    origin: ["https://roomly-chat.vercel.app", "http://localhost:3001"],
    credentials: true
  }));
app.use('/auth', authRouter)
app.use("/rooms", authMiddleware, roomRouter)
app.use("/profile", authMiddleware, profileRouter)

app.listen(3000, ()=> {console.log("Server Up")})