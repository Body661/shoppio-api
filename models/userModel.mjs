import mongoose from "mongoose";
import validator from "validator";

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
    minlength: 8,
    validate: {
      validator: (value) => validator.isStrongPassword(value),
      message: "The password is not strong enough",
    },
  },
  role: {
    type: String,
    trim: true,
    enum: ["admin", "user"],
    default: "user",
  },
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
