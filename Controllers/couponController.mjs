import CouponModel from "../models/couponModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";

// @desc Create a new Coupon
// @route POST /api/Coupons
// @access Private/Protected [Admin]
export const addCoupon = factory.createDocument(CouponModel);

// @desc Get all Coupons
// @route GET /api/coupons
// @access Private/Protected [Admin]
export const getCoupons = factory.getAllDocuments(CouponModel);

// @desc Get a specific Coupon
// @route GET /api/coupons/:id
// @access Private/Protected [Admin]
export const getCoupon = factory.getDocument(
    CouponModel,
    "Coupon code is invalid or expired"
);

// @desc Update a Coupon
// @route PUT /api/coupons/:id
// @access Private/Protected [Admin]
export const updateCoupon = factory.updateDocument(
    CouponModel,
    "Coupon not found"
);

// @desc Delete a Coupon
// @route DELETE /api/Coupons/:id
// @access Private/Protected [Admin]
export const deleteCoupon = factory.deleteDocument(
    CouponModel,
    "Coupon not found",
    "Coupon deleted successfully"
);
