import { Router } from "express";
import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
} from "./coupon.controller";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/coupons:
 *   get:
 *     summary: Lấy danh sách mã giảm giá
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", authMiddleware, requireRole("ADMIN"), getCoupons);

/**
 * @swagger
 * /api/coupons:
 *   post:
 *     summary: Tạo mã giảm giá
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", authMiddleware, requireRole("ADMIN"), createCoupon);

/**
 * @swagger
 * /api/coupons/{id}:
 *   put:
 *     summary: Cập nhật mã giảm giá
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 */
router.put("/:id", authMiddleware, requireRole("ADMIN"), updateCoupon);

/**
 * @swagger
 * /api/coupons/{id}:
 *   delete:
 *     summary: Xóa mã giảm giá
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", authMiddleware, requireRole("ADMIN"), deleteCoupon);

export default router;