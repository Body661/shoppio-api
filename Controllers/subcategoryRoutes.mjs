import slugify from "slugify";
import expressAsyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.mjs";
import SubcategoryModel from "../models/subcategoryModel.mjs";

const addSubcategory = expressAsyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const subcategory = await SubcategoryModel.create({
    name,
    slug: slugify(name),
  });
  res.status(201).json(subcategory);
});
