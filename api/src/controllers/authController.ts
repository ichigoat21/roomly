import { Request, Response } from "express"
import { handleGoogleAuth, handleSignin, handleSignup } from "../services/auth.Service"
import { userValidator } from "../validation/auth.Types"
import { Profile } from "passport";

export const googleCallback = async (req: Request, res: Response) => {
    try {
        const profile = req.user as Profile | undefined;
 
        if (!profile) {
          
            return res.redirect(`${process.env.WEB_URL}/auth`);
        }
 
        const { token, isNewUser } = await handleGoogleAuth(profile);

        res.redirect(
            `${process.env.WEB_URL}/auth/google/callback?token=${token}&isNewUser=${isNewUser}`
        );
 
    } catch (err) {
        console.log(err);
        res.redirect(`${process.env.WEB_URL}/auth`);
    }
};
 
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
        return res.status(201).json({token : token})
    } catch(err) {
        console.log(err)
        return res.status(500).json({message : "Sorry Auth Failed"})
        
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