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
    avatar: string | null
}

const users: User[] = []

const decodeToken = (token: string): string | null => {
    try {
        const payload = jwt.verify(token, process.env.SECRET!) as JwtPayload
        return payload.userId ?? null
    } catch (err) {
        console.log("[WS] Token decode failed:", err)
        return null
    }
}

export function initWebsocket(wss: WebSocketServer) {
    wss.on("connection", async (ws, request) => {
        const url = request.url
        const queryParams = new URLSearchParams(url?.split("?")[1])
        const token = queryParams.get("token")

        console.log("[WS] New connection attempt")

        const userId = token ? decodeToken(token) : null

        if (!userId) {
            console.log("[WS] Invalid token — closing")
            ws.close(1008, "Unauthorized")
            return
        }

        // ── Fetch real user data from DB on connect ────────────────────────
        // JWT only carries userId — username and avatar live in the DB
        let dbUser: { username: string; avatar: string | null } | null = null
        try {
            dbUser = await client.users.findUnique({
                where: { id: userId },
                select: { username: true, avatar: true },
            })
        } catch (err) {
            console.log("[WS] DB fetch failed on connect:", err)
        }

        if (!dbUser) {
            console.log("[WS] User not found in DB — closing")
            ws.close(1008, "User not found")
            return
        }

        console.log("[WS] Authenticated:", userId, "as", dbUser.username)

        const user: User = {
            ws,
            rooms: [],
            userId,
            userName: dbUser.username,
            avatar: dbUser.avatar,
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
                console.log("[WS] Joined room:", parsedData.roomID, "| rooms:", user.rooms)
            }

            if (parsedData.type === "leave") {
                user.rooms = user.rooms.filter(r => r !== parsedData.roomID)
                console.log("[WS] Left room:", parsedData.roomID)
            }

            if (parsedData.type === "chat") {
                console.log("[WS] Chat in room:", parsedData.roomID, "msg:", parsedData.message)

                let savedId: string = `${Date.now()}`

                try {
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
                    console.log("[WS] DB save error:", err)
                }

                const timestamp = new Date().toISOString()

                // ── Broadcast includes avatar so frontend can render it ─────
                const payload = JSON.stringify({
                    type: "chat",
                    id: savedId,
                    senderId: user.userId,
                    senderName: user.userName,
                    senderAvatarUrl: user.avatar ?? null,
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