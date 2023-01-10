import express from "express";
import { allowed, auth } from "../Controllers/authController.mjs";
import {
  addAddress,
  getAddresses,
  removeAdress,
} from "../Controllers/adressCntroller.mjs";

const router = express.Router();

router.use(auth, allowed("user"));

router.route("/").post(addAddress).get(getAddresses);
router.route("/:addressId").delete(removeAdress);

export default router;
