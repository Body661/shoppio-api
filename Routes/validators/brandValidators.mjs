import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.mjs";

export const addBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({
      min: 2,
      max: 32,
    })
    .withMessage("Brand name must be between 2 and 32 characters"),
  validatorMiddleware,
];

export const getBrandValidator = [
  check("id").isMongoId().withMessage("Brand ID is not valid"),
  validatorMiddleware,
];

export const updateBrandValidator = [
  check("id").isMongoId().withMessage("Brand ID is not valid"),
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({
      min: 2,
      max: 32,
    })
    .withMessage("Brand name must be between 2 and 32 characters"),
  validatorMiddleware,
];

export const deleteBrandValidator = [
  check("id").isMongoId().withMessage("Brand ID is not valid"),
  validatorMiddleware,
];
