import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";
import { Product } from "../models/products.js";
import { Order } from "../models/order.js";
import { User } from "../models/user.js";
import { calcPercentage, getCategoryPercentage } from "../utils/features.js";
export const getDashboardStats = async (req, res, next) => {
    try {
        let stats;
        if (myCache.has("admin-stats"))
            stats = JSON.parse(myCache.get("admin-stats"));
        else {
            const today = new Date();
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(today.getMonth() - 6);
            const thisMonth = {
                start: new Date(today.getFullYear(), today.getMonth(), 1),
                end: today
            };
            const lastMonth = {
                start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
                end: new Date(today.getFullYear(), today.getMonth(), 0)
            };
            // getting this month's and last month's prods from the db
            const thisMonthProductsPromise = Product.find({
                createdAt: {
                    $gte: thisMonth.start,
                    $lte: thisMonth.end,
                }
            });
            const lastMonthProductsPromise = Product.find({
                createdAt: {
                    $gte: lastMonth.start,
                    $lte: lastMonth.end,
                }
            });
            const thisMonthUsersPromise = User.find({
                createdAt: {
                    $gte: thisMonth.start,
                    $lte: thisMonth.end,
                }
            });
            const lastMonthUsersPromise = User.find({
                createdAt: {
                    $gte: lastMonth.start,
                    $lte: lastMonth.end,
                }
            });
            const thisMonthOrdersPromise = Order.find({
                createdAt: {
                    $gte: thisMonth.start,
                    $lte: thisMonth.end,
                }
            });
            const lastMonthOrdersPromise = Order.find({
                createdAt: {
                    $gte: lastMonth.start,
                    $lte: lastMonth.end,
                }
            });
            // getting the last 6 months' orders
            const lastSixMonthOrdersPromise = Order.find({
                createdAt: {
                    $gte: sixMonthsAgo,
                    $lte: today,
                }
            });
            const latestTransactionsPromise = Order.find({}).select(["orderItems", "discount", "total", "status"]).limit(4);
            // concurrent exec not one after the other - more efficient
            // useful when individual promises are independent
            const [thisMonthProducts, lastMonthProducts, thisMonthUsers, lastMonthUsers, thisMonthOrders, lastMonthOrders, productsCount, usersCount, allOrders, lastSixMonthOrders, categories, femaleUsersCount, latestTransactions,] = await Promise.all([
                thisMonthProductsPromise, lastMonthProductsPromise,
                thisMonthUsersPromise, lastMonthUsersPromise,
                thisMonthOrdersPromise, lastMonthOrdersPromise,
                Product.countDocuments(),
                User.countDocuments(),
                Order.find({}).select("total"),
                lastSixMonthOrdersPromise,
                Product.distinct("category"),
                User.countDocuments({ gender: "female" }),
                latestTransactionsPromise,
            ]);
            // calculating monthly revenue
            const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => (sum + (order.total || 0)), 0);
            const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => (sum + (order.total || 0)), 0);
            const changePercentages = {
                revenue: calcPercentage(thisMonthRevenue, lastMonthRevenue),
                products: calcPercentage(thisMonthProducts.length, lastMonthProducts.length),
                users: calcPercentage(thisMonthUsers.length, lastMonthUsers.length),
                orders: calcPercentage(thisMonthOrders.length, lastMonthOrders.length)
            };
            const revenueCount = allOrders.reduce((sum, order) => (sum + (order.total || 0)), 0);
            const countValues = {
                user: usersCount,
                product: productsCount,
                order: allOrders.length,
                revenue: revenueCount
            };
            // data generation for the charts
            const orderMonthCounts = new Array(6).fill(0);
            const orderMonthlyRevenue = new Array(6).fill(0);
            lastSixMonthOrders.forEach((order) => {
                const creationDate = order.createdAt;
                const monthDifference = (12 + today.getMonth() - creationDate.getMonth()) % 12;
                if (monthDifference < 6) {
                    orderMonthCounts[6 - monthDifference - 1] += 1;
                    orderMonthlyRevenue[6 - monthDifference - 1] += order.total;
                }
            });
            // to fill the inventory display
            const categoryPercentage = await getCategoryPercentage(categories, productsCount);
            // gender ratio
            const userRatio = {
                male: usersCount - femaleUsersCount,
                female: femaleUsersCount,
            };
            // modifying the latestTransactions to get tailored data suited to our needs
            const modifiedLatestTransactions = latestTransactions.map(t => ({
                _id: t._id,
                discount: t.discount,
                amount: t.total,
                quantity: t.orderItems.length,
                status: t.status,
            }));
            stats = {
                userRatio,
                latestTransactions,
                modifiedLatestTransactions,
                categoryPercentage,
                changePercentages,
                countValues,
                charts: {
                    orderMonthCounts,
                    orderMonthlyRevenue
                }
            };
            myCache.set("admin-stats", JSON.stringify(stats));
        }
        return res.status(200).json({
            success: true,
            stats,
        });
    }
    catch (err) {
        return next(new ErrorHandler("Something went wrong", 400));
    }
};
export const getPieCharts = async (req, res, next) => {
    try {
        let charts;
        if (myCache.has("admin-pie-charts"))
            charts = JSON.parse(myCache.get("admin-pie-charts"));
        else {
            const [ordersInProcessing, shippedOrders, deliveredOrders, categories, productsCount, outOfStock, allOrders, allUsers, adminUsers, customerUsers,] = await Promise.all([
                Order.countDocuments({ status: "Processing" }),
                Order.countDocuments({ status: "Shipped" }),
                Order.countDocuments({ status: "Delivered" }),
                Product.distinct("category"),
                Product.countDocuments(),
                Product.countDocuments({ stock: 0 }),
                Order.find({}).select(["total", "discount", "subtotal", "tax", "shippingCharges"]),
                User.find({}),
                User.countDocuments({ role: "admin" }),
                User.countDocuments({ role: "user" }),
            ]);
            // status of the orders 
            const orderFulfillment = {
                processing: ordersInProcessing,
                shipped: shippedOrders,
                delivered: deliveredOrders,
            };
            // ratio of categories of products
            const productCategory = await getCategoryPercentage(categories, productsCount);
            // stock availability 
            const stockAvailability = {
                inStock: productsCount - outOfStock,
                outOfStock: outOfStock,
            };
            const grossIncome = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);
            const discount = allOrders.reduce((sum, order) => sum + (order.discount || 0), 0);
            const productionCost = allOrders.reduce((sum, order) => sum + (order.shippingCharges || 0), 0);
            const burnt = allOrders.reduce((sum, order) => sum + (order.tax || 0), 0);
            const marketingCost = Math.round(grossIncome * (30 / 100));
            const netMargin = grossIncome - discount - productionCost - burnt - marketingCost;
            // revenue distribution pie chart
            const revenueDistribution = {
                netMargin,
                discount,
                productionCost,
                burnt,
                marketingCost,
            };
            // age group of users for pie chart
            const usersAgeGroup = {
                teen: allUsers.filter(i => i.age < 20).length,
                adult: allUsers.filter(i => i.age < 40 && i.age >= 20).length,
                old: allUsers.filter(i => i.age >= 40).length,
            };
            // admins and customers pie chart
            const adminCustomer = {
                admins: adminUsers,
                customers: customerUsers
            };
            charts = {
                stockAvailability,
                productCategory,
                orderFulfillment,
                revenueDistribution,
                adminCustomer,
                usersAgeGroup,
            };
            myCache.set("admin-pie-charts", JSON.stringify(charts));
        }
        return res.status(200).json({
            success: true,
            charts,
        });
    }
    catch (err) {
        return next(new ErrorHandler("Something went wrong", 400));
    }
};
export const getBarCharts = async (req, res, next) => {
    try {
        let charts;
        const key = "admin-bar-charts";
        if (myCache.has(key))
            charts = JSON.parse(myCache.get(key));
        else {
            const today = new Date();
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            const twelveMonthsAgo = new Date();
            twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
            // promises to resolve
            const sixMonthProductPromise = Product.find({
                createdAt: {
                    $gte: sixMonthsAgo,
                    $lte: today,
                },
            }).select("createdAt");
            const sixMonthUsersPromise = User.find({
                createdAt: {
                    $gte: sixMonthsAgo,
                    $lte: today,
                },
            }).select("createdAt");
            const twelveMonthOrdersPromise = Order.find({
                createdAt: {
                    $gte: twelveMonthsAgo,
                    $lte: today,
                },
            }).select("createdAt");
            // resolving all promises
            const [products, users, orders] = await Promise.all([
                sixMonthProductPromise,
                sixMonthUsersPromise,
                twelveMonthOrdersPromise,
            ]);
            // data gen for the charts
            const productsCounts = new Array(6).fill(0);
            products.forEach((i) => {
                const creationDate = i.createdAt;
                const monthDifference = (12 + today.getMonth() - creationDate.getMonth()) % 12;
                if (monthDifference < 6) {
                    productsCounts[6 - monthDifference - 1] += 1;
                }
            });
            const usersCounts = new Array(6).fill(0);
            users.forEach((i) => {
                const creationDate = i.createdAt;
                const monthDifference = (12 + today.getMonth() - creationDate.getMonth()) % 12;
                if (monthDifference < 6) {
                    usersCounts[6 - monthDifference - 1] += 1;
                }
            });
            const ordersCounts = new Array(12).fill(0);
            orders.forEach((i) => {
                const creationDate = i.createdAt;
                const monthDifference = (12 + today.getMonth() - creationDate.getMonth()) % 12;
                if (monthDifference < 12) {
                    ordersCounts[12 - monthDifference - 1] += 1;
                }
            });
            charts = {
                users: usersCounts,
                products: productsCounts,
                orders: ordersCounts,
            };
            myCache.set(key, JSON.stringify(charts));
        }
        return res.status(200).json({
            success: true,
            charts,
        });
    }
    catch (err) {
        return next(new ErrorHandler("Something went wrong", 400));
    }
};
export const getLineCharts = async (req, res, next) => {
    try {
        // let charts;
        // const key = "admin-line-charts";
        // if (myCache.has(key)) charts = JSON.parse(myCache.get(key) as string);
        // else {
        //   const today = new Date();
        //   const twelveMonthsAgo = new Date();
        //   twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        //   const baseQuery = {
        //     createdAt: {
        //       $gte: twelveMonthsAgo,
        //       $lte: today,
        //     },
        //   };
        //   const [products, users, orders] = await Promise.all([
        //     Product.find(baseQuery).select("createdAt"),
        //     User.find(baseQuery).select("createdAt"),
        //     Order.find(baseQuery).select(["createdAt", "discount", "total"]),
        //   ]);
        //   const productCounts = getChartData({ length: 12, today, docArr: products });
        //   const usersCounts = getChartData({ length: 12, today, docArr: users });
        //   const discount = getChartData({
        //     length: 12,
        //     today,
        //     docArr: orders,
        //     property: "discount",
        //   });
        //   const revenue = getChartData({
        //     length: 12,
        //     today,
        //     docArr: orders,
        //     property: "total",
        //   });
        //   charts = {
        //     users: usersCounts,
        //     products: productCounts,
        //     discount,
        //     revenue,
        //   };
        //   myCache.set(key, JSON.stringify(charts));
        // }
        return res.status(200).json({
            success: true,
        });
    }
    catch (err) {
        return next(new ErrorHandler("Something went wrong", 400));
    }
};
