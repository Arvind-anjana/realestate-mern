import React, { use } from 'react';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useState , useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { updateUserStart ,updateUserFailure , updateUserSuccess ,deleteUserFailure,deleteUserStart,deleteUserSuccess, signOutUserStart , signOutUserSuccess , signOutUserFailure} from '../redux/user/userSlice.js';
import { Link } from 'react-router-dom';

export default function Profile() {
  const {currentUser ,loading , error} = useSelector((state) => state.user); 
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [showListingError, setShowListingError] = useState(false);
  const dispatch = useDispatch();

  const [updateSucess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);



  // console.log(file);


  useEffect(() => {
    if(file){
     handleFileUpload(file);
    }  
  }, [file])  ;



const handleFileUpload = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const maxSize = 2 * 1024 * 1024; // 2MB limit
  if (file.size > maxSize) {
    setImageUploadError("File too large (Max 2MB)");
    return;
  }

  if (!file.type.startsWith("image/")) {
    setImageUploadError("Only image files are allowed");
    return;
  }

    // 1. Setup Cloudinary Data
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', uploadPreset); // Replace with your preset
    data.append('cloud_name', cloudName); // Replace with your cloud name

   
    try {
      setImageUploadError(false);
      setImageUploadProgress(10); // Start progress bar logic if you want one

      // 2. Direct Upload to Cloudinary
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: data,
      });

      const cloudData = await res.json();
      
      
      if (!res.ok) {
        setImageUploadError(true);
        return;
      }

      // 3. Attach the new URL to our form data state
      setFormData({ ...formData, photo: cloudData.secure_url });
      setImageUploadProgress(100);
      
    } catch (error) {
      setImageUploadError(true);
    }
  };


  const handlechange = (e) => {
    setFormData({...formData, [e.target.id] : e.target.value});
  } 


  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      // Make API call to update user details
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success===false){
        dispatch(updateUserFailure(data.message || "Failed to update profile"));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser= async(e)=>{

    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if(!confirmed) return;
    
    try {
      dispatch(deleteUserStart());
      
      const res= await fetch(`/api/user/delete/${currentUser._id}`,{
        method :`DELETE`,
        
      });
      const data = await res.json();
      if(data.success=== false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
    
  }

  const handleSignout = async() => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if(data.success === false){
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  const handleShowListings = async() => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false){
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  }

  const handleListingDelete = async(listingId) => {
    const confirmed = window.confirm("Are you sure you want to delete this listing? This action cannot be undone.");
    if(!confirmed) return;
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        alert(data.message || "Failed to delete listing");
        return;
      }
      setUserListings((prevListings) => prevListings.filter((listing) => listing._id !== listingId));

      alert("Listing  deleted successfully");
      // Remove the deleted listing from the state
      
    } catch (error) {
      alert("Failed to delete listing");
    }
  }





  return (
    <div className='p-3 max-w-lg mx-auto '>
      <h1 className='font-semibold text-3xl  text-center'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef}  hidden accept='image/*'/>


        <img onClick={()=>fileRef.current.click()} src={ formData.photo || currentUser.photo}
        className='rounded-full w-32 h-32 object-cover cursor-pointer self-center'
        alt="profile" 
        onError={(e) => {
         e.target.src = 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png';
        }}/>

        <p className='text-center text-sm'>
          {imageUploadError ? (<span className='text-red-700'>{imageUploadError}</span>): 
          imageUploadProgress > 0 && imageUploadProgress < 100 ?(
          <span className='text-green-700'>Uploading: {imageUploadProgress}% </span> ) :
          imageUploadProgress === 100 ? <span className='text-green-700'>Upload complete!</span> : null }  
        </p>

        <input type="text" placeholder='username' id='username' defaultValue={currentUser.username}
         onChange={handlechange}
         className='border-t p-3 rounded-lg shadow-2xl' />

        <input type="email" placeholder='email' id='email' defaultValue={currentUser.email}
                 onChange={handlechange}

         className='border-t p-3 rounded-lg shadow-2xl' />

        <input type="password" placeholder='password' id='password'
                 onChange={handlechange}

         className='border-t p-3 rounded-lg shadow-2xl' />

         <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? "Updating..." : "Update Profile"}
         </button>
         <Link to='/create-listing' className='bg-green-700 text-white rounded-lg p-3 uppercase hover:opacity-95 text-center'>
           Create Listing
         </Link>
      </form>

      <div className='flex justify-between items-center mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignout} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
       <p className='text-red-700 mt-3'>{error ? error : ""}</p>
       <p className='text-green-700 mt-3'>{updateSucess ? "user is updated successfully":""}</p>

       <button onClick={handleShowListings} className='text-green-700 w-full'>
        Show Listings
       </button>

       <p className='text-red-500 mt-5'>
        {showListingError ? "Error showing listings" : ""}
       </p>

       {userListings && userListings.length > 0 && 
       <div className='flex flex-col gap-4'>
        <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
        {userListings.map((listing) => (

        <div key={listing._id} className='border p-3 rounded-lg  flex justify-between items-center gap-4'>
          <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt="listing cover" className='h-16 w-16 object-contain '/>
          </Link>
          <Link to={`/listing/${listing._id}`} className='text-slate-700 font-semibold flex-1 hover:underline truncate'>
          <p >{listing.name}</p>
          </Link>

          <div className='flex flex-col item-center'>
            <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
            <Link to={`/update-listing/${listing._id}`} className='text-green-700 uppercase'>Edit</Link>
          </div>


        </div>
       ))}
       </div>}
       


    </div>
  )
}
