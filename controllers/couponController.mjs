import CouponModel from "../models/couponModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";

// Action for creating a new coupon
// @route POST /api/Coupons
// @access Private/Protected [Admin]
export const addCoupon = factory.createDocument(CouponModel);

// Action for getting all coupons
// @route GET /api/coupons
// @access Private/Protected [Admin]
export const getCoupons = factory.getAllDocuments(CouponModel);

// Action for Getting a specific coupon
// @route GET /api/coupons/:id
// @access Private/Protected [Admin]
export const getCoupon = factory.getDocument(
    CouponModel,
    "Coupon code is invalid or expired"
);

// Action for updating a coupon
// @route PUT /api/coupons/:id
// @access Private/Protected [Admin]
export const updateCoupon = factory.updateDocument(
    CouponModel,
    "Coupon not found"
);

// Action deleting a coupon by id
// @route DELETE /api/Coupons/:id
// @access Private/Protected [Admin]
export const deleteCoupon = factory.deleteDocument(
    CouponModel,
    "Coupon not found",
    "Coupon deleted successfully"
);
