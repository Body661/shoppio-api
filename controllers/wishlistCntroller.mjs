import expressAsyncHandler from "express-async-handler";
import UserModel from "../models/userModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";

// Action for adding a product to the wishlist
// @Route POST /api/wishlist
// @Access Private/Protected [User]
export const addToWishlist = expressAsyncHandler(async (req, res) => {
    const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: {wishlist: req.body.productId},
        },
        {new: true}
    );

    res.status(200).json({
        message: "Product added successfully to wishlist",
        data: user.wishlist,
    });
});

// Action for deleting a product from the wishlist
// @Route DELETE /api/wishlist/:productId
// @Access Private/Protected [User]
export const removeFromWishlist = expressAsyncHandler(async (req, res) => {
    const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {wishlist: req.params.productId},
        },
        {new: true}
    );

    res.status(200).json({
        message: "Product removed successfully from your wishlist",
        data: user.wishlist,
    });
});

// Action for getting the logged-in user's wishlist
// @Route GET /api/wishlist
// @Access Private/Protected [User]
export const getWishlist = expressAsyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user._id).populate("wishlist");

    res.status(200).json({data: user.wishlist});
});