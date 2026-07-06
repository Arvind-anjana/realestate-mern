import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";


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
        res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
    
}


export const getListing = async (req, res, next) => {   
    try {
        const listing = await Listing.findById(req.params.id);
        if(!listing){
            return next(errorHandler(404, "Listing not found"));
        }   
        res.status(200).json(listing);  
        console.log("listing fetched successfully");
    } catch (error) {
        next(error);
    }   
}