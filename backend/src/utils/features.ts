import mongoose from "mongoose"
import { InvalidateCacheProps } from "../types/types.js"
import { myCache } from "../app.js"
import { Product } from "../models/products.js"

export const connectDB = () => {
    mongoose.connect("mongodb://localhost:27017",{
        dbName: "Ecommerce",
    })
    .then((c) => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e))
}


export const invalidateCache = async ({
    product,
    order,
    admin
}: InvalidateCacheProps) => {
    if(product){
        const productKeys: string[] = [
            "latest-products",
            "categories",
            "all-products",
        ]
        const productIds = await Product.distinct("_id")
        productIds.forEach(eachId => {
            productKeys.push(`product-${eachId}`)
        })

        myCache.del(productKeys)
    }
    if(order){

    }
    if(admin){

    }
}