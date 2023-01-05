import userModel from "../models/userModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";

// @desc Create a new user
// @route POST /api/users
// @access Private
export const addUser = factory.createDocument(userModel);

// @desc Get all users
// @route GET /api/users
// @access Private
export const getUsers = factory.getAllDocuments(userModel);

// @desc Get specific user by id
// @route GET /api/users/:id
// @access Private
export const getUser = factory.getDocument(userModel, "User not found");

// @desc Update specific user by id
// @route PUT /api/users/:id
// @access Private
export const updateUser = factory.updateDocument(userModel, "User not found");

// @desc Update specific user by id
// @route DELETE /api/users/:id
// @access Private
export const deleteUser = factory.deleteDocument(
  userModel,
  "User not found",
  "User deleted successfully"
);
