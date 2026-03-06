 import  { Request, Response, NextFunction } from "express"; 
import { JWT_SECRET } from '@repo/backend-common/secret'
import jwt from "jsonwebtoken"
export function auth(req:Request,res:Response,next:NextFunction){
    const token=req.headers.authorization;
     
    if(!token){

        return res.status(411).json({message:"token can not be empty"})
    }
    const decoded=jwt.verify(token,JWT_SECRET)as {userId:string};

    if(!decoded){
        return res.status(411).json({message:"invalid token"});
    }
    //@ts-ignore 
    req.userId=decoded.userId
    next();

}