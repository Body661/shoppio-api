import expressAsyncHandler from "express-async-handler";
import { uuid } from "uuidv4";
import sharp from "sharp";
import ProductModel from "../models/productModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";
import { uploadMultiple } from "../middlewares/imageUploadMiddleware.mjs";

export const uploadProductImgs = uploadMultiple([
  { name: "cover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

export const imageProcessing = expressAsyncHandler(async (req, res, next) => {
  if (req.files.cover) {
    const coverFilename = `product-cover-${uuid()}-${Date.now()}.png`;

    await sharp(req.files.cover[0].buffer)
      .resize(2000, 1333)
      .toFormat("png")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${coverFilename}`);

    req.body.cover = coverFilename;
  }

  if (req.files.images) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imagFilename = `product-${index}-${uuid()}-${Date.now()}.png`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("png")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imagFilename}`);

        req.body.images.push(imagFilename);
      })
    );
  }
  next();
});

//@desc Create new product
//@route POST /api/products
//@access Private
export const addProduct = factory.createDocument(ProductModel);

// @desc Get a list of all products
// @route GET /api/products
// @access Public
export const getProducts = factory.getAllDocuments(ProductModel, "Products");

// @desc Get a list of all products
// @route GET /api/products/:id
// @access Public
export const getProduct = factory.getDocument(
  ProductModel,
  "Product not found"
);

export const updateProduct = factory.updateDocument(
  ProductModel,
  "Product not found"
);

// @desc delete a product
// @route DELETE /api/products/:id
// @access Private
export const deleteProduct = factory.deleteDocument(
  ProductModel,
  "Product not found",
  "Product deleted successfully"
);
