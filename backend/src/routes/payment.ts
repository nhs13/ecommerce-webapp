import express from 'express'
import { deleteUser, getAllUsers, getUser, newUser } from '../controllers/user.js'
import { adminOnly } from '../middlewares/auth.js'
import { newCoupon } from '../controllers/payment.js'

const app = express.Router()


// route -> .../api/v1/payment/coupon/new
app.post("/coupon/new", newCoupon)

export default app