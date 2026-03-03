import express from "express"
import jwt from "jsonwebtoken"
import {JWT_SECRET} from "@repo/backend-common/secret" 
import { auth } from "./middleware.js";
import {CreateUserSchema,SignInSchema,RoomSchema} from "@repo/common/zodSchem"
import {prismaClient} from "@repo/db/client"
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

app.get('/hi',async(req,res)=>{
      try {
    const user = await prismaClient.user.create({
      data: {
        name: "shakti",   // or simply name
      },
    });

    console.log("User created:", user);
    return res.json({message:"kuch to huwa"})
  } catch (error) {
    console.error("Error creating user:", error);
    return res.json({message:"error na jare "})
}
})

app.post("/test",(req,res)=>{
    return res.json({message:"hi there"})
})

app.listen(3001)