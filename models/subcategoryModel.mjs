import mongoose from "mongoose";

const SubcategoryScema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Subcategory name must be at least 3 characters"],
      maxLength: [32, "Subcategory name is too long"],
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const SubcategoryModel = new mongoose.model("Subcategory", SubcategoryScema);

export default SubcategoryModel;
