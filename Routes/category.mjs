import express from "express";
import {addCategory, getCategories} from "../Controllers/categoryRoutes.mjs";

const router = express.Router();

router.route('/')
    .post(addCategory)
    .get(getCategories)

export default router