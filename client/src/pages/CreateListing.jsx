import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.currentUser);
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading , setUploading] = useState(false);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: ' ',
        description: ' ',
        address: ' ',
        type: 'rent',
        parking: false,
        furnished: false,
        offer: false,
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountedPrice: 0
    });

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);


    console.log(formData);

    const handleImageSubmit= (e)=> {
        if(files.length >0 && files.length<7){

            setUploading(true);
            setImageUploadError(false);

            const promises=[];
            for(let i=0; i<files.length; i++){
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
            .then((urls)=>{
                setFormData((prevData)=>({
                    ...prevData,
                    imageUrls: formData.imageUrls.concat(urls) ,
                }));
                setImageUploadError(false);
                setUploading(false);
            })
            .catch((error)=>{
                setImageUploadError("Error uploading images. Please try again.");
                console.error("Error uploading images:", error);
            });
        } else {
            setImageUploadError("Please select between 1 and 6 images.");
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise(async (resolve, reject) => {
            const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;
            const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
            const maxSize = 2 * 1024 * 1024;
            if (file.size > maxSize  || !file.type.startsWith("image/")) {
               return reject(new Error("Invalid file size or type"));       
                }

          const data = new FormData();
            data.append('file', file);
            data.append('upload_preset', uploadPreset); // Replace with your preset
            data.append('cloud_name', cloudName); // Replace with your cloud name

            try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,{
                method: 'POST',
                body: data,
            });
            const cloudData =  await res.json();
            if (res.ok) {
                    resolve(cloudData.secure_url);
                } else {
                    reject(cloudData.error);
                }
            }catch (error) {
                reject(error);
            }
        });
    }

    const handleRemoveImage = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            imageUrls: prevData.imageUrls.filter((_, i) => i !== index),
        }));
    }

    const handlechange = (e) => {
        if(e.target.id === 'sale' || e.target.id === 'Rent'){
            setFormData((prevData) => ({
                ...prevData,
                type: e.target.id,
            }));
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setFormData((prevData) => ({
                ...prevData,
                [e.target.id]: e.target.checked,
            }));
        }
        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'   ){
            setFormData((prevData) => ({
                ...prevData,
                [e.target.id]: e.target.value,
            }));
        }
    }
    
    const handleSubmit = async(e) => {
        e.preventDefault();
        
        try {
            if (formData.imageUrls.length === 0) {
                return setError("Please upload at least one image.");
            }
            if (formData.discountedPrice >= formData.regularPrice) {
                return setError("Discounted price must be less than regular price.");
            }
                setLoading(true);
                setError(false);
                const res = await fetch('/api/listing/create', {
                    method: 'POST',
                    headers: {  
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...formData, userRef: currentUser._id })
                });
                const data = await res.json();
                setLoading(false);
                if(data.success === false){
                    setError(data.message);
                    return;
                }
                navigate(`/listing/${data._id}`); // Navigate to the newly created listing page
                // Reset form data after successful submission
                                 
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };


  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className= 'text-3xl font-semibold text-center my-7'>Create a listing </h1>

      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        {/* left side div.. */}
        <div className='flex flex-col gap-4 flex-1'>
            <input type="text" placeholder='Name' className='border p-3 rounded-lg shadow-2xl ' id='name' maxLength="62" minLength="5" required onChange={handlechange} value={formData.name}/>
            <textarea type="text" placeholder='Description' className='border-t p-3 rounded-lg shadow-2xl' id='description'  minLength="5" required onChange={handlechange} value={formData.description}/>
            <input type="text" placeholder='Address' className='border-t p-3 rounded-lg shadow-2xl' id='address' maxLength="62" minLength="5" required onChange={handlechange} value={formData.address}/>

            <div className='flex flex-wrap gap-6'>
                  {/* checkbox div */}
                        <div className='flex gap-2'>
                            <input type="checkbox" id='sale' className='w-5' onChange={handlechange} checked={formData.type === 'sale'}/>
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='Rent' className='w-5' onChange={handlechange} checked={formData.type === 'rent'}/>
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='parking' className='w-5' onChange={handlechange} checked={formData.parking} />
                            <span>Paking Spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='furnished' className='w-5' onChange={handlechange} checked={formData.furnished} />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='offer' className='w-5' onChange={handlechange} checked={formData.offer}  />
                            <span>Offer</span>
                        </div>
            </div>


             {/*onther info divs.. */}
            <div className='flex flex-wrap gap-6'>
                <div className='boder flex items-center gap-2 '>
                    <input type="number" id='bedrooms' placeholder='Bedrooms' min="1" max="10" className='border-gray-300 p-3 rounded-lg shadow-2xl' onChange={handlechange} value={formData.bedrooms}/> <p>Beds</p> 
                </div>
                <div className='boder flex items-center gap-2 '>
                    <input type="number" id='bathrooms' placeholder='Bathrooms' min="1" max="10" className='border-gray-300 p-3 rounded-lg shadow-2xl' onChange={handlechange} value={formData.bathrooms}/> <p>Baths</p> 
                </div>
                <div className='boder flex items-center gap-2 '>
                    <input type="number" id='regularPrice' placeholder='Regular Price' min="50" max="1000000" className='border border-gray-300 p-3 rounded-lg' onChange={handlechange} value={formData.regularPrice}/>
                    <div className='flex flex-col items-center'>
                        <p>Regular Price</p>
                        <span className='text-xs'>$/Month</span>
                    </div>
                </div>

                {formData.offer && (
                     <div className='flex items-center gap-2 '>
                    <input type="number" id='discountedPrice' placeholder='Discount Price' min="0" max="1000000" className='p-3 border-2 border-gray-300 rounded-lg ' onChange={handlechange} value={formData.discountPrice}/> 
                    <div className='flex flex-col items-center'>
                        <p>Discounted Price</p>
                        <span className='text-xs'>$/Month</span>
                    </div> 
                </div>)}
               
                
            </div>
        </div>
        

        {/* right side div */}
        <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>Images :</p>
            <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
        
        <div className='flex gap-4'>
            <input onChange={(e)=>setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
            <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg diabled:opacity-80'>{uploading ? "Uploading..." : "Upload"}</button>
        </div>
                 <p className='text-red-700 mt-3 text-sm'>{imageUploadError ? imageUploadError : ""}</p>
                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url,index)=>( 
                            <div key={url} className='flex justify-between p-3 border items-centre'>
                                <img src={url} key={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg' />
                                <button type='button' onClick={()=>handleRemoveImage(index)} className='p-3 bg-red-700 text-white rounded-lg uppercase hover:shadow-lg'>Delete</button>
                            </div>
                            

                        ))
                    }
        <button disabled={loading || uploading } type='submit'className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? "Creating..." : "Create Listing"}</button>
        {error && <p className='text-red-700 mt-3'>{error}</p>}
        </div>

      </form>

    </main>
  )
}