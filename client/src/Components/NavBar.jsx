import React, { useContext } from 'react'
import {assets} from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../Context/AppContext.jsx'
import { toast } from 'react-toastify'
import axios from 'axios'
import { CiHome } from "react-icons/ci";
const NavBar = () => {

    const navigate=useNavigate()

    const{userData,backendUrl,setIsLoggedIn,setUserData}=useContext(AppContent)

    const verifyAccount=async()=>
    {
      try {
        
        axios.defaults.withCredentials=true;
        const {data}=await axios.post(backendUrl+'/api/auth/send-verify-otp')
        if(data.success)
        {
          navigate('/email-verify');
          toast.success(data.message);
        }
        else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
    const logout=async()=>
    {
        try {
          axios.defaults.withCredentials=true;
           const {data}=await axios.post(backendUrl+'/api/auth/logout')
           if(data.success)
           {
            setIsLoggedIn(false);
            setUserData(false);
            navigate('/')
           }
        } catch (error) {
           toast.error(error.message)
        }
    }
  return (
    <div className='w-full flex justify-between p-4 items-center sm:p-6 sm:px-24 absolute top-0'>
        
        <CiHome  className=' h-9 w-28 sm:32' />
              {userData?
                 <div className='h-8 w-8  flex rounded-full bg-black justify-center items-center text-white relative group'>
                  {userData.name[0].toUpperCase()}
                  <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
                    <ul className='m-0 p-2 list-none text-sm bg-gray-100'>
                      {!userData.isAccountVerified&&  <li className='px-2 py-1  hover:bg-gray-200 cursor-pointer' onClick={verifyAccount}>verify Email</li>}
                     
                      <li 
                      onClick={logout}
                      className='px-2 py-1 hover:bg-gray-200 cursor-pointer pr-10'>Logout</li>
                    </ul>
                  </div>
                 </div>
                :  
                <button  onClick={()=>navigate('/login')}
                  className='flex border border-gray-500 gap-2 text-center hover:bg-gray-100 hover:cursor-pointer transition-all rounded-full px-6 py-2 text-gray-800'>
                 Login <img src={assets.arrow_icon} alt="" /></button>
              }
        
    </div>
  )
}

export default NavBar