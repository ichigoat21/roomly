import express from "express"
import authRouter from "./routes/auth.Routes"
import "./config/passport"


const app = express()

app.use(express.json())
app.use('/auth', authRouter)

app.listen(3000, ()=> {console.log("Server Up")})