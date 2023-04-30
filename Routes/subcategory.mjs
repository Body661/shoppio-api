import express from "express";
import {
    addSubcategory,
    createFilterObj,
    deleteSubcategory,
    getSubcategories,
    getSubcategory,
    updateSubcategory,
} from "../controllers/subcategoryControllers.mjs";

import {
    createSubcategoryValidator,
    deleteSubcategoryValidator,
    getSubcategoryValidator,
    updateSubcategoryValidator,
} from "./validators/subcategoryValidators.mjs";
import {allowed, auth} from "../controllers/authController.mjs";

const router = express.Router({mergeParams: true});

router
    .route("/")
    .post(auth, allowed("admin"), ...createSubcategoryValidator, addSubcategory)
    .get(createFilterObj, getSubcategories);

router
    .route("/:id")
    .put(auth, allowed("admin"), ...updateSubcategoryValidator, updateSubcategory)
    .get(...getSubcategoryValidator, getSubcategory)
    .delete(
        auth,
        allowed("admin"),
        ...deleteSubcategoryValidator,
        deleteSubcategory
    );

export default router;
