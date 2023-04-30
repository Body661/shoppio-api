import expressAsyncHandler from "express-async-handler";
import path from "path";
import fs from "fs/promises"; // Use fs.promises for promise-based fs operations

export const deleteImages = (Model) => expressAsyncHandler(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    // Delete all images associated with the document
    if (doc.images && doc.images.length > 0) {
        for (const img of doc.images) {
            const filePath = img.split(process.env.BASE_URL)[1];
            const fullPath = path.join('uploads', filePath);

            try {
                await fs.unlink(fullPath);
            } catch (err) {
                console.log(`Error deleting image ${img}: ${err}`);
            }
        }
    }

    // Delete the cover image if it exists
    if (doc.cover) {
        const filePath = doc.cover.split(process.env.BASE_URL)[1];
        const fullPath = path.join('uploads', filePath);

        try {
            await fs.unlink(fullPath);
        } catch (err) {
            console.log(`Error deleting cover image ${doc.cover}: ${err}`);
        }
    }

    // Delete the img property if it exists
    if (doc.img) {
        const filePath = doc.img.split(process.env.BASE_URL)[1];
        const fullPath = path.join('uploads', filePath);

        try {
            await fs.unlink(fullPath);
        } catch (err) {
            console.log(`Error deleting img ${doc.img}: ${err}`);
        }
    }

    next();
});
