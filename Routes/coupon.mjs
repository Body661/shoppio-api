import express from "express";
import { allowed, auth } from "../Controllers/authController.mjs";
import {
  addCoupon,
  deleteCoupon,
  getCoupon,
  getCoupons,
  updateCoupon,
} from "../Controllers/couponController.mjs";

const router = express.Router();

router.use(auth, allowed("admin"));

router.route("/").post(addCoupon).get(getCoupons);

router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

export default router;
