import express from "express";
import {
  addProductToCart,
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

export default router;
