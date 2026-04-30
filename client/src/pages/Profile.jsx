import React from 'react'
import { useSelector } from 'react-redux';

export default function Profile() {
  const {currentUser} = useSelector((state) => state.user); 
  return (
    <div className='p-3 max-w-lg mx-auto '>
      <h1 className='font-semibold text-3xl  text-center'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <img src={currentUser.photo} 
        className='rounded-full w-32 h-32 object-cover cursor-pointer self-center'
        alt="profile" 
        onError={(e) => {
         e.target.src = 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png';
        }}/>

        <input type="text" placeholder='username' id='username'
         className='border-t p-3 rounded-lg shadow-2xl' />
        <input type="email" placeholder='email' id='email'
         className='border-t p-3 rounded-lg shadow-2xl' />
        <input type="password" placeholder='password' id='password'
         className='border-t p-3 rounded-lg shadow-2xl' />
         <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
      </form>

      <div className='flex justify-between items-center mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  )
}
