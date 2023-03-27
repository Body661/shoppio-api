import express from "express";
import {
    addReview,
    deleteReview,
    getReviews,
    getReview,
    updateReview,
    createFilterObj,
    setProdIdAndUser,
} from "../Controllers/reviewControllers.mjs";

import {allowed, auth} from "../Controllers/authController.mjs";
import {
    addReviewValidator,
    deleteReviewValidator,
    getReviewValidator,
    updateReviewValidator,
} from "./validators/reviewValidators.mjs";

const router = express.Router({mergeParams: true});

router
    .route("/")
    .post(
        auth,
        allowed("user"),
        setProdIdAndUser,
        ...addReviewValidator,
        addReview
    )
    .get(createFilterObj, getReviews);

router
    .route("/:id")
    .get(...getReviewValidator, getReview)
    .put(
        auth,
        allowed("user"),
        setProdIdAndUser,
        ...updateReviewValidator,
        updateReview
    )
    .delete(
        auth,
        allowed("admin", "user"),
        ...deleteReviewValidator,
        deleteReview
    );

export default router;
