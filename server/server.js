import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDb from './config/mongodb.js'
import authRouter from './Router/auth-Router.js'
import userRouter from './Router/userRoutes.js'

const app=express();

const  port=process.env.PORT||4000;
connectDb();
app.use(express.json());
app.use(cookieParser());
const allowedOrigins=['http://localhost:5173']

app.use(cors({origin:true,credentials:true}))

app.get('/',(req,res)=>
{
    res.send("API is working");
})

app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.listen(port,()=>console.log(`server is running at http://localhost:${port}`))