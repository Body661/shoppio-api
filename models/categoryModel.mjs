import mongoose from "mongoose";

// Define the Category schema
const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "Category name is required"],
            unique: [true, "Category name must be unique"],
            minLength: [3, "Category name must be at least 3 characters"],
            maxLength: [32, "Category name is too long"],
        },
        img: {
            type: String,
        },
    },
    { timestamps: true }
);

// Create the Category model using the Category schema
const CategoryModel = mongoose.model("Category", CategorySchema);

export default CategoryModel;
