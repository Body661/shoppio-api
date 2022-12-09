import CategoryModel from "../models/categoryModel.mjs";
import slugify from "slugify";
import expressAsyncHandler from "express-async-handler";

export const addCategory = expressAsyncHandler(async (req, res) => {
    const {name} = req.body

    const category = await CategoryModel.create({name, slug: slugify(name)})
    res.status(201).json(category)
})

export const getCategories = expressAsyncHandler(async (req, res) => {
    try {
        const categories = await CategoryModel.find()
        res.status(200).json(categories)
    } catch (err) {
        res.status(400).json(err)
    }
})