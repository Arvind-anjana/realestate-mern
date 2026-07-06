import { use } from "react";
import { useEffect , useState } from "react"   ;
import {useParams} from "react-router-dom";

import {Swiper ,SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import {Navigation , Pagination } from "swiper/modules";
import 'swiper/css/bundle';


export default function Listing(){
SwiperCore.use([Navigation , Pagination]);
 const params = useParams();
 const [listing , setListing] = useState(null);
 const [loading , setLoading] = useState(false);
 const [error , setError] = useState(false);

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
            
            </>}
        </main>
    )
}