import express from "express";
import {
  addUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  updateUserPassword,
} from "../Controllers/userRoutes.mjs";
import {
  addUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateUserPassValidator,
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

router.put(
  "/changePassword/:id",
  ...updateUserPassValidator,
  updateUserPassword
);

export default router;
