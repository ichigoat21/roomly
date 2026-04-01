import { client } from "../lib/lib";
import bcrypt from "bcrypt"
import { generateRandomString } from "../config/username";
import { generateJWT } from "../lib/jwt";
import { Profile } from "passport";






export async function handleGoogleAuth(profile: Profile) {
    const email = profile.emails?.[0]?.value;

    if (!email) {
        throw new Error("No email found in Google profile");
    }

    let user = await client.users.findUnique({
        where: { email }
    });

    let isNewUser = false;

    if (!user) {
        user = await client.users.create({
            data: {
                email,
                username: generateRandomString(),
            }
        });
        isNewUser = true;
    }

    const token = generateJWT(user.id);

    return { token, isNewUser };
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
        const token = generateJWT(user.id)
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

    const token = generateJWT(user.id)

    return { success: true, token };
}

