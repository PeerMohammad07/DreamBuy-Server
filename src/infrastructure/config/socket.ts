import { Server, Socket } from "socket.io";

interface SocketUser {
  id: string;
  socketId: string;
}

export default function socketConnection(server: any) {
  let users: SocketUser[] = [];

  const addUser = (id: string, socketId: string) => {
    if (!users.some(user => user.id === id)) {
      users.push({ id, socketId });
    }
  };

  const removeUser = (socketId: string) => {
    users = users.filter(user => user.socketId !== socketId);
  };

  const getUser = (id: string) => {
    return users.find(user => user.id === id);
  };

  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5000","https://dream-buy.vercel.app"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("Socket connected successfully", socket.id);

    socket.on('addUser', (id: string) => {
      addUser(id, socket.id);
      io.emit('getUser', users); // Send updated users list to all clients
    });

    socket.on('message', (message: any, id: string,name:string,senderId) => {
      const user = getUser(id);
      if (user) {
        io.to(user.socketId).emit("messageContent", message);
        io.to(user.socketId).emit("notification",name,senderId)
      }
    });


    socket.on("call:start",({senderId,receiverId})=>{
      const receiverData = getUser(receiverId)
      if(receiverData){
        io.to(receiverData.socketId).emit("call:start",senderId)
      }
    })

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      removeUser(socket.id);
      io.emit('removeUser', users); // Send updated users list to all clients
    });
  });
}
