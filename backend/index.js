import express from "express"
import dotenv from "dotenv";
import dbConnect from "./DB/dbConnect.js";
import authRouter from './route/authUser.js'
import messageRouter from './route/messagerout.js'
import userRouter from './route/userRoute.js'
import cookieParser from "cookie-parser";
import cors from "cors"
import http from "http";
import { initSocket } from "./socket.js";
dotenv.config();
const app = express();
const server = http.createServer(app);

initSocket(server);


app.get("/",(req,res)=>{
    res.send("working on the server");
})
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))
app.use(express.json());
app.use(cookieParser())

app.use('/api/auth',authRouter)
app.use('/api/message',messageRouter)
app.use('/api/user',userRouter)



const PORT =process.env.PORT||3000 
server.listen(PORT, () => {
  dbConnect()
  console.log(`Server running on port ${PORT}`)
})

