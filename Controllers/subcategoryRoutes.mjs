import slugify from "slugify";
import expressAsyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.mjs";
import SubcategoryModel from "../models/subcategoryModel.mjs";

// @desc Create a new Subcategory
// @route POST /api/subcategories
// @access Private
export const addSubcategory = expressAsyncHandler(async (req, res, next) => {
  const { name, category } = req.body;

  const subcategory = await SubcategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });

  res.status(201).json(subcategory);
});

// @desc Get all subcategory
// @route GET /api/subcategories
// @access Public
export const getSubcategories = expressAsyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 2;
  const skip = (page - 1) * limit;

  // const { parentCat } = req.params;

  const subcategories = await SubcategoryModel.find({}).skip(skip).limit(limit);

  res.status(200).json({ page, amount: subcategories.length, subcategories });
});

// @desc Get a specific subcategory
// @route GET /api/subcategories/:id
// @access Public
export const getSubcategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subcategory = await SubcategoryModel.findById(id);

  if (!subcategory) {
    return next(new ApiError("Subcategory not found", 404));
  }

  res.status(200).json({ subcategory });
});

// @desc Update a subcategories
// @route PUT /api/subcategories/:id
// @access Private
export const updateSubcategory = expressAsyncHandler(async (req, res, next) => {
  const { name, category } = req.body;
  const { id } = req.params;

  const subcategory = await SubcategoryModel.findByIdAndUpdate(
    id,
    {
      name,
      slug: slugify(name),
      category,
    },
    { new: true }
  );

  if (!subcategory) {
    return next(new ApiError("Subcategory not found", 404));
  }

  res.status(200).json(subcategory);
});

// @desc Delete a subcategories
// @route DELETE /api/subcategories/:id
// @access Private
export const deleteSubcategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subcategory = await SubcategoryModel.findByIdAndDelete(id);

  if (!subcategory) {
    return next(new ApiError("Subcategory is not found", 404));
  }

  res.status(200).json({ message: "Subcategory deleted" });
});
