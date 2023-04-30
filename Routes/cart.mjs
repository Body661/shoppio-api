import express from "express";
import {
    addProductToCart,
    applyCoupon,
    deleteMyCart,
    getMyCart,
    removeItemFromCart,
    updateItemQuantity,
} from "../controllers/cartController.mjs";
import {allowed, auth} from "../controllers/authController.mjs";
import {
    addProductToCartValidator,
    applyCouponValidator,
    removeItemFromCartValidator,
    updateItemQuantityValidator,
} from "./validators/cartValidators.mjs";

const router = express.Router();

router.use(auth, allowed("user"));

router
    .route("/")
    .post(...addProductToCartValidator, addProductToCart)
    .get(getMyCart)
    .delete(deleteMyCart);
router
    .route("/:id")
    .delete(...removeItemFromCartValidator, removeItemFromCart)
    .put(...updateItemQuantityValidator, updateItemQuantity);
router.post("/coupon", ...applyCouponValidator, applyCoupon);

export default router;
