import ProductModel from "../models/productModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";

//@desc Create new product
//@route POST /api/products
//@access Private
export const addProduct = factory.createDocument(ProductModel);

// @desc Get a list of all products
// @route GET /api/products
// @access Public
export const getProducts = factory.getAllDocuments(ProductModel, "Products");

// @desc Get a list of all products
// @route GET /api/products/:id
// @access Public
export const getProduct = factory.getDocument(
  ProductModel,
  "Product not found"
);

export const updateProduct = factory.updateDocument(
  ProductModel,
  "Product not found"
);

// @desc delete a product
// @route DELETE /api/products/:id
// @access Private
export const deleteProduct = factory.deleteDocument(
  ProductModel,
  "Product not found",
  "Product deleted successfully"
);
