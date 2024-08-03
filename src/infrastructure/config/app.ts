import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import userRouter from "../routes/userRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";
import sellerRouter from "../routes/sellerRoutes";
import adminRouter from "../routes/adminRoutes";
import job from "../utils/cronJob";
import amenitiesModal from "../db/amenitiesSchema";

const app = express();

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
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Routes
app.use("/api", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/admin", adminRouter);

job.start()


export default app;
