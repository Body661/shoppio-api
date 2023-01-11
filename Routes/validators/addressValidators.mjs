import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.mjs";

export const addAdressValidators = [
  check("alias")
    .notEmpty()
    .withMessage("Alias is required")
    .custom(async (alias, { req }) => {
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

export const removeAdressValidator = [
  check("addressId")
    .notEmpty()
    .withMessage("Address id is required")
    .isMongoId()
    .withMessage("Address id is not valid"),
  validatorMiddleware,
];
