import express from "express";
import {
    addUser,
    deleteMe,
    deleteUser,
    getMe,
    getUser,
    getUsers,
    updateMe,
    updateMyPass,
    updateUser,
    updateUserPassword,
} from "../Controllers/userControllers.mjs";
import {
    addUserValidator,
    deleteUserValidator,
    getUserValidator,
    updateMeValidator,
    updateMyPassValidator,
    updateUserPassValidator,
    updateUserValidator,
} from "./validators/userValidators.mjs";
import {allowed, auth} from "../Controllers/authController.mjs";

const router = express.Router();

router.use(auth);

// User routes
router
    .route("/me")
    .get(allowed("user"), getMe, getUser)
    .put(allowed("user"), ...updateMeValidator, updateMe)
    .delete(allowed("user"), deleteMe);

router.put(
    "/my-password",
    allowed("user"),
    ...updateMyPassValidator,
    updateMyPass
);

// Admin routes
router.use(allowed("admin"));

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
    "/change-password/:id",
    ...updateUserPassValidator,
    updateUserPassword
);

export default router;
