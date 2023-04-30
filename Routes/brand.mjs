import express from "express";
import {
    addBrand,
    deleteBrand,
    getBrandById,
    getBrands,
    uploadBrandImg,
    imageProcessing,
    updateBrand,
} from "../controllers/brandControllers.mjs";
import {
    addBrandValidator,
    deleteBrandValidator,
    getBrandValidator,
    updateBrandValidator,
} from "./validators/brandValidators.mjs";
import {allowed, auth} from "../controllers/authController.mjs";
import {deleteImages} from "../utils/deleteImages.mjs";
import BrandModel from "../models/brandModel.mjs";

const router = express.Router();

router
    .route("/")
    .post(
        auth,
        allowed("admin"),
        uploadBrandImg,
        ...addBrandValidator,
        imageProcessing,
        addBrand
    )
    .get(getBrands);

router
    .route("/:id")
    .get(...getBrandValidator, getBrandById)
    .put(
        auth,
        allowed("admin"),
        deleteImages(BrandModel),
        uploadBrandImg,
        ...updateBrandValidator,
        imageProcessing,
        updateBrand
    )
    .delete(auth, allowed("admin"), ...deleteBrandValidator, deleteImages(BrandModel), deleteBrand);

export default router;
