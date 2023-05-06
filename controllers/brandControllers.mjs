import BrandModel from "../models/brandModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";

// Action for creating a new brand
// @Route POST /api/brands
// @Access Private/Protected [Admin]
export const addBrand = factory.createDocument(BrandModel);

// Action for getting all brands
// @Route GET /api/brands
// @Access Public
export const getBrands = factory.getAllDocuments(BrandModel);

// Action for getting a specific brand by ID
// @Route GET /api/brands/:id
// @Access Public
export const getBrandById = factory.getDocument(BrandModel, "Brand not found");

// Action for updating a brand by ID
// @Route PUT /api/brands/:id
// @Access Private/Protected [Admin]
export const updateBrand = factory.updateDocument(
    BrandModel,
    "Brand not found"
);

// Action for deleting a brand by ID
// @Route DELETE /api/brands/:id
// @Access Private/Protected [Admin]
export const deleteBrand = factory.deleteDocument(
    BrandModel,
    "Brand not found",
    "Brand deleted successfully"
);