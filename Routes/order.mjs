import express from "express";
import {
  createCashOrder,
  filterOrder,
  filterOrders,
  getAllOrders,
  getOrder,
} from "../Controllers/orderController.mjs";
import { allowed, auth } from "../Controllers/authController.mjs";

const router = express.Router();

router.use(auth);

router.route("/:cartId").post(allowed("user"), createCashOrder);
router
  .route("/")
  .get(auth, allowed("admin", "user"), filterOrders, getAllOrders);
router.route("/:id").get(allowed("user", "admin"), filterOrder, getOrder);

export default router;
