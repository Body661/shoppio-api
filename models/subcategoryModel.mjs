import { Mongoose } from "mongoose";

const SubcategoryScema = new Mongoose.Schema({
  name: {
    type: "string",
    required: true,
    minLength: 3,
    maxLength: 32,
  },
});

const SubcategoryModel = new Mongoose.Model(SubcategoryScema);

export default SubcategoryModel;
