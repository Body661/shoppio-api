import ReviewModel from "../models/reviewModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";

// Middleware to set the product ID and user ID for creating a new review
export const setProdIdAndUser = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.user._id;
    next();
};

// Action for adding a new review
// @Route POST /api/:id/reviews
// @Access Private/Protected [User]
export const addReview = factory.createDocument(ReviewModel);

// Middleware to create a filter object for retrieving reviews
export const createFilterObj = (req, res, next) => {
    let filter = {};
    if (req.params.productId) filter = { product: req.params.productId };
    req.filterObj = filter;
    next();
};

// Action for getting all reviews for a specific product
// @Route GET /api/reviews
// @Access Public
export const getReviews = factory.getAllDocuments(ReviewModel);

// Action for getting a specific review by ID
// @Route GET /api/reviews/:id
// @Access Public
export const getReview = factory.getDocument(ReviewModel, "Review not found");

// Action for updating a review by ID
// @Route PUT /api/reviews/:id
// @Access Private/Protected [User]
export const updateReview = factory.updateDocument(
    ReviewModel,
    "Review not found"
);

// Action for deleting a review by ID
// @Route DELETE /api/reviews/:id
// @Access Private/Protected [User-Admin]
export const deleteReview = factory.deleteDocument(
    ReviewModel,
    "Review not found",
    "Review deleted successfully"
);
