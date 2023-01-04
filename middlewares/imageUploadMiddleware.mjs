import multer from "multer";
import ApiError from "../utils/apiError.mjs";

const uploadSingle = (fieldName) => {
  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images are allowed", 400), false);
    }
  };
  const upload = multer({
    storage,
    fileFilter,
  });

  return upload.single(fieldName);
};

export default uploadSingle;
