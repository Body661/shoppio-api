import express from "express";
import { allowed, auth } from "../Controllers/authController.mjs";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../Controllers/wishlistCntroller.mjs";
import { addRemoveValidators } from "./validators/wishlistValidators.mjs";

const router = express.Router();

router.use(auth, allowed("user"));

router
  .route("/")
  .post(...addRemoveValidators, addToWishlist)
  .get(getWishlist);
router.route("/:productId").delete(...addRemoveValidators, removeFromWishlist);

export default router;
