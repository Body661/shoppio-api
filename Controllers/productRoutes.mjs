import expressAsyncHandler from "express-async-handler";
import slugify from "slugify";
import ProductModel from "../models/productModel.mjs";
import ApiError from "../utils/apiError.mjs";

//@desc Create new product
//@route POST /api/products
//@access Private
export const addProduct = expressAsyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await ProductModel.create(req.body);
  res.status(201).json(product);
});

// @desc Get a list of all products
// @route GET /api/products
// @access Public
export const getProducts = expressAsyncHandler(async (req, res) => {
  //1) Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;

  //2) Filtering
  const filter = { ...req.query };
  const excludesFileds = ["page", "sort", "limit", "fields"];
  excludesFileds.forEach((field) => delete filter[field]);

  // Apply filters using [gte | gt | lte | lt]
  let queryString = JSON.stringify(filter);
  queryString = queryString.replace(
    /(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );

  // Build query
  const query = ProductModel.find(JSON.parse(queryString))
    .skip(skip)
    .limit(limit)
    .populate([
      { path: "category", select: "name -_id" },
      { path: "subcategories", select: "name -_id" },
      { path: "brand", select: "name -_id" },
    ]);

  // Execute query
  const products = await query;
  res.status(200).json({ page, amount: products.length, data: products });
});

// @desc Get a list of all products
// @route GET /api/products/:id
// @access Public
export const getProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await ProductModel.findById(id).populate([
    { path: "category", select: "name" },
    { path: "subcategories", select: "name -_id" },
    { path: "brand", select: "name -_id" },
  ]);

  if (!product) {
    return next(new ApiError("Product not found", 404));
  }

  res.status(200).json(product);
});

export const updateProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (req.body.title) req.body.slug = slugify(req.body.title);

  const product = await ProductModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!product) {
    return next(new ApiError("Product not found", 404));
  }

  res.status(200).json(product);
});

// @desc delete a product
// @route DELETE /api/products/:id
// @access Private
export const deleteProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await ProductModel.findByIdAndDelete(id);

  if (!product) {
    return next(new ApiError("Product not found", 404));
  }

  res.status(200).json({ message: "Product deleted successfully" });
});
