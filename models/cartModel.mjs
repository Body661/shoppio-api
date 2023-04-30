import mongoose from "mongoose";

// Define the Cart schema
const CartSchema = new mongoose.Schema(
    {
        cartItems: [
            {
                product: {
                    type: mongoose.Schema.ObjectId,
                    ref: "Product",
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
                color: String,
                price: Number,
                priceAfterDiscount: Number,
            },
        ],
        totalCartPrice: { type: Number, default: 0 },
        totalPriceAfterDiscount: Number,
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

// Pre-find hook to populate the product field in the cartItems array
CartSchema.pre(/^find/, function (next) {
    this.populate({ path: "cartItems.product" });
    next();
});

// Create the Cart model using the Cart schema
const CartModel = mongoose.model("Cart", CartSchema);

export default CartModel;
