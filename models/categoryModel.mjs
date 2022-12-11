import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Category name is required"],
      unique: [true, "Category name must be unique"],
      minLength: [3, "Category name must be at least 3 characters"],
      maxLength: [32, "Category name is too long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    img: {
      type: String,
    },
  },
  { timestamps: true }
);

const CategoryModel = new mongoose.model("Category", CategorySchema);

export default CategoryModel;
