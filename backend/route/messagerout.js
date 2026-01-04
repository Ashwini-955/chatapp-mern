import express from "express";
import { sendMessage,getMessage } from "../routControllers/messageRoutControllers.js";
import isLogin from "../middlewares/isLogin.js";
const router =express.Router();

router.post('/send/:id',isLogin,sendMessage)

router.get('/:id',isLogin,getMessage)
export default router