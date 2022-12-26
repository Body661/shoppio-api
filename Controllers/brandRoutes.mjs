import BrandModel from "../models/brandModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";

// @desc Create a new brand
// @route POST /api/brands
// @access Private
export const addBrand = factory.createDocument(BrandModel);

// @desc Get all brands
// @route GET /api/brands
// @access Public
export const getBrands = factory.getAllDocuments(BrandModel);

// @desc Get a specific brand
// @route GET /api/brands/;id
// @access Public
export const getBrand = factory.getDocument(BrandModel, "Brand not found");

// @desc Update a brand
// @route PUT /api/brands/:id
// @access Private
export const updateBrand = factory.updateDocument(
  BrandModel,
  "Brand not found"
);

// @desc Delete a brand
// @route DELETE /api/brands/:id
// @access Private
export const deleteBrand = factory.deleteDocument(
  BrandModel,
  "Brand not found",
  "Brand deleted successfully"
);
