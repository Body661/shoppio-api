import {check} from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.mjs";
import BrandModel from "../../models/brandModel.mjs";

export const addBrandValidator = [
    (req, res, next) => {
        if (req.file) {
            req.body.img = req.file.filename; // Assuming the upload middleware stores the filename in req.file.filename
        }
        next();
    },
    check("name")
        .notEmpty()
        .withMessage("Brand name is required")
        .isLength({
            min: 2,
            max: 32,
        })
        .withMessage("Brand name must be between 2 and 32 characters"),
    validatorMiddleware,
];

export const getBrandValidator = [
    check("id").isMongoId().withMessage("Brand ID is not valid"),
    validatorMiddleware,
];

export const updateBrandValidator = [
    check("id").isMongoId().withMessage("Brand ID is not valid"),
    check("name")
        .optional()
        .notEmpty()
        .withMessage("Brand name is required")
        .isLength({
            min: 2,
            max: 32,
        })
        .withMessage("Brand name must be between 2 and 32 characters")
        .custom(async (value, {req}) => {
            const brand = await BrandModel.findOne({name: value, _id: {$ne: req.params.id}});

            if (brand) {
                throw new Error("Brand name already in use")
            }

            return true;
        }),
    validatorMiddleware,
];

export const deleteBrandValidator = [
    check("id").isMongoId().withMessage("Brand ID is not valid"),
    validatorMiddleware,
];
