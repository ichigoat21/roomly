import { Request, Response } from "express"
import { handleGoogleAuth } from "../services/auth.Service"

export const googleCallback = async (req : Request, res : Response)=> {
    try {
        const profile = req.user 
        console.log(profile)
        const token =  await handleGoogleAuth(profile)
        res.json({token})
    } catch(err) {
        res.status(500).json({message : "Sorry Auth Failed"})
        console.log(err)
    }
}