import { check } from "express-validator";
import ApiError from "../../utils/apiError.mjs";
import validatorMiddleware from "../../middlewares/validatorMiddleware.mjs";
import UserModel from "../../models/userModel.mjs";

export const addUserValidator = [
  check("name").notEmpty().withMessage("User name is required"),
  check("email")
    .notEmpty()
    .withMessage("Email address is required")
    .isEmail()
    .withMessage("Email address is not valid")
    .custom(async (email) => {
      const user = await UserModel.findOne({ email });
      if (user) {
        return Promise.reject(new ApiError("Email address is already in use"));
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword()
    .withMessage("Password is not strong enough"),

  check("phone")
    .optional()
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any")
    .withMessage("Phone number is not valid"),

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
    .isEmail()
    .withMessage("Email address is not valid"),

  check("password")
    .optional()
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword()
    .withMessage("Password is not strong enough"),

  check("phone")
    .optional()
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any")
    .withMessage("Phone number is not valid"),

  validatorMiddleware,
];
export const deleteUserValidator = [
  check("id").isMongoId().withMessage("User ID is not valid"),
  validatorMiddleware,
];
