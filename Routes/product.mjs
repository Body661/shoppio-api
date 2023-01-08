import express from "express";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  imageProcessing,
  updateProduct,
  uploadProductImgs,
} from "../Controllers/productRoutes.mjs";
import {
  createProductValidator,
  deleteProductValidator,
  getProductValidator,
  updateProductValidator,
} from "./validators/productValidators.mjs";
import { allowed, auth } from "../Controllers/authController.mjs";

const router = express.Router();

router
  .route("/")
  .post(
    auth,
    allowed("admin"),
    uploadProductImgs,
    imageProcessing,
    ...createProductValidator,
    addProduct
  )
  .get(getProducts);

router
  .route("/:id")
  .get(...getProductValidator, getProduct)
  .put(
    auth,
    allowed("admin"),
    uploadProductImgs,
    imageProcessing,
    ...updateProductValidator,
    updateProduct
  )
  .delete(auth, allowed("admin"), ...deleteProductValidator, deleteProduct);
export default router;
