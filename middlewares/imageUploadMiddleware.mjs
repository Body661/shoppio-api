import multer from "multer";
import ApiError from "../utils/apiError.mjs";

// Configure multer options for image storage and file filtering
const multerOptions = () => {
  // Set multer storage to memory storage
  const storage = multer.memoryStorage();

  // Filter files to only accept images
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images are allowed", 400), false);
    }
  };

  // Return multer middleware configured with the storage and file filter options
  return multer({
    storage,
    fileFilter,
  });
};

// Function to upload a single image file
export const uploadSingle = (fieldName) => {
  // Use multerOptions to create a multer middleware for single file upload
  return multerOptions().single(fieldName);
};

// Function to upload multiple image files
export const uploadMultiple = (fields) => {
  // Use multerOptions to create a multer middleware for multiple file uploads
  return multerOptions().fields(fields);
};