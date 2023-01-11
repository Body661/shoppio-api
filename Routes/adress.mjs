import express from "express";
import { allowed, auth } from "../Controllers/authController.mjs";
import {
  addAddress,
  getAddresses,
  removeAdress,
} from "../Controllers/adressCntroller.mjs";
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
router.route("/:addressId").delete(...removeAdressValidator, removeAdress);

export default router;
