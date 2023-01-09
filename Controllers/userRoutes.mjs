import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import UserModel from "../models/userModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";
import ApiError from "../utils/apiError.mjs";

// @desc Create a new user
// @route POST /api/users
// @access Private
export const addUser = factory.createDocument(UserModel);

// @desc Get all users
// @route GET /api/users
// @access Private
export const getUsers = factory.getAllDocuments(UserModel);

// @desc Get specific user by id
// @route GET /api/users/:id
// @access Private
export const getUser = factory.getDocument(UserModel, "User not found");

// @desc Update specific user by id
// @route PUT /api/users/:id
// @access Private
export const updateUser = expressAsyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError("User not found", 404));
  }

  res.status(200).json(document);
});

export const updateUserPassword = expressAsyncHandler(
  async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        password: await bcrypt.hash(req.body.password, 12),
        passLastUpdate: Date.now(),
      },
      { new: true }
    );

    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    res.status(200).json(user);
  }
);

// @desc Update specific user by id
// @route DELETE /api/users/:id
// @access Private
export const deleteUser = factory.deleteDocument(
  UserModel,
  "User not found",
  "User deleted successfully"
);

// @desc Get users data
// @route GET /api/users/me
// @access Private
export const getMe = expressAsyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
