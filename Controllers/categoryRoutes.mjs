import expressAsyncHandler from "express-async-handler";
import multer from "multer";
import { uuid } from "uuidv4";
import sharp from "sharp";
import CategoryModel from "../models/categoryModel.mjs";
import * as factory from "../utils/factoryHandler.mjs";
import ApiError from "../utils/apiError.mjs";

// DiskStorage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1];
//     const filename = `category-${uuid()}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });

// Memory Storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Only images are allowed", 400), false);
  }
};

const upload = multer({ storage, fileFilter });

export const imageProcessing = expressAsyncHandler(async (req, res, next) => {
  const filename = `category-${uuid()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);

  next();
});

export const uploadCatImg = upload.single("image");

// @desc Create a new category
// @route POST /api/categories
// @access Private
export const addCategory = factory.createDocument(CategoryModel);

// @desc Get all categories
// @route GET /api/categories
// @access Public
export const getCategories = factory.getAllDocuments(CategoryModel);

// @desc Get a specific category
// @route GET /api/categories/:id
// @access Public
export const getCategory = factory.getDocument(
  CategoryModel,
  "Category not found"
);

// @desc Update a category
// @route GET /api/categories/:id
// @access Private
export const updateCategory = factory.updateDocument(
  CategoryModel,
  "Category not found"
);

// @desc Delete a category
// @route DELETE /categories/:id
// @access Private
export const deleteCategory = factory.deleteDocument(
  CategoryModel,
  "Category not found",
  "Category deleted successfully"
);
