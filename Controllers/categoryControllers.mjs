import {uuid} from "uuidv4";
import sharp from "sharp";
import expressAsyncHandler from "express-async-handler";
import CategoryModel from "../models/categoryModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";
import {uploadSingle} from "../middlewares/imageUploadMiddleware.mjs";

export const uploadCatImg = uploadSingle("img");
export const imageProcessing = expressAsyncHandler(async (req, res, next) => {
    const filename = `category-${uuid()}-${Date.now()}.png`;

    if (req.file) {
        await sharp(req.file.buffer)
            .resize(130, 130)
            .toFormat("png")
            .png({quality: 80})
            .toFile(`uploads/categories/${filename}`);

        req.body.img = filename;
    }

    next();
});

// @desc Create a new category
// @route POST /api/categories
// @access Private/Protected [Admin]
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
// @access Private/Protected [Admin]
export const updateCategory = factory.updateDocument(
    CategoryModel,
    "Category not found"
);

// @desc Delete a category
// @route DELETE /categories/:id
// @access Private/Protected [Admin]
export const deleteCategory = factory.deleteDocument(
    CategoryModel,
    "Category not found",
    "Category deleted successfully",
);
