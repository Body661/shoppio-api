import express from "express";
import {
  loginValidators,
  signupValidators,
} from "./validators/authValidators.mjs";
import {
  forgetPassword,
  login,
  signup,
} from "../Controllers/authController.mjs";

const router = express.Router();

router.post("/signup", ...signupValidators, signup);
router.post("/login", ...loginValidators, login);
router.post("/forgetpassword", forgetPassword);

export default router;
