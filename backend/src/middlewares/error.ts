import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utility-class.js";
// import { ControllerType } from "../types/types.js";

export const errorMiddleware = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    
    // i += 1
    // err.message = err.message || "Something went wrong"
    err.message ||= "Something went wrong"
    err.statusCode ||= 500
    
    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}


// try-catch wrapper
// this is an arr fn which returns an arr fn
// export const TryCatch = (func: ControllerType) => (req: Request,res: Response,next: NextFunction) => {
//     return Promise.resolve(func(req,res,next))
// }