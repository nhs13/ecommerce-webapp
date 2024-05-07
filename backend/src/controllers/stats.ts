import { Response,Request,NextFunction } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";
import { Product } from "../models/products.js";
import { Order } from "../models/order.js";
import { User } from "../models/user.js";
import { calcPercentage } from "../utils/features.js";


export const getDashboardStats = async(
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try{
        let stats;
        if(myCache.has("admin-stats")) stats = JSON.parse(myCache.get("admin-stats") as string)
        else{
            const today = new Date()
            const sixMonthsAgo = new Date()
            sixMonthsAgo.setMonth(today.getMonth()-6)
            
            const thisMonth = {
                start: new Date(today.getFullYear(), today.getMonth(), 1),
                end: today
            }

            const lastMonth = {
                start: new Date(today.getFullYear(), today.getMonth()-1, 1),
                end: new Date(today.getFullYear(), today.getMonth(), 0)
            }
        
            // getting this month's and last month's prods from the db
            const thisMonthProductsPromise = Product.find({
                createdAt : {
                    $gte: thisMonth.start,
                    $lte: thisMonth.end,
                }
            })
            const lastMonthProductsPromise = Product.find({
                createdAt : {
                    $gte: lastMonth.start,
                    $lte: lastMonth.end,
                }
            })

            const thisMonthUsersPromise = User.find({
                createdAt : {
                    $gte: thisMonth.start,
                    $lte: thisMonth.end,
                }
            })
            const lastMonthUsersPromise = User.find({
                createdAt : {
                    $gte: lastMonth.start,
                    $lte: lastMonth.end,
                }
            })

            const thisMonthOrdersPromise = Order.find({
                createdAt : {
                    $gte: thisMonth.start,
                    $lte: thisMonth.end,
                }
            })
            const lastMonthOrdersPromise = Order.find({
                createdAt : {
                    $gte: lastMonth.start,
                    $lte: lastMonth.end,
                }
            })

            // getting the last 6 months' orders
            const lastSixMonthOrdersPromise = Order.find({
                createdAt : {
                    $gte: sixMonthsAgo,
                    $lte: today,
                }
            })
            

            // concurrent exec not one after the other - more efficient
            // useful when individual promises are independent
            const [
                thisMonthProducts, lastMonthProducts,
                thisMonthUsers, lastMonthUsers,
                thisMonthOrders, lastMonthOrders,
                productsCount,
                usersCount,
                allOrders,
                lastSixMonthOrders,
            ] = await Promise.all([
                thisMonthProductsPromise, lastMonthProductsPromise,
                thisMonthUsersPromise, lastMonthUsersPromise,
                thisMonthOrdersPromise, lastMonthOrdersPromise,
                Product.countDocuments(),
                User.countDocuments(),
                Order.find({}).select("total"),
                lastSixMonthOrdersPromise,
            ])

            // calculating monthly revenue
            const thisMonthRevenue = thisMonthOrders.reduce(
                (sum,order)=>(sum + (order.total || 0)), 0
            )
            const lastMonthRevenue = lastMonthOrders.reduce(
                (sum,order)=>(sum + (order.total || 0)), 0
            )

            const changePercentages = {
                revenue: calcPercentage(
                    thisMonthRevenue, 
                    lastMonthRevenue
                ),
                products: calcPercentage(
                    thisMonthProducts.length, 
                    lastMonthProducts.length
                ),
                users: calcPercentage(
                    thisMonthUsers.length, 
                    lastMonthUsers.length
                ),
                orders: calcPercentage(
                    thisMonthOrders.length, 
                    lastMonthOrders.length
                )
            }

            const revenueCount = allOrders.reduce(
                (sum,order)=>(sum + (order.total || 0)), 0
            )

            const countValues = {
                user: usersCount,
                product: productsCount,
                order: allOrders.length,
                revenue: revenueCount

            }

            const orderMonthCounts = new Array(6).fill(0)
            const orderMonthlyRevenue = new Array(6).fill(0)

            lastSixMonthOrders.forEach(
                (order)=>{
                    const creationDate = order.createdAt
                    const monthDifference = today.getMonth() - creationDate.getMonth()
                    
                    if(monthDifference<6){
                        orderMonthCounts[6-monthDifference-1] += 1
                        orderMonthlyRevenue[6-monthDifference-1] += order.total
                    }
                }
            )

            stats = {
                changePercentages,
                countValues,
                chart:{
                    orderMonthCounts,
                    orderMonthlyRevenue
                }
            }
        } 

        return res.status(200).json({
            success: true,
            stats,
        })
    }catch(err){
        return next(new ErrorHandler("Something went wrong", 400))
    }
}



export const getPieCharts = async(
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try{

    }catch(err){
        return next(new ErrorHandler("Something went wrong", 400))
    }
}



export const getBarCharts = async(
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try{

    }catch(err){
        return next(new ErrorHandler("Something went wrong", 400))
    }
}



export const getLineCharts = async(
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try{

    }catch(err){
        return next(new ErrorHandler("Something went wrong", 400))
    }
}