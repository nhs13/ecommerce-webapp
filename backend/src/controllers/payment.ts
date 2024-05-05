import { Request,Response,NextFunction } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { Coupon } from "../models/coupon.js";


export const newCoupon = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const {coupon, amount} = req.body
        if(!coupon || !amount) return next(new ErrorHandler("Enter all fields", 400))

        await Coupon.create({coupon, amount})

        return res.status(200).json({
            success: true,
            message: `Coupon ${coupon} Created Successfully`
        })
    } catch(err){
        return next(new ErrorHandler("Something went wrong", 400))
    }
}


export const applyDiscount = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const {coupon} = req.query
        const discount = await Coupon.findOne({coupon})

        if(!discount) return next(new ErrorHandler("Invalid coupon code", 400))

        return res.status(200).json({
            success: true,
            discount: discount.amount,
        })
    } catch(err){
        return next(new ErrorHandler("Something went wrong", 400))
    }
}



export const allCoupons = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const coupons = await Coupon.find({})

        return res.status(200).json({
            success: true,
            coupons,
        })
    } catch(err){
        return next(new ErrorHandler("Something went wrong", 400))
    }
}



export const deleteCoupon = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const {id} = req.params
        const coupon = await Coupon.findByIdAndDelete(id)

        if(!coupon) return next(new ErrorHandler("Invalid Coupon Id", 400))

        return res.status(200).json({
            success: true,
            message: `Coupon ${coupon} deleted successfully`,
        })
    } catch(err){
        return next(new ErrorHandler("Something went wrong", 400))
    }
}