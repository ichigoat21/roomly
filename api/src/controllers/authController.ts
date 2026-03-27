import { Request, Response } from "express"
import { handleGoogleAuth, handleSignin, handleSignup } from "../services/auth.Service"
import { userValidator } from "../validation/auth.Types"

export const googleCallback = async (req : Request, res : Response)=> {
    try {
        const profile = req.user 
        console.log(profile)
        const {token} =  await handleGoogleAuth(profile)
        res.redirect(`http://localhost:3001/dashboard?token=${token}`)
    } catch(err) {
        res.status(500).json({message : "Sorry Auth Failed"})
        console.log(err)
    }
}

export const Signup = async (req : Request, res : Response)=>{
    try {
        const parsedData = userValidator.safeParse(req.body)
        if(!parsedData.success){
            return res.status(403).json({message : "Wrong Inputs"})
        }
        const username = parsedData.data?.username
        const password = parsedData.data?.password
        const email = parsedData.data?.email
        const token= await handleSignup(username, password, email);
        res.status(201).json({message : "Signup Complete", token})
    } catch(err) {
        res.status(500).json({message : "Sorry Auth Failed"})
        console.log(err)
    }
}
export const Signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const result = await handleSignin(email, password);

        if (!result.success) {
            return res.status(401).json({ message: result.message });
        }

        return res.status(200).json({
            message: "Successfully Signed In",
            token: result.token
        });

    } catch (err) {
        return res.status(500).json({ message: "Sorry Auth Failed" });
    }
};