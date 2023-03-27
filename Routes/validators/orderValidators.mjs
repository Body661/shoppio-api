import {check} from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.mjs";
import OrderModel from "../../models/orderModel.mjs";
import CartModel from "../../models/cartModel.mjs";

export const createCashOrderValidator = [
    check("cartId")
        .notEmpty()
        .withMessage("Coupon Name is required")
        .isMongoId()
        .withMessage("Cart Id is not valid"),

    check("shippingAddress")
        .notEmpty()
        .withMessage("Shipping address date is required"),
    validatorMiddleware,
];

export const updateOrderPayValidator = [
    check("id")
        .notEmpty()
        .withMessage("Order Id is required")
        .isMongoId()
        .withMessage("Order Id is not valid")
        .custom(async (id) => {
            const order = await OrderModel.findById(id);

            if (!order) {
                return new Error("No order found for this id");
            }

            return true;
        }),
    validatorMiddleware,
];
export const updateOrderDeliveredValidator = [
    check("id")
        .notEmpty()
        .withMessage("Order Id is required")
        .isMongoId()
        .withMessage("Order Id is not valid")
        .custom(async (id) => {
            const order = await OrderModel.findById(id);

            if (!order) {
                return new Error("No order found for this id");
            }

            return true;
        }),
    validatorMiddleware,
];

export const checkoutSessionValidator = [
    check("cartId")
        .notEmpty()
        .withMessage("cart Id is required")
        .isMongoId()
        .withMessage("cart Id is not valid")
        .custom(async (id) => {
            const cart = await CartModel.findById(id);

            if (!cart) {
                return new Error("No cart found for this id");
            }

            return true;
        }),
    validatorMiddleware,
];
