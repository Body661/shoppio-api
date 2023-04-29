import express from "express";
import {
    checkoutSession,
    createCashOrder,
    filterOrder,
    filterOrders,
    getAllOrders,
    getOrder,
    updateOrderDelivered,
    updateOrderPay,
} from "../Controllers/orderController.mjs";
import {allowed, auth} from "../Controllers/authController.mjs";

const router = express.Router();

router.use(auth);

router.post("/checkout/:cartId", allowed("user"), checkoutSession);

router.route("/:cartId").post(allowed("user"), createCashOrder);
router
    .route("/")
    .get(auth, allowed("admin", "user"), filterOrders, getAllOrders);
router.route("/:id").get(allowed("user", "admin"), filterOrder, getOrder);
router.route("/:id/pay").put(allowed("admin"), updateOrderPay);
router.route("/:id/delivered").put(allowed("admin"), updateOrderDelivered);

export default router;
