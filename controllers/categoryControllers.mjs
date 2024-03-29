import CategoryModel from "../models/categoryModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";

// Action for creating a new category
// @route POST /api/categories
// @access Private/Protected [Admin]
export const addCategory = factory.createDocument(CategoryModel);

// Action for getting all categories
// @route GET /api/categories
// @access Public
export const getCategories = factory.getAllDocuments(CategoryModel);

// Action for get a specific category by ID
// @route GET /api/categories/:id
// @access Public
export const getCategory = factory.getDocument(
    CategoryModel,
    "Category not found"
);

// Action for updating a category
// @route GET /api/categories/:id
// @access Private/Protected [Admin]
export const updateCategory = factory.updateDocument(
    CategoryModel,
    "Category not found"
);

// Action for deleting a category
// @route DELETE /categories/:id
// @access Private/Protected [Admin]
export const deleteCategory = factory.deleteDocument(
    CategoryModel,
    "Category not found",
    "Category deleted successfully",
);
