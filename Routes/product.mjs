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

const router = express.Router();

router
  .route("/")
  .post(
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
    uploadProductImgs,
    imageProcessing,
    ...updateProductValidator,
    updateProduct
  )
  .delete(...deleteProductValidator, deleteProduct);
export default router;
