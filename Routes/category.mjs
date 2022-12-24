import express from "express";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
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
  .post(...createCategoryValidator, addCategory)
  .get(getCategories);

router
  .route("/:id")
  .get(...getCategoryValidator, getCategory)
  .put(...updateCategoryValidator, updateCategory)
  .delete(...deleteCategoryValidator, deleteCategory);

export default router;
