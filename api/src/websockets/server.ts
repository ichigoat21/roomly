import { RawData, WebSocketServer } from "ws"
import WebSocket from "ws"
import jwt, { JwtPayload } from "jsonwebtoken"
import { config } from "dotenv"
import { client } from "../lib/lib"
import messageValidation from "../validation/message.Types"
import { da } from "zod/v4/locales"

config()



interface User {
    ws: WebSocket
    rooms: string[]
    userId: string
    userName: string   
}

const users: User[] = []

const decoded = (token: string): { userId: string; userName: string } | null => {
    try {
        const payload = jwt.verify(token, process.env.SECRET!) as JwtPayload
        // adjust field names here if your JWT payload uses different keys
        return {
            userId: payload.userId,
            userName: payload.username ?? payload.name ?? "Unknown",
        }
    } catch {
        return null
    }
}

export function initWebsocket(wss : WebSocketServer) {
    wss.on("connection", (ws, request) => {
   
    const url = request.url
    const queryParams = new URLSearchParams(url?.split("?")[1])
    console.log(url)
    const token = queryParams.get("token")

    const identity = token ? decoded(token) : null

    if (!identity) {
        ws.close()
        return
    }

    const user: User = {
        ws,
        rooms: [],
        userId: identity.userId,
        userName: identity.userName,
    }

    users.push(user)

    ws.on("message", async (data : RawData) => {
        console.log(data.toString())
        let parsedData
        try {
            parsedData = JSON.parse(data.toString())
        } catch {
            console.log("Invalid JSON:", data.toString())
            return
        }

        const result = messageValidation.safeParse(parsedData)
        if (!result.success) {
            console.log("Invalid message:", result.error)
            return
        }
        parsedData = result.data

        if (parsedData.type === "join") {
            if (!user.rooms.includes(parsedData.roomID)) {
                user.rooms.push(parsedData.roomID)
            }
        }

        if (parsedData.type === "leave") {
            user.rooms = user.rooms.filter(r => r !== parsedData.roomID)
        }

        if (parsedData.type === "chat") {
            // Save to DB first so we get the real ID back
            let savedId: string = `${Date.now()}` // fallback if DB insert fails
            try {
                const saved = await client.chats.create({
                    data: {
                        message: parsedData.message,
                        roomId: Number(parsedData.roomID),
                        userId: user.userId,
                    }
                })
                savedId = String(saved.id)
            } catch (err) {
                console.log("DB error:", err)
                // still broadcast even if DB fails — don't silently drop the message
            }

            const timestamp = new Date().toISOString()

            // Broadcast to every other user in the same room
            // Payload includes all fields the client needs to render the message
            const payload = JSON.stringify({
                type: "chat",
                id: savedId,
                senderId: user.userId,
                senderName: user.userName,
                message: parsedData.message,
                roomID: parsedData.roomID,   // consistent casing with client
                timestamp,
            })

            users.forEach(u => {
                if (
                    u.rooms.includes(parsedData.roomID) &&
                    u.ws !== ws &&
                    u.ws.readyState === WebSocket.OPEN
                ) {
                    u.ws.send(payload)
                }
            })
        }
    })

    ws.on("close", () => {
        const index = users.findIndex(u => u.ws === ws)
        if (index !== -1) users.splice(index, 1)
    })
})} 