import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transport from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';

export const Register=async(req,res)=>
{
    const {name,email,password}=req.body;
    if(!name || !email ||!password)
    {
        return res.json({success:false,message:'Missing details'});
    }
    try {
        
        const existingUser=await userModel.findOne({email});
        if(existingUser)
        {
            return res.json({success:false,message:'User Already exists'})
        }

        const hashedPassword=await bcrypt.hash(password,10);
        const user=new userModel({name,email,password:hashedPassword})
        await user.save();

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24*60*60*1000
        });

        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:'welcome to my website',
            text:`Helo ${name}Your account is created with id:${email}`
        }
        await transport.sendMail(mailOptions);

        return res.json({success:true})

    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}
export const login=async(req,res)=>
{
    const {email,password}=req.body;
    if(!email || !password)
    {
        return res.json({success:false,message:'Both mail and password are needed'});
    }
    try {
        const user=await userModel.findOne({email})

        if(!user)
        {
            return res.json({success:false,message:'No user found'})
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch)
        {
            return res.json({success:false,message:'Invalid password'});
        }

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24*60*60*1000
        });

        return res.json({success:true})

    } catch (error) {
        return res.json({success:false,message:error.message})
    }

    
}
export const logout=async(req,res)=>
{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
        })

        return res.json({success:true,message:'Logged Out'})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}
export const sendVerifyOtp=async(req,res)=>{
    try {
        
         const {userId}=req.body;
         const user=await userModel.findById(userId)
         if(user.isAccountVerified)
         {
            return res.json({success:false,message:'Account Already verified'})
         }
               const otp=String(Math.floor(100000+Math.random()*900000))
               user.verifyOtp=otp;
               user.verifyOtpExpireAt=Date.now()+24*60*60*1000;
               await user.save();

               const mailOptions={
                from:process.env.SENDER_EMAIL,
                to:user.email,
                subject:'Otp for Account Verification',
                // text:`Your Otp for Account verification :  ${otp}`
                html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)

               }

               await transport.sendMail(mailOptions);
               return res.json({success:true,message:'Verify Otp sent Successfully'})
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}

export const verifyEmail=async(req,res)=>
{
   
    const {userId,otp}=req.body;
    if(!userId || !otp)
    {
        return res.json({success:false,message:'Missing details'});
    }
    try {
        
        const user=await userModel.findById(userId);

        if(user.verifyOtp==='' || user.verifyOtp!==otp)
        {
            return res.json({success:false,message:"Invalid otp"})
        }
        if(user.verifyOtpExpireAt<Date.now())
        {
                 return res.json({success:false,message:'Otp expired'});
        }

        user.isAccountVerified=true;
        user.verifyOtp='';
        user.verifyOtpExpireAt=0;
        await user.save();
        return res.json({success:true,message:"account verified successfully"})
        
    } catch (error) {
        return res.json({success:false,message:error.message})

    }
}

// to check wether the user is authenticated or not 
export const isAuthenticated=async(req,res)=>
{
    try {
        return res.json({success:true})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}


export const sendResetOtp=async(req,res)=>
{
    const {email}=req.body;
    if(!email)
    {
        return res.json({success:false,message:'Mail id is needed'})
    }
    try {
        const user=await userModel.findOne({email});
        if(!user)
        {
            return res.json({success:false,message:'No user found'});
        }
       // const otp=String(Math.floor(100000+Math.random()*900000));
        const otp=String(Math.floor(100000+Math.random()*900000))
        
        user.resetOtp=otp
        user.resetOtpExpireAt=Date.now()*15*60*1000;
        
        await user.save();
        const mailoptions={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Password reset Otp',
            // text:`Your otp for password resetting :  ${otp}`
            html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)

        }
    
        
        await transport.sendMail(mailoptions);

        return res.json({success:true,message:'reset password otp sent successfully'})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
    
}

export const ResetPassword=async(req,res)=>
{
        const {email,otp,newpassword}=req.body;

        if(!email || !otp || !newpassword)
        {
            return res.json({success:false,message:'email ,otp ans new password required'})
        }
        try {
            const user=await userModel.findOne({email});
            if(!user)
            {
                return res.json({success:false,message:'No user found '})
            }
            if(user.resetOtp==='' || user.resetOtp!==otp)
            {
                return res.json({success:false,message:'Invalid Otp'})
            }
            if(user.resetOtpExpireAt<Date.now())
            {
                return res.json({success:false,message:'Otp expired'})
            }
            const hashedPassword=await bcrypt.hash(newpassword,10);
            user.password=hashedPassword;
            user.resetOtp='';
            user.resetOtpExpireAt=0;
            await user.save();
            return res.json({success:true,message:"Password reset successfully"})

        } catch (error) {
            return res.json({success:false,message:error.message});
        }
}