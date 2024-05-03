import { Product } from "../models/products.js";
import ErrorHandler from "../utils/utility-class.js";
export const newProd = async (req, // additional type safety
res, next) => {
    try {
        const { name, category, price, stock } = req.body;
        const photo = req.file;
        await Product.create({
            name,
            price,
            stock,
            category: category.toLowerCase(),
            photo: photo?.path
        });
        return res.status(201).json({
            success: true,
            message: "Product created"
        });
    }
    catch (err) {
        console.log(err);
        return next(new ErrorHandler("Something went horribly wrong", 400));
    }
};
