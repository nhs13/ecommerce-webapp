import mongoose from "mongoose";
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name"]
    },
    Photo: {
        type: String,
        required: [true, "Please add Photo"]
    },
    Price: {
        type: Number,
        required: [true, "Please enter the Price"]
    },
    Stock: {
        type: Number,
        required: [true, "Please enter the Stock"]
    },
    Category: {
        type: String,
        required: [true, "Please enter the Category"]
    },
}, {
    timestamps: true,
});
export const Product = mongoose.model("Product", schema);