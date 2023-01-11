// Mount Routes
import categoryRoutes from "./category.mjs";
import subcategoryRoutes from "./subcategory.mjs";
import brandRoutes from "./brand.mjs";
import productRoutes from "./product.mjs";
import userRoutes from "./user.mjs";
import authRoutes from "./auth.mjs";
import reviewRoutes from "./review.mjs";
import wishlistRoutes from "./wishlist.mjs";
import addressRoutes from "./adress.mjs";
import couponRoutes from "./coupon.mjs";

const mountRoutes = (app) => {
  app.use("/api/categories", categoryRoutes);
  app.use("/api/subcategories", subcategoryRoutes);
  app.use("/api/brands", brandRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/wishlist", wishlistRoutes);
  app.use("/api/addresses", addressRoutes);
  app.use("/api/coupons", couponRoutes);
};

export default mountRoutes;
