import ErrorHandler from "../utils/utility-class.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import { myCache } from "../app.js";
export const newOrder = async (req, res, next) => {
    try {
        const { shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total } = req.body;
        if (!shippingInfo ||
            !orderItems ||
            !user ||
            !tax ||
            !total)
            return next(new ErrorHandler("Please enter all fields", 400));
        const order = await Order.create({
            shippingInfo,
            orderItems,
            user,
            subtotal,
            tax,
            shippingCharges,
            discount,
            total,
        });
        // reduce the stock after placing an order
        await reduceStock(orderItems);
        await invalidateCache({ product: true, order: true, admin: true, userId: user, productId: order.orderItems.map(i => String(i.productId)) });
        return res.status(201).json({
            success: true,
            message: "Order Placed Successfully"
        });
    }
    catch (err) {
        console.log(err);
        return next(new ErrorHandler("Something went horribly wrong", 400));
    }
};
export const myOrders = async (req, res, next) => {
    try {
        const { id } = req.query;
        const key = `my-orders-${id}`;
        let orders = [];
        if (myCache.has(key))
            orders = JSON.parse(myCache.get(key));
        else {
            orders = await Order.find({ user: id });
            myCache.set(key, JSON.stringify(orders));
        }
        return res.status(201).json({
            success: true,
            orders,
        });
    }
    catch (err) {
        console.log(err);
        return next(new ErrorHandler("Something went horribly wrong", 400));
    }
};
export const allOrders = async (req, res, next) => {
    try {
        const key = "all-orders";
        let orders = [];
        if (myCache.has(key))
            orders = JSON.parse(myCache.get(key));
        else {
            orders = await Order.find({}).populate("user", "name"); // to see the name of the user clearly
            myCache.set(key, JSON.stringify(orders));
        }
        return res.status(201).json({
            success: true,
            orders,
        });
    }
    catch (err) {
        console.log(err);
        return next(new ErrorHandler("Something went horribly wrong", 400));
    }
};
export const getSingleOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(id);
        const key = `order-${id}`;
        let order;
        if (myCache.has(key))
            order = JSON.parse(myCache.get(key));
        else {
            // .populate tell mongoose to replace the "user" field with actual 
            // "User" document referenced by the "order" field, here we only replace it with the name of user
            order = await Order.findById(id).populate("user", "name");
            if (!order)
                return next(new ErrorHandler("Order not found", 404));
            myCache.set(key, JSON.stringify(order));
        }
        return res.status(201).json({
            success: true,
            order,
        });
    }
    catch (err) {
        if (err instanceof Error && err.name === "CastError")
            return next(new ErrorHandler("Invalid ID", 404));
        return next(new ErrorHandler("Something went horribly wrong", 400));
    }
};
export const processOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order)
            return next(new ErrorHandler("Order not found", 404));
        switch (order.status) {
            case "Processing":
                order.status = "Shipped";
                break;
            case "Shipped":
                order.status = "Delivered";
                break;
            default:
                order.status = "Delivered";
                break;
        }
        await order.save();
        await invalidateCache({ product: false, order: true, admin: true, userId: order.user, orderId: String(order._id) });
        return res.status(201).json({
            success: true,
            message: "Order Processed"
        });
    }
    catch (err) {
        console.log(err);
        return next(new ErrorHandler("Something went horribly wrong", 400));
    }
};
export const deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order)
            return next(new ErrorHandler("Order not found", 404));
        await order.deleteOne();
        await invalidateCache({ product: false, order: true, admin: true, userId: order.user, orderId: String(order._id) });
        return res.status(201).json({
            success: true,
            message: "Order Deleted"
        });
    }
    catch (err) {
        console.log(err);
        return next(new ErrorHandler("Something went horribly wrong", 400));
    }
};
