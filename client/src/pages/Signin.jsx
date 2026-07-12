import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { useDispatch } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice.js';
import { useSelector } from 'react-redux';
import OAuth from '../components/OAuth.jsx';
export default function Signin() {

  // maintaining the state while typing the signin info 

  const [formData, setFormData] = useState({});
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false);
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  // submission of form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      // setLoading(true);
      dispatch(signInStart());

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success == false) {
        // setLoading(false);
        dispatch(signInFailure(data.message));
        // setError(data.message);
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');

    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }


  return (
    <div className='max-w-lg mx-auto p-3'>

      <h1 className='text-3xl font-semibold text-center my-7'>Sign In</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4' action="">

        <input type="email" placeholder='email'
          className='border-t p-3 rounded-lg shadow-2xl' id='email' onChange={handleChange} />
        <input type="password" placeholder='password'
          className='border-t p-3 rounded-lg shadow-2xl' id='password' onChange={handleChange} />

        <button disabled={loading} type='submit' className='bg-slate-700 mt-5 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : "Sign In"}</button>
        <OAuth />
      </form>

      <div className='flex gap-2 justify-center mt-5'>
        <p>Dont have an account?</p>
        <Link to={"/signup"}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
