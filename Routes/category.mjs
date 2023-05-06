import express from "express";
import {
    addCategory,
    deleteCategory,
    getCategories,
    getCategory,
    updateCategory,
} from "../controllers/categoryControllers.mjs";

import {
    createCategoryValidator,
    deleteCategoryValidator,
    getCategoryValidator,
    updateCategoryValidator,
} from "./validators/categoryValidators.mjs";

import subcategoryRoutes from "./subcategory.mjs";

import {allowed, auth} from "../controllers/authController.mjs";
import {deleteImageMiddleware} from "../middlewares/deleteImageMiddleware.mjs";
import CategoryModel from "../models/categoryModel.mjs";
import {uploadSingle} from "../middlewares/imageUploadMiddleware.mjs";
import {imageProcessingMiddleware} from "../middlewares/imageProcessingMiddleware.mjs";

const router = express.Router();

router.use("/:categoryId/subcategories", subcategoryRoutes);

router
    .route("/")
    .post(
        auth,
        allowed("admin"),
        uploadSingle("img"),
        ...createCategoryValidator,
        imageProcessingMiddleware('category'),
        addCategory
    )
    .get(getCategories);

router
    .route("/:id")
    .get(...getCategoryValidator, getCategory)
    .put(
        auth,
        allowed("admin"),
        uploadSingle("img"),
        ...updateCategoryValidator,
        deleteImageMiddleware(CategoryModel),
        imageProcessingMiddleware('category'),
        updateCategory
    )
    .delete(auth, allowed("admin"), ...deleteCategoryValidator, deleteImageMiddleware(CategoryModel), deleteCategory);

export default router;
