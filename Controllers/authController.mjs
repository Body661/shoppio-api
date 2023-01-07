import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import jsonwebtoken from "jsonwebtoken";
import UserModel from "../models/userModel.mjs";
import ApiError from "../utils/apiError.mjs";

const signToken = (userId) =>
  jsonwebtoken.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: "14d",
  });

// @desc Signup
// @route POST /api/auth/signup
// @access Public
export const signup = expressAsyncHandler(async (req, res) => {
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  });

  const token = signToken(user._id);
  res.status(201).json({ data: user, token });
});

// @desc Login
// @route POST /api/auth/login
// @access Public
export const login = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Invalid email or password", 401));
  }

  const token = signToken(user._id);
  res.status(200).json({ data: user, token });
});
