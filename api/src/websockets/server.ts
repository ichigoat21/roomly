import { RawData, WebSocketServer } from "ws"
import WebSocket from "ws"
import jwt, { JwtPayload } from "jsonwebtoken"
import { config } from "dotenv"
import { client } from "../lib/lib"
import messageValidation from "../validation/message.Types"

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
        console.log(process.env.SECRET)
        return {
            userId: payload.userId,
            userName: payload.username ?? payload.name ?? "Unknown",
        }
    } catch (err) {
        console.log("[WS] Token decode failed:", err)
        return null
    }
}

export function initWebsocket(wss: WebSocketServer) {
    wss.on("connection", (ws, request) => {
        const url = request.url
        const queryParams = new URLSearchParams(url?.split("?")[1])
        const token = queryParams.get("token")

        console.log("[WS] New connection attempt")

        const identity = token ? decoded(token) : null

        if (!identity) {
            console.log("[WS] No identity — closing")
            ws.close(1008, "Unauthorized")
            return
        }

        console.log("[WS] Authenticated:", identity.userId)

        const user: User = {
            ws,
            rooms: [],
            userId: identity.userId,
            userName: identity.userName,
        }

        users.push(user)
        console.log("[WS] Total connected users:", users.length)

        ws.on("message", async (data: RawData) => {
            let parsedData
            try {
                parsedData = JSON.parse(data.toString())
            } catch {
                console.log("[WS] Invalid JSON:", data.toString())
                return
            }

            const result = messageValidation.safeParse(parsedData)
            if (!result.success) {
                console.log("[WS] Validation failed:", result.error.flatten())
                return
            }

            parsedData = result.data
            console.log("[WS] Message type:", parsedData.type, "from:", user.userId)

            if (parsedData.type === "join") {
                if (!user.rooms.includes(parsedData.roomID)) {
                    user.rooms.push(parsedData.roomID)
                }
                console.log("[WS] Joined room:", parsedData.roomID, "| User rooms:", user.rooms)
            }

            if (parsedData.type === "leave") {
                user.rooms = user.rooms.filter(r => r !== parsedData.roomID)
                console.log("[WS] Left room:", parsedData.roomID)
            }

            if (parsedData.type === "chat") {
                console.log("[WS] Chat in room:", parsedData.roomID, "| msg:", parsedData.message)

                let savedId: string = `${Date.now()}`

                try {
                    // Check schema.prisma 
                    const saved = await client.chats.create({
                        data: {
                            message: parsedData.message,
                            roomId: Number(parsedData.roomID),   
                            userId: user.userId,
                        }
                    })
                    savedId = String(saved.id)
                    console.log("[WS] Saved to DB:", savedId)
                } catch (err) {
                    console.log("[WS] DB error (will still broadcast):", err)
                   
                }

                const timestamp = new Date().toISOString()
                const payload = JSON.stringify({
                    type: "chat",
                    id: savedId,
                    senderId: user.userId,
                    senderName: user.userName,
                    message: parsedData.message,
                    roomID: parsedData.roomID,
                    timestamp,
                })

                const targets = users.filter(u =>
                    u.rooms.includes(parsedData.roomID) &&
                    u.ws !== ws &&
                    u.ws.readyState === WebSocket.OPEN
                )
                console.log("[WS] Broadcasting to", targets.length, "users")
                targets.forEach(u => u.ws.send(payload))
            }
        })

        ws.on("close", (code, reason) => {
            console.log("[WS] Closed:", code, reason.toString())
            const index = users.findIndex(u => u.ws === ws)
            if (index !== -1) users.splice(index, 1)
            console.log("[WS] Users remaining:", users.length)
        })

        ws.on("error", (err) => {
            console.log("[WS] Socket error:", err.message)
        })
    })
}