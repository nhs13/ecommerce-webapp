import { Product } from "../models/products.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";
// Revalidate on New, Update, Delete Product or on New Order
export const getLatestProducts = async (req, // additional type safety
res, next) => {
    try {
        let products = [];
        if (myCache.has("latest-products"))
            // retrieve value from cache is exists for optimization
            // value retrieved from the cache has unknown type at compile time
            products = JSON.parse(myCache.get("latest-products"));
        else {
            products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
            myCache.set("latest-products", JSON.stringify(products));
        }
        return res.status(200).json({
            success: true,
            products
        });
    }
    catch (err) {
        console.log(err);
        return next(new ErrorHandler("Something went horribly wrong", 400));
    }
};
// Revalidate on New, Update, Delete Product or on New Order
export const getAllCategories = async (req, // additional type safety
res, next) => {
    try {
        let categories = [];
        if (myCache.has("categories"))
            categories = JSON.parse(myCache.get("categories"));
        else {
            categories = await Product.distinct("category");
            myCache.set("category", JSON.stringify(categories));
        }
        return res.status(200).json({
            success: true,
            categories
        });
    }
    catch (err) {
        console.log(err);
        return next(new ErrorHandler("Something went horribly wrong", 400));
    }
};
// admin can access all the products
// Revalidate on New, Update, Delete Product or on New Order
export const getAdminProducts = async (req, // additional type safety
res, next) => {
    try {
        let products = [];
        if (myCache.has("all-products"))
            products = JSON.parse(myCache.get("all-products"));
        else {
            products = await Product.find({}).sort({ createdAt: -1 });
            myCache.set("all-products", JSON.stringify(products));
        }
        return res.status(200).json({
            success: true,
            products
        });
    }
    catch (err) {
        console.log(err);
        return next(new ErrorHandler("Something went horribly wrong", 400));
    }
};
// Revalidate on New, Update, Delete Product or on New Order
export const getSingleProduct = async (req, // additional type safety
res, next) => {
    try {
        let product;
        const id = req.params.id;
        if (myCache.has(`product-${id}`)) {
            product = JSON.parse(myCache.get(`product-${id}`));
        }
        else {
            product = await Product.findById(id);
            if (!product)
                return next(new ErrorHandler("Product not found", 404));
            myCache.set(`product-${id}`, JSON.stringify(product));
        }
        return res.status(200).json({
            success: true,
            product
        });
    }
    catch (err) {
        console.log(err);
        return next(new ErrorHandler("Something went horribly wrong", 400));
    }
};
export const newProd = async (req, // additional type safety
res, next) => {
    try {
        const { name, category, price, stock } = req.body;
        const photo = req.file;
        if (!photo)
            return next(new ErrorHandler("Please add photo", 400));
        if (!name || !price || !stock || !category) {
            rm(photo.path, () => {
                console.log("deleted");
            });
            return next(new ErrorHandler("Please enter all fields", 400));
        }
        await Product.create({
            name,
            price,
            stock,
            category: category.toLowerCase(),
            photo: photo?.path
        });
        // Invalidate the cache
        await invalidateCache({ product: true });
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
export const updateProduct = async (req, // additional type safety
res, next) => {
    try {
        const { id } = req.params;
        const { name, price, stock, category } = req.body;
        const photo = req.file;
        const product = await Product.findById(id);
        if (!product)
            return next(new ErrorHandler("Product Not Found", 404));
        if (photo) {
            rm(product.photo, () => {
                console.log("Old Photo Deleted");
            });
            product.photo = photo.path;
        }
        if (name)
            product.name = name;
        if (price)
            product.price = price;
        if (stock)
            product.stock = stock;
        if (category)
            product.category = category;
        await product.save();
        invalidateCache({
            product: true,
            productId: String(product._id),
            admin: true,
        });
        return res.status(200).json({
            success: true,
            message: "Product updated successfully"
        });
    }
    catch (err) {
        console.log(err);
        return next(new ErrorHandler("Something went horribly wrong", 400));
    }
};
export const deleteProduct = async (req, // additional type safety
res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product)
            return next(new ErrorHandler("Product not found", 404));
        rm(product.photo, () => {
            console.log("Old photo deleted from static uploads folder");
        });
        await product.deleteOne();
        await invalidateCache({ product: true, productId: String(product._id) });
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    }
    catch (err) {
        console.log(err);
        return next(new ErrorHandler("Something went horribly wrong", 400));
    }
};
export const getAllProducts = async (req, // additional type safety
res, next) => {
    try {
        const { search, sort, category, price } = req.query;
        const page = Number(req.query.page) || 1;
        const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
        const skip = limit * (page - 1);
        // so that we take all the query params only if they exist
        const baseQuery = {};
        if (search)
            baseQuery.name = {
                $regex: search, // to search based on pattern and not the entire word
                $options: "i" // case insensitive kardia
            };
        if (price)
            baseQuery.price = { $lte: Number(price) };
        if (category)
            baseQuery.category = category;
        // since there are multiple awaits for the same document
        const [products, allFilteredProducts] = await Promise.all([
            Product.find(baseQuery)
                .sort(sort && { price: sort === "asc" ? 1 : -1 })
                .limit(limit)
                .skip(skip),
            Product.find(baseQuery)
        ]);
        const totalPages = Math.ceil(allFilteredProducts.length / limit);
        return res.status(200).json({
            success: true,
            products,
            totalPages
        });
    }
    catch (err) {
        console.log(err);
        return next(new ErrorHandler("Something went horribly wrong", 400));
    }
};
