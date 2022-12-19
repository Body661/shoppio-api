import expressAsyncHandler from "express-async-handler";
import slugify from "slugify";
import ApiError from "../utils/apiError.mjs";
import BrandModel from "../models/brandModel.mjs";

// @desc Create a new brand
// @route POST /api/brands
// @access Private
export const addBrand = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;

  const brand = await BrandModel.create({ name, slug: slugify(name) });
  res.status(201).json(brand);
});

// @desc Get all brands
// @route GET /api/brands
// @access Public
export const getBrands = expressAsyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;

  const brands = await BrandModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ page, amount: brands.length, data: brands });
});

// @desc Get a specific brand
// @route GET /api/brands/;id
// @access Public
export const getBrand = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await BrandModel.findById(id);

  if (!brand) {
    return next(new ApiError("Brand not found", 404));
  }

  res.status(200).json(brand);
});

// @desc Update a brand
// @route PUT /api/brands/:id
// @access Private
export const updateBrand = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await BrandModel.findByIdAndUpdate(
    id,
    {
      name,
      slug: slugify(name),
    },
    { new: true }
  );

  if (!brand) {
    return next(new ApiError("Brand not found", 404));
  }

  res.status(200).json(brand);
});

// @desc Delete a brand
// @route DELETE /api/brands/:id
// @access Private
export const deleteBrand = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await BrandModel.findByIdAndDelete(id);

  if (!brand) {
    return next(new ApiError("Brand not found", 404));
  }

  res.status(200).json({ message: "Brand deleted" });
});
