import {check} from "express-validator";
import CouponModel from "../../models/couponModel.mjs";
import validatorMiddleware from "../../middlewares/validatorMiddleware.mjs";

export const addCouponValidator = [
    check("name")
        .notEmpty()
        .withMessage("Coupon Name is required")
        .custom(async (name) => {
            const coupon = await CouponModel.findOne({name});

            if (coupon) {
                throw new Error("Coupon Name is already in use");
            }

            return true;
        }),
    check("expire")
        .notEmpty()
        .withMessage("Expiration date is required")
        .isDate()
        .withMessage("Expiration date must be a valid date")
        .custom(async (date) => {
            if (new Date(date) * 1000 < Date.now() * 1000) {
                throw new Error("Expiration date must be greater than current date");
            }

            return true;
        }),
    check("discount")
        .notEmpty()
        .withMessage("Discount value is required")
        .isNumeric()
        .withMessage("Discount value must be a number"),
    validatorMiddleware,
];

export const updateCouponValidator = [
    check("name")
        .optional()
        .notEmpty()
        .withMessage("Coupon Name is required")
        .custom(async (name) => {
            const coupon = await CouponModel.findOne({name});

            if (coupon) {
                throw new Error("Coupon Name is already in use");
            }

            return true;
        }),
    check("expire")
        .optional()
        .notEmpty()
        .withMessage("Expiration date is required")
        .isDate()
        .withMessage("Expiration date must be a valid date")
        .custom(async (date) => {
            if (new Date(date) * 1000 < Date.now() * 1000) {
                throw new Error("Expiration date must be greater than current date");
            }

            return true;
        }),
    check("discount")
        .optional()
        .notEmpty()
        .withMessage("Discount value is required")
        .isNumeric()
        .withMessage("Discount value must be a number"),
    validatorMiddleware,
];
