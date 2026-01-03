import User from "../Models/userModels.js";
import bcryptjs from "bcryptjs";
export const userRegister=async(req,res)=>{
    try {
       const{fullname,username,email,gender,password,profilepic }=req.body;
        const user = await User.findOne({username,email})
        if(user) return res.status(500).send({success:false,message:"Username or email already exist"});
        const hashPassword=bcryptjs.hashSync(password,10);
        const profileBoy =profilepic||`https://avatar.iran.liara.run/public/boy?username=${username}`;
        const profileGirl =profilepic||`https://avatar.iran.liara.run/public/girl?username=${username}`;
        const newUser= new User({
            fullname,
            username,
            email,
            password:hashPassword,
            gender,
            profilepic: gender===male?profileBoy:profileGirl
        })
        if(newUser){
            await newUser.save();
        }else{
            res.status(500).send({success:false,message:"Invalid user data"})
        }
        res.status(201).send({
            id:newUser._id,
            fullname:newUser.fullname,
            username:newUser.username,
            profilepic:newUser.profilepic,
            email:newUser.email,
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:error
        })
        console.log(error);
    }
}