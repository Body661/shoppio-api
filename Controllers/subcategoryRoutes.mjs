import SubcategoryModel from "../models/subcategoryModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";

// @desc Create a new Subcategory
// @route POST /api/subcategories
// @access Private
export const addSubcategory = factory.createDocument(SubcategoryModel);

export const createFilterObj = (req, res, next) => {
  let filter = {};
  if (req.params.categoryId) filter = { category: req.params.categoryId };
  req.filterObj = filter;
  next();
};

// @desc_1 Get all subcategories
// @route_1 GET /api/subcategories
// @access_1 Public

// @desc_2 Get subcategories for a specific category
// @route_2 GET /api/category/:categoryId/subcategories
// @access_2 Public
export const getSubcategories = factory.getAllDocuments(SubcategoryModel);

// @desc Get a specific subcategory
// @route GET /api/subcategories/:id
// @access Public
export const getSubcategory = factory.getDocument(
  SubcategoryModel,
  "Subcategory not found"
);

// @desc Update a subcategories
// @route PUT /api/subcategories/:id
// @access Private
export const updateSubcategory = factory.updateDocument(
  SubcategoryModel,
  "Subcategory not found"
);

// @desc Delete a subcategories
// @route DELETE /api/subcategories/:id
// @access Private
export const deleteSubcategory = factory.deleteDocument(
  SubcategoryModel,
  "Subcategory not found",
  "Subcategory deleted successfully"
);
