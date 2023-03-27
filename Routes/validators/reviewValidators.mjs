import {check} from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.mjs";
import ReviewModel from "../../models/reviewModel.mjs";

export const addReviewValidator = [
    check("title")
        .notEmpty()
        .withMessage("Review title is required")
        .isLength({
            min: 2,
            max: 100,
        })
        .withMessage("Review title must be between 2 and 100 characters"),
    check("description")
        .notEmpty()
        .withMessage("Review description is required")
        .isLength({
            min: 10,
            max: 1000,
        })
        .withMessage("Review description must be between 10 and 2000 characters"),
    check("ratings")
        .isNumeric()
        .withMessage("Review ratings must be a number")
        .isFloat({min: 1, max: 5})
        .withMessage("Review ratings must be between 1 and 5"),
    check("user").isMongoId().withMessage("invalid user id"),
    check("productId")
        .isMongoId()
        .withMessage("invalid product id")
        .custom(async (id, {req}) => {
            const review = await ReviewModel.findOne({
                user: req.user._id,
                product: id,
            });

            if (review) {
                throw new Error("You have already reviewed");
            }

            return true;
        }),
    validatorMiddleware,
];

export const getReviewValidator = [
    check("id").isMongoId().withMessage("review ID is not valid"),
    validatorMiddleware,
];

export const updateReviewValidator = [
    check("id")
        .isMongoId()
        .withMessage("review ID is not valid")
        .custom(async (val, {req}) => {
            const review = await ReviewModel.findById(val);

            if (!review) {
                throw new Error("Review not found");
            }

            if (review.user._id.toString() !== req.user._id.toString()) {
                throw new Error("You are not allowed to update this review");
            }

            return true;
        }),
    check("title")
        .optional()
        .notEmpty()
        .withMessage("Review title is required")
        .isLength({
            min: 2,
            max: 100,
        })
        .withMessage("Review title must be between 2 and 100 characters"),
    check("description")
        .optional()
        .notEmpty()
        .withMessage("Review description is required")
        .isLength({
            min: 10,
            max: 1000,
        })
        .withMessage("Review description must be between 10 and 2000 characters"),
    check("ratings")
        .optional()
        .isNumeric()
        .withMessage("Review ratings must be a number")
        .isFloat({min: 1, max: 5})
        .withMessage("Review ratings must be between 1 and 5"),
    check("user")
        .notEmpty()
        .withMessage("Review must belong to a user")
        .isMongoId()
        .withMessage("invalid user id"),
    check("product")
        .notEmpty()
        .withMessage("Review must belong to a product")
        .isMongoId()
        .withMessage("invalid product id"),
    validatorMiddleware,
];

export const deleteReviewValidator = [
    check("id")
        .isMongoId()
        .withMessage("review ID is not valid")
        .custom(async (val, {req}) => {
            const review = await ReviewModel.findById(val);

            if (!review) {
                throw new Error("Review not found");
            }

            if (req.user.role === "user") {
                if (review.user._id.toString() !== req.user._id.toString()) {
                    throw new Error("You are not allowed to delete this review");
                }
            }

            return true;
        }),
    validatorMiddleware,
];
