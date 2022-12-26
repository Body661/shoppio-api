import { check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatorMiddleware.mjs";

export const createSubcategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Subcategory name is required")
    .isLength({ min: 2, max: 33 })
    .withMessage("Category name must be between 2 and 32 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("categoryId")
    .notEmpty()
    .withMessage("Subcategory must be belong to a category")
    .isMongoId()
    .withMessage("Category ID is not valid")
    .custom((value, { req }) => {
      req.body.category = value;
      console.log(value);
      return true;
    }),
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
    .withMessage("Subcategory name must be between 2 and 32 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

export const deleteSubcategoryValidator = [
  check("id").isMongoId().withMessage("Subcategory ID is not valid"),
  validatorMiddleware,
];
