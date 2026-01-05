import express from "express";
import isLogin from '../middlewares/isLogin.js'
import { getUserBySearch,getCurrentChatters } from "../routControllers/userHandleController.js";

const router =express.Router()

router.get('/search',isLogin,getUserBySearch);
router.get('/currentchatters',isLogin,getCurrentChatters);
export default router