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
import {
  allowed,
  auth,
  forgetPassword,
} from "../Controllers/authController.mjs";

const router = express.Router();

router
  .route("/")
  .post(auth, allowed("admin"), ...addUserValidator, addUser)
  .get(auth, allowed("admin"), getUsers);

router
  .route("/:id")
  .get(auth, allowed("admin"), ...getUserValidator, getUser)
  .put(auth, allowed("admin"), ...updateUserValidator, updateUser)
  .delete(auth, allowed("admin"), ...deleteUserValidator, deleteUser);

router.put(
  "/changePassword/:id",
  auth,
  allowed("user", "admin"),
  ...updateUserPassValidator,
  updateUserPassword
);

export default router;
