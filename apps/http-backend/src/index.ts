import express from "express"
import jwt from "jsonwebtoken"
import {JWT_SECRET} from "@repo/backend-common/secret" 
import { auth } from "./middleware.js";
import {CreateUserSchema,SignInSchema,RoomSchema} from "@repo/common/zodSchem"
const app=express();
app.use(express.json());

app.post('/signup',(req,res)=>{
     const data=CreateUserSchema.safeParse(req.body);

    if(!data.success){
        return res.status(411).json({message:"invalid input"})
    }
     return res.json({message:"you are signed up"})
})

app.post('/signin',(req,res)=>{
    const data=SignInSchema.safeParse(req.body);

    if(!data.success){
        return res.status(411).json({message:"invalid input"})
    }

   const token = jwt.sign('123',JWT_SECRET);

    return res.json({token:token});
})

app.get('/hi',auth,(req,res)=>{
    const data=RoomSchema.safeParse(req.body);

    if(!data.success){
        return res.status(411).json({message:"invalid input"})
    }
    return res.json({message:"hi"})
})

app.listen(3001)