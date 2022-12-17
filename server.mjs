import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import dbConnect from "./config/db.mjs";
import categoryRoutes from "./Routes/category.mjs";
import subcategoryRoutes from "./Routes/subcategory.mjs";
import ApiError from "./utils/apiError.mjs";
import errorMiddleware from "./middlewares/errorMiddleware.mjs";

dotenv.config({ path: "config.env" });

// App configuration
const app = express();
const { PORT } = process.env;

dbConnect();

// Middleware
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);

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
