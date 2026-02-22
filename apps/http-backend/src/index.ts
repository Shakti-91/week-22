import express from "express"
import jwt from "jsonwebtoken"
import {JWT_SECRET} from "@repo/backend-common/secret" 
import { auth } from "./middleware.js";
const app=express();
app.use(express.json());

app.post('/signup',(req,res)=>{
     const {username,passwrod}=req.body;


     return res.json({message:"you are signed up"})
})

app.post('/signin',(req,res)=>{
    const {username,password}=req.body

   const token = jwt.sign('123',JWT_SECRET);

    return res.json({token:token});
})

app.get('/hi',auth,(req,res)=>{
    return res.json({message:"hi"})
})

app.listen(3001)