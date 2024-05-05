import express from 'express'
import { adminOnly } from '../middlewares/auth.js'
import { getAllCategories, getLatestProducts, getAdminProducts, newProd, getSingleProduct, updateProduct, deleteProduct, getAllProducts } from '../controllers/product.js'
import { singleUpload } from '../middlewares/multer.js'

const app = express.Router()

// Create new product - .../api/v1/product/new
app.post("/new", adminOnly, singleUpload, newProd)

// To get last 10 Products - .../api/v1/product/latest
app.get("/latest", getLatestProducts)

// To get all products with filters - .../api/v1/product/all
app.get("/all", getAllProducts)

// To get all unique Categories - .../api/v1/product/categories
app.get("/category", getAllCategories)

// To get all Products - .../api/v1/product/admin-products
app.get("/admin-products", adminOnly, getAdminProducts)

// To get, update, delete a single Product
app
    .route("/:id")
    .get(getSingleProduct)
    .put(adminOnly, singleUpload, updateProduct)
    .delete(adminOnly, deleteProduct)

export default app