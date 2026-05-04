import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

export const getUser = (req, res) =>{
    res.send('Get user route is working!');
};


export const updateUser = async (req, res, next ) => {
   if(req.user.id !== req.params.id) return next(errorHandler(403, "You can update only your own account!"));
   try {
    if(req.body.password){
        const salt = bcrypt.genSaltSync(10);
        req.body.password = bcrypt.hashSync(req.body.password, salt);
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set : {
            username : req.body.username,
            email : req.body.email,
            password : req.body.password,
            photo : req.body.photo
        },
    }, { returnDocument: "after" });

    const {password, ...otherDetails} = updatedUser._doc;


    res.status(200).json(otherDetails);
   } catch (error) {
    
   }
}