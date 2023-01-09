import express from "express";
import {
  addUser,
  deleteUser,
  getMe,
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

router.route("/me").get(auth, allowed("user"), getMe, getUser);

router.use(auth, allowed("admin"));

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
  auth,
  allowed("user", "admin"),
  ...updateUserPassValidator,
  updateUserPassword
);

export default router;
