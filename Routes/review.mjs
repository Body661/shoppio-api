import express from "express";
import {
  addReview,
  deleteReview,
  getReviews,
  getReview,
  updateReview,
} from "../Controllers/reviewRoutes.mjs";

import { allowed, auth } from "../Controllers/authController.mjs";
import {
  addReviewValidator,
  deleteReviewValidator,
  getReviewValidator,
  updateReviewValidator,
} from "./validators/reviewValidators.mjs";

const router = express.Router();

router
  .route("/")
  .post(auth, allowed("user"), ...addReviewValidator, addReview)
  .get(getReviews);

router
  .route("/:id")
  .get(...getReviewValidator, getReview)
  .put(auth, allowed("user"), ...updateReviewValidator, updateReview)
  .delete(
    auth,
    allowed("admin", "user"),
    ...deleteReviewValidator,
    deleteReview
  );

export default router;
