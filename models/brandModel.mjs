import mongoose from "mongoose";

// Define the Brand schema
const BrandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "Brand name is required"],
            unique: [true, "Brand name must be unique"],
            minLength: [2, "Brand name must be at least 2 characters"],
            maxLength: [32, "Brand name is too long"],
        },
        img: {
            type: String,
        },
    },
    { timestamps: true }
);

// Create the Brand model using the Brand schema
const BrandModel = mongoose.model("Brand", BrandSchema);

export default BrandModel;
