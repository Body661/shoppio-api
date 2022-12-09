import CategoryModel from "../models/categoryModel.mjs";
import slugify from "slugify";
import expressAsyncHandler from "express-async-handler";

// @desc add a new category
// @route POST /api/categories
// @ access Private
export const addCategory = expressAsyncHandler(async (req, res) => {
    const {name} = req.body

    const category = await CategoryModel.create({name, slug: slugify(name)})
    res.status(201).json(category)
})

// @desc Get all categories
// @route GET /api/categories
// @access Public
export const getCategories = expressAsyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 2;
    const skip = (page - 1) * limit;

    const categories = await CategoryModel.find().skip(skip).limit(limit)
    res.status(200).json({page, amount: categories.length, data: categories})
})