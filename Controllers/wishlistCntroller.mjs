import expressAsyncHandler from "express-async-handler";
import UserModel from "../models/userModel.mjs";

// @desc Add product to wishlist
// @route POST /api/wishlist
// @access Private/Protected [User]
export const addToWishlist = expressAsyncHandler(async (req, res) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    message: "Product added successfully to wishlist",
    data: user.wishlist,
  });
});

// @desc Delete product from wishlist
// @route DELETE /api/wishlist/:productId
// @access Private/Protected [User]
export const removeFromWishlist = expressAsyncHandler(async (req, res) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    message: "Product removed successfully from your wishlist",
    data: user.wishlist,
  });
});

// @desc Get legged user wishlist
// @route GET /api/wishlist
// @access Private/Protected [User]
export const getWishlist = expressAsyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user._id).populate("wishlist");

  res.status(200).json({ data: user.wishlist });
});
