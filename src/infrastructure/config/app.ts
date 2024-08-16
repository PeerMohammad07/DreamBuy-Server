import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import userRouter from "../routes/userRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";
import sellerRouter from "../routes/sellerRoutes";
import adminRouter from "../routes/adminRoutes";
import job from "../utils/cronJob";
import chatRouter from "../routes/chatRoutes";
import path from "path";
import {EventEmitter} from "events";

const app = express();

EventEmitter.setMaxListeners(20)

// config dotenv
dotenv.config();

// Use morgan middleware to log HTTP requests
app.use(morgan("dev"));

// Setting Cors
app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  })
);

// Cookie Parser
app.use(cookieParser());

// Url encoding
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/api", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/chat",chatRouter)

job.start()


export default app;
