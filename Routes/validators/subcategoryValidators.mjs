import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.mjs";

export const createSubcategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Subcategory name is required")
    .isLength({ min: 2, max: 33 })
    .withMessage("Category name must be between 2 and 32 characters"),

  check("categoryId")
    .notEmpty()
    .withMessage("Subcategory must be belong to a category")
    .isMongoId()
    .withMessage("Category ID is not valid"),
  validatorMiddleware,
];

export const getSubcategoryValidator = [
  check("id").isMongoId().withMessage("Subcategory ID is not valid"),
  validatorMiddleware,
];
export const updateSubcategoryValidator = [
  check("id").isMongoId().withMessage("Subcategory ID is not valid"),
  check("name")
    .notEmpty()
    .withMessage("Subcategory name is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("Subcategory name must be between 2 and 32 characters"),
  validatorMiddleware,
];

export const deleteSubcategoryValidator = [
  check("id").isMongoId().withMessage("Subcategory ID is not valid"),
  validatorMiddleware,
];
