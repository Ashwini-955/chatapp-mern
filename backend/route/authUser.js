import express from "express";
import { userRegister,userLogin,userLogout,forgotPassword } from "../routControllers/userRoutControllers.js";

const router= express.Router();
router.post("/register",userRegister)
router.post("/login",userLogin)
router.post("/logout",userLogout)
router.post("/forgot-password",forgotPassword)
export default router
