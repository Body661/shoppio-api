import express from "express";
import { signupValidator } from "./validators/authValidators.mjs";
import { signup } from "../Controllers/authController.mjs";

const router = express.Router();

router.post("/signup", signupValidator, signup);

export default router;
