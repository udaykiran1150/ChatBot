import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../Context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'


const Login = () => {
  const {backendUrl,isLoggedIn,setIsLoggedIn,getUserData}=useContext(AppContent)
  const navigate=useNavigate();
  const [state,setState]=useState('Sign Up')
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')



  const HandleSubmitHandler=async(e)=>
  {
         try {
          e.preventDefault();
          axios.defaults.withCredentials=true;

          if(state==='Sign Up')
          {
                const {data}=await axios.post(backendUrl+'/api/auth/register',{name,email,password});

                if(data.success)
                {  navigate('/')
                  toast.success("Account created Successfully")
                  getUserData()
                  setIsLoggedIn(true)
                 
                  
                }
                else{
                    toast.error(data.message);
                }
          }
          else{
            e.preventDefault()
            axios.defaults.withCredentials=true;
             const {data}=await axios.post(backendUrl+'/api/auth/login',{email,password})
             if(data.success)
              {
                navigate('/')
                toast.success("LoggedIn successfully")
                getUserData()

                setIsLoggedIn(true)
                
                
              }
              else{
                  toast.error(data.message);
              }
          }
         } catch (error) {
            toast.error(error.message);
         }

  }
  return (
    <div className='flex justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-100 to-purple-400'>
      <img  onClick={()=>navigate('/')}src={assets.logo} alt=""  className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
      <div className='bg-slate-900 p-10 rounded-lg text-indigo-300 w-full sm:w-96  shadow-lg text-sm'>
          <h1 className='text-3xl font-semibold text-white text-center mb-3'>{state==='Sign Up'?'Create Account':'Login'}</h1>
          <p className='text-center text-sm mb-6'>{state==='Sign Up'?'Create Your Account':'Login to your account'}</p>
          <form onSubmit={HandleSubmitHandler}>
            {
              state==='Sign Up' &&(<div className='mb-4 flex gap-3 items-center bg-[#333A5C] rounded-full px-5 py-2.5 text-gray-300'>
                <img src={assets.person_icon} alt="" />
                <input type="text" placeholder='Enter name'  
                className='bg-transparent outline-none'
                onChange={(e)=>setName(e.target.value)}
                value={name}  />
              </div>)
            }
            
            <div className='mb-4 flex gap-3 items-center bg-[#333A5C] rounded-full px-5 py-2.5 text-gray-300'>
              <img src={assets.mail_icon} alt="" />
              <input type="email" placeholder='Enter Email' 
               className='bg-transparent outline-none'
               onChange={(e)=>setEmail(e.target.value)}
                value={email}/>
            </div>
            <div className='mb-4 flex gap-3 items-center bg-[#333A5C] rounded-full px-5 py-2.5 text-gray-300'>
              <img src={assets.lock_icon} alt="" />
              <input type="password" placeholder='password'  
              className='bg-transparent outline-none'
              onChange={(e)=>setPassword(e.target.value)}
                value={password}
              />
            </div>
            <p className='text-indigo-500 mb-4 cursor-pointer ' onClick={()=>navigate('/reset-password')}>Forget Password?</p>
            <button className='py-2.5 w-full text-center bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-full text-white font-medium' >{state}</button>
          </form>
          {state==='Sign Up'? <p className='text-xm text-center text-gray-400 mt-4'>Already have an account? <span onClick={()=>setState('Login')} className='text-blue-600 underline cursor-pointer'>Login here</span></p>
          
          : <p className='text-xm text-center text-gray-400 mt-4'>Don'thave an account? <span onClick={()=>setState('Sign Up')}className='text-blue-600 underline cursor-pointer'>Signup here</span></p>
          }
                      </div>
                      
     
    </div>
  )
}

export default Login