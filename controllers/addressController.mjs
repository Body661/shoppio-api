import expressAsyncHandler from "express-async-handler";
import UserModel from "../models/userModel.mjs";

// Action for adding a new address to the user's address list
// @route POST /api/addresses
// @access Private/Protected [User]
export const addAddress = expressAsyncHandler(async (req, res) => {
    const updatedUser = await UserModel.findByIdAndUpdate(
        req?.user._id,
        {
            $addToSet: {addresses: req?.body},
        },
        {new: true}
    );

    res?.status(200).json({
        message: "Address added successfully to your list",
        data: updatedUser?.addresses,
    });
});

// Action for getting a specific address by ID
// @route GET /api/addresses/:addressId
// @access Private/User
export const getAddressById = expressAsyncHandler(async (req, res) => {
    const user = await UserModel.findById(req?.user._id);

    const address = user?.addresses.id(req?.params?.addressId);

    return res?.status(200).json({data: address});
});

// Action for updating an existing user address
// @route PUT /api/addresses/:addressId
// @access Private/Protected [User]
export const updateAddress = expressAsyncHandler(async (req, res) => {
    const addressIndex = req.user.addresses.findIndex(
        (address) => address._id.toString() === req?.params?.addressId
    );

    Object.keys(req?.body).forEach((key) => {
        req.user.addresses[addressIndex][key] = req.body[key];
    });

    const updatedUser = await req.user.save();

    res.status(200).json({
        message: "Address updated successfully",
        data: updatedUser?.addresses,
    });
});

// Action for deleting an address from the user's address list by ID
// @route DELETE /api/addresses/:addressId
// @access Private/Protected [User]
export const removeAddress = expressAsyncHandler(async (req, res) => {
    const updatedUser = await UserModel.findByIdAndUpdate(
        req?.user?._id,
        {
            $pull: {addresses: {_id: req?.params?.addressId}},
        },
        {new: true}
    );

    res?.status(200).json({
        message: "Address removed successfully from your list",
        data: updatedUser?.addresses,
    });
});

// Action for getting the logged user's address list
// @route GET /api/addresses
// @access Private/Protected [User]
export const getAllAddresses = expressAsyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user._id).populate("addresses");

    res?.status(200).json({data: user?.addresses});
});