"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = socketConnection;
const socket_io_1 = require("socket.io");
function socketConnection(server) {
    let users = [];
    const addUser = (id, socketId) => {
        if (!users.some(user => user.id === id)) {
            users.push({ id, socketId });
        }
    };
    const removeUser = (socketId) => {
        users = users.filter(user => user.socketId !== socketId);
    };
    const getUser = (id) => {
        return users.find(user => user.id === id);
    };
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: ["http://localhost:5000", "https://dream-buy.vercel.app"],
        },
    });
    io.on("connection", (socket) => {
        console.log("Socket connected successfully", socket.id);
        socket.on('addUser', (id) => {
            addUser(id, socket.id);
            io.emit('getUser', users); // Send updated users list to all clients
        });
        socket.on('message', (message, id, name, senderId) => {
            const user = getUser(id);
            if (user) {
                io.to(user.socketId).emit("messageContent", message);
                io.to(user.socketId).emit("notification", name, senderId);
            }
        });
        socket.on("call:start", ({ senderId, receiverId }) => {
            const receiverData = getUser(receiverId);
            if (receiverData) {
                io.to(receiverData.socketId).emit("call:start", senderId);
            }
        });
        socket.on("disconnect", () => {
            console.log("Socket disconnected");
            removeUser(socket.id);
            io.emit('removeUser', users); // Send updated users list to all clients
        });
    });
}
//# sourceMappingURL=socket.js.map