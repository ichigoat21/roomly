import { client } from "../lib/lib";
import jwt from "jsonwebtoken"
import { config } from "dotenv";

config()

export async function handleGoogleAuth(profile : any){
    let user = await client.users.findUnique({
        where : {
            googleId : profile.id
        }
    }) 
    if(!user) {
        user = await client.users.create({
            data : {
                username : profile.displayName,
                email: profile.emails?.[0]?.value,
                googleId : profile.id
            }
        })
    }
    const token = jwt.sign(
        { userId: user.id },
        process.env.SECRET!,
        { expiresIn: "7d" }
      );
    return {user, token}
}