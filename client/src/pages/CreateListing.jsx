import React from 'react';

export default function CreateListing() {
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className= 'text-3xl font-semibold text-center my-7'>Create a listing </h1>

      <form className='flex flex-col sm:flex-row gap-4'>
        {/* left side div.. */}
        <div className='flex flex-col gap-4 flex-1'>
            <input type="text" placeholder='Name' className='border p-3 rounded-lg shadow-2xl ' id='name' maxLength="62" minLength="10" required/>
            <textarea type="text" placeholder='Description' className='border-t p-3 rounded-lg shadow-2xl' id='name' maxLength="62" minLength="10" required/>
            <input type="text" placeholder='Address' className='border-t p-3 rounded-lg shadow-2xl' id='name' maxLength="62" minLength="10" required/>
            <input type="text" placeholder='Name' className='border-t p-3 rounded-lg shadow-2xl' id='name' maxLength="62" minLength="10" required/>

            <div className='flex flex-wrap gap-6'>
                  {/* checkbox div */}
                        <div className='flex gap-2'>
                            <input type="checkbox" id='sale' className='w-5' />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='Rent' className='w-5' />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='parking' className='w-5' />
                            <span>Paking Spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='furnished' className='w-5' />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='offer' className='w-5' />
                            <span>Offer</span>
                        </div>
            </div>


             {/*onther info divs.. */}
            <div className='flex flex-wrap gap-6'>
                <div className='boder flex items-center gap-2 '>
                    <input type="number" id='bedrooms' placeholder='Bedrooms' min="1" max="10" className='border-gray-300 p-3 rounded-lg shadow-2xl'/> <p>Beds</p> 
                </div>
                <div className='boder flex items-center gap-2 '>
                    <input type="number" id='bathrooms' placeholder='Bathrooms' min="1" max="10" className='border-gray-300 p-3 rounded-lg shadow-2xl'/> <p>Baths</p> 
                </div>
                <div className='boder flex items-center gap-2 '>
                    <input type="number" id='regularPrice' placeholder='Regular Price' min="0" className='border border-gray-300 p-3 rounded-lg'/>
                    <div className='flex flex-col items-center'>
                        <p>Regular Price</p>
                        <span className='text-xs'>$/Month</span>
                    </div>
                </div>
                <div className='flex items-center gap-2 '>
                    <input type="number" id='discountPrice' placeholder='Discount Price' min="0" className='p-3 border-2 border-gray-300 rounded-lg '/> 
                    <div className='flex flex-col items-center'>
                        <p>Discounted Price</p>
                        <span className='text-xs'>$/Month</span>
                    </div> 
                </div>
                
            </div>
        </div>
        

        {/* right side div */}
        <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>Images :</p>
            <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
        
        <div className='flex gap-4'>
            <input className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
            <button className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg diabled:opacity-80'>Upload</button>
        </div>
        <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
        </div>


      </form>


    </main>
  )
}