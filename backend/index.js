import express from "express"
import dotenv from "dotenv";
import dbConnect from "./DB/dbConnect.js";
import authRouter from './route/authUser.js'
const app=express();
dotenv.config();
app.get("/",(req,res)=>{
    res.send("working on the server");
})

app.use('/api/auth',authRouter)

const PORT =process.env.PORT||3000 
app.listen("3000",()=>{
    dbConnect();
    console.log(`working at ${PORT}`);
}) 
