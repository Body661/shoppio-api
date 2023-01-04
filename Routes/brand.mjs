import express from "express";
import {
  addBrand,
  deleteBrand,
  getBrand,
  getBrands,
  uploadBrandImg,
  imageProcessing,
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
  .post(uploadBrandImg, imageProcessing, ...addBrandValidator, addBrand)
  .get(getBrands);

router
  .route("/:id")
  .get(...getBrandValidator, getBrand)
  .put(uploadBrandImg, imageProcessing, ...updateBrandValidator, updateBrand)
  .delete(...deleteBrandValidator, deleteBrand);

export default router;
