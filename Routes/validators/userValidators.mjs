import { check } from "express-validator";
import bcrypt from "bcryptjs";
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
        throw new Error("Email address is already in use");
      }

      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword()
    .withMessage("Password is not strong enough"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom(async (passwordConfirm, { req }) => {
      const { password } = req.body;

      if (passwordConfirm !== password) {
        throw new Error("Passwords do not match");
      }

      return true;
    }),

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
  check("id").isMongoId().withMessage("User ID is not valid"),
  check("name").optional().notEmpty().withMessage("User name is required"),
  check("email")
    .optional()
    .notEmpty()
    .isEmail()
    .withMessage("Email address is not valid")
    .custom(async (email) => {
      const user = UserModel.findOne({ email: email });

      if (user) {
        throw new Error("Email address already in use");
      }

      return true;
    }),

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
export const updateUserPassValidator = [
  check("id").isMongoId().withMessage("User ID is not valid"),

  check("currentPassword")
    .notEmpty()
    .withMessage("Please enter your current password")
    .custom(async (currPassword, { req }) => {
      const user = await UserModel.findById(req.params.id);

      if (!user) {
        throw new Error("User not found");
      }

      if (!(await bcrypt.compare(currPassword, user.password))) {
        throw new Error("Current password is incorrect");
      }

      return true;
    }),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword()
    .withMessage("Password is not strong enough"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom(async (passwordConfirm, { req }) => {
      const { password } = req.body;

      if (passwordConfirm !== password) {
        throw new Error("Passwords do not match");
      }

      return true;
    }),
  validatorMiddleware,
];

export const updateMyPassValidator = [
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword()
    .withMessage("Password is not strong enough"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom(async (passwordConfirm, { req }) => {
      const { password } = req.body;

      if (passwordConfirm !== password) {
        throw new Error("Passwords do not match");
      }

      return true;
    }),
  validatorMiddleware,
];

export const updateMeValidator = [
  check("name").optional().notEmpty().withMessage("User name is required"),
  check("email")
    .optional()
    .notEmpty()
    .isEmail()
    .withMessage("Email address is not valid")
    .custom(async (email) => {
      const user = UserModel.findOne({ email: email });

      if (user) {
        throw new Error("Email address already in use");
      }

      return true;
    }),

  check("phone")
    .optional()
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any")
    .withMessage("Phone number is not valid"),

  validatorMiddleware,
];
