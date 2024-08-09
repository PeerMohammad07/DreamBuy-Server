import { Server,Socket } from "socket.io";

interface socketUser {
  id:string
  socketId:string
}

export default function socketConnection(server:any){

  let users:socketUser[] = []
  const addUser = (id:string,socketId:string)=>{
    !users.some(users=> users.id==id)&&users.push({id,socketId})
  }

  const removeUser = (socketId:string)=>{
    users = users.filter(user=> user.socketId!=socketId)
  }

  const getUser = (id:string)=>{
    for(let i=0;i<users.length;i++){
      if(users[i].id==id){
        return users[i]
      }
    }
  }


  const io=new Server(server,{
    cors:{
        origin:"*", 
    },
  })

  io.on("connection",(socket:Socket)=>{
    console.log("socket connected succesfully",socket.id)

    socket.on('addUser',(id)=>{
      addUser(id,socket.id)
      console.log(users,"user")
    })
    
    socket.emit('getUser',users)

    socket.on('message',(message,id)=>{
      const user = getUser(id)
      if(!user){return}
      io.to(user.socketId).emit("messageContent",message)
    })

    socket.on("disconnect",()=>{
      console.log("socket io disconnected")
      removeUser(socket.id)
      io.emit('removeUser',users)
    })
  })
}
