import ApiError from "../utils/apiError.mjs";

// Development error handler
const devError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

// Handler for JWT invalid token error
const handleJwtInvalidToken = () => new ApiError("Invalid token, Please login again!", 401);

// Handler for JWT expired token error
const handleJwtExpiredToken = () => new ApiError("Expired token, Please login again!", 401);

const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    // Handling errors in development environment
    if (process.env.NODE_ENV === "development") {
        return devError(err, res);
    }

    // Handling JWT errors
    if (err.name === "JsonWebTokenError") {
        err = handleJwtInvalidToken();
    } else if (err.name === "TokenExpiredError") {
        err = handleJwtExpiredToken();
    }

    // Send error response
    res.status(err.statusCode).json({status: err.status, message: err.message});
};

export default errorMiddleware;
