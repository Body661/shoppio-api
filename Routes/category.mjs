import express from "express";
import {
    addCategory,
    deleteCategory,
    getCategories,
    getCategory,
    imageProcessing,
    updateCategory,
    uploadCatImg,
} from "../controllers/categoryControllers.mjs";

import {
    createCategoryValidator,
    deleteCategoryValidator,
    getCategoryValidator,
    updateCategoryValidator,
} from "./validators/categoryValidators.mjs";

import subcategoryRoutes from "./subcategory.mjs";

import {allowed, auth} from "../controllers/authController.mjs";
import {deleteImages} from "../utils/deleteImages.mjs";
import CategoryModel from "../models/categoryModel.mjs";

const router = express.Router();

router.use("/:categoryId/subcategories", subcategoryRoutes);

router
    .route("/")
    .post(
        auth,
        allowed("admin"),
        uploadCatImg,
        ...createCategoryValidator,
        imageProcessing,
        addCategory
    )
    .get(getCategories);

router
    .route("/:id")
    .get(...getCategoryValidator, getCategory)
    .put(
        auth,
        allowed("admin"),
        uploadCatImg,
        ...updateCategoryValidator,
        deleteImages(CategoryModel),
        imageProcessing,
        updateCategory
    )
    .delete(auth, allowed("admin"), ...deleteCategoryValidator, deleteImages(CategoryModel), deleteCategory);

export default router;
