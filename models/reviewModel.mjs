import mongoose from "mongoose";
import ProductModel from "./productModel.mjs";

const ReviewSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        ratings: {
            type: Number,
            required: [true, "Review ratings are required"],
            min: [1, "Min rating value is 1"],
            max: [5, "Max rating value is 5"],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Review must belong to user"],
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Review must belong to product"],
        },
    },
    { timestamps: true }
);

// Pre-find hook to populate user field with name
ReviewSchema.pre(/^find/, function (next) {
    this.populate("user", "name");
    next();
});

// Static method to calculate average ratings and total ratings for a product
ReviewSchema.statics.calcRatings = async function (productId) {
    const result = await this.aggregate([
        {
            $match: { product: productId },
        },
        {
            $group: {
                _id: "product",
                ratingsAvg: { $avg: "$ratings" },
                ratingsQuantity: { $sum: 1 },
            },
        },
    ]);

    if (result.length > 0) {
        await ProductModel.findByIdAndUpdate(productId, {
            ratingsAvg: result[0].ratingsAvg,
            ratingsQuantity: result[0].ratingsQuantity,
        });
    } else {
        await ProductModel.findByIdAndUpdate(productId, {
            ratingsAvg: 0,
            ratingsQuantity: 0,
        });
    }
};

// Post-save hook to recalculate ratings for the product
ReviewSchema.post("save", function () {
    this.constructor.calcRatings(this.product);
});

// Post-remove hook to recalculate ratings for the product
ReviewSchema.post("remove", function () {
    this.constructor.calcRatings(this.product);
});

// Create the Review model using the Review schema
const ReviewModel = mongoose.model("Review", ReviewSchema);

export default ReviewModel;
