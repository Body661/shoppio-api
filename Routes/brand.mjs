import express from "express";
import {
    addBrand,
    deleteBrand,
    getBrandById,
    getBrands,
    updateBrand,
} from "../controllers/brandControllers.mjs";
import {
    addBrandValidator,
    deleteBrandValidator,
    getBrandValidator,
    updateBrandValidator,
} from "./validators/brandValidators.mjs";
import {allowed, auth} from "../controllers/authController.mjs";
import {deleteImageMiddleware} from "../middlewares/deleteImageMiddleware.mjs";
import BrandModel from "../models/brandModel.mjs";
import {uploadSingle} from "../middlewares/imageUploadMiddleware.mjs";
import {imageProcessingMiddleware} from "../middlewares/imageProcessingMiddleware.mjs";

const router = express.Router();

router
    .route("/")
    .post(
        auth,
        allowed("admin"),
        uploadSingle("img"),
        ...addBrandValidator,
        imageProcessingMiddleware('brand'),
        addBrand
    )
    .get(getBrands);

router
    .route("/:id")
    .get(...getBrandValidator, getBrandById)
    .put(
        auth,
        allowed("admin"),
        deleteImageMiddleware(BrandModel),
        uploadSingle("img"),
        ...updateBrandValidator,
        imageProcessingMiddleware('brand'),
        updateBrand
    )
    .delete(auth, allowed("admin"), ...deleteBrandValidator, deleteImageMiddleware(BrandModel), deleteBrand);

export default router;
