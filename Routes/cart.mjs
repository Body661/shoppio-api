import express from "express";
import {
  addProductToCart,
  applyCoupon,
  deleteMyCart,
  getMyCart,
  removeItemFromCart,
  updateItemQuantity,
} from "../Controllers/cartController.mjs";
import { allowed, auth } from "../Controllers/authController.mjs";

const router = express.Router();

router.use(auth, allowed("user"));

router.route("/").post(addProductToCart).get(getMyCart).delete(deleteMyCart);
router.route("/:id").delete(removeItemFromCart).put(updateItemQuantity);
router.post("/coupon", applyCoupon);

export default router;
