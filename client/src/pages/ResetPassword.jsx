import React, { useContext, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {

  const {backendUrl}=useContext(AppContent);
  axios.defaults.withCredentials=true;
  const navigate = useNavigate();
   const inputrefs = useRef([])
   const[isEmailSent,setIsEmailSent]=useState('')
   const[otp,setOtp]=useState(0);
   const[isotpSubmitted,setIsOtpSubmitted]=useState(false)

  const [email,setEmail]=useState('');
  const [newpassword,setNewpassword]=useState('')

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputrefs.current.length - 1) {
      inputrefs.current[index + 1].focus();
    }
  };
  const handlekeydown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputrefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputrefs.current[index]) {
        inputrefs.current[index].value = char;
      }
    });
    
    inputrefs.current[pasteArray.length - 1].focus();
  };

  const SendOtptoEmail=async(e)=>
  {
    e.preventDefault();
    try {
      
      const {data}=await axios.post(backendUrl+'/api/auth/send-reset-otp',{email})
      if(data.success)
      {
        setIsEmailSent(true)
        toast.success(data.message);
      }
      else{
        toast.error(data.message);
      }

    } catch (error) {
       toast.error(error.message)
    }
  }
const submitOtp=async(e)=>
{  e.preventDefault()
    const otpArray=inputrefs.current.map(e=>e.value)
    setOtp(otpArray.join(''));
    setIsOtpSubmitted(true);
    
}

const onSubmitNewPassword=async(e)=>
{

  e.preventDefault()
      try {
          const {data}=await axios.post(backendUrl+'/api/auth/reset-password',{email,otp,newpassword})
          if(data.success)
          {
            toast.success(data.message);
            navigate('/login');
          }
          else{
            toast.error(data.message)
          }
      } catch (error) {
        toast.error(error.message)
      }
}
  return (
    <div className="flex justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-100 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

     {!isEmailSent &&
      <form onSubmit={SendOtptoEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h2 className="text-white text-2xl font-semibold text-center mb-4">
          ResetPassword
        </h2>
        <p className="text-center mb-6 text-indigo-300">
          Enter email to reset pasword
        </p>
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <img src={assets.mail_icon} alt=""  className="w-3 h-3"/>
          <input type="email"  
          placeholder="Enter Email" 
          className="outline-none text-white bg-transparent"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
          
          />

        </div>
        <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 cursor-pointer">Submit</button>

      </form>
}


{!isotpSubmitted && isEmailSent && 

      <form  onSubmit={submitOtp} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h2 className="text-white text-2xl font-semibold text-center mb-4">
          Email Reset Otp
        </h2>
        <p className="text-center mb-6 text-indigo-300">
          
          Enter 6 digit otp sent to your registerd mail
        </p>
        <div className="flex justify-between mb-8 " onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                required
                key={index}
                className="sm:w-12 sm:h-12 w-10 h-10 rounded-md text-center text-white text-xl bg-[#333A5C]"
                ref={(e) => (inputrefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handlekeydown(e, index)}
              />
            ))}
        </div>
        <button className="w-full text-white bg-gradient-to-r from-indigo-500 to-indigo-900 py-2.5">
          submit
        </button>
      </form>
}
{isEmailSent && isotpSubmitted && 
      <form  onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h2 className="text-white text-2xl font-semibold text-center mb-4">
          ResetPassword
        </h2>
        <p className="text-center mb-6 text-indigo-300">
          Enter newpassword
        </p>
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <img src={assets.lock_icon} alt=""  className="w-3 h-3"/>
          <input type="password"  
          placeholder="password" 
          className="outline-none text-white bg-transparent"
          value={newpassword}
          onChange={(e)=>setNewpassword(e.target.value)}
          required
          
          />

        </div>
        <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 cursor-pointer">Submit</button>

      </form>
}
    </div>
  );
};

export default ResetPassword;
