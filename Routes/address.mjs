import express from "express";
import { allowed, auth } from "../controllers/authController.mjs";
import {
    addAddress,
    getAddressById,
    getAllAddresses,
    removeAddress,
    updateAddress,
} from "../controllers/addressController.mjs";
import {
    addAddressValidators,
    removeAddressValidator,
    updateAddressValidators,
} from "./validators/addressValidators.mjs";

// Initialize the router
const router = express.Router();

// Middleware to authenticate and authorize a user
router.use(auth, allowed("user"));

// Routes for adding and getting all addresses
router
    .route("/")
    .post(...addAddressValidators, addAddress) // Add an address with validation
    .get(getAllAddresses); // Get all addresses for a user

// Routes for updating, getting, and removing an address by its ID
router
    .route("/:addressId")
    .put(...updateAddressValidators, updateAddress) // Update an address with validation
    .get(getAddressById) // Get an address by its ID
    .delete(...removeAddressValidator, removeAddress); // Remove an address with validation

export default router;