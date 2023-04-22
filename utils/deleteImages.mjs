import expressAsyncHandler from "express-async-handler";
import path from "path";
import fs from "fs";

export const deleteImages = (Model) => expressAsyncHandler(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (doc.images && doc.images.length > 0) {
        for (const img of doc.images) {
            const filePath = img.split(`${process.env.baseUrl}`)[1];
            const fullPath = path.join('uploads', filePath);
            await fs.unlink(fullPath, ((err) => {
                console.log(err);
            }));
        }
    }

    if (doc.cover) {
        const filePath = doc.cover.split(`${process.env.baseUrl}`)[1];
        const fullPath = path.join('uploads', filePath);
        await fs.unlink(fullPath, ((err) => {
            console.log(err);
        }));
    }

    if (doc.img) {
        const filePath = doc.img.split(`${process.env.baseUrl}`)[1];
        const fullPath = path.join('uploads', filePath);
        await fs.unlink(fullPath, ((err) => {
            console.log(err);
        }));
    }

    next()
})