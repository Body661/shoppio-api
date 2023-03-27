import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import UserModel from "../models/userModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";
import ApiError from "../utils/apiError.mjs";
import signToken from "../utils/signJWT.mjs";

// @desc Create a new user
// @route POST /api/users
// @access Private/Protected [Admin]
export const addUser = factory.createDocument(UserModel);

// @desc Get all users
// @route GET /api/users
// @access Private/Protected [Admin]
export const getUsers = factory.getAllDocuments(UserModel);

// @desc Get specific user by id
// @route GET /api/users/:id
// @access Private/Protected [Admin]
export const getUser = factory.getDocument(UserModel, "User not found");

// @desc Update specific user by id
// @route PUT /api/users/:id
// @access Private/Protected [Admin]
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

// @desc Update user password by id
// @route PUT /api/users/changePassword/:id
// @access Private/Protected [Admin]
export const updateUserPassword = expressAsyncHandler(
    async (req, res, next) => {
        const user = await UserModel.findByIdAndUpdate(
            req.params.id,
            {
                password: await bcrypt.hash(req.body.password, 12),
                passLastUpdate: Date.now(),
            },
            {new: true}
        );

        if (!user) {
            return next(new ApiError("User not found", 404));
        }

        res.status(200).json(user);
    }
);

// @desc delete specific user by id
// @route DELETE /api/users/:id
// @access Private/Protected [Admin]
export const deleteUser = factory.deleteDocument(
    UserModel,
    "User not found",
    "User deleted successfully"
);

// --------------//
// USER ROUTES //
// --------------//

// @desc Get logged-in user data
// @route GET /api/users/me
// @access Private/Protected [User]
export const getMe = expressAsyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
});

// @desc Update logged-in user password
// @route PUT /api/users/myPassword
// @access Private/Protected [User]
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

// @desc Update logged-in user data
// @route PUT /api/users/me
// @access Private/Protected [User]
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

    res.status(200).json(document);
});

// @desc delete logged-in user
// @route DELETE /api/users/me
// @access Private/Protected [User]
export const deleteMe = expressAsyncHandler(async (req, res) => {
    await UserModel.findByIdAndDelete(req.user._id);
    res.status(204).send();
});
