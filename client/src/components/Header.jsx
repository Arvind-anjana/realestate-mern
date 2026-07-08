import React from 'react'
import {FaSearch} from 'react-icons/fa';
import {Link ,useNavigate, useLocation} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState , useEffect} from 'react';

export default function Header() {
    const {currentUser} = useSelector((state) => state.user);
    const [searchTerm , setSearchTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = (e)=>{
        e.preventDefault();
        const urlParam = new URLSearchParams(window.location.search);
        urlParam.set('searchTerm', searchTerm);
        const searchQuery = urlParam.toString();
        navigate(`/search?${searchQuery}`);
        
    }

    useEffect(()=>{
        const urlParam = new URLSearchParams(location.search);
        const searchTermFromUrl= urlParam.get('searchTerm');
        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl);
        } else {
            setSearchTerm('');
        }
    },[location.search]);
    
  return (
    <header className='bg-slate-200 '>
        
        <div className='flex justify-between items-center mx-auto p-4'>
{/* logo */}
{/* link to home page  */}
        <Link to='/'>
            <h1 className='font-bold text-sm sm:text-xl flex-wrap'>
                <span className='text-slate-500'>Riyal-</span>
                <span className='text-slate-700'>Estate</span>
            </h1>
        </Link>
{/* search bar */}

        <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center gap-2'>
            <input type="text" placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64'
            value={searchTerm}
            onChange={(e)=> setSearchTerm(e.target.value)}
            />

            <button>

            <FaSearch className='text-slate-600'/>
            </button>
        </form>  

{/* navbar buttons  */}
        <ul className='flex gap-4'>
            <Link to={'/'}>
                <li className='text-slate-700 font-semibold rounded-lg cursor-pointer hidden sm:inline hover:underline'>Home</li>
            </Link>
            <Link to={'/about'}>
                <li className='text-slate-700 font-semibold rounded-lg cursor-pointer hidden sm:inline hover:underline'>About</li>
            </Link >

            <Link to={'/profile'}>
            {currentUser ? (
                <div className='flex items-center gap-2'>
                    <img 
                        className='rounded-full w-8 h-8 object-cover cursor-pointer' 
                        src={currentUser.photo}  
                        alt="profile" 
                        onError={(e) => {
                            e.target.src = 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png';
                        }}
                    />
                    {/* <span className='text-slate-700 font-semibold cursor-pointer hover:underline hidden sm:inline'>
                        {currentUser.username}
                    </span> */}
                </div>
            ): 
                <li className='text-slate-700 font-semibold rounded-lg cursor-pointer hover:underline'>Sign In</li>
            }
            </Link>
        </ul>
        </div>
        
    </header>
  )
}
