import express from "express";
import {
  addBrand,
  deleteBrand,
  getBrand,
  getBrands,
  updateBrand,
} from "../Controllers/brandRoutes.mjs";
import {
  addBrandValidator,
  deleteBrandValidator,
  getBrandValidator,
  updateBrandValidator,
} from "./validators/brandValidators.mjs";

const router = express.Router();

router
  .route("/")
  .post(...addBrandValidator, addBrand)
  .get(getBrands);

router
  .route("/:id")
  .get(...getBrandValidator, getBrand)
  .put(...updateBrandValidator, updateBrand)
  .delete(...deleteBrandValidator, deleteBrand);

export default router;
