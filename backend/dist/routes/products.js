import express from 'express';
import { newProd } from '../controllers/product.js';
import { singleUpload } from '../middlewares/multer.js';
const app = express.Router();
app.post("/new", singleUpload, newProd);
export default app;
