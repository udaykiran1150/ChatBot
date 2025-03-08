import React, { useContext, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContent } from "../Context/AppContext";
import { toast } from "react-toastify";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const inputrefs = useRef([]);
  const {backendUrl,getUserData,isLoggedIn,userData}=useContext(AppContent)

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

  const onSubmitHandler = async (e) => {
    try {
         e.preventDefault();
         const otpArray=inputrefs.current.map(e=>e.value)
         const otp=otpArray.join('');

      const {data}=await axios.post(backendUrl+'/api/auth/verify-account',{otp})

      if(data.success)
      {
        toast.success(data.message);
         navigate('/')
         getUserData()
      }
      else
      {
        toast.error(data.message)
      }
    } catch (error) {
        toast.error(error.message);
    }
  };

  useEffect(()=>{
         isLoggedIn&&userData.isAccountVerified && userData && navigate('/')
  },[isLoggedIn,userData])
  return (
    <div className="flex justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-100 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <form onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h2 className="text-white text-2xl font-semibold text-center mb-4">
          Email verify Otp
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
          verif email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
