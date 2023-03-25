import express from "express";
import {allowed, auth} from "../Controllers/authController.mjs";
import {
    addAddress,
    getAddress,
    getAddresses,
    removeAddress, updateAddress,
} from "../Controllers/addressCntroller.mjs";
import {
    addAddressValidators,
    removeAddressValidator, updateAddressValidators,
} from "./validators/addressValidators.mjs";

const router = express.Router();

router.use(auth, allowed("user"));

router
    .route("/")
    .post(...addAddressValidators, addAddress)
    .get(getAddresses);

router.route("/:addressId").put(...updateAddressValidators, updateAddress).get(getAddress).delete(...removeAddressValidator, removeAddress);

export default router;
