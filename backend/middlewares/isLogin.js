import jwt from "jsonwebtoken";
import User from "../Models/userModels.js";

const isLogin = async (req, res, next) => {
  console.log("Cookies:", req.cookies);
console.log("Auth Header:", req.headers.authorization);

  try {
    const token =
      req.cookies?.jwt ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User unauthorized"
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    req.user = user;   // ✅ real user object
    next();

  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

export default isLogin;
