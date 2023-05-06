import expressAsyncHandler from "express-async-handler";
import {uuid} from "uuidv4";
import sharp from "sharp";
import ProductModel from "../models/productModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";
import {uploadMultiple} from "../middlewares/imageUploadMiddleware.mjs";

export const uploadProductImages = uploadMultiple([
    {name: "cover", maxCount: 1},
    {name: "images", maxCount: 5},
]);

// Action for create new product
// @route POST /api/products
// @access Private/Protected [Admin]
export const addProduct = factory.createDocument(ProductModel);

// Action for getting a list of all products
// @route GET /api/products
// @access Public
export const getProducts = factory.getAllDocuments(ProductModel, "Products");

// Action for getting a list of all products
// @route GET /api/products/:id
// @access Public
export const getProduct = factory.getDocument(
    ProductModel,
    "Product not found",
    "reviews"
);

// Action for updating a product
// @route PUT /api/products/:id
// @access Private/Protected [Admin]
export const updateProduct = factory.updateDocument(
    ProductModel,
    "Product not found",
);

// Action for deleting a product
// @route DELETE /api/products/:id
// @access Private/Protected [Admin]
export const deleteProduct = factory.deleteDocument(
    ProductModel,
    "Product not found",
    "Product deleted successfully",
);
