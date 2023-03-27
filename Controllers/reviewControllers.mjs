import ReviewModel from "../models/reviewModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";

export const setProdIdAndUser = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.user._id;
    next();
};

// @desc Create a new review
// @route POST /api/:id/reviews
// @access Private/Protected [User]
export const addReview = factory.createDocument(ReviewModel);

export const createFilterObj = (req, res, next) => {
    let filter = {};
    if (req.params.productId) filter = {product: req.params.productId};
    req.filterObj = filter;
    next();
};

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
