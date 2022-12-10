import express from "express";
import {addCategory, getCategories, getCategory, updateCategory} from "../Controllers/categoryRoutes.mjs";

const router = express.Router();

router.route('/')
    .post(addCategory)
    .get(getCategories)

router.route('/:id').get(getCategory).put(updateCategory)

export default router