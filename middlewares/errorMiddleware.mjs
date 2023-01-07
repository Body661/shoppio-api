import ApiError from "../utils/apiError.mjs";

const devError = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const handleJwtInvalidToken = () =>
  new ApiError("Invalid token, Please login again!", 401);

const handleJwtExpiredToken = () =>
  new ApiError("Expired token, Please login again!", 401);

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    return devError(err, res);
  }

  if (err.name === "JsonWebTokenError") err = handleJwtInvalidToken();
  if (err.name === "TokenExpiredError") err = handleJwtExpiredToken();
  res.status(err.statusCode).json({ status: err.status, message: err.message });
};
export default errorMiddleware;
