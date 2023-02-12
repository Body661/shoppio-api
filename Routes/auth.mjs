import express from "express";
import rateLimit from "express-rate-limit";

import {
    forgotPasswordValidators,
    loginValidators,
    resetPasswordValidators,
    signupValidators,
    verfiyPassResetCodeValidators,
} from "./validators/authValidators.mjs";
import {
    auth,
    checkRoles,
    forgetPassword,
    login,
    resetPassword,
    signup,
    verifyPassResetCode,
} from "../Controllers/authController.mjs";

const router = express.Router();

const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message:
        "Too many Requests created from this IP, please try again after 1 hour",
});

const createAccountLimiter = rateLimit({
    windowMs: 180 * 60 * 1000,
    max: 5,
    message:
        "Too many accounts created from this IP, please try again after 3 hours",
    standardHeaders: true,
    legacyHeaders: false,
});

router.post("/signup", createAccountLimiter, ...signupValidators, signup);
router.post("/login", ...loginValidators, login);
router.post(
    "/forgetPassword",
    passwordResetLimiter,
    ...forgotPasswordValidators,
    forgetPassword
);
router.post(
    "/verifyPassResetCode",
    ...verfiyPassResetCodeValidators,
    verifyPassResetCode
);
router.put(
    "/resetPassword",
    passwordResetLimiter,
    ...resetPasswordValidators,
    resetPassword
);
router.get('/checkRoles', auth, checkRoles)
export default router;
