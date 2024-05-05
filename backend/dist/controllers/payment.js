import ErrorHandler from "../utils/utility-class.js";
import { Coupon } from "../models/coupon.js";
export const newCoupon = async (req, res, next) => {
    try {
        const { coupon, amount } = req.body;
        if (!coupon || !amount)
            return next(new ErrorHandler("Enter all fields", 400));
        await Coupon.create({ coupon, amount });
        return res.status(200).json({
            success: true,
            message: `Coupon ${coupon} Created Successfully`
        });
    }
    catch (err) {
        return next(new ErrorHandler("Something went wrong", 400));
    }
};
