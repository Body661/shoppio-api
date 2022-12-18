import mongoose from "mongoose";

const BrandsSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Category name is required"],
    unique: [true, "Category name must be unique"],
    minLength: [2, "Category name must be at least 2 characters"],
    maxLength: [32, "Category name is too long"],
  },
  slug: {
    type: String,
    lowercase: true,
  },
  img: {
    type: String,
  },
});

const BrandsModel = new mongoose.model(BrandsSchema);
export default BrandsModel;
