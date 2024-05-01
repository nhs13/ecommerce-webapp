// import { ControllerType } from "../types/types.js";
export const errorMiddleware = (err, req, res, next) => {
    // i += 1
    // err.message = err.message || "Something went wrong"
    err.message || (err.message = "Something went wrong");
    err.statusCode || (err.statusCode = 500);
    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
// try-catch wrapper
// this is an arr fn which returns an arr fn
// export const TryCatch = (func: ControllerType) => (req: Request,res: Response,next: NextFunction) => {
//     return Promise.resolve(func(req,res,next))
// }
