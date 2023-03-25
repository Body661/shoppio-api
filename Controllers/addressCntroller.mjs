import expressAsyncHandler from "express-async-handler";
import UserModel from "../models/userModel.mjs";

// @desc Add address to user addresses
// @route POST /api/addresses
// @access Private/Protected [User]
export const addAddress = expressAsyncHandler(async (req, res) => {
    const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: {addresses: req.body},
        },
        {new: true}
    );

    res.status(200).json({
        message: "address added successfully to your list",
        data: user.addresses,
    });
});

// @desc      Get Specific address with id
// @route     Get /api/addresses/:addressId
// @access    Private/User
export const getAddress = expressAsyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.user._id);

    const address = user.addresses.id(req.params.addressId);

    return res.status(200).json({data: address});
});

// @desc Update user address
// @route PUT /api/addresses/:id
// @access Private/Protected [User]
export const updateAddress = expressAsyncHandler(async (req, res) => {

    const addressIndex = req.user.addresses.findIndex(
        (address) => address._id.toString() === req.params.addressId
    );

    Object.keys(req.body).forEach((key) => {
        req.user.addresses[addressIndex][key] = req.body[key];
    });

    const updatedUser = await req.user.save();

    res.status(200).json({
        message: "Address updated successfully",
        data: updatedUser.addresses,
    });
});

// @desc Delete address from addresses list
// @route DELETE /api/addresses/:addressId
// @access Private/Protected [User]
export const removeAddress = expressAsyncHandler(async (req, res) => {
    const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {addresses: {_id: req.params.addressId}},
        },
        {new: true}
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

    res.status(200).json({data: user.addresses});
});
