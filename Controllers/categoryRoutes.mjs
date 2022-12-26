import CategoryModel from "../models/categoryModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";

// @desc Create a new category
// @route POST /api/categories
// @access Private
export const addCategory = factory.createDocument(CategoryModel);

// @desc Get all categories
// @route GET /api/categories
// @access Public
export const getCategories = factory.getAllDocuments(CategoryModel);

// @desc Get a specific category
// @route GET /api/categories/:id
// @access Public
export const getCategory = factory.getDocument(
  CategoryModel,
  "Category not found"
);

// @desc Update a category
// @route GET /api/categories/:id
// @access Private
export const updateCategory = factory.updateDocument(
  CategoryModel,
  "Category not found"
);

// @desc Delete a category
// @route DELETE /categories/:id
// @access Private
export const deleteCategory = factory.deleteDocument(
  CategoryModel,
  "Category not found",
  "Category deleted successfully"
);
