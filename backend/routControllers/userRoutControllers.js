import User from "../Models/userModels.js";
import bcryptjs from "bcryptjs";
import jwtToken from "../utils/jwtWebToken.js"
export const userRegister=async(req,res)=>{
    try {
       const{fullname,username,email,gender,password,profilepic }=req.body;
        const user = await User.findOne({
            $or: [{ username }, { email }]
        });

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
            profilepic: gender==="male"?profileBoy:profileGirl
        })

        if(newUser){
            await newUser.save();
            jwtToken(newUser._id,res)
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

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).send({
                success: false,
                message: "Email does not exist"
            });

        const comparePasss=bcryptjs.compareSync(password,user.password||"");
        if(!comparePasss) return res.status(500).send({success:false,message:"Incorrect Password"})
        jwtToken(user._id,res)
        res.status(200).send({
            id:user._id,
            fullname:user.fullname,
            username:user.username,
            profilepic:user.profilepic,
            email:user.email,
            message:"Successfully Login"
        })

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

export const userLogout=async(req,res)=>{
    try {
        res.cookie("jwt",'',{
            maxAge:0
        })
        res.status(200).send({message:"user Logout"})
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}
