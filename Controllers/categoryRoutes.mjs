import slugify from "slugify";
import expressAsyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.mjs";
import CategoryModel from "../models/categoryModel.mjs";

// @desc add a new category
// @route POST /api/categories
// @access Private
export const addCategory = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;

  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(201).json(category);
});

// @desc Get all categories
// @route GET /api/categories
// @access Public
export const getCategories = expressAsyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 2;
  const skip = (page - 1) * limit;

  const categories = await CategoryModel.find().skip(skip).limit(limit);
  res.status(200).json({ page, amount: categories.length, data: categories });
});

// @desc Get a specific category
// @route GET /api/categories/:id
// @access Public
export const getCategory = expressAsyncHandler(async (req, res, next) => {
  const category = await CategoryModel.findById(req.params.id);

  if (!category) {
    return next(new ApiError("Category is not found", 404));
  }

  res.status(200).json(category);
});

// @desc Update a category
// @route GET /api/categories/:id
// @access Private
export const updateCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await CategoryModel.findByIdAndUpdate(
    id,
    { name, slug: slugify(req.body.name) },
    { new: true }
  );

  if (!category) {
    return next(new ApiError("Category is not found", 404));
  }

  res.status(200).json(category);
});

// @desc Delete a category
// @route DELETE /categories/:id
// @access Private
export const deleteCategory = expressAsyncHandler(async (req, res, next) => {
  const category = await CategoryModel.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new ApiError("Category is not found", 404));
  }

  res.status(200).json({ message: "Category deleted" });
});
