import express from "express";
import { allowed, auth } from "../Controllers/authController.mjs";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../Controllers/wishlistCntroller.mjs";

const router = express.Router();

router.use(auth, allowed("user"));

router.route("/").post(addToWishlist).get(getWishlist);
router.route("/:productId").delete(removeFromWishlist);

export default router;
