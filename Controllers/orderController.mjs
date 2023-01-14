import dotenv from "dotenv";
import Stripe from "stripe";
import expressAsyncHandler from "express-async-handler";
import CartModel from "../models/cartModel.mjs";
import ApiError from "../utils/apiError.mjs";
import OrderModel from "../models/orderModel.mjs";
import ProductModel from "../models/productModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";

dotenv.config({ path: "config.env" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// @desc    create cash order
// @route   POST /api/orders/cartId
// @access  Private/Protected [User]
export const createCashOrder = expressAsyncHandler(async (req, res, next) => {
  const cart = await CartModel.findById(req.params.cartId);

  if (!cart) {
    return next(new ApiError("No cart found for user", 404));
  }

  const price = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const order = await OrderModel.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice: price,
    paymentMethodType: "cash",
    paidAt: Date.now(),
  });

  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await ProductModel.bulkWrite(bulkOptions, {});

    await CartModel.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ data: order });
});

export const filterOrders = expressAsyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});

// @desc    get all orders
// @route   POST /api/orders
// @access  Private/Protected [Admin - User]
export const getAllOrders = factory.getAllDocuments(OrderModel, "Order");

// @desc    get specific order
// @route   GET /api/orders/:id
// @access  Private/Protected [Admin - User]
export const filterOrder = expressAsyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});
export const getOrder = factory.getDocument(
  OrderModel,
  "No Order found for this Id"
);

// @desc    Update order pay state
// @route   POST /api/orders/:id/pay
// @access  Private/Protected [Admin]
export const updateOrderPay = expressAsyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);

  if (!order) {
    return next(new ApiError("No order found for this id", 404));
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  await order.save();
  res.status(200).json({ data: order });
});

// @desc    Update order delivered state
// @route   POST /api/orders/:id/delivered
// @access  Private/Protected [Admin]
export const updateOrderDelivered = expressAsyncHandler(
  async (req, res, next) => {
    const order = await OrderModel.findById(req.params.id);

    if (!order) {
      return next(new ApiError("No order found for this id", 404));
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    await order.save();
    res.status(200).json({ data: order });
  }
);

// @desc    Checkout stripe session
// @route   GET /api/orders/checkout/cartId
// @access  Private/Protected [User]
export const checkoutSession = expressAsyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOne({
    _id: req.params.cartId,
    user: req.user._id,
  });

  if (!cart) {
    return next(new ApiError("No cart found for this id", 404));
  }

  const price = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          unit_amount: price * 100,
          currency: "eur",
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: cart._id,
    metadata: req.body.shippingAddress,
  });

  res.status(200).json({ session });
});
