import express from 'express';
// Importing routes
import userRoutes from "./routes/user.js";
import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';
connectDB();
const port = 4000;
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.send("API Working with /api/v1");
});
// Using Routes
app.use("/api/v1/user", userRoutes);
// last middleware, so any route's next() would lead to this mw
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
});
