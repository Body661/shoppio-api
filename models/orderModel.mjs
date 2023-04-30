import mongoose from "mongoose";

// Define the Order schema
const OrderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "Order must belong to a user"],
        },
        cartItems: [
            {
                product: {
                    type: mongoose.Schema.ObjectId,
                    ref: "Product",
                },
                quantity: Number,
                color: String,
                price: Number,
            },
        ],
        taxPrice: {
            type: Number,
            default: 0,
        },
        shippingAddress: {
            details: String,
            phone: String,
            city: String,
            postalCode: String,
        },
        shippingPrice: {
            type: Number,
            default: 0,
        },
        totalOrderPrice: {
            type: Number,
        },
        paymentMethodType: {
            type: String,
            enum: ["card", "cash"],
            default: "card",
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        paidAt: Date,
        isDelivered: {
            type: Boolean,
            default: false,
        },
        deliveredAt: Date,
    },
    { timestamps: true }
);

// Pre-find hook to populate the user and cartItems fields
OrderSchema.pre(/^find/, function (next) {
    this.populate([
        { path: "user", select: "name email phone" },
        {
            path: "cartItems.product",
        },
    ]);
    next();
});

// Create the Order model using the Order schema
const OrderModel = mongoose.model("Order", OrderSchema);

export default OrderModel;
