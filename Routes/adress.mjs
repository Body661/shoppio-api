import express from "express";
import {allowed, auth} from "../Controllers/authController.mjs";
import {
    addAddress,
    getAddress,
    getAddresses,
    removeAddress,
} from "../Controllers/addressCntroller.mjs";
import {
    addAdressValidators,
    removeAdressValidator,
} from "./validators/addressValidators.mjs";

const router = express.Router();

router.use(auth, allowed("user"));

router
    .route("/")
    .post(...addAdressValidators, addAddress)
    .get(getAddresses);
router.route("/:addressId").get(getAddress).delete(...removeAdressValidator, removeAddress);

export default router;
