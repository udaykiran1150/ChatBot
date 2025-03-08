import express from 'express'
import { isAuthenticated, login, logout, Register,ResetPassword,sendResetOtp,sendVerifyOtp, verifyEmail } from '../controllers/auth_controller.js';
import userAuth from '../Middleware/userauth.js';

const authRouter=express.Router();

authRouter.post('/register',Register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/send-verify-otp',userAuth,sendVerifyOtp);
authRouter.post('/verify-account',userAuth,verifyEmail);
authRouter.get('/is-auth',userAuth,isAuthenticated);
authRouter.post('/send-reset-otp',sendResetOtp)
authRouter.post('/reset-password',ResetPassword);


export default authRouter;