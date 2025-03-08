import express from 'express'
import userAuth from '../Middleware/userauth.js'
import { getUserDetails } from '../controllers/user_controller.js'

const userRouter=express.Router()

userRouter.get('/data',userAuth,getUserDetails);
export default userRouter;