import express from "express"
import authRouter from "./routes/auth.Routes"
import "./config/passport"
import { authMiddleware } from "./middlewares/auth.Middleware"
import roomRouter from "./routes/room.Routes"
import cors from "cors"
import profileRouter from "./routes/profile.Route"
import { createServer } from "http"
import { WebSocketServer } from "ws"
import { initWebsocket } from "./websockets/server"


const app = express()
const server = createServer(app)
const wss = new WebSocketServer({server})
initWebsocket(wss)

app.use(express.json())
app.use(cors({
    origin: "https://roomly-chat.vercel.app",
    credentials: true
  }));
app.use('/auth', authRouter)
app.use("/rooms", authMiddleware, roomRouter)
app.use("/profile", authMiddleware, profileRouter)

server.listen(3000, ()=> {console.log("Server Up")})