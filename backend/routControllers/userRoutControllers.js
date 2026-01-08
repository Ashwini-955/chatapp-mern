import User from "../Models/userModels.js";
import bcryptjs from "bcryptjs";
import jwtToken from "../utils/jwtWebToken.js"
export const userRegister = async (req, res) => {
  try {
    const { fullname, username, email, gender, password, profilepic } = req.body;

    const userExist = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (userExist) {
      return res.status(409).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    const hashPassword = bcryptjs.hashSync(password, 10);

    const profileBoy =
      profilepic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const profileGirl =
      profilepic || `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await User.create({
      fullname,
      username,
      email,
      password: hashPassword,
      gender,
      profilepic: gender === "male" ? profileBoy : profileGirl,
    });

    jwtToken(newUser._id, res);

    res.status(201).json({
      success: true,
      id: newUser._id,
      fullname: newUser.fullname,
      username: newUser.username,
      profilepic: newUser.profilepic,
      email: newUser.email,
      message: "Registration successful",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email does not exist",
      });
    }

    const isMatch = bcryptjs.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    jwtToken(user._id, res);

    res.status(200).json({
      success: true,
      id: user._id,
      fullname: user.fullname,
      username: user.username,
      profilepic: user.profilepic,
      email: user.email,
      message: "Successfully logged in",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


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
