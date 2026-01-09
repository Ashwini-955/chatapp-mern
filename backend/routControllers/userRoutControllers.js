import User from "../Models/userModels.js";
import bcryptjs from "bcryptjs";
import bcrypt from "bcryptjs";
import jwtToken from "../utils/jwtWebToken.js"
import crypto from "crypto";
import sendEmail from "../utils/sendEmails.js";
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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 10 minutes.</p>
    `;

    await sendEmail({
      to: user.email,
      subject: "Password Reset - ChatApp",
      html: message
    });

    return res.status(200).json({
      success: true,
      message: "Password reset email sent"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = bcrypt.hashSync(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful"
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

