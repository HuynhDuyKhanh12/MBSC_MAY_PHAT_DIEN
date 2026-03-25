import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/user/user.routes";
import categoryRoutes from "../modules/category/category.routes";
import brandRoutes from "../modules/brand/brand.routes";
import productRoutes from "../modules/product/product.routes";
import cartRoutes from "../modules/cart/cart.routes";
import orderRoutes from "../modules/order/order.routes";
import couponRoutes from "../modules/coupon/coupon.routes";
import reviewRoutes from "../modules/review/review.routes";
import wishlistRoutes from "../modules/wishlist/wishlist.routes";
import addressRoutes from "../modules/address/address.routes";
import serviceRequestRoutes from "../modules/service-request/service-request.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/brands", brandRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/coupons", couponRoutes);
router.use("/reviews", reviewRoutes);
router.use("/wishlists", wishlistRoutes);
router.use("/addresses", addressRoutes);
router.use("/service-requests", serviceRequestRoutes);

export default router;