import express from "express"
import dotenv from "dotenv";
import dbConnect from "./DB/dbConnect.js";
import authRouter from './route/authUser.js'
import messageRouter from './route/messagerout.js'
import cookieParser from "cookie-parser";
const app=express();
dotenv.config();
app.get("/",(req,res)=>{
    res.send("working on the server");
})
app.use(express.json());
app.use(cookieParser())
app.use('/api/auth',authRouter)
app.use('/api/message',messageRouter)

const PORT =process.env.PORT||3000 
app.listen("3000",()=>{
    dbConnect();
    console.log(`working at ${PORT}`);
}) 
