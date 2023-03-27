import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "Coupon name is required"],
            unique: [true, "Coupon is already registered"],
        },
        expire: {
            type: Date,
            required: [true, "Expire date is required"],
        },
        discount: {
            type: Number,
            required: [true, "Discount is required"],
        },
    },
    {timestamps: true}
);

const CouponModel = mongoose.model("coupon", CouponSchema);
export default CouponModel;
