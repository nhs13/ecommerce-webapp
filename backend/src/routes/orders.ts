import express from 'express'
import { adminOnly } from '../middlewares/auth.js'
import { singleUpload } from '../middlewares/multer.js'
import { allOrders, deleteOrder, getSingleOrder, myOrders, newOrder, processOrder } from '../controllers/orders.js'

const app = express.Router()

// Create new order - .../api/v1/order/new
app.post("/new", newOrder)

// Get my orders - .../api/v1/order/my?userId
app.get("/my", myOrders)

// Get all orders - .../api/v1/order/all
app.get("/all", adminOnly, allOrders)

// Get Single Order, Change order processing status & Delete Order
app.route("/:id").get(getSingleOrder).put(adminOnly,processOrder).delete(adminOnly,deleteOrder)

export default app