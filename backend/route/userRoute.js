import express from "express";
import isLogin from '../middlewares/isLogin.js'
import { getUserBySearch } from "../routControllers/userHandleController.js";

const router =express.Router()

router.get('/search',isLogin,getUserBySearch)
export default router