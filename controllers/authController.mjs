import crypto from "crypto";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import jsonwebtoken from "jsonwebtoken";
import UserModel from "../models/userModel.mjs";
import ApiError from "../utils/apiError.mjs";
import sendEmail from "../utils/sendEmail.mjs";
import {signToken, encodeUser} from "../utils/signJWT.mjs";
import {sanitizeUser} from "../utils/sanitizeData.mjs";

// Action for signing a user
// @route POST /api/auth/signup
// @access Public
export const signup = expressAsyncHandler(async (req, res) => {
    const user = await UserModel.create({
        name: req?.body.name,
        email: req?.body.email,
        phone: req?.body.phone,
        password: req?.body.password,
    });

    const token = signToken(user._id, user?.role);

    await sendEmail({
        email: user?.email,
        subject: "Welcome on board!",
        template: "welcoming",
        context: {
            name: user?.name,
            action_url: "https://shoppio.vercel.app/",
            support_email: "shoppio.app@gmail.com",
            help_url: "https://shoppio.vercel.app/",
        },
    });

    res?.status(201).json({data: sanitizeUser(user), token});
});

// Action for logging in
// @route POST /api/auth/login
// @access Public
export const login = expressAsyncHandler(async (req, res, next) => {
    const user = await UserModel.findOne({email: req?.body.email});

    if (!user || !(await bcrypt.compare(req?.body.password, user.password))) {
        return next(new ApiError("Invalid email or password", 401));
    }

    const token = signToken(user._id, user.role);
    const data = encodeUser(sanitizeUser(user))

    res?.status(200).json({data, token});
});

// Auth middleware responsible for checking if the user is authenticated or not
export const auth = expressAsyncHandler(async (req, res, next) => {
    let token;
    if (
        req?.header("Authorization") &&
        req?.header("Authorization").startsWith("Bearer")
    ) {
        token = req?.header("Authorization").split(" ")[1];
    }

    if (!token) {
        return next(new ApiError("You are not logged in, Please login!", 401));
    }

    const verify = jsonwebtoken.verify(token, process.env.SECRET_KEY);

    const user = await UserModel.findById(verify.userId);

    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    if (user.passwordLastUpdate) {
        const passTimestamp = parseInt(user.passwordLastUpdate.getTime() / 1000, 10);
        if (passTimestamp > verify.iat) {
            return next(new ApiError("Password changed, Please login again", 401));
        }
    }

    req.user = user;
    next();
});

//Middleware for checking user permissions
export const allowed = (...roles) =>
    expressAsyncHandler(async (req, res, next) => {
        if (!roles.includes(req?.user.role)) {
            return next(new ApiError("Access denied", 403));
        }
        next();
    });

// Action for forgot password
// @route POST /api/auth/forgotPassword
// @access Public
export const forgotPassword = expressAsyncHandler(async (req, res, next) => {
    const user = await UserModel.findOne({email: req?.body.email});

    if (!user) {
        return next(new ApiError("Incorrect email", 404));
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.passwordResetCode = crypto
        .createHash("sha256")
        .update(code)
        .digest("hex");
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    user.passwordResetVerified = false;

    await user.save();

    try {
        await sendEmail({
            email: user.email,
            subject: "Password reset code",
            template: "resetPass",
            context: {name: user.name, code},
        });
    } catch (e) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;
        await user.save();
        return next(new ApiError("Error while sending email", 500));
    }

    res.status(200).json({message: "Reset code sent successfully"});
});

// Action for verifying password reset code
// @route POST /api/auth/verify-password-reset-code
// @access Public
export const verifyPassResetCode = expressAsyncHandler(
    async (req, res, next) => {
        const hashedResetCode = crypto
            .createHash("sha256")
            .update(req.body.code)
            .digest("hex");

        const user = await UserModel.findOne({
            passwordResetCode: hashedResetCode,
            passwordResetExpires: {$gt: Date.now()},
        });

        if (!user) {
            return next(new ApiError("Code is invalid or expired", 403));
        }

        user.passwordResetVerified = true;
        await user.save();

        res.status(200).send();
    }
);

// Action for resetting password
// @route PUT /api/auth/reset-password
// @access Public
export const resetPassword = expressAsyncHandler(async (req, res, next) => {
    const user = await UserModel.findOne({email: req.body.email});

    if (!user) {
        return next(new ApiError("Incorrect email", 404));
    }

    if (!user.passwordResetVerified) {
        return next(new ApiError("Reset code not verified", 400));
    }

    user.password = req.body.password;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();

    await sendEmail({
        email: user.email,
        subject: "Password changed",
        template: "passChanged",
        context: {name: user.name},
    });

    const token = signToken(user._id, user.role);
    res.status(200).json({message: "Password changed successfully", token});
});