import validator from "validator";
import { check } from "express-validator";
import ApiError from "../../utils/apiError.mjs";
import validatorMiddleware from "../../middlewares/validatorMiddleware.mjs";

export const addUserValidator = [
  check("name").notEmpty().withMessage("User name is required"),
  check("email")
    .notEmpty()
    .withMessage("Email address is required")
    .custom(async (email) => {
      if (!validator.isEmail(email)) {
        return Promise.reject(new ApiError("Email address is not valid"));
      }

      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .custom(async (password) => {
      if (!validator.isStrongPassword(password)) {
        return Promise.reject(new ApiError("Password is not strong enough"));
      }

      return true;
    }),
  check("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .custom(async (phone) => {
      if (!validator.isMobilePhone(phone)) {
        return Promise.reject(new ApiError("Phone number is not valid"));
      }
    }),
  validatorMiddleware,
];

export const getUserValidator = [
  check("id").isMongoId().withMessage("User ID is not valid"),
  validatorMiddleware,
];

export const updateUserValidator = [
  check("name").optional().notEmpty().withMessage("User name is required"),
  check("email")
    .optional()
    .notEmpty()
    .withMessage("Email address is required")
    .custom(async (email) => {
      if (!validator.isEmail(email)) {
        return Promise.reject(new ApiError("Email address is not valid"));
      }

      return true;
    }),
  check("password")
    .optional()
    .notEmpty()
    .withMessage("Password is required")
    .custom(async (password) => {
      if (!validator.isStrongPassword(password)) {
        return Promise.reject(new ApiError("Password is not strong enough"));
      }

      return true;
    }),
  check("phone")
    .optional()
    .notEmpty()
    .withMessage("Phone number is required")
    .custom(async (phone) => {
      if (!validator.isMobilePhone(phone)) {
        return Promise.reject(new ApiError("Phone number is not valid"));
      }
    }),
  validatorMiddleware,
];
export const deleteUserValidator = [
  check("id").isMongoId().withMessage("User ID is not valid"),
  validatorMiddleware,
];
