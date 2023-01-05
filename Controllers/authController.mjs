import expressAsyncHandler from "express-async-handler";
import jsonwebtoken from "jsonwebtoken";
import UserModel from "../models/userModel.mjs";

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

  const token = jsonwebtoken.sign({ email: user._id }, process.env.SECRET_KEY, {
    expiresIn: "14d",
  });

  res.status(201).json({
    document: user,
    token,
  });
});
