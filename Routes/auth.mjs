import express from "express";
import {
  loginValidators,
  signupValidators,
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
router.post("/forgetPassword", forgetPassword);
router.post("/verifyPassResetCode", verifyPassResetCode);
router.put("/resetPassword", resetPassword);

export default router;
