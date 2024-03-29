import express from "express";
import {allowed, auth} from "../controllers/authController.mjs";
import {
    addCoupon,
    deleteCoupon,
    getCoupon,
    getCoupons,
    updateCoupon,
} from "../controllers/couponController.mjs";
import {
    addCouponValidator,
    updateCouponValidator,
} from "./validators/couponValidators.mjs";

const router = express.Router();

router.use(auth, allowed("admin"));

router
    .route("/")
    .post(...addCouponValidator, addCoupon)
    .get(getCoupons);

router
    .route("/:id")
    .get(getCoupon)
    .put(...updateCouponValidator, updateCoupon)
    .delete(deleteCoupon);

export default router;
