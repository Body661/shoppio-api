import crypto from "crypto";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import jsonwebtoken from "jsonwebtoken";
import UserModel from "../models/userModel.mjs";
import ApiError from "../utils/apiError.mjs";
import sendEmail from "../utils/sendEmail.mjs";

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

  sendEmail({
    email: user.email,
    subject: "Welcome on board!",
    template: "welcoming",
    context: {
      name: user.name,
      action_url: "www.google.com",
      support_email: "examen.project.ecommerce@gmail.com",
      help_url: "www.google.com",
    },
  });

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

//@desc check user permissions
export const allowed = (...roles) =>
  expressAsyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("Access denied", 403));
    }
    next();
  });

// @desc forget password
// @route POST /api/auth/forgetPassword
// @access Public
export const forgetPassword = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new ApiError("Incorrect email", 404));
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(code)
    .digest("hex");

  user.passResetCode = hashedResetCode;
  user.passResetExpires = Date.now() + 15 * 60 * 1000;
  user.passResetVerified = false;

  await user.save();

  try {
    sendEmail({
      email: user.email,
      subject: "Password reset code",
      template: "resetPass",
      context: { name: user.name, code },
    });
  } catch (e) {
    user.passResetCode = undefined;
    user.passResetExpires = undefined;
    user.passResetVerified = undefined;
    await user.save();
    return next(new ApiError("Error while sending email", 500));
  }

  res.status(200).json({ message: "Reset code sent successfully" });
});

// @desc verify password reset code
// @route POST /api/auth/verifyPassResetCode
// @access Public
export const verifyPassResetCode = expressAsyncHandler(
  async (req, res, next) => {
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(req.body.code)
      .digest("hex");

    const user = await UserModel.findOne({
      passResetCode: hashedResetCode,
      passResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ApiError("Code is invalid or expired", 403));
    }

    user.passResetVerified = true;
    await user.save();

    res.status(200).send();
  }
);

// @desc reset password
// @route POST /api/auth/resetPassword
// @access Public
export const resetPassword = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new ApiError("Incorrect email", 404));
  }

  if (!user.passResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }

  user.password = req.body.password;
  user.passResetCode = undefined;
  user.passResetExpires = undefined;
  user.passResetVerified = undefined;
  await user.save();

  sendEmail({
    email: user.email,
    subject: "Password changed",
    template: "passChanged",
    context: { name: user.name },
  });

  const token = signToken(user._id);
  res.status(200).json({ message: "Password changed successfully", token });
});
