import express from "express";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategory,
  imageProcessing,
  updateCategory,
  uploadCatImg,
} from "../Controllers/categoryControllers.mjs";

import {
  createCategoryValidator,
  deleteCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
} from "./validators/categoryValidators.mjs";

import subcategoryRoutes from "./subcategory.mjs";

import { allowed, auth } from "../Controllers/authController.mjs";

const router = express.Router();

router.use("/:categoryId/subcategories", subcategoryRoutes);

router
  .route("/")
  .post(
    auth,
    allowed("admin"),
    uploadCatImg,
    imageProcessing,
    ...createCategoryValidator,
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
    imageProcessing,
    ...updateCategoryValidator,
    updateCategory
  )
  .delete(auth, allowed("admin"), ...deleteCategoryValidator, deleteCategory);

export default router;
