import express from 'express';
import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';
import NodeCache from 'node-cache';
import { config } from 'dotenv';
import morgan from 'morgan';
config({
    path: "./.env"
});
const mongoURI = process.env.MONGO_URI || "";
connectDB(mongoURI);
const port = process.env.PORT || 4000;
const app = express();
export const myCache = new NodeCache();
// Importing routes
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import paymentRoutes from "./routes/payment.js";
app.use(express.json());
app.use(morgan("dev"));
app.get("/", (req, res) => {
    res.send("API Working with /api/v1");
});
// Using Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);
// making the "uploads" folder serve static files
app.use("/uploads", express.static("uploads"));
// last middleware, so any route's next() would lead to this mw
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
});
