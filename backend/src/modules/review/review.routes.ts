import { Router } from "express";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";
import {
  createReview,
  deleteReview,
  getReviewsByProduct,
} from "./review.controller";

const router = Router();

/**
 * @swagger
 * /api/reviews/product/{productId}:
 *   get:
 *     summary: Lấy đánh giá theo sản phẩm
 *     tags: [Reviews]
 */
router.get("/product/:productId", getReviewsByProduct);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Tạo đánh giá
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", authMiddleware, createReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Xóa đánh giá
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", authMiddleware, requireRole("ADMIN"), deleteReview);

export default router;