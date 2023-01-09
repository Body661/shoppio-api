import express from "express";
import {
  forgotPasswordValidators,
  loginValidators,
  resetPasswordValidators,
  signupValidators,
  verfiyPassResetCodeValidators,
} from "./validators/authValidators.mjs";
import {
  forgetPassword,
  login,
  resetPassword,
  signup,
  verifyPassResetCode,
} from "../Controllers/authController.mjs";

const router = express.Router();

router.post("/signup", ...signupValidators, signup);
router.post("/login", ...loginValidators, login);
router.post("/forgetPassword", ...forgotPasswordValidators, forgetPassword);
router.post(
  "/verifyPassResetCode",
  ...verfiyPassResetCodeValidators,
  verifyPassResetCode
);
router.put("/resetPassword", ...resetPasswordValidators, resetPassword);

export default router;
