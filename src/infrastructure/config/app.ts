import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import userRouter from '../routes/userRoutes'
import cors from "cors"
import cookieParser from 'cookie-parser'
import sellerRouter from '../routes/sellerRoutes'

const app = express()

// config dotenv
dotenv.config()

// Use morgan middleware to log HTTP requests
app.use(morgan('dev'))

// Setting Cors
app.use(cors({
  origin:"http://localhost:5000",
  credentials:true
}))

// Cookie Parser
app.use(cookieParser())

// Url encoding
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({extended:true,limit: '10mb'}))

// Routes
app.use('/api',userRouter)
app.use('/api/seller',sellerRouter)
// app.use('/api/admin',)


export default app