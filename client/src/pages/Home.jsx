import React from 'react'
import NavBar from '../Components/NavBar'
import Header from '../Components/Header'

const Home = () => {
  return (
    <div className='flex flex-col justify-center items-center bg-[url("./bg_img.png")] bg-cover bg-center' >
      <NavBar/>
      <Header/>
    </div>
  )
}

export default Home