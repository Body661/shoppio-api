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
import { allowed, auth } from "../Controllers/authController.mjs";

const router = express.Router();

router
  .route("/")
  .post(
    auth,
    allowed("admin"),
    uploadBrandImg,
    imageProcessing,
    ...addBrandValidator,
    addBrand
  )
  .get(getBrands);

router
  .route("/:id")
  .get(...getBrandValidator, getBrand)
  .put(
    auth,
    allowed("admin"),
    uploadBrandImg,
    imageProcessing,
    ...updateBrandValidator,
    updateBrand
  )
  .delete(auth, allowed("admin"), ...deleteBrandValidator, deleteBrand);

export default router;
