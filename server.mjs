import express from "express";
import cors from "cors";
import hpp from "hpp";
import dotenv from "dotenv";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import compression from "compression";
import morgan from "morgan";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import rateLimit from "express-rate-limit";
import dbConnect from "./config/db.mjs";
import ApiError from "./utils/apiError.mjs";
import errorMiddleware from "./middlewares/errorMiddleware.mjs";
import mountRoutes from "./Routes/index.mjs";
import { webhookCheckout } from "./Controllers/orderController.mjs";

dotenv.config({ path: "config.env" });

// App configuration
const app = express();

app.use(cors());
app.options("*", cors());

app.use(compression());
app.use(helmet({
  crossOriginResourcePolicy: false
}));

app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

const { PORT } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dbConnect();

// Middleware
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({extended: true}));
app.use(mongoSanitize());
app.use(xss());

app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  standardHeaders: true,
  legacyHeaders: false,
  message:
    "Too many Requests created from this IP, please try again after 15 minutes",
});

// Apply the rate limiting middleware to all requests
app.use("/api", limiter);

app.use(hpp({ whitelist: ["price", "sold", "quantity", "ratingsAvg", "category", "brand"] }));

mountRoutes(app);
app.all("*", (req, res, next) => {
  next(new ApiError(`${req.originalUrl} is not a valid route`, 400));
});

// Error Handling inside Express
app.use(errorMiddleware);

const server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// Error Handling outside Express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection error: ${err}`);
  server.close(() => {
    process.exit(1);
  });
});
