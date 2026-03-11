import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  addToWishlist,
  getWishlist,
  removeWishlist,
} from "./wishlist.controller";

const router = Router();

/**
 * @swagger
 * /api/wishlists:
 *   get:
 *     summary: Lấy danh sách yêu thích
 *     tags: [Wishlists]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", authMiddleware, getWishlist);

/**
 * @swagger
 * /api/wishlists:
 *   post:
 *     summary: Thêm vào yêu thích
 *     tags: [Wishlists]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", authMiddleware, addToWishlist);

/**
 * @swagger
 * /api/wishlists/{productId}:
 *   delete:
 *     summary: Xóa khỏi yêu thích
 *     tags: [Wishlists]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:productId", authMiddleware, removeWishlist);

export default router;