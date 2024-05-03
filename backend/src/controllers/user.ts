import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import { Error } from "mongoose";
import ErrorHandler from "../utils/utility-class.js";

export const newUser =async (
    req: Request<{},{}, NewUserRequestBody>, // additional type safety
    res: Response, 
    next: NextFunction
    )=>{
        try{
            // we are customizing "req" above only
            // providing type information that helps TypeScript
            // understand the structure of the request body
            const {name, email, photo, gender, _id, dob} = req.body;
            
            // find the user in the DB
            let user = await User.findById(_id)
            // if the user already exists, let them in
            if (user) return res.status(200).json({
                success: true,
                message: `Welcome ${user.name}`
            })
            
            // for someone who already does not exist, 
            // ask them to fill all the necessary info
            if(!_id || !name || !email || !photo || !gender || !dob){
                next(new ErrorHandler("Please enter all the fields", 400))
            }

            // if this is a new user, create him/her in the DB
            user = await User.create({
                name, 
                email, 
                photo, 
                gender,  
                _id, 
                dob
            })
            return res.status(201).json({
                success: true,
                message: `Welcome, ${user.name}`
            })
        } catch(error){
            return next(new ErrorHandler("Cannot Create User", 400))
        }
        
    }



export const getAllUsers = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const users = await User.find({})
        return res.status(200).json({
            success: true,
            users,
        })
    } catch(error){
        return next(new ErrorHandler("Could Not Find Users", 400))
    }
}



export const getUser = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const id = req.params.id
        const user = await User.findById(id)

        if(!user) return next(new ErrorHandler("Invalid ID", 400))

        return res.status(200).json({
            success: true,
            user,
        })
    } catch(error){
        return next(new ErrorHandler("Could Not Find Users", 400))
    }
}



export const deleteUser = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const id = req.params.id
        const user = await User.findById(id)

        if(!user) return next(new ErrorHandler("Invalid ID", 400))
        
        await user.deleteOne()

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        })
    } catch(error){
        return next(new ErrorHandler("Could Not Find Users", 400))
    }
}