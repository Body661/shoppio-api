import express from "express";
import {
    addCategory,
    deleteCategory,
    getCategories,
    getCategory,
    updateCategory
} from "../Controllers/categoryRoutes.mjs";

const router = express.Router();

router.route('/')
    .post(addCategory)
    .get(getCategories)

router.route('/:id').get(getCategory).put(updateCategory).delete(deleteCategory)

export default router