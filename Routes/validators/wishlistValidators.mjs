import {check} from "express-validator";
import ProductModel from "../../models/productModel.mjs";
import validatorMiddleware from "../../middlewares/validatorMiddleware.mjs";

export const addRemoveValidators = [
    check("productId")
        .notEmpty()
        .withMessage("Product Id is required")
        .isMongoId()
        .withMessage("Product Id is not valid")
        .custom(async (id) => {
            const product = await ProductModel.findById(id);

            if (!product) {
                throw new Error("No product found for this id");
            }

            return true;
        }),
    validatorMiddleware,
];