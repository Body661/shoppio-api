import SubcategoryModel from "../models/subcategoryModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";

// Action for creating a new Subcategory
// @Route POST /api/subcategories
// @Access Private
export const addSubcategory = factory.createDocument(SubcategoryModel);

// Middleware to create a filter object for retrieving subcategories
export const createFilterObj = (req, res, next) => {
    let filter = {};
    if (req.params.categoryId) filter = { category: req.params.categoryId };
    req.filterObj = filter;
    next();
};

// Action for getting all subcategories or subcategories for a specific category
// @Route 1 GET /api/subcategories
// @Access 1 Public
// @Route 2 GET /api/category/:categoryId/subcategories
// @Access 2 Public
export const getSubcategories = factory.getAllDocuments(SubcategoryModel);

// Action for getting a specific subcategory by ID
// @Route GET /api/subcategories/:id
// @Access Public
export const getSubcategory = factory.getDocument(
    SubcategoryModel,
    "Subcategory not found"
);

// Action for updating a subcategory by ID
// @Route PUT /api/subcategories/:id
// @Access Private/Protected [Admin]
export const updateSubcategory = factory.updateDocument(
    SubcategoryModel,
    "Subcategory not found"
);

// Action for deleting a subcategory by ID
// @Route DELETE /api/subcategories/:id
// @Access Private/Protected [Admin]
export const deleteSubcategory = factory.deleteDocument(
    SubcategoryModel,
    "Subcategory not found",
    "Subcategory deleted successfully"
);
