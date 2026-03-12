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
 *     responses:
 *       200:
 *         description: Get wishlist successful
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Add to wishlist successful
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
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Remove wishlist successful
 */
router.delete("/:productId", authMiddleware, removeWishlist);

export default router;