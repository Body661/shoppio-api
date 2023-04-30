import expressAsyncHandler from "express-async-handler";
import { uuid } from "uuidv4";
import sharp from "sharp";
import BrandModel from "../models/brandModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";
import { uploadSingle } from "../middlewares/imageUploadMiddleware.mjs";

// Middleware for uploading a single brand image
export const uploadBrandImg = uploadSingle("img");

// Middleware for processing the uploaded brand image
export const imageProcessing = expressAsyncHandler(async (req, res, next) => {
    // Generate a unique filename for the uploaded image
    const filename = `brand-${uuid()}-${Date.now()}.png`;

    if (req?.file) {
        // Resize, convert to PNG, and save the image using Sharp
        await sharp(req.file.buffer)
            .resize(130, 130)
            .toFormat("png", {})
            .png({ quality: 80 })
            .toFile(`uploads/brands/${filename}`);

        // Set the img field in the request body
        req.body.img = filename;
    }

    next();
});

// Action for creating a new brand
// @Route POST /api/brands
// @Access Private/Protected [Admin]
export const addBrand = factory.createDocument(BrandModel);

// Action for getting all brands
// @Route GET /api/brands
// @Access Public
export const getBrands = factory.getAllDocuments(BrandModel);

// Action for getting a specific brand by ID
// @Route GET /api/brands/:id
// @Access Public
export const getBrandById = factory.getDocument(BrandModel, "Brand not found");

// Action for updating a brand by ID
// @Route PUT /api/brands/:id
// @Access Private/Protected [Admin]
export const updateBrand = factory.updateDocument(
    BrandModel,
    "Brand not found"
);

// Action for deleting a brand by ID
// @Route DELETE /api/brands/:id
// @Access Private/Protected [Admin]
export const deleteBrand = factory.deleteDocument(
    BrandModel,
    "Brand not found",
    "Brand deleted successfully"
);