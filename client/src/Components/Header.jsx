import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../Context/AppContext'
const Header = () => {

  const {userData} =useContext(AppContent);
  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
        <img src={assets.header_img} alt=""  className='w-36 h-36 rounded-full mb-6'/>
        <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey&nbsp;&nbsp;{userData?userData.name:'Developer'}<img src={assets.hand_wave} className='w-8 aspect-square' alt="" /></h1>
        <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our App</h2>
        <p className='mb-8 max-w-md'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum repudiandae nihil molestias perferendis non optio debitis molestiae maxime ullam laboriosam impedit at ipsum quas corporis minus sunt accusantium, atque ratione.</p>
        <button className='border border-gray-500 px-8 py-2.5 rounded-full hover:bg-gray-200 cursor-pointer transition-all'>Get Started</button>
    </div>
  )
}

export default Header