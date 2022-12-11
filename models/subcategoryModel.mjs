import { Mongoose } from "mongoose";

const SubcategoryScema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Subcategory name must be at least 3 characters"],
    maxLength: [32, "Subcategory name is too long"],
    unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
});

const SubcategoryModel = new Mongoose.Model(SubcategoryScema);

export default SubcategoryModel;
