import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import jsonwebtoken from "jsonwebtoken";
import UserModel from "../models/userModel.mjs";
import ApiError from "../utils/apiError.mjs";

const signToken = (userId) =>
  jsonwebtoken.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: "2h",
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

export const auth = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.header("Authorization") &&
    req.header("Authorization").startsWith("Bearer")
  ) {
    token = req.header("Authorization").split(" ")[1];
  }

  if (!token) {
    return next(new ApiError("You are not logged in, Please login!", 401));
  }

  const verify = jsonwebtoken.verify(token, process.env.SECRET_KEY);

  const user = await UserModel.findById(verify.userId);

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  if (user.passLastUpdate) {
    const passTimestamp = parseInt(user.passLastUpdate.getTime() / 1000, 10);
    if (passTimestamp > verify.iat) {
      return next(new ApiError("Password changed, Please login again", 401));
    }
  }

  req.user = user;
  next();
});

export const allowed = (...roles) =>
  expressAsyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("Access denied", 403));
    }
    next();
  });
