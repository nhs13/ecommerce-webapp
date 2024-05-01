import express from 'express'
import { Request, Response, NextFunction } from 'express';



// Importing routes
import userRoutes from "./routes/user.js"
import { connectDB } from './utils/features.js'
connectDB();
const port = 4000
const app = express()

app.use(express.json())

app.get("/", (req,res)=>{
    res.send("API Working with /api/v1")
})

// Using Routes
app.use("/api/v1/user", userRoutes)


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    return res.status(400).json({
        success: false,
        message: "Something went wrong",
    });
});

app.listen(port, ()=>{
    console.log(`Server is working on http://localhost:${port}`)
})
