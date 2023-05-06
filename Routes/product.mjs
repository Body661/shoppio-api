import express from "express";
import {
    addProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct,
    uploadProductImages,
} from "../controllers/productControllers.mjs";
import {
    createProductValidator,
    deleteProductValidator,
    getProductValidator,
    updateProductValidator,
} from "./validators/productValidators.mjs";
import {allowed, auth} from "../controllers/authController.mjs";
import reviewRoutes from "./review.mjs";
import {deleteImageMiddleware} from "../middlewares/deleteImageMiddleware.mjs";
import ProductModel from "../models/productModel.mjs";
import {check} from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleware.mjs";
import {imageProcessingMiddleware} from "../middlewares/imageProcessingMiddleware.mjs";

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
        uploadProductImages,
        ...createProductValidator,
        imageProcessingMiddleware('product'),
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
        deleteImageMiddleware(ProductModel),
        uploadProductImages,
        ...updateProductValidator,
        imageProcessingMiddleware('product'),
        updateProduct
    )
    .delete(auth, allowed("admin"), ...deleteProductValidator, deleteImageMiddleware(ProductModel), deleteProduct);

export default router;
