import { WebSocketServer } from "ws"
import WebSocket from "ws"
import jwt, { JwtPayload } from "jsonwebtoken"
import { config } from "dotenv"
import { client } from "../lib/lib"

config()

const wss = new WebSocketServer({ port: 8080 })

interface User {
    ws: WebSocket
    rooms: string[]
    userId: string
}

const users: User[] = []

const decoded = (token: string) => {
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET!) as JwtPayload
        console.log(decodedToken.userId)
        return decodedToken.userId

    } catch {
        return null
    }
}

wss.on("connection", (ws, request) => {
    const url = request.url
    const queryParams = new URLSearchParams(url?.split("?")[1])
    const token = queryParams.get("token")


    const userId = token ? decoded(token) : null
    console.log("Incoming connection:", request.url)
    console.log("Token:", token)
    console.log("UserId:", userId)

    if (!userId) {
        ws.close()
        return
    }

    const user: User = {
        ws,
        rooms: [],
        userId
    }

    users.push(user)

    ws.on("message", async (data) => {
        let parsedData;

         try {
         parsedData = JSON.parse(data.toString())
         } catch (err) {
        console.log("Invalid JSON:", data.toString())
        return
         }

        if (parsedData.type === "join") {
            user.rooms.push(parsedData.roomId)
        }

        if (parsedData.type === "leave") {
            user.rooms = user.rooms.filter(r => r !== parsedData.roomId)
        }

        if (parsedData.type === "chat") {
            users.forEach(u => {
                if (
                    u.rooms.includes(parsedData.roomId) &&
                    u.ws !== ws   // exclude sender
                ) {
                    u.ws.send(JSON.stringify({
                        type: "chat",
                        message: parsedData.message,
                        roomId: parsedData.roomId
                    }))
                }
            })
            try {
                await client.chats.create({
                data: {
                    message: parsedData.message,
                    roomId: Number(parsedData.roomId),
                    userId
                }
            })} catch (err){
                console.log(err)
            }
            
        }
    })

    ws.on("close", () => {
        const index = users.findIndex(u => u.ws === ws)
        if (index !== -1) {
            users.splice(index, 1)
        }
    })
})