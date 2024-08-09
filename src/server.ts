import { createServer } from "http";
import app from "./infrastructure/config/app";
import connectDB from "./infrastructure/config/db";
import socketConnection from "./infrastructure/config/socket";

let PORT: string = process.env.PORT!;

const httpServer = createServer(app)

// database connection
connectDB();

// socket connection 
socketConnection(httpServer)

// create server
httpServer.listen(PORT, () => console.log("http://localhost:3000"));
