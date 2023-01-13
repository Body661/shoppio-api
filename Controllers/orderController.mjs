import expressAsyncHandler from "express-async-handler";
import CartModel from "../models/cartModel.mjs";
import ApiError from "../utils/apiError.mjs";
import OrderModel from "../models/orderModel.mjs";
import ProductModel from "../models/productModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";

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
