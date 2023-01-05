import express from "express";
import {
  addUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../Controllers/userRoutes.mjs";
import {
  addUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateUserValidator,
} from "./validators/userValidators.mjs";

const router = express.Router();

router
  .route("/")
  .post(...addUserValidator, addUser)
  .get(getUsers);

router
  .route("/:id")
  .get(...getUserValidator, getUser)
  .put(...updateUserValidator, updateUser)
  .delete(...deleteUserValidator, deleteUser);

export default router;
