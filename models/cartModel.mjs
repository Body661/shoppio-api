import mongoose from "mongoose";

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
                priceAfterDiscount: Number
            },
        ],
        totalCartPrice: {type: Number, default: 0},
        totalPriceAfterDiscount: Number,
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
    },
    {timestamps: true}
);

CartSchema.pre(/^find/, function (next) {
    this.populate({path: 'cartItems.product'})
    next();
});

const CartModel = mongoose.model("Cart", CartSchema);
export default CartModel;
