import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minLength: [3, "Product name must be at least 3 characters"],
            maxLength: [150, "product name must be at most 150 characters"],
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            minLength: [20, "Product description must be at least 20 characters"],
        },
        quantity: {
            type: Number,
            required: [true, "Product quantity is required"],
        },
        sold: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
            trim: true,
        },
        priceAfterDiscount: {
            type: Number,
            min: 0,
        },
        colors: [String],
        cover: {
            type: String,
            required: [true, "Product cover is required"],
        },
        images: [String],
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            required: [true, "Product category is required"],
        },
        subcategories: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "Subcategory",
            },
        ],
        brand: {
            type: mongoose.Schema.ObjectId,
            ref: "Brand",
        },
        ratingsAvg: {
            type: Number,
            min: [1, "Rating must be between 1 and 5"],
            max: [5, "Rating must be between 1 and 5"],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Define virtual field for reviews
ProductSchema.virtual("reviews", {
    ref: "Review",
    foreignField: "product",
    localField: "_id",
});

// Pre-find hook to populate category, subcategories, and brand fields
ProductSchema.pre(/^find/, function (next) {
    this.populate([
        { path: "category", select: "name" },
        { path: "subcategories", select: "name" },
        { path: "brand", select: "name" },
    ]);

    next();
});

// Helper function to set image URLs
const setImgUrl = (doc) => {
    if (doc.cover) {
        doc.cover = `${process.env.BASE_URL}/products/${doc.cover}`;
    }

    if (doc.images) {
        const images = [];

        doc.images.forEach((img) => {
            images.push(`${process.env.BASE_URL}/products/${img}`);
        });

        doc.images = images;
    }
};

// Post-init and post-save hooks to update image URLs
ProductSchema.post("init", (doc) => {
    setImgUrl(doc);
});

ProductSchema.post("save", (doc) => {
    setImgUrl(doc);
});

// Create the Product model using the Product schema
const ProductModel = mongoose.model("Product", ProductSchema);

export default ProductModel;
