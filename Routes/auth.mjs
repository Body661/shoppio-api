import express from "express";
import rateLimit from "express-rate-limit";

import {
    forgotPasswordValidators,
    loginValidators,
    resetPasswordValidators,
    signupValidators,
    verifyPassResetCodeValidators,
} from "./validators/authValidators.mjs";
import {
    forgotPassword,
    login,
    resetPassword,
    signup,
    verifyPassResetCode,
} from "../controllers/authController.mjs";

// Initialize the router
const router = express.Router();

// Rate limiting for password reset requests
const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message:
        "Too many Requests created from this IP, please try again after 1 hour",
});

// Rate limiting for account creation
const createAccountLimiter = rateLimit({
    windowMs: 180 * 60 * 1000,
    max: 5,
    message:
        "Too many accounts created from this IP, please try again after 3 hours",
    standardHeaders: true,
    legacyHeaders: false,
});

// Route for signing up with rate limiting and validation
router.post("/signup", createAccountLimiter, ...signupValidators, signup);

// Route for logging in with validation
router.post("/login", ...loginValidators, login);

// Route for forgot password with rate limiting and validation
router.post(
    "/forgot-password",
    passwordResetLimiter,
    ...forgotPasswordValidators,
    forgotPassword
);

// Route for verifying password reset code with validation
router.post(
    "/verify-password-reset-code",
    ...verifyPassResetCodeValidators,
    verifyPassResetCode
);

// Route for resetting password with rate limiting and validation
router.put(
    "/reset-password",
    passwordResetLimiter,
    ...resetPasswordValidators,
    resetPassword
);

export default router;