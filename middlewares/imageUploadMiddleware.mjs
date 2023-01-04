import multer from "multer";
import ApiError from "../utils/apiError.mjs";

const multerOptions = () => {
  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images are allowed", 400), false);
    }
  };
  return multer({
    storage,
    fileFilter,
  });
};

export const uploadSingle = (fieldName) => multerOptions().single(fieldName);

export const uploadMultiple = (fields) => multerOptions().fields(fields);
