import { use } from "react";
import { useEffect , useState } from "react"   ;
import {useParams} from "react-router-dom";

import {Swiper ,SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import {Navigation , Pagination } from "swiper/modules";
import 'swiper/css/bundle';
import { FaMapMarkerAlt, FaBed, FaBath, FaParking ,FaChair ,FaShare} from "react-icons/fa";



export default function Listing(){
SwiperCore.use([Navigation , Pagination]);
 const params = useParams();
 const [listing , setListing] = useState(null);
 const [loading , setLoading] = useState(false);
 const [error , setError] = useState(false);
 const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchListing= async()=>{
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
            const data = await res.json();
            if(data.success === false){
                setError(true);
                setLoading(false);
                setListing(null);
                return;
            }
            setListing(data);
            setLoading(false);
            
        } catch (error) {
            setError(true);
            setLoading(false);
        }};
        fetchListing();
    } , [params.listingId] )

    return(
        <main>
            {loading && <p className="text-center mt-7 text-2xl text-blue-700">Loading...</p>}
            {error && <p className="text-center mt-7 text-2xl text-blue-700">Error</p>}
            {listing && !loading && ! error && <>
            <Swiper navigation >
                {listing.imageUrls.map((url)=>(
                    <SwiperSlide key={url}>
                        <div className="h-[550px]" style={{backgroundImage: `url(${url})`,backgroundRepeat: 'no-repeat',backgroundSize: 'cover' , backgroundPosition: 'center'}}>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="fixed top-{13%} right-{3%} z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
                <FaShare
                className="text-slate-500"
                onClick={()=>{
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    alert("Link copied to clipboard");
                    setTimeout(()=>{
                        setCopied(false);
                    },3000);
                    
                }}/>

            </div>

        <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-6">
           <p className="font-bold text-3xl my-7 text-slate-700">
                 {listing.name} - ${listing.offer ? listing.discountedPrice.toLocaleString() : listing.regularPrice.toLocaleString()}
                 {listing.type === 'rent'? '/month': ''}
            </p>
            <p className="flex item-center mt-6 gap-2 text-slate-600">
                <FaMapMarkerAlt className="text-green-700"/>
                {listing.address}
               
            </p>

            <div className="flex gap-4">
                <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md m-4">
                     {listing.type === 'rent' ?'For Rent':'For Sale'}

                </p>
                {
                    listing.offer && (
                        <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md m-4">
                            ${+ listing.regularPrice - listing.discountedPrice}
                        </p>
                    )
                }
            </div>

            <div>
               <p className="mb-3 text-slate-800 text-md">
                <span className="text-black font-semibold"> Description: </span>
                {listing.description}
               </p>

               <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
                <li className="flex items-center gap-1 whitespace-nowrap"><FaBed className="text-lg"/>
                {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap"><FaBath className="text-lg"/>
                {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap"><FaParking className="text-lg"/>
                {listing.parking ? `parking` : `no parking`}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap"><FaChair className="text-lg"/>
                {listing.furnished ? `furnished` : `not furnished`}                </li>
               </ul>
            </div>
            </div>
            
            </>}
        </main>
    )
}