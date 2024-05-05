import { Request, Response, NextFunction } from "express";
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
import { Product } from "../models/products.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";

export const newProd = async(
    req: Request<{},{},NewProductRequestBody>,   // additional type safety
    res: Response, 
    next: NextFunction) => {
    try{
        const {name, category, price, stock} = req.body
        const photo = req.file

        if(!photo) return next(new ErrorHandler("Please add photo", 400))
        
        if(!name || !price || !stock || !category) {
            rm(photo.path, ()=>{
                console.log("deleted")
            })
            return next(new ErrorHandler("Please enter all fields", 400))
        }

        await Product.create({
            name, 
            price, 
            stock,
            category: category.toLowerCase(), 
            photo: photo?.path
        })

        return res.status(201).json({
            success: true,
            message: "Product created"
        })
    }catch(err){
        console.log(err)
        return next(new ErrorHandler("Something went horribly wrong", 400))
    }
}



export const getLatestProducts = async(
    req: Request<{},{},NewProductRequestBody>,   // additional type safety
    res: Response, 
    next: NextFunction) => {
    try{
        const products = await Product.find({}).sort({createdAt:-1}).limit(5)
        return res.status(200).json({
            success: true,
            products
        })
    }catch(err){
        console.log(err)
        return next(new ErrorHandler("Something went horribly wrong", 400))
    }
}



export const getAllCategories = async(
    req: Request<{},{},NewProductRequestBody>,   // additional type safety
    res: Response, 
    next: NextFunction) => {
    try{
        const categories = await Product.distinct("category")
        return res.status(200).json({
            success: true,
            categories
        })
    }catch(err){
        console.log(err)
        return next(new ErrorHandler("Something went horribly wrong", 400))
    }
}


// admin can access all the products
export const getAdminProducts = async(
    req: Request<{},{},NewProductRequestBody>,   // additional type safety
    res: Response, 
    next: NextFunction) => {
    try{
        const products = await Product.find({}).sort({createdAt:-1})
        return res.status(200).json({
            success: true,
            products
        })
    }catch(err){
        console.log(err)
        return next(new ErrorHandler("Something went horribly wrong", 400))
    }
}



export const getSingleProduct = async(
    req: Request<{id: string},{},NewProductRequestBody>,   // additional type safety
    res: Response, 
    next: NextFunction) => {
    try{
        const product = await Product.findById(req.params.id)
        if (!product) return next(new ErrorHandler("Product not found", 404))

        return res.status(200).json({
            success: true,
            product
        })
    }catch(err){
        console.log(err)
        return next(new ErrorHandler("Something went horribly wrong", 400))
    }
}



export const updateProduct = async(
    req: Request<{id: string},{},NewProductRequestBody>,   // additional type safety
    res: Response, 
    next: NextFunction) => {
    try{
        const {id} = req.params
        const {name, category, price, stock} = req.body
        const photo = req.file

        const product = await Product.findById(id)
        if (!product) return next(new ErrorHandler("Product not found", 404))
                
        if(photo) {
            rm(product.photo, ()=>{
                console.log("Old photo deleted")
            })
            product.photo = photo.path
            return next(new ErrorHandler("Please enter all fields", 400))
        }

        if(name) product.name = name
        if(price) product.price = price
        if(stock) product.stock = stock
        if(category) product.category = category

        await product.save()

        return res.status(200).json({
            success: true,
            message: "Product updated successfully"
        })
    }catch(err){
        console.log(err)
        return next(new ErrorHandler("Something went horribly wrong", 400))
    }
}



export const deleteProduct = async(
    req: Request<{id: string},{},NewProductRequestBody>,   // additional type safety
    res: Response, 
    next: NextFunction) => {
    try{
        const product = await Product.findById(req.params.id)
        if (!product) return next(new ErrorHandler("Product not found", 404))

        rm(product.photo, ()=>{
            console.log("Old photo deleted from static uploads folder")
        })
        await product.deleteOne()

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"

        })
    }catch(err){
        console.log(err)
        return next(new ErrorHandler("Something went horribly wrong", 400))
    }
}



export const getAllProducts = async(
    req: Request<{},{},NewProductRequestBody,SearchRequestQuery>,   // additional type safety
    res: Response, 
    next: NextFunction) => {
    try{
        const {search, sort, category, price} = req.query
        const page = Number(req.query.page) || 1
        const limit = Number(process.env.PRODUCT_PER_PAGE) || 8
        const skip = limit * (page-1)

        // so that we take all the query params only if they exist
        const baseQuery: BaseQuery = {}

        if(search) baseQuery.name = {
            $regex: search,  // to search based on pattern and not the entire word
            $options: "i"    // case insensitive kardia
        }
        if(price) baseQuery.price = {$lte: Number(price)}
        if(category) baseQuery.category = category

        // since there are multiple awaits for the same document
        const [products, allFilteredProducts] = await Promise.all([
            Product.find(baseQuery)
            .sort(sort && {price:sort==="asc" ? 1 : -1})
            .limit(limit)
            .skip(skip),

            Product.find(baseQuery)
        ])
        
        const totalPages = Math.ceil(allFilteredProducts.length / limit)

        return res.status(200).json({
            success: true,
            products,
            totalPages
        })
    }catch(err){
        console.log(err)
        return next(new ErrorHandler("Something went horribly wrong", 400))
    }
}
