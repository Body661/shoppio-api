import ReviewModel from "../models/reviewModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";

// @desc Create a new review
// @route POST /api/:id/reviews
// @access Private/Protected [User]
export const addReview = factory.createDocument(ReviewModel);

// @desc Get all reviews
// @route GET /api/reviews
// @access Public
export const getReviews = factory.getAllDocuments(ReviewModel);

// @desc Get a specific review by id
// @route GET /api/reviews/:id
// @access Public
export const getReview = factory.getDocument(ReviewModel, "Review not found");

// @desc Update a review
// @route PUT /api/reviews/:id
// @access Private/Protected [User]
export const updateReview = factory.updateDocument(
  ReviewModel,
  "Review not found"
);

// @desc Delete a review
// @route DELETE /api/reviews/:id
// @access Private/Protected [User-Admin]
export const deleteReview = factory.deleteDocument(
  ReviewModel,
  "Review not found",
  "Review deleted successfully"
);
