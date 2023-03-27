import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import {string} from "sharp/lib/is.js";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: "Please enter a valid email address",
        },
        required: [true, "Email is required"],
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: (value) => validator.isMobilePhone(value),
            message: "Please enter a valid phone number",
        },
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password is required"],
        validate: {
            validator: (value) => validator.isStrongPassword(value),
            message: "The password is not strong enough",
        },
    },
    passLastUpdate: Date,
    passResetCode: String,
    passResetExpires: Date,
    passResetVerified: Boolean,
    role: {
        type: String,
        trim: true,
        enum: ["admin", "user"],
        default: "user",
    },
    wishlist: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
        },
    ],
    addresses: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
            },
            alias: String,
            street: String,
            postalCode: String,
            phone: String,
            city: String,
            country: String,
        },
    ],
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
