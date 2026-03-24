import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { config } from "dotenv";

config()


export const authMiddleware = (req : Request, res : Response, next : NextFunction)=>{
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" })
    }

    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.SECRET!) as {userId : string}
        req.userId = decoded.userId
        next()
    } catch(err) {
        res.status(500).json({message: "Something went wrong"})
        console.log(err)
    }
}