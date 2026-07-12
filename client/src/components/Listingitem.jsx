import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from 'react-icons/md';

export default function Listingitem({ listing }) {
    return (
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow 
            overflow-hidden rounded-lg w-full sm:w-[330px] m-2">
            <Link to={`/listing/${listing._id}`} className="">
                <img src={listing.imageUrls[0] || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXq9rRhN5RK44d0--ZJVbzIn_QF0udwufU2LDKDGrWhEuzvq-UGyabQEQ&s=10"}
                    alt="listing cover"
                    className="h-[300px] sm:h-[200px] w-full object-cover
              hover:scale-105 transition-scale duration-300" />
                <div className="p-3 flex flex-col gap-2 w-full">
                    <p className="text-lg font-semibold text-slate-700 truncate">
                        {listing.name}
                    </p>
                    <div className="flex items-center gap-1">
                        <MdLocationOn className="h-4 w-4 text-green-600" />
                        <p className="text-sm text-gray-600 truncate w-full">
                            {listing.address}
                        </p>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {listing.description}
                    </p>

                    <p className="text-slate-700 mt-2 font-semibold flex item-center">
                        Rs.
                        {listing.offer ? listing.discountedPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                        {listing.type === 'rent' && '/month'}
                    </p>

                    <div className="flex items-center gap-4 text-slate-700 ">
                        <div className="flex font-semibold gap-2">
                            {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                        </div>
                        <div className="flex font-semibold gap-2">
                            {listing.bedrooms > 1 ? `${listing.bathrooms} bath` : `${listing.bathrooms} bath`}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}