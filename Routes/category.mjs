import express from "express";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategory,
  imageProcessing,
  updateCategory,
  uploadCatImg,
} from "../Controllers/categoryRoutes.mjs";

import {
  createCategoryValidator,
  deleteCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
} from "./validators/categoryValidators.mjs";

import subcategoryRoutes from "./subcategory.mjs";

const router = express.Router();

router.use("/:categoryId/subcategories", subcategoryRoutes);

router
  .route("/")
  .post(uploadCatImg, imageProcessing, ...createCategoryValidator, addCategory)
  .get(getCategories);

router
  .route("/:id")
  .get(...getCategoryValidator, getCategory)
  .put(
    uploadCatImg,
    imageProcessing,
    ...updateCategoryValidator,
    updateCategory
  )
  .delete(...deleteCategoryValidator, deleteCategory);

export default router;
