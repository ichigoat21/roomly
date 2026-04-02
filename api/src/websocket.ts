import { WebSocketServer } from "ws"
import { initWebsocket } from "./websockets/server"


const wss = new WebSocketServer({port : 8080})
initWebsocket(wss)
