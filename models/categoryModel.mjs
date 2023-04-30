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

// Set the image URL using the base URL from the environment variables
const setImgUrl = (doc) => {
    if (doc.img) {
        doc.img = `${process.env.BASE_URL}/categories/${doc.img}`;
    }
};

// Post-init hook to set the image URL
CategorySchema.post("init", (doc) => {
    setImgUrl(doc);
});

// Post-save hook to set the image URL
CategorySchema.post("save", (doc) => {
    setImgUrl(doc);
});

// Create the Category model using the Category schema
const CategoryModel = mongoose.model("Category", CategorySchema);

export default CategoryModel;
