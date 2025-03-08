import userModel from "../models/userModel.js";

export const getUserDetails=async(req,res)=>
{
    const {userId}=req.body;
    try {
        const user=await userModel.findById(userId);
        if(!user)
        {
            return res.json({success:false,message:"no user found"});
        }
        res.json({success:true,
            userDetails:{
                name:user.name,
                isAccountVerified:user.isAccountVerified
            }
        })
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}