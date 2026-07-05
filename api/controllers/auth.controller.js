import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res , next) => {
    const {username, email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
        username,
        email,
        password : hashedPassword
    });

    try {
        await newUser.save()
        res.status(201).json("User created successfully");  }
        
    catch (error) {
        next(error);
     }
}

export const signin = async (req, res , next) => {
    const {email, password} = req.body;
    try {
        const validUser = await User.findOne({email});
        if(!validUser){  return next(errorHandler(404, "User not found")); }
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if(!validPassword){ return next(errorHandler(400, "Wrong Credentials")); }

        // if user is authenticated then create a jwt (token) and send it to client in cookie

        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
        const {password : pass, ...otherDetails} = validUser._doc; // to avoid sending password in response 
        res
            .cookie('access_token', token, { httpOnly : true,/* expires : new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day */})
            .status(200)
            .json(otherDetails);  

    } catch (error) {
        next(error);
    }
}

export const googleAuth = async(req,res,next) => {
    try {
        const user = await User.findOne({email : req.body.email});
        if(user){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            const {password : pass, ...otherDetails} = user._doc; // to avoid sending password in response
            res
                .cookie('access_token', token, { httpOnly : true,/* expires : new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day */})
                .status(200)
                .json(otherDetails);  
        }else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
            const newUser = new User({
                username : req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
                email : req.body.email,
                password : hashedPassword,
                photo: req.body.photo,
            });
            const savedUser = await newUser.save();
            const token = jwt.sign({id: savedUser._id}, process.env.JWT_SECRET);
            const {password : pass, ...otherDetails} = savedUser._doc;
            res
                .cookie('access_token', token, { httpOnly : true,/* expires : new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day */})
                .status(200)
                .json(otherDetails);

            
            
        }

    } catch (error) {
        
    }
}

export const signout = async(req,res,next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('user has been logged out');
    } catch (error) {
        next(error);
    }
}   
