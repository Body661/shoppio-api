import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.mjs";
import UserModel from "../../models/userModel.mjs";

// Signup Validators
export const signupValidators = [
    // Check if the name field is not empty
    check("name").notEmpty().withMessage("User name is required"),
    // Check if the email field is not empty, is a valid email, and is not already in use
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
    // Check if the password field is not empty and is strong enough
    check("password")
        .notEmpty()
        .withMessage("Password is required")
        .isStrongPassword()
        .withMessage("Password is not strong enough"),
    // Check if the passwordConfirm field is not empty and matches the password field
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
    // Check if the phone field is optional, not empty, and a valid mobile phone number
    check("phone")
        .optional()
        .notEmpty()
        .withMessage("Phone number is required")
        .isMobilePhone("any")
        .withMessage("Phone number is not valid"),
    // Use the validator middleware
    validatorMiddleware,
];

// Login Validators
export const loginValidators = [
    check("email")
        .notEmpty()
        .withMessage("Email address is required")
        .isEmail()
        .withMessage("Email address is not valid"),
    check("password").notEmpty().withMessage("Password is required"),
    validatorMiddleware,
];

// Forgot Password Validators
export const forgotPasswordValidators = [
    // Check if the email field is not empty, is a valid email, and exists in the database
    check("email")
        .notEmpty()
        .withMessage("Email address is required")
        .isEmail()
        .withMessage("Email address is not valid")
        .custom(async (email) => {
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new Error("Incorrect email");
            }
            return true;
        }),
    validatorMiddleware,
];

// Verify Password Reset Code Validators
export const verifyPassResetCodeValidators = [
    // Check if the code field is not empty and is exactly 6 characters long
    check("code")
        .notEmpty()
        .withMessage("Reset code is required")
        .isLength({ min: 6, max: 6 })
        .withMessage("Reset code must be 6 characters long"),
    validatorMiddleware,
];

export const resetPasswordValidators = [
    check("email")
        .notEmpty()
        .withMessage("Email address is required")
        .isEmail()
        .withMessage("Email address is not valid")
        .custom(async (email) => {
            const user = await UserModel.findOne({email});
            if (!user) {
                throw new Error("Incorrect email");
            }

            if (!user.passwordResetVerified) {
                throw new Error("Reset code not verified");
            }

            return true;
        }),
    check("password")
        .notEmpty()
        .withMessage("New password is required")
        .isStrongPassword()
        .withMessage("Password is not strong enough"),
    validatorMiddleware,
];
