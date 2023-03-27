import {check} from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.mjs";

export const addProductToCartValidator = [
    check("productId")
        .notEmpty()
        .withMessage("product Id is required")
        .isMongoId()
        .withMessage("Product id is not valid"),
    check("quantity")
        .optional()
        .notEmpty()
        .withMessage("Quantity cant not be an empty value")
        .isNumeric()
        .withMessage("Quantity must be a number"),
    check("color")
        .optional()
        .notEmpty()
        .withMessage("Color cant not be an empty value"),
    validatorMiddleware,
];

export const removeItemFromCartValidator = [
    check("id").isMongoId().withMessage("product ID is not valid"),
    validatorMiddleware,
];

export const updateItemQuantityValidator = [
    check("id").isMongoId().withMessage("product ID is not valid"),
    validatorMiddleware,
];

export const applyCouponValidator = [
    check("coupon").notEmpty().withMessage("Coupon code is required"),
    validatorMiddleware,
];
