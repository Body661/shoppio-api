import express from "express";
import {
    addProduct,
    deleteProduct,
    getProduct,
    getProducts,
    imageProcessing,
    updateProduct,
    uploadProductImgs,
} from "../Controllers/productControllers.mjs";
import {
    createProductValidator,
    deleteProductValidator,
    getProductValidator,
    updateProductValidator,
} from "./validators/productValidators.mjs";
import {allowed, auth} from "../Controllers/authController.mjs";
import reviewRoutes from "./review.mjs";
import {deleteImages} from "../utils/deleteImages.mjs";
import ProductModel from "../models/productModel.mjs";
import {check} from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleware.mjs";

const router = express.Router();

router.use("/:productId/reviews", reviewRoutes);

router
    .route("/")
    .post(
        auth,
        allowed("admin"),
        uploadProductImgs,
        ...createProductValidator,
        imageProcessing,
        [check("cover").notEmpty().withMessage("Product imageCover is required"), validatorMiddleware],
        addProduct
    )
    .get(getProducts);

router
    .route("/:id")
    .get(...getProductValidator, getProduct)
    .put(
        auth,
        allowed("admin"),
        deleteImages(ProductModel),
        uploadProductImgs,
        ...updateProductValidator,
        imageProcessing,
        updateProduct
    )
    .delete(auth, allowed("admin"), ...deleteProductValidator, deleteImages(ProductModel), deleteProduct);
export default router;
