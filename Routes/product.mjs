import express from "express";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
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
  .post(...createProductValidator, addProduct)
  .get(getProducts);

router
  .route("/:id")
  .get(...getProductValidator, getProduct)
  .put(...updateProductValidator, updateProduct)
  .delete(...deleteProductValidator, deleteProduct);
export default router;
