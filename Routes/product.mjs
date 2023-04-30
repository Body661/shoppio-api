import express from "express";
import {
    addProduct,
    deleteProduct,
    getProduct,
    getProducts,
    imageProcessing,
    updateProduct,
    uploadProductImgs,
} from "../controllers/productControllers.mjs";
import {
    createProductValidator,
    deleteProductValidator,
    getProductValidator,
    updateProductValidator,
} from "./validators/productValidators.mjs";
import {allowed, auth} from "../controllers/authController.mjs";
import reviewRoutes from "./review.mjs";
import {deleteImages} from "../utils/deleteImages.mjs";
import ProductModel from "../models/productModel.mjs";
import {check} from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleware.mjs";

// Initialize the router
const router = express.Router();

// Use review routes as sub-route for productId
router.use("/:productId/reviews", reviewRoutes);

// Route for creating and fetching products
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

// Route for getting, updating, and deleting a specific product
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
