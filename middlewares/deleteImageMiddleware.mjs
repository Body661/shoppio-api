import expressAsyncHandler from "express-async-handler";
import path from "path";
import aws from "aws-sdk"

const s3 = new aws.S3();

export const deleteImageMiddleware = (Model) => expressAsyncHandler(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    // Delete all images associated with the document
    if (doc.images && doc.images.length > 0) {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Delete: {
                Objects: []
            }
        };

        for (const img of doc.images) {
            const fileName = img.split(process.env.AWS_BATH)[1];

            params.Delete.Objects.push({Key: fileName});
        }

        await s3.deleteObjects(params);

    }

    // Delete the cover image if it exists
    if (doc.cover) {
        const fileName = doc.cover.split(process.env.AWS_BATH)[1];

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
        };

        await s3.deleteObject(params);
    }

    // Delete the img property if it exists
    if (doc.img) {
        const fileName = doc.img.split(process.env.AWS_BATH)[1];

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
        };

        await s3.deleteObject(params);
    }

    next();
});
