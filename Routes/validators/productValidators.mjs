import {body, check} from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.mjs";
import CategoryModel from "../../models/categoryModel.mjs";
import SubcategoryModel from "../../models/subcategoryModel.mjs";
import ProductModel from "../../models/productModel.mjs";

const duplicateValidators = [
    check("sold")
        .optional()
        .isNumeric()
        .withMessage("Product quantity must be a number"),

    check("colors")
        .optional()
        .isArray()
        .withMessage("available colors should be array of string"),

    check("images")
        .optional()
        .isArray()
        .withMessage("images should be array of string"),

    check("brand")
        .optional()
        .isMongoId()
        .withMessage("Please select a brand"),
    check("ratingsAvg")
        .optional()
        .isNumeric()
        .withMessage("ratingsAverage must be a number")
        .isLength({min: 1})
        .withMessage("Rating must be above or equal 1.0")
        .isLength({max: 5})
        .withMessage("Rating must be below or equal 5.0"),
    check("ratingsQuantity")
        .optional()
        .isNumeric()
        .withMessage("ratingsQuantity must be a number"),

    check("subcategories")
        .optional()
        .isMongoId()
        .withMessage("Please select a valid subcategory")
        .custom(async (subcategoriesIds) => {
            const subcategories = await SubcategoryModel.find({
                _id: {$exists: true, $in: subcategoriesIds},
            });

            if (
                subcategories.length < 1 ||
                subcategories.length !== subcategoriesIds.length
            ) {
                return Promise.reject(new Error(`Invalid subcategories Ids`));
            }
        })
        .custom(async (val, {req}) => {
            const category =
                req.body.category ||
                (await ProductModel.findById(req.params.id).then(
                    (product) => product.category._id
                ));

            const subcategories = await SubcategoryModel.find({
                category,
            });
            const subCategoriesIdsInDB = [];

            subcategories.forEach((subCategory) => {
                subCategoriesIdsInDB.push(subCategory._id.toString());
            });
            const checker = (target, arr) => target.every((v) => arr.includes(v));
            if (!checker(val, subCategoriesIdsInDB)) {
                return Promise.reject(
                    new Error(`subcategories not belong to category`)
                );
            }
        }),
];

export const createProductValidator = [
    check("title")
        .isLength({min: 3})
        .withMessage("must be at least 3 chars")
        .notEmpty()
        .withMessage("Product title is required"),
    check("description")
        .notEmpty()
        .withMessage("Product description is required")
        .isLength({min: 20})
        .withMessage("Product description must be at least 20 characters")
        .isLength({max: 2000})
        .withMessage("Product description must at most 2000 characters"),
    check("quantity")
        .notEmpty()
        .withMessage("Product quantity is required")
        .isNumeric()
        .withMessage("Product quantity must be a number"),
    check("price")
        .notEmpty()
        .withMessage("Product price is required")
        .isNumeric()
        .withMessage("Product price must be a number")
        .isLength({max: 32})
        .withMessage("To long price"),
    check("priceAfterDiscount")
        .optional()
        .isNumeric()
        .withMessage("Product priceAfterDiscount must be a number")
        .toFloat()
        .custom((value, {req}) => {
            if (req.body.price <= value) {
                throw new Error("priceAfterDiscount must be lower than price");
            }
            return true;
        }),
    check("category")
        .notEmpty()
        .withMessage("Product must be belong to a category")
        .isMongoId()
        .withMessage("Please select a category")
        .custom(async (categoryId) => {
            const category = await CategoryModel.findById(categoryId);

            if (!category) {
                return Promise.reject(
                    new Error(`No category for this id: ${categoryId}`)
                );
            }
        }),
    ...duplicateValidators,
    validatorMiddleware,
];

export const getProductValidator = [
    check("id").isMongoId().withMessage("Product id is not valid"),
    validatorMiddleware,
];

export const updateProductValidator = [
    check("id").isMongoId().withMessage("Product doesn't exists or product id is wrong"),
    body("title")
        .optional()
        .notEmpty(),
    check("description")
        .optional()
        .notEmpty()
        .withMessage("Product description is required")
        .isLength({min: 20})
        .withMessage("Product description must be at least 20 characters")
        .isLength({max: 2000})
        .withMessage("Product description must at most 2000 characters"),
    check("quantity")
        .optional()
        .notEmpty()
        .withMessage("Product quantity is required")
        .isNumeric()
        .withMessage("Product quantity must be a number"),
    check("price")
        .optional()
        .notEmpty()
        .withMessage("Product price is required")
        .isNumeric()
        .withMessage("Product price must be a number")
        .isLength({max: 32})
        .withMessage("To long price"),
    check("priceAfterDiscount")
        .optional()
        .isNumeric()
        .withMessage("Product priceAfterDiscount must be a number")
        .toFloat()
        .custom(async (value, {req}) => {
            const product = await ProductModel.findById(req.params.id);
            if (product.price <= value) {
                return Promise.reject(
                    new Error("priceAfterDiscount must be lower than price")
                );
            }
        }),
    check("cover")
        .optional()
        .notEmpty()
        .withMessage("Product imageCover is required"),
    check("category")
        .optional()
        .notEmpty()
        .withMessage("Product must be belong to a category")
        .isMongoId()
        .withMessage("Please select a category")
        .custom(async (categoryId) => {
            const category = CategoryModel.findById(categoryId);

            if (!category) {
                return Promise.reject(
                    new Error(`No category for this id: ${categoryId}`)
                );
            }
        }),
    ...duplicateValidators,
    validatorMiddleware,
];

export const deleteProductValidator = [
    check("id").isMongoId().withMessage("Product id is not valid"),
    validatorMiddleware,
];
