import {check} from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.mjs";

export const addAddressValidators = [
    check("alias")
        .notEmpty()
        .withMessage("Alias is required")
        .custom(async (alias, {req}) => {
            const checkAlias = req.user.addresses.find(
                (address) => address.alias === alias
            );

            if (checkAlias) {
                throw new Error("Alias is already in use");
            }

            return true;
        }),
    check("street").notEmpty().withMessage("Street is required"),
    check("postalCode")
        .notEmpty()
        .withMessage("Postal Code is required")
        .isPostalCode("any")
        .withMessage("Postal Code is not valid"),
    check("phone")
        .optional()
        .notEmpty()
        .isMobilePhone("any")
        .withMessage("Phone number is not valid"),
    check("city").notEmpty().withMessage("City is required"),
    check("country").notEmpty().withMessage("Country is required"),
    validatorMiddleware,
];

export const updateAddressValidators = [
    check("addressId")
        .notEmpty()
        .withMessage("Address id is required")
        .isMongoId()
        .withMessage("Address id is not valid")
        .custom(async (addressId, {req}) => {
            const addressIndex = req.user.addresses.findIndex(
                (address) => address._id.toString() === addressId
            );

            if (addressIndex === -1) {
                throw new Error("Address not found");
            }

            return true;
        }),
    check("alias")
        .optional()
        .notEmpty()
        .withMessage("Alias is required")
        .custom(async (alias, {req}) => {
            const checkAlias = req.user.addresses.find(
                (address) => (address.alias === alias && address._id.toString() !== req.params.addressId)
            );

            if (checkAlias) {
                throw new Error("Alias is already in use");
            }

            return true;
        }),
    check("street")
        .optional()
        .notEmpty()
        .withMessage("Street is required"),
    check("postalCode")
        .optional()
        .notEmpty()
        .withMessage("Postal Code is required")
        .isPostalCode("any")
        .withMessage("Postal Code is not valid"),
    check("phone")
        .optional()
        .optional()
        .notEmpty()
        .isMobilePhone("any")
        .withMessage("Phone number is not valid"),
    check("city")
        .optional()
        .notEmpty()
        .withMessage("City is required"),
    check("country")
        .optional()
        .notEmpty()
        .withMessage("Country is required"),
    validatorMiddleware,
];

export const removeAddressValidator = [
    check("addressId")
        .notEmpty()
        .withMessage("Address id is required")
        .isMongoId()
        .withMessage("Address id is not valid"),
    validatorMiddleware,
];
