import WebSocket, {WebSocketServer} from "ws"
import jwt, { JwtPayload } from "jsonwebtoken"
import {JWT_SECRET} from "@repo/backend-common/secret"
import { json } from "express"
import {prismaClient} from "@repo/db/client"

const wss=new WebSocketServer({port:8080})

function checkUser(token :string):string | null{

    try{const decoded=jwt.verify(token,JWT_SECRET)
    
    if(!decoded ||!(decoded as JwtPayload).userId){
        
        return null ;
    }
    
    return (decoded as JwtPayload).userId;
}catch(e){
    console.log(e);
    return null;
}

return null
    

}

type User={
    userId:string,
    Rooms:string[],
    ws:WebSocket
}

const Users:User[]=[];

wss.on('connection', function connection(ws,request){
    const url=request.url;
    
    if(!url){
        return ;
    }
    
    const queryParms=new URLSearchParams(url?.split('?')[1]);
    const token =queryParms.get('token') ?? "";
    
    const userId=checkUser(token);
    
    if(!userId){

        ws.close()
        return ;
    }

    Users.push({
        userId,
        Rooms:[],
        ws
    })

    ws.on('message',async function  message(data){
          const parsedData=JSON.parse(data as unknown as  string);

          if(parsedData.type =="join_room"){
            const user =Users.find(x=>x.ws===ws)
            user?.Rooms.push(parsedData.roomId);
            
          }

          if(parsedData.type =="leave_room"){
            const user=Users.find(x=>x.ws==ws)
            if(!user)return
            user.Rooms=user.Rooms.filter(x=>x!==parsedData.roomId);
          }

          
          if(parsedData.type =="chat"){
             const roomId=parsedData.roomId
            const message=parsedData.message
            
            await prismaClient.chat.create({
                data:{
                    roomId,
                    message,
                    userId
                }
            })
            
            
            Users.forEach(user=>{
                if(user.Rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                       type:"chat",
                       message,
                       roomId 
                    }))
                }
            })
          }
    })

})