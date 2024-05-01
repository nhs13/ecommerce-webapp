import { Request, Response, NextFunction } from "express"

export interface NewUserRequestBody {
    name:string
    email: string
    photo: string
    gender: string
    _id: string
    dob: Date
}

// type def for the wrapper
// export type ControllerType = (
//     req: Request, 
//     res: Response, 
//     next: NextFunction
// ) => Promise<void | Response<any, Record<string, any>>>

// ) => Promise<Response<any, Record<string, any>> | undefined>
