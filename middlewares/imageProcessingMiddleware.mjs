import expressAsyncHandler from "express-async-handler";
import {uuid} from "uuidv4";
import sharp from "sharp";
import aws from "aws-sdk"

const s3 = new aws.S3();

export const imageProcessingMiddleware = (modelName) => expressAsyncHandler(async (req, res, next) => {
    // Generate a unique filename for the uploaded image
    const filename = `${modelName}-${uuid()}-${Date.now()}.png`;

    if (req.file) {
        // Resize, convert to PNG and convert to buffered format
        const image = await sharp(req.file.buffer)
            .resize(150, 150)
            .toFormat("png", {})
            .png({quality: 80})
            .toBuffer();

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filename,
            Body: image,
            ContentType: req.file.mimetype,
        };

        const result = await s3.upload(params).promise();

        // Set the img field in the request body
        req.body.img = result.Location;
    }

     if (req.files?.cover) {
        const filename = `${modelName}-cover-${uuid()}-${Date.now()}.png`;

        const image = await sharp(req.files.cover[0].buffer)
            .resize(600)
            .toFormat("png")
            .png({quality: 60})
            .toBuffer();

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filename,
            Body: image,
            ContentType: req.files.cover[0].mimetype,
        };

        const result = await s3.upload(params).promise();

        req.body.cover = result.Location;
    }

    if (req.files?.images) {
        req.body.images = [];

        await Promise.all(
            req.files.images.map(async (img, index) => {
                const filename = `${modelName}-${index}-${uuid()}-${Date.now()}.png`;

                const image = await sharp(img.buffer)
                    .toFormat("png")
                    .png({quality: 95})
                    .toBuffer();

                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: filename,
                    Body: image,
                    ContentType: img.mimetype,
                };

                const result = await s3.upload(params).promise();
                req.body.images.push(result.Location);
            })
        );
    }

    next();
});