import expressAsyncHandler from "express-async-handler";
import UserModel from "../models/userModel.mjs";

// @desc Add address to user addresses
// @route POST /api/addresses
// @access Private/Protected [User]
export const addAddress = expressAsyncHandler(async (req, res) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    message: "address added successfully to your list",
    data: user.addresses,
  });
});

// @desc Delete address from addresses list
// @route DELETE /api/addresses/:addressId
// @access Private/Protected [User]
export const removeAdress = expressAsyncHandler(async (req, res) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );

  res.status(200).json({
    message: "Address removed successfully from your list",
    data: user.addresses,
  });
});

// @desc Get legged user wishlist
// @route GET /api/wishlist
// @access Private/Protected [User]
export const getAddresses = expressAsyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user._id).populate("addresses");

  res.status(200).json({ data: user.addresses });
});
