import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import UserModel from "../models/userModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";
import ApiError from "../utils/apiError.mjs";
import {encodeUser, signToken} from "../utils/signJWT.mjs";
import {sanitizeUser, sanitizeUserProfile} from "../utils/sanitizeData.mjs";

// Action for creating a new user
// @Route POST /api/users
// @Access Private/Protected [Admin]
export const addUser = factory.createDocument(UserModel);

// Action for getting all users
// @Route GET /api/users
// @Access Private/Protected [Admin]
export const getUsers = factory.getAllDocuments(UserModel);

// Action for getting a specific user by ID
// @Route GET /api/users/:id
// @Access Private/Protected [Admin]
export const getUser = expressAsyncHandler(async (req, res, next) => {
    const doc = await UserModel.findById(req.params.id).populate("orders")

    if (!doc) {
        return next(new ApiError('User not found', 404));
    }

    res.status(200).json({data: sanitizeUserProfile(doc)});
});

// Action for updating a specific user by ID
// @Route PUT /api/users/:id
// @Access Private/Protected [Admin]
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

// Action for updating a user password by ID
// @Route PUT /api/users/change-password/:id
// @Access Private/Protected [Admin]
export const updateUserPassword = expressAsyncHandler(
    async (req, res, next) => {
        const user = await UserModel.findByIdAndUpdate(
            req.params.id,
            {
                password: await bcrypt.hash(req.body.password, 12),
                passwordLastUpdate: Date.now(),
            },
            {new: true}
        );

        if (!user) {
            return next(new ApiError("User not found", 404));
        }

        res.status(200).json(user);
    }
);

// Action for deleting a specific user by ID
// @Route DELETE /api/users/:id
// @Access Private/Protected [Admin]
export const deleteUser = factory.deleteDocument(
    UserModel,
    "User not found",
    "User deleted successfully"
);

// Action for getting the logged-in user's data
// @Route GET /api/users/me
// @Access Private/Protected [User]
export const getMe = expressAsyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
});

// Action for updating the logged-in user's password
// @Route PUT /api/users/my-password
// @Access Private/Protected [User]
export const updateMyPass = expressAsyncHandler(async (req, res) => {
    await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passLastUpdate: Date.now(),
        },
        {new: true}
    );

    const token = signToken(req.user._id);

    res.status(200).json({token});
});

// Action for updating the logged-in user's data
// @Route PUT /api/users/me
// @Access Private/Protected [User]
export const updateMe = expressAsyncHandler(async (req, res) => {
    const document = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
        },
        {
            new: true,
        }
    );

    res.status(200).json(encodeUser(sanitizeUser(document)));
});

// Action for deleting the logged-in user
// @Route DELETE /api/users/me
// @Access Private/Protected [User]
export const deleteMe = expressAsyncHandler(async (req, res) => {
    await UserModel.findByIdAndDelete(req.user._id);
    res.status(204).send();
});