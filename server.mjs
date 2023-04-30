import express from "express";
import cors from "cors";
import hpp from "hpp";
import dotenv from "dotenv";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import compression from "compression";
import morgan from "morgan";
import {fileURLToPath} from "url";
import path, {dirname} from "path";
import rateLimit from "express-rate-limit";
import dbConnect from "./config/db.mjs";
import ApiError from "./utils/apiError.mjs";
import errorMiddleware from "./middlewares/errorMiddleware.mjs";
import mountRoutes from "./Routes/index.mjs";
import {webhookCheckout} from "./Controllers/orderController.mjs";

dotenv.config({path: "config.env"});

// Create the Express app
const app = express();

// Set up basic security and CORS options for the app
app.use(cors({
    origin: 'https://shoppio.vercel.app/',
    credentials: true,
    optionSuccessStatus: 200
}));

app.use(compression());
app.use(helmet({
    crossOriginResourcePolicy: false
}));

// Add route for Stripe webhook events
app.post(
    "/webhook-checkout",
    express.raw({type: "application/json"}),
    webhookCheckout
);

// Set up environment variables
const {PORT} = process.env;

// Set up path variables for use in middleware
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to the database
dbConnect();

// Apply common middleware to all requests
app.use(express.json({limit: "20kb"}));
app.use(express.urlencoded({extended: true}));
app.use(mongoSanitize());
app.use(xss());

// Serve static files from the "uploads" directory
app.use(express.static(path.join(__dirname, "uploads")));

// Apply development-only middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Set up rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
    standardHeaders: true,
    legacyHeaders: false,
    message:
        "Too many Requests created from this IP, please try again after 15 minutes",
});

// Apply the rate limiting middleware to all requests starting with "/api"
app.use("/api", limiter);

// Prevent HTTP Parameter Pollution attacks
app.use(hpp({whitelist: ["price", "sold", "quantity", "ratingsAvg", "category", "brand"]}));

// Mount the API routes
mountRoutes(app);

// Catch-all error handler for invalid routes
app.all("*", (req, res, next) => {
    next(new ApiError(`${req.originalUrl} is not a valid route`, 400));
});

// Handle errors inside Express
app.use(errorMiddleware);

// Start the server
const server = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
    console.error(`UnhandledRejection error: ${err}`);
    server.close(() => {
        process.exit(1);
    });
});