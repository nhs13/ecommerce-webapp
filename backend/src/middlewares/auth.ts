import { NextFunction, Request, Response } from "express"
import ErrorHandler from "../utils/utility-class.js"
import { User } from "../models/user.js"

// Middleware to make sure only admin is allowed
export const adminOnly = async (
    req: Request, 
    res: Response, 
    next: NextFunction) => {
    try{
        const {id} = req.query
        if(!id) next(new ErrorHandler("Unauthorized access", 401))
        
        const user = await User.findById(id)
        if(!user) return next(new ErrorHandler("User with this ID does not exist", 400))    
        if(user.role !== "admin") return next(new ErrorHandler("Unauthorized", 401))
        
        next()
    
    } catch(err){
        return next(new ErrorHandler("Something went wrong", 400))
    }
}

// "api/v1/user/someID?key=23"
// here key is query &
// someID is param