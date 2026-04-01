import jwt from "jsonwebtoken"
import { config } from "dotenv"

config()

export function generateJWT(user : string){

    const token = jwt.sign({
        userId : user
    }, process.env.SECRET!)
    return token
}