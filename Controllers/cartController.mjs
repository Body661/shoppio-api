import expressAsyncHandler from "express-async-handler";
import CartModel from "../models/cartModel.mjs";
import ProductModel from "../models/productModel.mjs";
import ApiError from "../utils/apiError.mjs";

// @desc Add product to cart
// @route POST /api/cart
// @access Private/Protected [User]
export const addProductToCart = expressAsyncHandler(async (req, res, next) => {
  const { productId, quantity, color } = req.body;
  const product = await ProductModel.findOne({ _id: productId });

  if (!product) {
    return next(new ApiError("Product not found"));
  }

  let cart = await CartModel.findOne({ user: req.user._id });

  if (!cart) {
    cart = await CartModel.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          quantity: quantity,
          color: color,
          price: product.price,
        },
      ],
    });
  } else {
    const productExistence = cart.cartItems.find(
      (prod) => productId === prod.product.toString() && color === prod.color
    );

    if (productExistence) {
      productExistence.quantity += 1;
      productExistence.price = product.price * productExistence.quantity;
    } else {
      cart.cartItems.push({
        product: productId,
        quantity: quantity,
        color: color,
        price: product.price,
      });
    }
  }

  cart.cartItems.forEach((item) => {
    cart.totalCartPrice += item.price;
  });

  await cart.save();
  res.status(200).json({ message: "Product added to cart", data: cart });
});

// @desc Get logged user cart
// @route GET /api/cart
// @access Private/Protected [User]
export const getMyCart = expressAsyncHandler(async (req, res) => {
  const cart = await CartModel.findOne({ user: req.user._id });
  res.status(200).json({ data: cart });
});

// @desc remove item from cart
// @route DELETE /api/cart/:id
// @access Private/Protected [User]
export const removeItemFromCart = expressAsyncHandler(async (req, res) => {
  const cart = await CartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.id } },
    },
    { new: true }
  );

  cart.cartItems.forEach((item) => {
    cart.totalCartPrice += item.price;
  });
  await cart.save();
  res.status(200).json({ data: cart });
});

// @desc Clear cart
// @route DELETE /api/cart/
// @access Private/Protected [User]
export const deleteMyCart = expressAsyncHandler(async (req, res) => {
  await CartModel.findOneAndDelete({ user: req.user._id });
  res.status(204).json();
});
