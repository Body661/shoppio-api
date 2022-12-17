import express from "express";
import {
  addSubcategory,
  deleteSubcategory,
  getSubcategories,
  getSubcategory,
  updateSubcategory,
} from "../Controllers/subcategoryRoutes.mjs";

import {
  createSubcategoryValidator,
  deleteSubcategoryValidator,
  // getSubcategoriesValidator,
  getSubcategoryValidator,
  updateSubcategoryValidator,
} from "./validators/subcategoryValidators.mjs";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(...createSubcategoryValidator, addSubcategory)
  .get(getSubcategories);

router
  .route("/:id")
  .delete(...deleteSubcategoryValidator, deleteSubcategory)
  .get(...getSubcategoryValidator, getSubcategory)
  .put(...updateSubcategoryValidator, updateSubcategory);

export default router;
