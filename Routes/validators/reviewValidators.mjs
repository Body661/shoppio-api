import { check } from "express-validator";
import UserModel from "../../models/userModel.mjs";
import validatorMiddleware from "../../middlewares/validatorMiddleware.mjs";
import ProductModel from "../../models/productModel.mjs";

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
    .isFloat({ min: 1, max: 5 })
    .withMessage("Review ratings must be between 1 and 5"),
  check("user")
    .isMongoId()
    .withMessage("invalid user id")
    .custom(async (id) => {
      const user = await UserModel.findById(id);
      if (!user) {
        throw new Error("invalid user id");
      }

      return true;
    }),
  check("product")
    .isMongoId()
    .withMessage("invalid product id")
    .custom(async (id) => {
      const product = await ProductModel.findById(id);
      if (!product) {
        throw new Error("No product found");
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
    .isFloat({ min: 1, max: 5 })
    .withMessage("Review ratings must be between 1 and 5"),
  check("user")
    .notEmpty()
    .withMessage("Review must belong to a user")
    .isMongoId()
    .withMessage("invalid user id")
    .custom(async (id) => {
      const user = await UserModel.findById(id);
      if (!user) {
        throw new Error("invalid user id");
      }

      return true;
    }),
  check("product")
    .notEmpty()
    .withMessage("Review must belong to a product")
    .isMongoId()
    .withMessage("invalid product id")
    .custom(async (id) => {
      const product = await ProductModel.findById(id);
      if (!product) {
        throw new Error("No product found");
      }

      return true;
    }),
  validatorMiddleware,
];

export const deleteReviewValidator = [
  check("id").isMongoId().withMessage("review ID is not valid"),
  validatorMiddleware,
];
