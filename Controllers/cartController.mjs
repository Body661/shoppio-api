import expressAsyncHandler from "express-async-handler";
import CartModel from "../models/cartModel.mjs";
import ProductModel from "../models/productModel.mjs";
import ApiError from "../utils/apiError.mjs";
import CouponModel from "../models/couponModel.mjs";

const calcTotalCartPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
        if (item.priceAfterDiscount > 0) {
            totalPrice += item.quantity * item.priceAfterDiscount;
        } else {
            totalPrice += item.quantity * item.price;
        }
    });
    cart.totalCartPrice = totalPrice;
    cart.totalPriceAfterDiscount = undefined;
};

// @desc Add product to cart
// @route POST /api/cart
// @access Private/Protected [User]
export const addProductToCart = expressAsyncHandler(async (req, res, next) => {
    const {productId, quantity, color} = req.body;
    const product = await ProductModel.findOne({_id: productId});

    if (!product) {
        return next(new ApiError("Product not found", 404));
    }

    let cart = await CartModel.findOne({user: req.user._id});

    if (!cart) {
        cart = await CartModel.create({
            user: req.user._id,
            cartItems: [
                {
                    product: productId,
                    quantity: quantity,
                    color: color,
                    price: product.price,
                    priceAfterDiscount: product.priceAfterDiscount,
                },
            ],
        });
    } else {
        const productExistence = cart.cartItems?.find(
            (prod) => productId === prod?.product?._id.toString() && color === prod.color
        );

        if (productExistence) {
            productExistence.quantity += 1;
        } else {
            cart.cartItems.push({
                product: productId,
                quantity: quantity,
                color: color,
                price: product.price,
                priceAfterDiscount: product.priceAfterDiscount,
            });
        }
    }

    calcTotalCartPrice(cart);

    await cart.save();
    res.status(200).json({message: "Product added to cart", data: cart});
});

// @desc Get logged user cart
// @route GET /api/cart
// @access Private/Protected [User]
export const getMyCart = expressAsyncHandler(async (req, res) => {
    const cart = await CartModel.findOne({user: req.user._id});
    res.status(200).json({data: cart});
});

// @desc remove item from cart
// @route DELETE /api/cart/:id
// @access Private/Protected [User]
export const removeItemFromCart = expressAsyncHandler(async (req, res) => {
    const cart = await CartModel.findOneAndUpdate(
        {user: req.user._id},
        {
            $pull: {cartItems: {_id: req.params.id}},
        },
        {new: true}
    );

    calcTotalCartPrice(cart);

    await cart.save();
    res.status(200).json({data: cart});
});

// @desc Clear cart
// @route DELETE /api/cart/
// @access Private/Protected [User]
export const deleteMyCart = expressAsyncHandler(async (req, res) => {
    await CartModel.findOneAndDelete({user: req.user._id});
    res.status(204).json();
});

// @desc Update item quantity
// @route PUT /api/cart/:id
// @access Private/Protected [User]
export const updateItemQuantity = expressAsyncHandler(
    async (req, res, next) => {
        let cart = await CartModel.findOne({user: req.user._id});

        if (!cart) {
            return next(new ApiError("No cart found for user", 404));
        }

        const product = cart.cartItems.find(
            (item) => item._id.toString() === req.params.id
        );

        if (product) {
            if (req.body.quantity > 0 && req.body.quantity <= product.product.quantity) {
                product.quantity = req.body.quantity;
            } else if (req.body.quantity > 0 && req.body.quantity > product.product.quantity) {
                product.quantity = product.product.quantity;
            } else {
                cart = await CartModel.findOneAndUpdate(
                    {user: req.user._id},
                    {
                        $pull: {cartItems: {_id: req.params.id}},
                    },
                    {new: true}
                );
            }
        } else {
            next(new ApiError("No product found for this id", 404));
        }

        calcTotalCartPrice(cart);
        await cart.save();

        res.status(200).json({data: cart});
    }
);

// @desc Apply coupon to cart
// @route PUT /api/cart/coupon
// @access Private/Protected [User]
export const applyCoupon = expressAsyncHandler(async (req, res, next) => {
    const coupon = await CouponModel.findOne({
        name: req.body.coupon,
        expire: {$gt: Date.now()},
    });

    if (!coupon) {
        return next(new ApiError("Coupon code is invalid or expired", 404));
    }

    const cart = await CartModel.findOne({user: req.user._id});

    if (!cart) {
        return next(new ApiError("No cart found for user", 404));
    }

    calcTotalCartPrice(cart);
    cart.totalPriceAfterDiscount = (
        cart.totalCartPrice -
        (cart.totalCartPrice * coupon.discount) / 100
    ).toFixed(2);

    cart.coupon = req.body.coupon;
    await cart.save(cart.totalPriceAfterDiscount);
    res.status(200).json({data: cart});
});
