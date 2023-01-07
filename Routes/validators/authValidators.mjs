import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.mjs";
import UserModel from "../../models/userModel.mjs";

export const signupValidators = [
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

export const loginValidators = [
  check("email")
    .notEmpty()
    .withMessage("Email address is required")
    .isEmail()
    .withMessage("Email address is not valid"),
  check("password").notEmpty().withMessage("Password is required"),
  validatorMiddleware,
];
