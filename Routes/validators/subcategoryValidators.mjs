import {check} from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.mjs";
import categoryModel from "../../models/categoryModel.mjs";
import subcategoryModel from "../../models/subcategoryModel.mjs";

export const createSubcategoryValidator = [
    check("name")
        .notEmpty()
        .withMessage("Subcategory name is required")
        .isLength({min: 2, max: 33})
        .withMessage("Category name must be between 2 and 32 characters")
        .custom(async (value, {req}) => {
            const subcategory = await subcategoryModel.findOne({name: value})

            if (subcategory) {
                throw new Error("Subcategory name already exists")
            }

            return true;
        }),
    check("categoryId")
        .notEmpty()
        .withMessage("Subcategory must be belong to a category")
        .isMongoId()
        .withMessage("Category ID is not valid")
        .custom(async (value, {req}) => {
            const category = await categoryModel.findById(value)

            if (!category) {
                throw new Error("Category does not exist")
            }

            req.body.category = value;
            return true;
        }),
    validatorMiddleware,
];

export const getSubcategoryValidator = [
    check("id").isMongoId().withMessage("Subcategory ID is not valid"),
    validatorMiddleware,
];
export const updateSubcategoryValidator = [
    check("id").isMongoId().withMessage("Subcategory ID is not valid"),
    check("name")
        .notEmpty()
        .withMessage("Subcategory name is required")
        .isLength({min: 2, max: 32})
        .withMessage("Subcategory name must be between 2 and 32 characters")
        .custom(async (value, {req}) => {
            const subcategory = await subcategoryModel.findOne({name: value, _id: { $ne: req.params.id }})

            if (subcategory) {
                throw new Error("Subcategory name already exists")
            }

            return true;
        }),
    validatorMiddleware,
];

export const deleteSubcategoryValidator = [
    check("id").isMongoId().withMessage("Subcategory ID is not valid"),
    validatorMiddleware,
];
