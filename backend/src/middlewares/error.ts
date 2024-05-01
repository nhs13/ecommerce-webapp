import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    
    // i += 1
    // err.message = err.message || "Something went wrong"
    err.message ||= "Something went wrong"
    
    return res.status(400).json({
        success: false,
        message: err.message,
    });
}