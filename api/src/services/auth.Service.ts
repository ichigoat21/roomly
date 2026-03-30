import { client } from "../lib/lib";
import jwt from "jsonwebtoken"
import { config } from "dotenv";
import bcrypt from "bcrypt"


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

export async function handleSignup(username : string, password : string, email : string){
    try {
        const hashedPass = await bcrypt.hash(password, 10)
        const user = await client.users.create({
            data : {
                username, 
                password : hashedPass, 
                email
            }
        })
        if(!user){
            return {success : false, message : "Auth Failed"}
        }
        const token = jwt.sign({
            userId : user.id
        }, process.env.SECRET!)
        return token
    } catch(err){
        return {success : false, message : err}
    }
   
}

export async function handleSignin(email: string, password: string) {
    const user = await client.users.findUnique({
        where: { email }
    });

    if (!user) {
        return { success: false, message: "Wrong Email" };
    }

    const pass = await bcrypt.compare(password, user.password!);

    if (!pass) {
        return { success: false, message: "Wrong Password" };
    }

    const token = jwt.sign(
        { userId: user.id },
        process.env.SECRET!
    );

    return { success: true, token };
}

