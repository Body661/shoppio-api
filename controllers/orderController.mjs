import dotenv from "dotenv";
import Stripe from "stripe";
import expressAsyncHandler from "express-async-handler";
import CartModel from "../models/cartModel.mjs";
import ApiError from "../utils/apiError.mjs";
import OrderModel from "../models/orderModel.mjs";
import ProductModel from "../models/productModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";
import UserModel from "../models/userModel.mjs";

// Load environment variables from config file
dotenv.config({ path: "config.env" });

// Initialize Stripe with secret key and API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
});

// Action for creating cash order
// @route   POST /api/orders/cartId
// @access  Private/Protected [User]
export const createCashOrder = expressAsyncHandler(async (req, res, next) => {
    const cart = await CartModel.findOne({
        _id: req.params.cartId,
        user: req.user._id,
    });

    if (!cart) {
        return next(new ApiError("No cart found", 404));
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

// Filter orders based on user role
export const filterOrders = expressAsyncHandler(async (req, res, next) => {
    if (req.user.role === "user") req.filterObj = { user: req.user._id };
    next();
});

// Action for getting all orders
// @route   POST /api/orders
// @access  Private/Protected [Admin - User]
export const getAllOrders = factory.getAllDocuments(OrderModel, "Order");

// Action for getting a specific order by ID
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

// Action for updating order pay state [paid | not paid]
// @route   POST /api/orders/:id/pay
// @access  Private/Protected [Admin]
export const updateOrderPay = expressAsyncHandler(async (req, res, next) => {
    const order = await OrderModel.findById(req.params.id);

    if (!order) {
        return next(new ApiError("No order found for this id", 404));
    }

    order.isPaid = req.body.isPaid;

    if (req.body.isPaid) {
        order.paidAt = Date.now();
    } else {
        order.paidAt = null;
    }

    await order.save();
    res.status(200).json({ data: order });
});

// Action for Updating order delivery state
// @route   POST /api/orders/:id/delivered
// @access  Private/Protected [Admin]
export const updateOrderDelivered = expressAsyncHandler(
    async (req, res, next) => {
        const order = await OrderModel.findById(req.params.id);

        if (!order) {
            return next(new ApiError("No order found for this id", 404));
        }

        order.isDelivered = req.body.isDelivered;

        if (req.body.isDelivered) {
            order.deliveredAt = Date.now();
        } else {
            order.deliveredAt = null;
        }

        await order.save();
        res.status(200).json({ data: order });
    }
);

// Action for creating stripe checkout session
// @route   POST /api/orders/checkout/cartId
// @access  Private/Protected [User]
export const checkoutSession = expressAsyncHandler(async (req, res, next) => {
    try {
        const userId = req.user._id;
        const cartId = req.params.cartId;
        const cartDetails = await CartModel.findOne({ _id: cartId, user: userId });

        if (!cartDetails) {
            return next(new ApiError("No cart found for this user and cart id", 404));
        }

        const totalPrice = cartDetails.totalPriceAfterDiscount || cartDetails.totalCartPrice;
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        unit_amount: Math.round(totalPrice * 100),
                        currency: "eur",
                        product_data: {
                            name: req.user.name,
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/cart/order-received`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
            customer_email: req.user.email,
            client_reference_id: cartId,
            metadata: req.body.shippingAddress,
        });

        res.status(200).json({ session });
    } catch (error) {
        next(error);
    }
});

export async function createOrder(session) {
    try {
        const cartId = session.client_reference_id;
        const shippingAddress = session.metadata;
        const price = session.amount_total / 100;
        const user = await UserModel.findOne({ email: session.customer_email });
        const cart = await CartModel.findById(cartId);

        if (!user) {
            throw new Error("User not found");
        }

        if (!cart) {
            throw new Error("Cart not found");
        }

        const order = await OrderModel.create({
            user: user._id,
            cartItems: cart.cartItems,
            shippingAddress,
            totalOrderPrice: price,
            paymentMethodType: "card",
            isPaid: true,
            paidAt: Date.now(),
        });

        if (order) {
            const bulkOptions = cart.cartItems.map((item) => ({
                updateOne: {
                    filter: { _id: item.product },
                    update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
                },
            }));
            await ProductModel.bulkWrite(bulkOptions);
            await CartModel.findByIdAndDelete(cartId);
        }
    } catch (error) {
        throw new Error("Failed to create order");
    }
}

export const webhookCheckout = expressAsyncHandler(async (req, res, next) => {
    try {
        const sig = req.headers["stripe-signature"];
        const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type === "checkout.session.completed") {
            await createOrder(event.data.object);
            res.status(201).json({ received: true });
        }

    } catch (error) {
        next(new ApiError(`Webhook error: ${error.message}`, 400));
    }
});