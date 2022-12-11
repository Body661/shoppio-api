import mongoose from "mongoose";

const SubcategoryScema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Subcategory name is required"],
      unique: [true, "Subcategory name must be unique"],
      minLength: [3, "Subcategory name must be at least 3 characters"],
      maxLength: [32, "Subcategory name is too long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Subcategory must be belong to a parent category"],
    },
  },
  { timestamps: true }
);

const SubcategoryModel = new mongoose.model("Subcategory", SubcategoryScema);

export default SubcategoryModel;
