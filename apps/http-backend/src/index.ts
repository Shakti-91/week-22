import express from "express"
import jwt from "jsonwebtoken"
import {JWT_SECRET} from "@repo/backend-common/secret" 
import { auth } from "./middleware.js";
import {CreateUserSchema,SignInSchema,RoomSchema} from "@repo/common/zodSchem"
import {prismaClient} from "@repo/db/client"
const app=express();
app.use(express.json());

app.post('/signup',async(req,res)=>{
  
     const parsedData=CreateUserSchema.safeParse(req.body);
     
    if(!parsedData.success){
      console.log(parsedData.error);
        return res.status(411).json({message:"invalid input"})

    }
    try{
      //hash the password
    const user= await prismaClient.user.create({
      data:{
        email:parsedData.data?.username,
        password:parsedData.data.password,
        name:parsedData.data.name
      }
    })

     return res.json(user.id);
  }catch(e){
    console.log(e);
    return res.status(411).json({message:"user already exsist"});
  }
})

app.post('/signin',async(req,res)=>{
    const parsedData=SignInSchema.safeParse(req.body);

    if(!parsedData.success){
        return res.status(411).json({message:"invalid input"})
    }
   
   try{
   const user= await prismaClient.user.findFirst({
      where:{
        email:parsedData.data.username,
        password:parsedData.data.password
      }
    })
    if(!user){
      return res.status(403).json({message:"user not authorized"});
    }

    const token =jwt.sign({userId:user.id},JWT_SECRET);

    return res.json({token:token});
   }catch(e){
    console.log(e);
    return res.json({message:"kuch to gadbad hai"})
   }
})

app.post('/room',auth,async(req,res)=>{
     const parsedData=RoomSchema.safeParse(req.body);
     if(!parsedData.success){
      return res.json({message:"invalid input"});

     }

     try{
      //@ts-ignore
      const userId=req.userId;
      const room =await prismaClient.room.create({
        data:{
          slug:parsedData.data.roomName,
          adminId:userId
        }
      })

      return res.json({roomId:room.id});
     }catch(e){
      console.log(e);
      return res.json("room already exsist")
     }
})

app.post("/test",(req,res)=>{
    return res.json({message:"hi there"})
})

app.listen(3001)