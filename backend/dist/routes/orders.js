import express from 'express';
import { newOrder } from '../controllers/orders.js';
const app = express.Router();
// Create new order - .../api/v1/order/new
app.post("/new", newOrder);
export default app;
