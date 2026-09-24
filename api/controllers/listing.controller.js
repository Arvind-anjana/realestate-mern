import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import redisClient from "../utils/redis.js";


export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {     
        next(error);
    }   
}
export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id); 
    if(!listing){
        return next(errorHandler(404, "Listing not found"));
    }   

    if(listing.userRef.toString() !== req.user.id){
        return next(errorHandler(403, "You are not authorized to delete this listing"));
    }
        
    try {
       await Listing.findByIdAndDelete(req.params.id);
       try {
           await redisClient.del(`listing:${req.params.id}`);
       } catch (e) {
           console.error('Redis delete error:', e);
       }
       res.status(200).json({success: true, message: "Listing deleted successfully"});
    } catch (error) {     
        next(error);
    }   
}
export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return next(errorHandler(404,"Listing not found"));
    }
    if(listing.userRef.toString() !== req.user.id){
        return next(errorHandler(403, "You are not authorized to update this listing"));
    }
    try {
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { returnDocument: true });
        try {
            await redisClient.del(`listing:${req.params.id}`);
        } catch (e) {
            console.error('Redis delete error:', e);
        }
        res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
    
}


export const getListing = async (req, res, next) => {   
    try {
        const cacheKey = `listing:${req.params.id}`;
        try {
            const cachedListing = await redisClient.get(cacheKey);
            if (cachedListing) {
                console.log('✅ CACHE HIT: Single Listing');
                return res.status(200).json(JSON.parse(cachedListing));
            }
        } catch (e) {
            console.error('Redis get error:', e);
        }

        const listing = await Listing.findById(req.params.id);
        if(!listing){
            return next(errorHandler(404, "Listing not found"));
        }   

        try {
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(listing));
            console.log('❌ CACHE MISS: Single Listing (Saved to Redis)');
        } catch (e) {
            console.error('Redis set error:', e);
        }

        res.status(200).json(listing);  
    } catch (error) {
        next(error);
    }   
}
export const getListings = async (req, res, next) => {   
    try {
         const cacheKey = `listings:${JSON.stringify(req.query)}`;
         try {
             const cachedListings = await redisClient.get(cacheKey);
             if (cachedListings) {
                 console.log('✅ CACHE HIT: Multiple Listings');
                 return res.status(200).json(JSON.parse(cachedListings));
             }
         } catch (e) {
             console.error('Redis get error:', e);
         }

         const limit = parseInt(req.query.limit) || 9;
         const startIndex = parseInt(req.query.startIndex) || 0;
         

         

         let offer = req.query.offer;
         if(offer === undefined || offer === "false"){
            offer = {$in : [false , true] };
         }

         let furnished = req.query.furnished;
         if(furnished === undefined || furnished === "false"){
            furnished = {$in : [false , true] };
         }

         let parking = req.query.parking;
         if(parking === undefined || parking === "false"){
            parking = {$in : [false , true] };
         }
         
         let type = req.query.type || "all";

         if(type === "all"){
            type = { $in: ["rent" , "sale"]};
         }

         const searchTerm = req.query.searchTerm || "";
         const sort = req.query.sort || "createdAt";
         const order = req.query.order || "desc";

         
         const listings = await Listing.find({
            name: {$regex: searchTerm, $options: "i"},
            offer,
            furnished,
            parking,
            type,
         }).sort({[sort]: order}).limit(limit).skip(startIndex);

         try {
             await redisClient.setEx(cacheKey, 3600, JSON.stringify(listings));
             console.log('❌ CACHE MISS: Multiple Listings (Saved to Redis)');
         } catch (e) {
             console.error('Redis set error:', e);
         }

         res.status(200).json(listings);  
    } catch (error) {
        next(error);
    }   
}